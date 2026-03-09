const express = require('express');
const path = require('path');
const { add, subtract, multiply, divide } = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route principale - interface HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API : addition
app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Paramètres invalides' });
  }
  res.json({ operation: 'addition', a, b, result: add(a, b) });
});

// API : soustraction
app.get('/subtract', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Paramètres invalides' });
  }
  res.json({ operation: 'soustraction', a, b, result: subtract(a, b) });
});

// API : multiplication
app.get('/multiply', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Paramètres invalides' });
  }
  res.json({ operation: 'multiplication', a, b, result: multiply(a, b) });
});

// API : division
app.get('/divide', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Paramètres invalides' });
  }
  try {
    res.json({ operation: 'division', a, b, result: divide(a, b) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Démarrage du serveur uniquement si lancé directement (pas pendant les tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Calculatrice disponible sur http://localhost:${PORT}`);
  });
}

module.exports = app; // Exporté pour les tests
