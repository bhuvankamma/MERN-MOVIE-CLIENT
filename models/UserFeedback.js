import mongoose from 'mongoose';


const userFeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
    },
  },
  { timestamps: true }
);

const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);
export default UserFeedback;
