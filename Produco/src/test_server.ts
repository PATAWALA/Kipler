import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello depuis le test 🎉');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur de test lancé sur http://localhost:${PORT}`);
});

