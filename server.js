const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Servir archivos estáticos primero
app.use(express.static(path.join(__dirname, 'public')));

// Montar las rutas de la API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Ruta dinámica para manejar los chipId, evitando capturar rutas de archivos estáticos
app.get('/:chipId', async (req, res, next) => {
  if (path.extname(req.params.chipId)) {
    console.log(`Static file request: ${req.params.chipId}`);
    return next();
  }

  const { chipId } = req.params;
  const Chip = require('./models/Chip');

  console.log(`Fetching chip with ID: ${chipId}`);

  try {
    const chip = await Chip.findOne({ chipId }).populate('owner', 'username');
    if (!chip) {
      console.error('Chip not found');
      return res.status(404).send('<h1>Chip not found</h1>');
    }

    if (!chip.registered) {
      console.log('Chip not registered');
      return res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } else {
      console.log('Chip found and registered');
      return res.sendFile(path.join(__dirname, 'public', 'chip-info.html'));
    }
  } catch (err) {
    console.error('Error fetching chip:', err);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
});

// Nueva ruta para servir register-chip.html
app.get('/register-chip/:chipId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register-chip.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
