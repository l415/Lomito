const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chip = require('../models/Chip');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const secret = process.env.SESSION_SECRET;

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error('User not found');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Middleware para autenticación
const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Ruta para registrar un chip
router.post('/chips/register', auth, async (req, res) => {
  const { chipId, ownerName, contactInfo } = req.body;

  try {
    const chip = await Chip.findOne({ chipId });
    if (!chip) {
      return res.status(404).json({ error: 'Chip not found' });
    }
    if (chip.registered) {
      return res.status(400).json({ error: 'Chip already registered' });
    }

    chip.owner = req.user.userId;
    chip.ownerName = ownerName;
    chip.contactInfo = contactInfo;
    chip.registered = true;
    await chip.save();

    res.status(200).json({ message: 'Chip registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ruta para ver la información del chip
router.get('/chips/:chipId', async (req, res) => {
  const { chipId } = req.params;

  try {
    const chip = await Chip.findOne({ chipId }).populate('owner', 'username');
    if (!chip) {
      return res.status(404).json({ error: 'Chip not found' });
    }

    res.status(200).json(chip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ruta para generar chips (solo para uso administrativo)
router.post('/chips/generate', async (req, res) => {
  const keys = [
    { chipId: 'XZGT-PQWE-RTY', route: '/details/XZGT-PQWE-RTY' },
    { chipId: 'NMBV-DSAF-HJK', route: '/details/NMBV-DSAF-HJK' },
    { chipId: 'LPOI-UYTR-REW', route: '/details/LPOI-UYTR-REW' },
    { chipId: 'QWAS-ZXCV-BNM', route: '/details/QWAS-ZXCV-BNM' },
    { chipId: 'VBGF-DERT-YUI', route: '/details/VBGF-DERT-YUI' },
    { chipId: 'OPIU-YTRE-WQS', route: '/details/OPIU-YTRE-WQS' },
    { chipId: 'ASDF-GHJK-LZXC', route: '/details/ASDF-GHJK-LZXC' },
    { chipId: 'HJUI-KOLM-NBGF', route: '/details/HJUI-KOLM-NBGF' },
    { chipId: 'XSDC-FRTG-HNJU', route: '/details/XSDC-FRTG-HNJU' },
    { chipId: 'YUIO-PKLM-NVBG', route: '/details/YUIO-PKLM-NVBG' },
    { chipId: 'QWEA-SZXD-CVBN', route: '/details/QWEA-SZXD-CVBN' },
    { chipId: 'AZWS-XEDC-RFVB', route: '/details/AZWS-XEDC-RFVB' }
  ];

  try {
    await Chip.insertMany(keys);
    res.status(201).json({ message: 'Chips generated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
