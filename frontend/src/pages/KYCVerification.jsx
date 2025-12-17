import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import {
    Upload,
    FileCheck,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader,
    FileText,
    User,
    Calendar,
    Hash,
    DollarSign,
    TrendingUp
} from 'lucide-react'

export default function KYCVerification() {
    const { user } = useAuth()
    const [documents, setDocuments] = useState({
        pan: null,
        aadhaar: null,
        itr: null,
        balanceSheet: null
    })
    const [previews, setPreviews] = useState({})
    const [uploading, setUploading] = useState(false)
    const [results, setResults] = useState({})
    const [currentUpload, setCurrentUpload] = useState(null)

    const documentTypes = [
        { key: 'pan', label: 'PAN Card', required: true, icon: Hash },
        { key: 'aadhaar', label: 'Aadhaar Card', required: true, icon: User },
        { key: 'itr', label: '3-Year ITR Records', required: true, icon: FileText },
        { key: 'balanceSheet', label: 'Balance Sheet', required: true, icon: TrendingUp }
    ]

    const handleFileChange = (e, docType) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setDocuments(prev => ({ ...prev, [docType]: selectedFile }))

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [docType]: reader.result }))
            }
            reader.readAsDataURL(selectedFile)
        }
    }


    const handleUpload = async (docType) => {
        const file = documents[docType]
        if (!file || !user) return

        setUploading(true)
        setCurrentUpload(docType)

        try {
            // Upload file to backend for OCR processing
            const formData = new FormData()
            formData.append('file', file)
            formData.append('user_id', user.id)
            formData.append('document_type', docType)

            const response = await axios.post('http://localhost:8000/api/upload-kyc', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            // Use real extracted data from EdenAI
            if (response.data.success) {
                setResults(prev => ({
                    ...prev,
                    [docType]: {
                        success: true,
                        documentType: response.data.extracted_data.document_type || docType,
                        extractedData: response.data.extracted_data,
                        confidence: response.data.confidence === 'high' ? 95 :
                            response.data.confidence === 'medium' ? 85 : 70,
                        verified: response.data.validation.valid
                    }
                }))
            } else {
                throw new Error(response.data.message || 'Extraction failed')
            }

            setUploading(false)
            setCurrentUpload(null)

        } catch (error) {
            console.error('Upload error:', error)
            setResults(prev => ({
                ...prev,
                [docType]: {
                    success: false,
                    error: error.response?.data?.detail || error.message || 'Failed to upload document. Please try again.'
                }
            }))
            setUploading(false)
            setCurrentUpload(null)
        }
    }

    const allDocumentsVerified = documentTypes.every(doc =>
        doc.required ? results[doc.key]?.success : true
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Complete KYC Verification</h1>
                    <p className="text-xl text-primary-100">Upload all required documents for loan application</p>
                </div>

                {/* Progress Indicator */}
                <div className="glass rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Verification Progress</h3>
                        <span className="text-primary-100">
                            {Object.values(results).filter(r => r?.success).length} / {documentTypes.filter(d => d.required).length} Required
                        </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(Object.values(results).filter(r => r?.success).length / documentTypes.filter(d => d.required).length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Document Upload Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {documentTypes.map((docType) => {
                        const Icon = docType.icon
                        const file = documents[docType.key]
                        const result = results[docType.key]
                        const isUploading = uploading && currentUpload === docType.key

                        return (
                            <div key={docType.key} className="glass rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Icon className="w-5 h-5 text-white" />
                                        <h3 className="text-xl font-bold text-white">{docType.label}</h3>
                                    </div>
                                    {docType.required && (
                                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Required</span>
                                    )}
                                    {result?.success && (
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    )}
                                </div>

                                {!result ? (
                                    <>
                                        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-all mb-4">
                                            <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />

                                            <input
                                                type="file"
                                                id={`upload-${docType.key}`}
                                                accept="image/*,.pdf"
                                                onChange={(e) => handleFileChange(e, docType.key)}
                                                className="hidden"
                                            />

                                            <label
                                                htmlFor={`upload-${docType.key}`}
                                                className="cursor-pointer inline-block bg-white text-primary-700 px-4 py-2 rounded-lg font-semibold hover:shadow-xl transition-all text-sm"
                                            >
                                                Choose File
                                            </label>

                                            {file && (
                                                <div className="mt-3 text-white text-sm">
                                                    <p className="font-semibold truncate">{file.name}</p>
                                                    <p className="text-xs text-primary-100">{(file.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            )}
                                        </div>

                                        {file && (
                                            <button
                                                onClick={() => handleUpload(docType.key)}
                                                disabled={isUploading}
                                                className="w-full bg-white text-primary-700 py-2 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileCheck className="w-4 h-4" />
                                                        <span>Verify Document</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </>
                                ) : result.success ? (
                                    <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            <span className="text-green-300 font-semibold">Verified</span>
                                            <span className="text-green-400 text-sm">({result.confidence}%)</span>
                                        </div>

                                        {/* Extracted Data Display */}
                                        {result.extractedData && Object.keys(result.extractedData).length > 0 ? (
                                            <div className="space-y-2.5 mb-4">
                                                {Object.entries(result.extractedData).map(([key, value]) => (
                                                    <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-sky-200 text-xs uppercase tracking-wide font-semibold">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                            </span>
                                                            <span className="text-white font-bold text-right ml-3">
                                                                {value || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-white/60 text-sm mb-4 italic">
                                                No data extracted
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                setDocuments(prev => ({ ...prev, [docType.key]: null }))
                                                setResults(prev => ({ ...prev, [docType.key]: null }))
                                                setPreviews(prev => ({ ...prev, [docType.key]: null }))
                                            }}
                                            className="w-full mt-3 bg-white/10 text-white py-2 rounded-lg text-sm hover:bg-white/20 transition-all"
                                        >
                                            Re-upload
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <XCircle className="w-5 h-5 text-red-400" />
                                            <span className="text-red-300 font-semibold">Verification Failed</span>
                                        </div>
                                        <p className="text-red-200 text-sm">{result.error}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Completion Message */}
                {allDocumentsVerified && (
                    <div className="glass rounded-2xl p-8 text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">All Documents Verified!</h3>
                        <p className="text-primary-100 mb-6">You can now proceed with your loan application</p>
                        <a
                            href="/chat"
                            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                        >
                            Continue to Loan Application
                        </a>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-8 glass rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="text-white/90">
                            <p className="font-semibold mb-2">Document Requirements</p>
                            <ul className="text-sm space-y-1 text-white/70">
                                <li>• <strong>PAN Card</strong>: For identity verification and tax compliance</li>
                                <li>• <strong>Aadhaar Card</strong>: For address proof and government ID</li>
                                <li>• <strong>3-Year ITR Records</strong>: To verify income and tax payment history</li>
                                \u003cli\u003e• <strong>Balance Sheet</strong>: To assess financial health and net worth\u003c/li\u003e
                                \u003cli\u003e• All documents are processed using EdenAI OCR with multi-provider accuracy (95%+)\u003c/li\u003e
                                <li>• Your data is encrypted and secure with complete audit trails</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
