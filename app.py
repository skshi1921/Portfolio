from flask import Flask, render_template, request, jsonify
import os
import csv
from datetime import datetime

app = Flask(__name__,
    static_url_path='/static',
    static_folder='static',
    template_folder='templates')

# Set a secret key for security
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'your-secret-key-here')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        service = request.form.get('service')
        message = request.form.get('message')
        mobile_number = request.form.get('mobileNumber', '')  # Default to empty string if not provided

        # Add timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Prepare data for CSV
        data = [timestamp, name, email, service, mobile_number, message]

        # Define CSV file path
        csv_file = 'contacts.csv'

        # Check if CSV file exists, if not create it with headers
        file_exists = os.path.isfile(csv_file)

        # Append data to CSV
        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(['Timestamp', 'Name', 'Email', 'Service', 'Mobile Number', 'Message'])
            writer.writerow(data)

        # Return success response
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
        # Log the error and return failure response
        print(f"Error saving to CSV: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to save form data: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Get host, port, and debug mode from environment variables
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host=host, port=port, debug=debug)