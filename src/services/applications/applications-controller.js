/* eslint-disable camelcase */
import ApplicationsRepositories from './applications-repositories.js';
import response from '../../utils/response.js';
import InvariantError from '../../exceptions/invariant-error.js';
import NotFoundError from '../../exceptions/not-found-error.js';

const applicationsRepositories = new ApplicationsRepositories();

export const createApplication = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id: job_id } = req.params;

    const verifyJob = await applicationsRepositories.verifyJobExist(job_id);
    if (!verifyJob) {
      throw new NotFoundError('Lowongan tidak ditemukan atau sudah ditutup');
    }

    const verifyApplication = await applicationsRepositories.verifyApplicationsExist({ user_id, job_id });
    if (verifyApplication) {
      throw new InvariantError('Anda sudah melamar pekerjaan ini');
    }

    const application = await applicationsRepositories.createApplication({
      user_id,
      job_id,
    });

    if (!application) {
      return next(new InvariantError('Lamaran gagal ditambahkan'));
    }

    return response(res, 201, 'Lamaran berhasil ditambahkan', application);
  } catch (err) {
    next(err);
  }
};

export const getAllMyApplication = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const applications = await applicationsRepositories.getAllMyApplications(user_id);

    return response(res, 200, 'Lamaran berhasil ditampilkan', { applications });
  } catch (err) {
    next(err);
  }
};

export const getMyApplicationsById = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id: application_id } = req.params;

    const application = await applicationsRepositories.getMyApplicationsById({ application_id, user_id });

    if (!application) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }

    return response(res, 200, 'Lamaran berhasil ditampilkan', application);
  } catch (err) {
    next(err);
  }
};

export const getAllApplicationByJobId = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id: job_id } = req.params;

    const applications = await applicationsRepositories.getAllApplicationsByJobId({ user_id, job_id });

    return response(res, 200, 'Data pelamar berhasi ditampilkan', { applications });
  } catch (err) {
    next(err);
  }
};

export const updateStatusApplicationById = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id: application_id } = req.params;
    const { status } = req.validated;

    const application = await applicationsRepositories.updateStatusApplicationById({ user_id, application_id, status });

    if (!application) {
      throw new NotFoundError('Data pelamar tidak ditemukan');
    }
    return response(res, 200, 'Status lamaran berhasil diperbarui', application);
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const {
      jobId: job_id,
      applicationId: application_id,
    } = req.params;

    const application = await applicationsRepositories.getApplicationById({ user_id, job_id, application_id });

    if (!application) {
      throw new NotFoundError('Data pelamar tidak ditemukan');
    }
    return response(res, 200, 'Data pelamar berhasi ditampilkan', application);
  } catch (err) {
    next(err);
  }
};

// export const updateApplication = async (req, res, next) => {
//   const { id } = req.params;
//   const existingApplication =
//     await applicationsRepositories.getApplicationById(id);

//   if (!existingApplication) {
//     return next(
//       new NotFoundError('Lamaran tidak ditemukan')
//     );
//   }

//   const updatedData = {
//     user_id:
//       req.validated.user_id ??
//       existingApplication.user_id,

//     job_id:
//       req.validated.job_id ??
//       existingApplication.job_id,

//     status:
//       req.validated.status ??
//       existingApplication.status,
//   };


//   const application = await applicationsRepositories.updateApplication(id, updatedData);

//   if (!application) {
//     return next(new NotFoundError('Lamaran tidak ditemukan'));
//   }

//   return response(res, 200, 'Lamaran berhasil diperbarui', application);
// };

// export const deleteApplication = async (req, res, next) => {
//   const { id } = req.params;

//   const application = await applicationsRepositories.deleteApplication(id);

//   if (!application) {
//     return next(new NotFoundError('Lamaran tidak ditemukan'));
//   }

//   return response(res, 200, 'Lamaran berhasil dihapus', application);
// };

// export const getApplications = async (req, res, next) => {
//   const applications = await applicationsRepositories.getAllApplications();

//   if (!applications) {
//     return next(new NotFoundError('Lamaran tidak ditemukan'));
//   }

//   return response(res, 200, 'Lamaran berhasil ditampilkan', { applications });
// };

// export const getApplicationsById = async (req, res, next) => {
//   const { id } = req.params;
//   const application = await applicationsRepositories.getApplicationById(id);

//   if (!application) {
//     return next(new NotFoundError('Lamaran tidak ditemukan'));
//   }

//   return response(res, 200, 'Lamaran berhasil ditampilkan', application);
// };

// export const getApplicationsByUserId = async (req, res, next) => {
//   const { userId } = req.params;
//   const applications = await applicationsRepositories.getApplicationsByUserId(userId);

//   if (!applications) {
//     return next(new NotFoundError('Lamaran tidak ditemukan'));
//   }

//   return response(res, 200, 'Lamaran berhasil ditampilkan', { applications });
// };

// export const getApplicationsByJobId = async (req, res, next) => {
//   const { jobId } = req.params;
//   const applications = await applicationsRepositories.getApplicationsByJobId(jobId);

//   if (!applications) {
//     return next(new NotFoundError('Lamaran tidak ditemukan'));
//   }

//   return response(res, 200, 'Lamaran berhasil ditampilkan', { applications });
// };