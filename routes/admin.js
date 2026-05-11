import express from 'express';
import Theme from '../models/theme.js';
import Room from '../models/room.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

router.post('/theme', async (req, res) => {
  const theme = new Theme(req.body);
  await theme.save();
  res.json(theme);
});

router.get('/themes', async (req, res) => {
  const themes = await Theme.find();
  res.json(themes);
});

router.put('/theme/:id', async (req, res) => {
  const updatedTheme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTheme);
});

// NEW: Delete Theme
router.delete('/theme/:id', async (req, res) => {
  await Theme.findByIdAndDelete(req.params.id);
  res.json({ message: 'Theme deleted' });
});

router.post('/room', async (req, res) => {
  const room = new Room(req.body);
  await room.save();
  res.json(room);
});

router.put('/room/:id', async (req, res) => {
  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedRoom);
});

// NEW: Delete Room
router.delete('/room/:id', async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: 'Room deleted' });
});

export default router;