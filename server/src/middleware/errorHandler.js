const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Sits after every route — only reached if something threw without being
// caught locally (e.g. a bug in a controller, not the deliberate 400/404s
// each controller already returns itself).
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: 'A record with this value already exists' });
  }

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
};

module.exports = { notFound, errorHandler };