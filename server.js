const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const BASE_DIR = "G:/_temp_login/";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Utility: percorso file dati personali
function getUserDataPath(email) {
  return path.join(BASE_DIR, email);
}

// ✅ REGISTRA UTENTE
app.post('/api/register', async (req, res) => {
  const { password, nome, cognome, email } = req.body;
  const username = email; // username = email

  if (!username || !password || !nome || !cognome || !email) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  const userDir = getUserDataPath(email);

  // Controllo email già registrata
  if (await fs.pathExists(userDir)) {
    return res.status(409).json({ message: 'Email già registrata' });
  }

  await fs.ensureDir(userDir);
  const userData = { username, password, nome, cognome, email, createdAt: new Date() };
  await fs.writeJson(path.join(userDir, 'user.json'), userData, { spaces: 2 });

  res.json({ message: 'Registrazione completata! Il tuo username sarà la tua email.' });
});

// ✅ LOGIN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const userDir = getUserDataPath(username); // username = email
  const userPath = path.join(userDir, 'user.json');

  if (!(await fs.pathExists(userPath))) {
    return res.status(404).json({ message: 'Utente non trovato' });
  }

  const savedUser = await fs.readJson(userPath);
  if (savedUser.password !== password) {
    return res.status(401).json({ message: 'Password errata' });
  }

  res.json({ message: 'Login riuscito', user: savedUser });
});



app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

