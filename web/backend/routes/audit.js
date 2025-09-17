const express = require('express');
const router = express.Router();

// Simple in-memory audit log store (replace with MongoDB later)
const auditLogs = [
  {
    id: 1,
    actor: 'admin',
    action: 'LOGIN',
    target: 'System',
    timestamp: new Date().toISOString(),
    meta: {}
  }
];

// GET /api/audit – list logs
router.get('/', (req, res) => {
  res.json({ logs: auditLogs });
});

// POST /api/audit – add a log entry (used by other services)
router.post('/', (req, res) => {
  const { actor, action, target, meta = {} } = req.body;
  const entry = {
    id: auditLogs.length + 1,
    actor,
    action,
    target,
    timestamp: new Date().toISOString(),
    meta
  };
  auditLogs.unshift(entry);
  res.status(201).json({ message: 'Log added', entry });
});

module.exports = router;
