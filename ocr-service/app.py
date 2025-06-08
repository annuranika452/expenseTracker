from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import io

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def extract_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = Image.open(request.files['image'].stream)
    text = pytesseract.image_to_string(image)

    # Dummy parser
    lines = text.split('\n')
    data = {
        'title': lines[0] if lines else '',
        'amount': '0.00',
        'category': 'Uncategorized',
        'date': ''
    }

    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
