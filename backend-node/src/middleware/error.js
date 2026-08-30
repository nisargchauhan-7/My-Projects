// Central error handler + 404. Never leak stack traces in production.
function notFound(req, res) { res.status(404).json({ error: 'Not found' }); }

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error('[error]', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
