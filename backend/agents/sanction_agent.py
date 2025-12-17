"""
Sanction Agent - Generates PDF sanction letters
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from datetime import datetime
import os
from services.supabase_client import supabase_client

class SanctionAgent:
    def process(self, user_id: str, message: str, master_agent) -> dict:
        """Generate sanction letter PDF"""
        
        state_data = master_agent.get_state_data(user_id)
        
        # Get user details
        user = supabase_client.get_user(user_id)
        user_name = state_data.get('name', user.get('name', 'Valued Customer') if user else 'Valued Customer')
        
        # Generate PDF
        pdf_filename = f"sanction_letter_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(os.path.dirname(__file__), '..', 'generated_pdfs', pdf_filename)
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        
        # Generate the PDF
        self.generate_sanction_letter(
            pdf_path,
            user_name,
            state_data.get('loan_amount', 0),
            state_data.get('interest_rate', 0),
            state_data.get('tenure_months', 0),
            state_data.get('credit_score', 0)
        )
        
        # Log audit
        supabase_client.log_audit(
            user_id=user_id,
            action='sanction_letter_generated',
            agent_name='SanctionAgent',
            details={'pdf_filename': pdf_filename}
        )
        
        # Reset state
        master_agent.reset_state(user_id)
        
        response = "✅ **Sanction Letter Generated!**\n\n"
        response += "Your loan has been sanctioned. The sanction letter has been generated with all the details.\n\n"
        response += "**Next Steps:**\n"
        response += "1. Download and review your sanction letter\n"
        response += "2. Our team will contact you within 24 hours\n"
        response += "3. Complete the final documentation\n"
        response += "4. Receive your loan amount in your bank account\n\n"
        response += "Thank you for choosing our services! 🎉"
        
        return {
            'response': response,
            'next_stage': 'complete',
            'data': {
                'sanction_letter_url': f'/api/download-sanction/{pdf_filename}'
            }
        }
    
    def generate_sanction_letter(self, filename, applicant_name, loan_amount, interest_rate, tenure, credit_score):
        """Generate PDF sanction letter using ReportLab"""
        
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#4338ca'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#4338ca'),
            spaceAfter=12,
        )
        
        # Header
        story.append(Paragraph("AI Loan Sales Assistant", title_style))
        story.append(Paragraph("Powered by Tata Capital BFSI", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Date and Reference
        date_str = datetime.now().strftime('%B %d, %Y')
        story.append(Paragraph(f"Date: {date_str}", styles['Normal']))
        story.append(Paragraph(f"Reference: LOAN/{datetime.now().strftime('%Y%m%d')}/AUTO", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Sanction Letter Title
        story.append(Paragraph("LOAN SANCTION LETTER", heading_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Applicant Details
        story.append(Paragraph(f"Dear {applicant_name},", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Approval Message
        approval_text = """
        We are pleased to inform you that your personal loan application has been <b>APPROVED</b>. 
        After careful evaluation of your application and credit profile, we are happy to offer you 
        the following loan terms:
        """
        story.append(Paragraph(approval_text, styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Loan Details Table
        loan_details = [
            ['Loan Details', ''],
            ['Sanctioned Amount', f'₹{loan_amount:,.2f}'],
            ['Interest Rate', f'{interest_rate}% per annum'],
            ['Loan Tenure', f'{tenure} months ({tenure//12} years)'],
            ['Credit Score', str(credit_score)],
            ['Processing Fee', '₹1,000 + GST'],
            ['Disbursement', 'Within 48 hours of documentation'],
        ]
        
        table = Table(loan_details, colWidths=[3*inch, 3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4338ca')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        # Terms and Conditions
        story.append(Paragraph("Terms and Conditions:", heading_style))
        terms = """
        1. This sanction is valid for 30 days from the date of this letter.<br/>
        2. The loan is subject to completion of documentation and verification.<br/>
        3. The interest rate is subject to change based on RBI guidelines.<br/>
        4. Prepayment charges: 2% of outstanding principal amount.<br/>
        5. Late payment charges: 2% per month on overdue amount.<br/>
        """
        story.append(Paragraph(terms, styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Closing
        closing_text = """
        We look forward to serving you. For any queries, please contact our customer service 
        at support@ailoanassistant.com or call us at 1800-XXX-XXXX.
        """
        story.append(Paragraph(closing_text, styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        story.append(Paragraph("Sincerely,", styles['Normal']))
        story.append(Spacer(1, 0.1*inch))
        story.append(Paragraph("<b>AI Loan Sales Assistant</b>", styles['Normal']))
        story.append(Paragraph("Automated Loan Processing System", styles['Normal']))
        
        # Build PDF
        doc.build(story)

# Singleton instance
sanction_agent = SanctionAgent()
