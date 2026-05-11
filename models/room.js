import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String, // NEW FIELD
  difficulty: String,
  themeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' }
});

export default mongoose.model('Room', RoomSchema);