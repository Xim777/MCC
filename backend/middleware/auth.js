/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and enforces role/district access
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'eci-tn-secret-2026';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { iat, exp, ...user } = decoded;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  }
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { iat, exp, ...user } = decoded;
    req.user = user;
  } catch (err) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

function requireDistrict(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { iat, exp, ...user } = decoded;
    req.user = user;
  } catch (err) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  if (req.user.role !== 'district') {
    return res.status(403).json({ error: 'District officer access required.' });
  }
  next();
}

/**
 * Enforce that district officers can only access their own district's data
 */
function enforceDistrictAccess(req, res, next) {
  if (req.user.role === 'admin') {
    return next();
  }
  const requestedDistrict = req.params.districtId || req.body.districtId || req.query.districtId;
  if (requestedDistrict && requestedDistrict !== req.user.districtId) {
    return res.status(403).json({ error: 'Access denied. You can only access your own district.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, requireDistrict, enforceDistrictAccess };
