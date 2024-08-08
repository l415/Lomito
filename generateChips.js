const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Chip = require('./models/Chip');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    generateChips();
  })
  .catch(err => console.error('Error connecting to MongoDB', err));

async function generateChips() {
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
    console.log('Chips generated successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error generating chips:', err);
    mongoose.connection.close();
  }
}
