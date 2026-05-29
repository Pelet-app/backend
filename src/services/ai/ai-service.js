/* eslint-disable camelcase */
import axios from 'axios';

export const matchJobsAI = async ({ cv_text, jobs }) => {
  const response = await axios.post(
    'https://egoekosetio-capstone-ai.hf.space/api/v1/match-multi',
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