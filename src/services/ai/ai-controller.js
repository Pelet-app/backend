/* eslint-disable camelcase */
import AIRepositories from './ai-repositories.js';
import { matchJobsAI, interviewAI } from './ai-service.js';
import { nanoid } from 'nanoid';
import NotFoundError from '../../exceptions/not-found-error.js';
import InvariantError from '../../exceptions/invariant-error.js';

const aiRepositories = new AIRepositories();

export const getRecommendedJobs = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // 1. Ambil latest compressed cv
    const latestDocument = await aiRepositories.getLatestCompressedCv(user_id);

    if (!latestDocument) {
      throw new NotFoundError(
        'Resume belum diupload'
      );
    }

    if (!latestDocument.compressed_cv) {
      throw new InvariantError(
        'compressed_cv tidak ditemukan'
      );
    }

    const document_id = latestDocument.id;

    const existingRecommendation = await aiRepositories.checkRecommendationExists(document_id);

    if (existingRecommendation) {
      throw new InvariantError(
        'Rekomendasi untuk CV terbaru sudah ada, silakan cek rekomendasi Anda'
      );
    }

    // 2. Ambil semua jobs open
    const jobs = await aiRepositories.getOpenJobs();

    if (!jobs.length) {
      throw new NotFoundError(
        'Lowongan pekerjaan tidak tersedia'
      );
    }

    // 3. Mapping payload AI
    const formattedJobs = jobs.map((job) => ({
      job_id: job.id,
      job_text: `${job.title} ${job.description}`,
    }));

    // 4. Call AI service
    const aiResult = await matchJobsAI({
      cv_text: latestDocument.compressed_cv,
      jobs: formattedJobs,
    });

    // 5. Ambil top 3
    const topRecommendations = aiResult.results
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3)
      .map((recommendation) => {
        const job = jobs.find(
          (job) => job.id === recommendation.job_id
        );

        return {
          ...recommendation,

          title: job?.title,
          description: job?.description,

          hrd_id: job?.hrd_id,
          hrd_name: job?.hrd_name,

          company_name: job?.company_name,
          company_website: job?.company_website,
          hrd_position: job?.hrd_position,
        };
      });;

    // 6. Save recommendation baru
    for (const item of topRecommendations) {
      await aiRepositories
        .createRecommendation({
          id: `rec-${nanoid(16)}`,
          user_id,
          document_id,
          job_id: item.job_id,
          match_score: item.match_score,
          ai_analysis:
            item.ai_analysis || null,
          top_units:
            item.top_units || [],
          gap_units:
            item.gap_units || [],
          missing_skills:
            item.missing_skills || [],
        });
    }

    return res.status(200).json({
      status: 'success',
      data: topRecommendations,
    });

  } catch (err) {
    return next(err);
  }
};

export const getSavedRecommendations = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const recommendations = await aiRepositories.getRecommendationsByUserId(user_id);


    return res.status(200).json({
      status: 'success',
      data: recommendations,
    });

  } catch (err) {
    return next(err);
  }
};

export const getRecommendationsByDocumentId = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { documentId } = req.params;

    const recommendation = await aiRepositories.getRecommendationsByDocumentId(user_id, documentId);

    if (!recommendation.length) {
      throw new NotFoundError(
        'Rekomendasi tidak ditemukan untuk dokumen ini'
      );
    }

    return res.status(200).json({
      status: 'success',
      data: recommendation,
    });

  } catch (err) {
    return next(err);
  }
};

export const interviewMock = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id: job_id } = req.params;

    // 1. Ambil document_id dari table recommended_jobs berdasarkan user_id dan job_id
    const recommendation = await aiRepositories.getRecommendationByUserIdAndJobId(user_id, job_id);

    if (!recommendation) {
      throw new NotFoundError(
        'Rekomendasi tidak ditemukan untuk pekerjaan ini, pastikan Anda sudah mendapatkan rekomendasi untuk pekerjaan ini'
      );
    }

    const top_units = recommendation.top_units;
    const document_id = recommendation.document_id;

    // 2. Ambil compressed_cv dari document_id
    const document = await aiRepositories.getDocumentById(document_id);


    if (!document || !document.compressed_cv) {
      throw new NotFoundError(
        'Resume tidak ditemukan untuk dokumen ini'
      );
    }

    const cv_text = document.compressed_cv;

    // 3. Ambil job description berdasarkan job_id
    const job = await aiRepositories.getJobById(job_id);

    if (!job) {
      throw new NotFoundError(
        'Pekerjaan tidak ditemukan'
      );
    }

    // 4. Mapping payload AI
    const job_text = `${job.title} ${job.description}`;

    // 5. Call AI service
    const aiResult = await interviewAI({
      cv_text,
      job_text,
      skkni_units: top_units.map((u) => `${u.kode_unit} - ${u.judul_unit}`)
    });

    return res.status(200).json({
      status: 'success',
      data: aiResult,
    });

  } catch (err) {
    return next(err);
  }
};
