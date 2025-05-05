require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Server running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

