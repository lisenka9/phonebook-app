const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist/phonebook-app')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/phonebook-app/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Phonebook app running on port ${port}`);
  console.log(`Open http://localhost:${port} to view the app`);
});