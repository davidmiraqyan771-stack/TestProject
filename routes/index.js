import express from 'express';
import Room from '../models/room.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../views/index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading index.html');
    }
    const ipStr = process.env.ip ? process.env.ip : 'Not set';
    const modifiedData = data.replace('</body>', `  <div style="text-align: center; color: white;">IP: ${ipStr}</div>\n</body>`);
    res.send(modifiedData);
  });
});

router.get('/api/rooms', async (req, res) => {
  const rooms = await Room.find().populate('themeId');
  res.json(rooms);
});


export default router;