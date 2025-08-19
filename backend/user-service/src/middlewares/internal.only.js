export default function internalOnly(req, res, next) {
  const token = req.headers['x-internal-token'];
  if (token !== process.env.INTERNAL_SERVICE_TOKEN) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
