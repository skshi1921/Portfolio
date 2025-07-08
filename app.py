from flask import Flask, render_template, request, jsonify, session
import os
import csv
from datetime import datetime
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from flask_mail import Mail, Message

app = Flask(__name__,
    static_url_path='/static',
    static_folder='static',
    template_folder='templates')

# Set a secret key for session tracking
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'any-random-string')

# ---------- EMAIL CONFIG ----------
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USER')  # e.g., skshivam771@gmail.com
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASS')  # e.g., App Password

mail = Mail(app)

# ---------- GOOGLE SHEETS SETUP ----------
# Sheet IDs
VISITOR_SHEET_ID = "1fJ_eypzPTvtMxZ_yM0R3yeYtEZ6i1YgDlG49s86mTKw"
CONTACT_SHEET_ID = "1hLDSRhGJKja5Ogrk-rvUwVvE02tLsVmCNI2ZZkV-saI"

# Get Google Sheet
def get_sheet(sheet_id):
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive"
    ]
    creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
    client = gspread.authorize(creds)
    return client.open_by_key(sheet_id).sheet1

# Log daily visit to Google Sheet with session-based check
def log_visit_to_sheet():
    today = datetime.now().strftime('%Y-%m-%d')
    if session.get('visited_today') == today:
        return  # Already visited today

    session['visited_today'] = today

    sheet = get_sheet(VISITOR_SHEET_ID)
    records = sheet.get_all_records()
    found = False

    for i, row in enumerate(records):
        if row['Date'] == today:
            count = int(row['Views']) + 1
            sheet.update_cell(i + 2, 2, count)
            found = True
            break

    if not found:
        sheet.append_row([today, 1])

# Save contact to Google Sheet
def save_contact_to_sheet(name, email, service, mobile, message):
    sheet = get_sheet(CONTACT_SHEET_ID)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sheet.append_row([timestamp, name, email, service, mobile, message])

# Send email notification to admin
def send_contact_email(name, email, service, mobile, message):
    body = f"""
📥 New Contact Form Submission:

Name: {name}
Email: {email}
Mobile: {mobile}
Service: {service}
Message: {message}
"""
    msg = Message(subject="📨 New Contact Request",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[app.config['MAIL_USERNAME']],
                  body=body)
    mail.send(msg)

# Send confirmation email to user
def send_user_confirmation_email(user_email, user_name):
    body = f"""
Hello {user_name},

Thank you for contacting us. We have received your message and will get back to you soon.

Best regards,
Shivam (Portfolio Website)
"""
    msg = Message(subject="Thank you for contacting us!",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[user_email],
                  body=body)
    mail.send(msg)

# ---------- ROUTES ----------

@app.route('/')
def index():
    log_visit_to_sheet()
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        service = request.form.get('service')
        message = request.form.get('message')
        mobile_number = request.form.get('mobileNumber', '')

        save_contact_to_sheet(name, email, service, mobile_number, message)
        send_contact_email(name, email, service, mobile_number, message)
        send_user_confirmation_email(email, name)

        return jsonify({
            'status': 'success',
            'message': 'Form data saved and emails sent.',
            'data': {
                'name': name,
                'email': email,
                'service': service,
                'message': message,
                'mobileNumber': mobile_number
            }
        })

    except Exception as e:
        print(f"Error saving to Google Sheet or sending email: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to save form data or send email: {str(e)}'
        }), 500

# ---------- FLASK CONFIG ----------
if __name__ == '__main__':
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host=host, port=port, debug=debug)
