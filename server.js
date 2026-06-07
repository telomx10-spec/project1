const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Project1' });
});

app.listen(3000, () => console.log('Server on port 3000'));
