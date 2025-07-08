from flask import Flask, render_template, request, jsonify, session
import os
import csv
from datetime import datetime
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from flask_mail import Mail, Message
import requests

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
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = ('Shubham Kumar', app.config['MAIL_USERNAME'])

mail = Mail(app)

# ---------- GOOGLE SHEETS SETUP ----------
VISITOR_SHEET_ID = "1fJ_eypzPTvtMxZ_yM0R3yeYtEZ6i1YgDlG49s86mTKw"
CONTACT_SHEET_ID = "1hLDSRhGJKja5Ogrk-rvUwVvE02tLsVmCNI2ZZkV-saI"

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

# ---------- VISITOR TRACKING ----------
def log_visit_to_sheet():
    today = datetime.now().strftime('%Y-%m-%d')
    if session.get('visited_today') == today:
        return

    session['visited_today'] = today
    sheet = get_sheet(VISITOR_SHEET_ID)
    sheet.append_row([today, 1])

def get_geo_info(ip):
    try:
        res = requests.get(f"https://ipinfo.io/{ip}/json")
        data = res.json()
        return data.get("city", "-"), data.get("country", "-")
    except:
        return "-", "-"

# ---------- CONTACT MANAGEMENT ----------
def save_contact_to_sheet(name, email, service, mobile, message):
    sheet = get_sheet(CONTACT_SHEET_ID)
    ip = request.headers.get('X-Forwarded-For', '').split(',')[0].strip() or request.remote_addr
    city, country = get_geo_info(ip)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sheet.append_row([timestamp, name, email, service, mobile, message, ip, city, country, "Yes"])

def send_contact_email(name, email, service, mobile, message):
    ip = request.headers.get('X-Forwarded-For', '').split(',')[0].strip() or request.remote_addr
    city, country = get_geo_info(ip)
    body = f"""
📥 New Contact Form Submission:

Name: {name}
Email: {email}
Mobile: {mobile}
Service: {service}
Message: {message}
City: {city}
Country: {country}
"""
    msg = Message(subject="📨 New Contact Request",
                  recipients=[app.config['MAIL_USERNAME']],
                  body=body)
    mail.send(msg)

def send_user_confirmation_email(user_email, user_name):
    body = f"""
Hi {user_name},

Thank you for reaching out to me through my portfolio website! 🙌

I've received your message and will get back to you as soon as possible. In the meantime, feel free to explore more of my work on the site.

Have a great day ahead! 🌟

Warm regards,
Shubham Kumar
"""
    msg = Message(subject="Thanks for getting in touch!",
                  recipients=[user_email],
                  body=body)
    mail.send(msg)

# ---------- DAILY SUMMARY ----------
@app.route('/send-daily-summary')
def send_daily_summary():
    try:
        visitor_sheet = get_sheet(VISITOR_SHEET_ID)
        contact_sheet = get_sheet(CONTACT_SHEET_ID)
        today = datetime.now().strftime('%Y-%m-%d')

        visit_count = sum(1 for row in visitor_sheet.get_all_values()[1:] if row[0] == today)
        contact_count = sum(1 for row in contact_sheet.get_all_values()[1:] if today in row[0])

        body = f"""
📊 Daily Summary - {today}

👀 Visitors: {visit_count}
📬 Contact Submissions: {contact_count}

Log in to your Google Sheets for details.
"""
        msg = Message(subject=f"📈 Daily Summary - {today}",
                      recipients=[app.config['MAIL_USERNAME']],
                      body=body)
        mail.send(msg)
        return "Summary email sent."

    except Exception as e:
        return f"Error sending summary: {str(e)}"

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
