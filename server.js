const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cimatec',
  database: 'celsinho'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Erro ao consultar os dados:', err);
      res.status(500).send('Erro ao consultar os dados');
      return;
    }

    if (results.length > 0) {
      res.status(200).send('Login bem-sucedido');
    } else {
      res.status(404).send('Usuário ou senha incorretos');
    }
  });
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
