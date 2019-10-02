/* eslint-disable no-console */
require('dotenv').config();
const request = require('request-promise-native');

function authenticationTokenRequest() {
  return {
    method: 'POST',
    baseUrl: process.env.BASE_URL,
    uri: '/api/token',
    form: {
      grant_type: 'password',
      username: process.env.PIXMASTER_EMAIL,
      password: process.env.PIXMASTER_PASSWORD,
      scope: 'pix-cron'
    },
    json: true
  };
}

function cacheFlushingRequest(authToken) {
  return {
    headers: {
      authorization: 'Bearer ' + authToken
    },
    method: 'DELETE',
    baseUrl: process.env.BASE_URL,
    uri: '/api/cache',
  };
}

function cacheWarmupRequest(authToken) {
  return {
    headers: {
      authorization: 'Bearer ' + authToken
    },
    method: 'PATCH',
    baseUrl: process.env.BASE_URL,
    uri: '/api/cache',
    timeout: 5000,
    json: true,
  };
}

async function reloadCache() {
  const authResponse = await request(authenticationTokenRequest());
  const authToken = authResponse.access_token;
  await request(cacheFlushingRequest(authToken));
  const { success } = await request(cacheWarmupRequest(authToken));
  if (!success) {
    throw new Error('Cache reload failed, check server logs');
  }
}

module.exports = reloadCache;

// This "pythonism" allows us to invoke this module as a script
// to invoke an immediate reload, as well as require() it from
// another script.
if (require.main === module) {
  reloadCache().then(() => {
    console.log('Cache reload complete');
  }, (e) => {
    console.error('Cache reload error:', e.message);
    process.exit(1);
  });
}
