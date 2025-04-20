import Trailer from '../models/Trailer.js';

// Admin adds a trailer
export const addTrailer = async (req, res) => {
  try {
    const { title, videoUrl, description, thumbnail } = req.body;
    const trailer = await Trailer.create({ title, videoUrl, description, thumbnail });
    res.status(201).json(trailer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add trailer' });
  }
};

// Admin or user fetches all trailers
export const getAllTrailers = async (req, res) => {
  try {
    const trailers = await Trailer.find();
    res.json(trailers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trailers' });
  }
};

// Admin deletes a trailer
export const deleteTrailer = async (req, res) => {
  try {
    const trailer = await Trailer.findById(req.params.id);
    if (!trailer) return res.status(404).json({ error: 'Trailer not found' });

    await trailer.remove();
    res.json({ message: 'Trailer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trailer' });
  }
};
