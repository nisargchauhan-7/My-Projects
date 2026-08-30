/* Global config.
   The frontend is served on the same host as the API. The Emergent ingress proxies
   every `/api/*` request to the FastAPI pipe (port 8001) which forwards to the real
   Node/Express/MySQL backend. So a same-origin ('' base) fetch to /api/* hits the backend. */
window.CONFIG = {
  APP_NAME: 'SynapseEDU',
  APP_SUB: 'Learning Hub',
  // '' = same-origin (ingress proxies /api to the Node backend). Set to a full URL for self-host.
  API_BASE_URL: '',
  // When true, the UI talks to the real Node backend. If a call fails it auto-falls back to demo.
  BACKEND: true,
  AI_MODEL: 'gemini-2.0-flash',
  get DEMO_MODE() { return !this.BACKEND; },
  STORAGE_KEY: 'synapse_state_v1'
};
