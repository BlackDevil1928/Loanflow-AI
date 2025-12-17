import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function GenerativeMountainScene() {
    const mountRef = useRef(null)
    const lightRef = useRef(null)

    useEffect(() => {
        const currentMount = mountRef.current
        if (!currentMount) return

        // SCENE SETUP
        const scene = new THREE.Scene()
        scene.fog = new THREE.Fog(0x0a1929, 8, 20)

        // Camera setup - adjusted to show mountain peaks at top
        const camera = new THREE.PerspectiveCamera(
            60,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            100
        )
        camera.position.set(0, 0.5, 5)
        camera.rotation.x = -0.15

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        currentMount.appendChild(renderer.domElement)

        // STARS
        const starsGeometry = new THREE.BufferGeometry()
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        })

        const starsVertices = []
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 50
            const y = Math.random() * 20 + 5
            const z = (Math.random() - 0.5) * 50
            starsVertices.push(x, y, z)
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
        const stars = new THREE.Points(starsGeometry, starsMaterial)
        scene.add(stars)

        // MULTIPLE MOUNTAIN LAYERS
        const createMountainLayer = (zPos, scale, color, opacity, yOffset = 0) => {
            const geometry = new THREE.PlaneGeometry(16 * scale, 12 * scale, 180, 180)

            const material = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                wireframe: false,
                uniforms: {
                    time: { value: 0 },
                    pointLightPosition: { value: new THREE.Vector3(0, 0, 5) },
                    color: { value: new THREE.Color(color) },
                    opacity: { value: opacity },
                    zOffset: { value: zPos }
                },
                vertexShader: `
          uniform float time;
          uniform float zOffset;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vElevation;
          
          // Perlin noise functions
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          
          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
          }

          void main() {
            vNormal = normal;
            vPosition = position;
            
            float noiseFreq = 0.5 + zOffset * 0.15;
            float noiseAmp = 1.2 + zOffset * 0.4;
            
            // Multiple octaves for sharp peaks
            float displacement = snoise(vec3(position.x * noiseFreq, position.y * noiseFreq - time * 0.12, zOffset)) * noiseAmp;
            displacement += snoise(vec3(position.x * noiseFreq * 2.5, position.y * noiseFreq * 2.5 - time * 0.12, zOffset)) * (noiseAmp * 0.6);
            displacement += snoise(vec3(position.x * noiseFreq * 5.0, position.y * noiseFreq * 5.0 - time * 0.08, zOffset)) * (noiseAmp * 0.3);
            
            vElevation = displacement;
            
            vec3 newPosition = position + normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
                fragmentShader: `
          uniform vec3 color;
          uniform vec3 pointLightPosition;
          uniform float opacity;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vElevation;
          
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(pointLightPosition - vPosition);
            
            // Enhanced lighting
            float diffuse = max(dot(normal, lightDir), 0.0);
            float ambient = 0.25;
            
            // Fresnel effect for edges
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
            
            // Elevation-based color variation (brighter peaks)
            float elevationFactor = smoothstep(-0.3, 1.2, vElevation);
            vec3 peakColor = vec3(0.85, 0.92, 1.0);
            vec3 baseColor = color;
            vec3 mixedColor = mix(baseColor, peakColor, elevationFactor * 0.5);
            
            // Combine lighting
            vec3 finalColor = mixedColor * (diffuse * 0.8 + ambient) + mixedColor * fresnel * 0.7;
            
            // Atmospheric perspective
            float depth = length(vPosition);
            float fogFactor = smoothstep(8.0, 20.0, depth);
            vec3 fogColor = vec3(0.04, 0.1, 0.16);
            finalColor = mix(finalColor, fogColor, fogFactor * 0.25);
            
            gl_FragColor = vec4(finalColor, opacity);
          }
        `,
                transparent: true,
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.rotation.x = -Math.PI / 2
            mesh.position.z = zPos
            mesh.position.y = yOffset
            return { mesh, material }
        }

        // Create 3 layers with adjusted positions to show peaks
        const layer1 = createMountainLayer(-3, 1.3, '#4a90c8', 0.85, -1.5)  // Front - darker blue
        const layer2 = createMountainLayer(-5, 1.1, '#5ba3d9', 0.80, -1.2)  // Middle - medium blue
        const layer3 = createMountainLayer(-7, 0.9, '#7dbce8', 0.75, -0.8)  // Back - lighter blue

        scene.add(layer1.mesh)
        scene.add(layer2.mesh)
        scene.add(layer3.mesh)

        // Enhanced lighting
        const pointLight = new THREE.PointLight(0xffffff, 2.5, 100)
        pointLight.position.set(0, 4, 5)
        lightRef.current = pointLight
        scene.add(pointLight)

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x4a5568, 0.4)
        scene.add(ambientLight)

        // Directional light for peaks
        const directionalLight = new THREE.DirectionalLight(0x7dd3fc, 1.2)
        directionalLight.position.set(-5, 6, 5)
        scene.add(directionalLight)

        let frameId
        const animate = (t) => {
            const timeValue = t * 0.0003

            // Update all layers
            layer1.material.uniforms.time.value = timeValue
            layer2.material.uniforms.time.value = timeValue * 0.75
            layer3.material.uniforms.time.value = timeValue * 0.5

            // Gentle star twinkling
            starsMaterial.opacity = 0.6 + Math.sin(t * 0.001) * 0.2

            renderer.render(scene, camera)
            frameId = requestAnimationFrame(animate)
        }
        animate(0)

        const handleResize = () => {
            if (!currentMount) return
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
        }

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1
            const lightX = x * 6
            const lightY = y * 3 + 4
            const pos = new THREE.Vector3(lightX, lightY, 4 - y * 2)

            if (lightRef.current) {
                lightRef.current.position.copy(pos)
            }

            // Update all layer lighting
            layer1.material.uniforms.pointLightPosition.value = pos
            layer2.material.uniforms.pointLightPosition.value = pos
            layer3.material.uniforms.pointLightPosition.value = pos
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            if (currentMount && renderer.domElement.parentNode === currentMount) {
                currentMount.removeChild(renderer.domElement)
            }

            // Cleanup
            starsGeometry.dispose()
            starsMaterial.dispose()
            layer1.mesh.geometry.dispose()
            layer1.material.dispose()
            layer2.mesh.geometry.dispose()
            layer2.material.dispose()
            layer3.mesh.geometry.dispose()
            layer3.material.dispose()
            renderer.dispose()
        }
    }, [])

    return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />
}
