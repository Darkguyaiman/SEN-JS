const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { renderPage } = require('../lib/core/Component');

router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

router.get('/dashboard', async (req, res) => {
  let users = [];
  let dbConnected = false;

  try {
    await db.ping();
    dbConnected = true;
    users = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC LIMIT 20'
    );
  } catch {
    users = getDemoUsers();
  }

  renderPage(res, 'dashboard', {
    title: 'Dashboard',
    users,
    dbConnected,
    nav: getNavItems('/dashboard'),
  });
});

router.get('/users', async (req, res) => {
  let users = [];

  try {
    users = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC'
    );
  } catch {
    users = getDemoUsers();
  }

  renderPage(res, 'users', {
    title: 'Users',
    users,
    nav: getNavItems('/users'),
  });
});

function getNavItems(activePath) {
  const items = [
    { label: 'Dashboard', href: '/dashboard', icon: 'grid' },
    { label: 'Users', href: '/users', icon: 'users' },
    { label: 'Reports', href: '#', icon: 'chart' },
    { label: 'Settings', href: '#', icon: 'settings' },
  ];

  return items.map((item) => ({
    ...item,
    active: item.href === activePath,
  }));
}

function getDemoUsers() {
  return [
    { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'Admin', status: 'active', created_at: '2026-05-01' },
    { id: 2, name: 'James Wilson', email: 'james@example.com', role: 'Editor', status: 'active', created_at: '2026-05-03' },
    { id: 3, name: 'Maria Garcia', email: 'maria@example.com', role: 'Viewer', status: 'inactive', created_at: '2026-05-10' },
    { id: 4, name: 'Alex Thompson', email: 'alex@example.com', role: 'Editor', status: 'active', created_at: '2026-05-15' },
    { id: 5, name: 'Priya Patel', email: 'priya@example.com', role: 'Admin', status: 'active', created_at: '2026-05-18' },
  ];
}

module.exports = router;
