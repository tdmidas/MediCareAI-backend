from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained model
model = joblib.load("rf_model.pkl")

# Define the predict route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data from the request
        data = request.json

        # Perform prediction using the loaded model
        prediction = model.predict([data['input']])  # Assuming 'input' is the key for your input data

        # Return the prediction as JSON response
        return jsonify({'prediction': int(prediction)}), 200

    except Exception as e:
        # Return error message if something goes wrong
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True,port=6000)
