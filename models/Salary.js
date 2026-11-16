import mongoose from 'mongoose';

const SalarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Salary || mongoose.model('Salary', SalarySchema);
