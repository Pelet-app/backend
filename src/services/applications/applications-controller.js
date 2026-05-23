// /* eslint-disable camelcase */
// import ApplicationsRepositories from './applications-repositories.js';
// import response from '../../utils/response.js';
// import InvariantError from '../../exceptions/invariant-error.js';
// import NotFoundError from '../../exceptions/not-found-error.js';

// const applicationsRepositories = new ApplicationsRepositories();

// export const createApplication = async (req, res, next) => {
//   const { user_id, job_id, status } = req.validated;

//   const application = await applicationsRepositories.createApplication({
//     user_id,
//     job_id,
//     status
//   });

//   if (!application) {
//     return next(new InvariantError('Lamaran gagal ditambahkan'));
//   }

//   return response(res, 201, 'Lamaran berhasil ditambahkan', application);
// };

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