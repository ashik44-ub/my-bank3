import mongoose from 'mongoose';

const VaultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    siteName: { type: String, required: true },
    username: { type: String, required: true },
    encrypted: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Vault || mongoose.model('Vault', VaultSchema);
