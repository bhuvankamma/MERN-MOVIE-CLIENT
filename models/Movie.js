import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const abuseReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Movie' },
    language: { type: String, required: true },
    releaseYear: { type: Number },
    ageRestriction: { type: Number },
    genre: { type: String },
    genres: [{ type: String }],

    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    filePath: { type: String }, // For streaming from local server

    // 📈 Interactions
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reviews: [reviewSchema],
    abuseReports: [abuseReportSchema],
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
