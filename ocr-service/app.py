from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import io
import re
from datetime import datetime
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def extract_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    # Convert uploaded file to OpenCV image
    file_bytes = np.asarray(bytearray(request.files['image'].read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Preprocess: grayscale, blur, threshold
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 3)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    # Convert to PIL format for Tesseract
    image = Image.fromarray(thresh)

    # Now OCR
    text = pytesseract.image_to_string(image, config="--psm 6")

    # Smart parser
    lines = text.split('\n')
    lines = [line.strip() for line in lines if line.strip()]
    full_text = "\n".join(lines)

    # Extract amount using regex
    amount_match = re.search(r'(\$|\bUSD)?\s?(\d+\.\d{2})', full_text)
    amount = amount_match.group(2) if amount_match else "0.00"

    # Extract date using regex
    date_match = re.search(r'(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})', full_text)
    raw_date = date_match.group(0) if date_match else ""
    parsed_date = ""
    try:
        parsed_date = datetime.strptime(raw_date, "%Y-%m-%d").date().isoformat()
    except:
        try:
            parsed_date = datetime.strptime(raw_date, "%d/%m/%Y").date().isoformat()
        except:
            pass

    data = {
        "title": lines[0] if lines else "",
        "amount": amount,
        "category": "Uncategorized",
        "date": parsed_date,
    }

    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
