import mongoose from 'mongoose';

const trailerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: String,
    }
  },
  { timestamps: true }
);

const Trailer = mongoose.model('Trailer', trailerSchema);
export default Trailer;
