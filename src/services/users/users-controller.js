import UserRepositories from './users-repositories.js';
import response from '../../utils/response.js';
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const userRepositories = new UserRepositories();

export const createUser = async (req, res, next) => {
  const { name, email, password, role, companyName, position, companyWebsite } = req.validated;

  const isEmailExist = await userRepositories.verifyEmailUnique(email);
  if (isEmailExist) {
    return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = `user-${nanoid(16)}`;

  const { user, profile } = await userRepositories.registerWithProfile({
    id,
    name,
    email,
    hashedPassword,
    role: role || 'user',
    initialHrdData: {
      companyName, position, companyWebsite
    }
  });

  return res.status(201).json({
    status: 'success',
    message: 'User berhasil ditambahkan',
    data: {
      userId: user.id,
      role: user.role,
      profileId: profile.id,
    },
  });
};

export const getMe = async (req, res, next) => {
  const { id } = req.params;
  const user = await userRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil ditampilkan', user);
};

