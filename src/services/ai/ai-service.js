/* eslint-disable camelcase */
import axios from 'axios';

export const matchJobsAI = async ({ cv_text, jobs }) => {
  const response = await axios.post(
    'modelai-production-9be4.up.railway.app/api/v1/match-multi',
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