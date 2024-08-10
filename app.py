from flask import Flask, request, jsonify, render_template
import json
from transformers import pipeline

app = Flask(__name__)

# Load predefined responses
with open('responses.json') as f:
    responses = json.load(f)

# Load the NLP model
nlp_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Categories (topics) we support, matching the keys in responses.json
categories = list(responses.keys())

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get('message', '').lower()
    print(f"User input: {user_input}")  # Debug output
    reply = generate_response(user_input)
    return jsonify({'response': reply})


def generate_response(user_input):
    # Use the NLP model to classify the input message
    result = nlp_model(user_input, candidate_labels=categories)
    # Find the category with the highest score
    best_category = result['labels'][0]
    confidence_score = result['scores'][0]

    if confidence_score > 0.5:  # Confidence threshold
        return responses.get(best_category, "I'm sorry, I didn't understand that. Could you please rephrase?")
    else:
        return "I'm sorry, I didn't understand that. Could you please rephrase?"

if __name__ == '__main__':
    app.run(debug=True)