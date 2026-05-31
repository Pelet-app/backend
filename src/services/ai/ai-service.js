/* eslint-disable camelcase */
import axios from 'axios';

export const matchJobsAI = async ({ cv_text, jobs }) => {
  const response = await axios.post(
    // 'https://egoekosetio-capstone-ai.hf.space/api/v1/match-multi',
    'https://egoekosetio-ai-capstone.hf.space/api/v1/match-multi',
    {
      cv_text,
      jobs,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const interviewAI = async ({ cv_text, job_text }) => {
  const response = await axios.post(
    // 'https://egoekosetio-capstone-ai.hf.space/api/v1/mock-interview',
    'https://egoekosetio-ai-capstone.hf.space/api/v1/mock-interview',
    {
      cv_text,
      job_text,
      skkni_units: [] // Placeholder, you can replace this with actual SKKNI units if needed
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};