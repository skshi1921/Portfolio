from flask import Flask, render_template, request, jsonify, send_file
import os
import csv
from datetime import datetime

app = Flask(__name__,
    static_url_path='/static',
    static_folder='static',
    template_folder='templates')

# Set a secret key for security
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'your-secret-key-here')

# 🔁 CSV log file for visit tracking
VISIT_LOG_CSV = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'visit_logs.csv')

# ✅ Function to log visit per day
def log_visit():
    today = datetime.now().strftime('%Y-%m-%d')
    data = {}

    # Load existing data
    if os.path.exists(VISIT_LOG_CSV):
        with open(VISIT_LOG_CSV, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) == 2:
                    date, count = row
                    data[date] = int(count)

    # Update today's count
    if today in data:
        data[today] += 1
    else:
        data[today] = 1

    # Write updated data back
    with open(VISIT_LOG_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for date, count in sorted(data.items()):
            writer.writerow([date, count])

# ✅ Homepage — track views here
@app.route('/')
def index():
    log_visit()  # track view
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
        mobile_number = request.form.get('mobileNumber', '')  # Default to empty string

        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data = [timestamp, name, email, service, mobile_number, message]

        csv_file = 'contacts.csv'
        file_exists = os.path.isfile(csv_file)

        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(['Timestamp', 'Name', 'Email', 'Service', 'Mobile Number', 'Message'])
            writer.writerow(data)

        return jsonify({
            'status': 'success',
            'message': 'Form data received and saved to CSV.',
            'data': {
                'name': name,
                'email': email,
                'service': service,
                'message': message,
                'mobileNumber': mobile_number
            }
        })

    except Exception as e:
        print(f"Error saving to CSV: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to save form data: {str(e)}'
        }), 500

# ✅ Show contact submissions
@app.route('/request-dikha')
def request_dikha():
    try:
        with open("contacts.csv", "r", encoding="utf-8") as f:
            rows = f.readlines()
            rows = [row.strip().split(",") for row in rows]

        html = "<h2>Contact Requests</h2><table border='1' cellpadding='5'>"
        for i, row in enumerate(rows):
            html += "<tr>"
            for cell in row:
                tag = "th" if i == 0 else "td"
                html += f"<{tag}>{cell}</{tag}>"
            html += "</tr>"
        html += "</table>"
        return html

    except Exception as e:
        return f"<h3>Error reading CSV file: {str(e)}</h3>"

# ✅ New route to show total views
@app.route('/total-view')
def total_view():
    try:
        if not os.path.exists(VISIT_LOG_CSV):
            return "<h3>No views recorded yet.</h3>"

        with open(VISIT_LOG_CSV, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            rows = list(reader)

        html = "<h2>Daily View Count</h2><table border='1' cellpadding='5'><tr><th>Date</th><th>Views</th></tr>"
        for row in rows:
            if len(row) == 2:
                html += f"<tr><td>{row[0]}</td><td>{row[1]}</td></tr>"
        html += "</table>"
        return html

    except Exception as e:
        return f"<h3>Error reading log: {str(e)}</h3>"

# ✅ Flask run config
if __name__ == '__main__':
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host=host, port=port, debug=debug)
