/* Global config. In the Emergent preview API_BASE_URL is empty => demo mode.
   Point this at your deployed Node/Express backend to run against MySQL + Gemini. */
window.CONFIG = {
  APP_NAME: 'SynapseEDU',
  APP_SUB: 'Learning Hub',
  // e.g. 'https://synapseedu-api.onrender.com'  — leave empty for client-side demo mode
  API_BASE_URL: '',
  get DEMO_MODE() { return !this.API_BASE_URL; },
  STORAGE_KEY: 'synapse_state_v1'
};
