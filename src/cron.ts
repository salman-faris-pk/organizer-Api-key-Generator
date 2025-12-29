import cron from 'node-cron';
import axios from 'axios';

const API_URL = process.env.API_URL || 'https://organizer-api-keys.onrender.com/health';

const callApi = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(`[${new Date().toISOString()}] Cron API called successfully:`, response.status);
  } catch (err: any) {
    console.error(`[${new Date().toISOString()}] Cron API error:`, err.message);
  }
};

cron.schedule('*/14 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running scheduled API call...`);
  await callApi();
});
