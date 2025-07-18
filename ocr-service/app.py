# ocr-service/app.py

from flask import Flask, request, jsonify
import pytesseract
from datetime import datetime
import re
import cv2
import numpy as np

app = Flask(__name__)

class ReceiptParser:
    def __init__(self):
        self.amount_patterns = [
            (r'TOTAL\s+\$?(\d+\.\d{2})', 1.0),
            (r'AMOUNT\s+DUE\s+\$?(\d+\.\d{2})', 0.9),
            (r'SUBTOTAL\s+\$?(\d+\.\d{2})', 0.8),
            (r'\$?(\d+\.\d{2})$', 0.7)
        ]
        self.date_patterns = [
            (r'\b(\d{2}/\d{2}/\d{4})\b', '%m/%d/%Y', 1.0),
            (r'\b(\d{2}-\d{2}-\d{4})\b', '%m-%d-%Y', 0.9),
            (r'\b(\d{4}-\d{2}-\d{2})\b', '%Y-%m-%d', 0.9),
        ]
        self.store_pattern = r'^([A-Za-z& ]{3,})[\n\r]'

    def preprocess(self, file_stream):
        file_bytes = np.frombuffer(file_stream.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.medianBlur(gray, 3)
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        return thresh

    def extract_text(self, img):
        return pytesseract.image_to_string(img, config="--psm 6")

    def extract_amount(self, text):
        text = text.replace(',', '')
        for pattern, _ in self.amount_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return "{:.2f}".format(float(match.group(1)))
        matches = re.findall(r'\d+\.\d{2}', text)
        if matches:
            return max(matches, key=lambda x: float(x))
        return "0.00"

    def extract_date(self, text):
        for pattern, fmt, _ in self.date_patterns:
            match = re.search(pattern, text)
            if match:
                try:
                    return datetime.strptime(match.group(1), fmt).date().isoformat()
                except:
                    continue
        return ""

    def extract_store(self, text):
        match = re.match(self.store_pattern, text)
        if match:
            return match.group(1).strip()
        lines = text.splitlines()
        for line in lines:
            line = line.strip()
            if 3 <= len(line) <= 35 and not any(char.isdigit() for char in line):
                return line
        return "Unknown Store"

    def parse(self, file):
        try:
            img = self.preprocess(file)
            text = self.extract_text(img)

            return {
                "title": self.extract_store(text),
                "amount": self.extract_amount(text),
                "date": self.extract_date(text),
                "category": "Uncategorized",
                "success": True,
                "raw_text": text
            }
        except Exception as e:
            return {"error": str(e), "success": False}

parser = ReceiptParser()

@app.route("/ocr", methods=["POST"])
def ocr():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    result = parser.parse(request.files["image"])
    if result["success"]:
        return jsonify(result)
    return jsonify(result), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
