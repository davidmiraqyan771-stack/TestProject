import express from 'express';
import Room from '../models/room.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/api/rooms', async (req, res) => {
  const rooms = await Room.find().populate('themeId');
  res.json(rooms);
});

export default router;