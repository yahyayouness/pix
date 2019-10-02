/* eslint-disable no-console */
require('dotenv').config();
const cron = require('node-cron');
const reloadCache = require('./reload-cache');

cron.schedule(process.env.CACHE_RELOAD_TIME, () => {
  console.log('Starting daily cache reload');

  return reloadCache().then(() => {
    console.log('Daily cache reload done');
  }, (e) => {
    console.error('Cache reload error:', e.message);
    process.exit(1);
  });
});
