/**
 * Multi-tenant Middleware
 * Ensures restricted resources are scoped to the correct salon.
 * Expects 'x-salon-id' header in requests.
 */
export const multiTenant = (req, res, next) => {
  const salonId = req.headers['x-salon-id'];

  if (!salonId) {
    return res.status(400).json({ error: 'Missing x-salon-id header' });
  }

  req.salonId = parseInt(salonId, 10);
  next();
};
