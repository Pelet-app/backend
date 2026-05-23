/* eslint-disable camelcase */
import path from 'path';
import fs from 'fs';
import ResumesRepositories from './resumes-repositories.js';
import { nanoid } from 'nanoid';
import { extractCvText } from '../../utils/extractCv.js';
import AuthenticationError from '../../exceptions/authentication-error.js';

const resumeRepositories = new ResumesRepositories();

export const uploadResume = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let filename;
    let filePath;
    let cvText = '';

    if (!req.user) {
      return next(new AuthenticationError('Unauthorized'));
    }

    if (req.file) {
      filename = req.file.originalname;
      filePath = `/uploads/${req.file.filename}`;

      try {
        cvText = await extractCvText(req.file.path);
      } catch (error) {
        console.error(error);
      }
    } else if (req.body.fileUrl) {
      // ── JSON fallback / dummy URL (no AI extraction yet) ───────────
      filename = req.body.filename || path.basename(req.body.fileUrl);
      filePath = req.body.fileUrl;
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'File atau fileUrl wajib disertakan',
      });
    }

    const id = `doc-${nanoid(16)}`;

    const document = await resumeRepositories.createDocument({
      id,
      userId,
      filename,
      path: filePath,
      cvText,
    });

    // TODO: AI skill extraction goes here in the next phase
    // await extractSkillsFromResume(document);

    return res.status(201).json({
      status: 'success',
      message: 'Resume berhasil diunggah',
      data: { documentId: document.id, path: document.path, cv_text: document.cv_text },
    });
  } catch (err) {
    // Cleanup uploaded file if DB insert fails
    if (req.file) {
      fs.unlink(req.file.path, () => { });
    }
    return next(err);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const documents = await resumeRepositories.getDocumentsByUser(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: { documents },
    });
  } catch (err) {
    return next(err);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Throws NotFoundError if missing
    const document = await resumeRepositories.getDocumentById(id);

    // Throws AuthorizationError if not owner
    await resumeRepositories.verifyDocumentOwner(id, req.user.id);

    return res.status(200).json({
      status: 'success',
      data: { document },
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    await resumeRepositories.verifyDocumentOwner(id, req.user.id);
    const deleted = await resumeRepositories.deleteDocument(id);

    // Remove physical file if it's a local path (not an external URL)
    if (deleted.path && deleted.path.startsWith('/uploads/')) {
      const fullPath = path.resolve(`.${deleted.path}`);
      fs.unlink(fullPath, () => { });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Resume berhasil dihapus',
    });
  } catch (err) {
    return next(err);
  }
};

export const getResumesByUserId = async (req, res, next) => {
  try {
    const resumes = await resumeRepositories.getDocumentsByuserId(req.user.id);
    return res.status(200).json({ status: 'success', data: { resumes } });
  } catch (err) {
    return next(err);
  }
};