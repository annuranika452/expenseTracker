const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  const form = new FormData();
  form.append('image', fs.createReadStream(req.file.path));

  try {
    const ocrRes = await fetch('http://ocr:5001/ocr', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    const data = await ocrRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
