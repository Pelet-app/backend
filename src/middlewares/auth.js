import TokenManager from '../security/token-manager.js';
import response from '../utils/response.js';
import AuthenticationError from '../exceptions/authentication-error.js';

export async function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token && token.indexOf('Bearer ') !== -1) {
    try {
      const user = await TokenManager.verify(token.split('Bearer ')[1], process.env.ACCESS_TOKEN_KEY);
      req.user = user;
      return next();
    } catch (error) {
      return response(res, 401, error.message, null);
    }
  }

  return response(res, 401, 'Unauthorized', null);
};

export async function hrdOnly(req, res, next) {

  if (!req.user) {
    return next(new AuthenticationError('Authentikasi diperlukan'));
  }

  if (req.user.role !== 'hrd') {
    return next(new AuthenticationError('Akses ditolak: hanya HRD yang dapat mengakses resource ini'));
  }
  return next();
}