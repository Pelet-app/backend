import TokenManager from '../../security/token-manager.js';
import AuthenticationRepository from './authentications-repositories.js';
import UserRepositories from '../users/users-repositories.js';
// import InvariantError from '../../exceptions/invariant-error.js';
import AuthenticationError from '../../exceptions/authentication-error.js';
import bcrypt from 'bcrypt';

const userRepositories = new UserRepositories();
const authenticationRepository = new AuthenticationRepository();

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepositories.getUserByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Email atau password salah');
    }

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = TokenManager.generateAccessToken(tokenPayload);
    const refreshToken = TokenManager.generateRefreshToken(tokenPayload);

    await authenticationRepository.addRefreshToken(refreshToken);

    const profileSnapshot = {
      fullname: user.full_name || user.name,
      avatarUrl: user.avatar_url || null,
      ...(user.role === 'hrd'
        ? { hrdData: user.hrd_data || {} }
        : { applicantData: user.applicant_data || {} }
      ),
    };

    return res.status(201).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: profileSnapshot,
        }
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authenticationRepository.verifyRefreshToken(refreshToken);

    const payload = TokenManager.verifyRefreshToken(refreshToken);
    const accessToken = TokenManager.generateAccessToken({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    });

    return res.status(200).json({
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await authenticationRepository.verifyRefreshToken(refreshToken);
    await authenticationRepository.deleteRefreshToken(refreshToken);

    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil',
    });
  } catch (err) {
    return next(err);
  }
};