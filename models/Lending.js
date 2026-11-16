import mongoose from 'mongoose';

// type: 'given'  => user dhar diyeche (taka onno kaoke deya hoyeche, taka komeche)
// type: 'taken'  => user dhar niyeche (taka onno karo theke neya hoyeche, taka beray/debt)
const LendingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['given', 'taken'], required: true },
    personName: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Lending || mongoose.model('Lending', LendingSchema);
