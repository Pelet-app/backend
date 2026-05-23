import JobsRepositories from './jobs-repositories.js';
import { nanoid } from 'nanoid';

const jobsRepositories = new JobsRepositories();

export const createJob = async (req, res, next) => {
  try {
    // hrd_id diambil dari JWT, bukan payload body
    const hrdId = req.user.id;

    const {
      categoryId, title, description,
      jobType, experienceLevel, locationType, status,
    } = req.body;

    const id = `job-${nanoid(16)}`;

    const job = await jobsRepositories.createJob({
      id,
      hrdId,          // ← dari token, bukan req.body
      categoryId,
      title,
      description,
      jobType: jobType || 'full-time',
      experienceLevel: experienceLevel || 'entry',
      locationType: locationType || 'onsite',
      status: status || 'open',
    });

    return res.status(201).json({
      status: 'success',
      message: 'Lowongan berhasil dibuat',
      data: { jobId: job.id },
    });
  } catch (err) {
    return next(err);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const {
      status, jobType, experienceLevel, locationType,
      categoryId, search, page, limit,
    } = req.query;

    const result = await jobsRepositories.getJobs({
      status, jobType, experienceLevel, locationType,
      categoryId, search,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    });

    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    return next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobsRepositories.getJobById(id);

    return res.status(200).json({
      status: 'success',
      data: { job },
    });
  } catch (err) {
    return next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ownership: only the HRD who owns the company can update the job
    await jobsRepositories.verifyJobOwner(id, req.user.id);

    const job = await jobsRepositories.updateJob(id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Lowongan berhasil diperbarui',
      data: { job },
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ownership check
    await jobsRepositories.verifyJobOwner(id, req.user.id);

    await jobsRepositories.deleteJob(id);

    return res.status(200).json({
      status: 'success',
      message: 'Lowongan berhasil dihapus',
    });
  } catch (err) {
    return next(err);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await jobsRepositories.getJobsByHrdId(req.user.id);
    return res.status(200).json({ status: 'success', data: { jobs } });
  } catch (err) {
    return next(err);
  }
};


