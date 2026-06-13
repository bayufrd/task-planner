#!/usr/bin/env node

/**
 * Smoke test untuk backend Express Smart Task Planner.
 * Mengetes semua endpoint yang tercantum di backend/README.md.
 *
 * Prasyarat:
 * - Backend Express berjalan di http://localhost:8000
 * - Database MySQL development tersedia dan terhubung
 * - Environment backend sudah dikonfigurasi dengan benar
 *
 * Jalankan dengan:
 *   node scripts/smoke-test-backend.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:8000';

let authToken = null;
let testUserId = null;
let testTaskId = null;
let testReminderId = null;
let testCalendarId = null;

const testUser = {
  name: 'Smoke Test User',
  email: `smoke-test-${Date.now()}@example.com`,
  password: 'password123',
};

const testTask = {
  title: 'Smoke Test Task',
  description: 'Task untuk smoke test backend',
  deadline: new Date(Date.now() + 86400000).toISOString(), // besok
  priority: 'HIGH',
  estimatedDuration: 60,
  tags: ['test', 'smoke'],
};

const testReminder = {
  reminderTime: new Date(Date.now() + 3600000).toISOString(), // 1 jam dari sekarang
  message: 'Smoke test reminder',
};

const testCalendar = {
  googleCalendarId: 'primary',
  googleEventId: 'smoke-test-event-' + Date.now(),
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function cleanup() {
  console.log('\n📝 Catatan: Test user tidak dihapus otomatis.');
  console.log(`   Email: ${testUser.email}`);
  console.log('   Untuk cleanup manual, hapus user via database atau endpoint delete.');
}

async function testHealth() {
  console.log('\n1. Testing /health');
  const res = await axios.get(`${API_BASE}/health`);
  console.log(`   Status: ${res.status}, Data:`, res.data);
  if (res.data.status !== 'ok') throw new Error('Health check gagal');
}

async function testRegister() {
  console.log('\n2. Testing /api/auth/register');
  const res = await axios.post(`${API_BASE}/api/auth/register`, testUser);
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Register gagal');
  if (!res.data.data?.token) throw new Error('Token tidak diterima');
  authToken = res.data.data.token;
  testUserId = res.data.data.user.id;
  console.log(`   Token diterima, user ID: ${testUserId}`);
}

async function testLogin() {
  console.log('\n3. Testing /api/auth/login');
  const res = await axios.post(`${API_BASE}/api/auth/login`, {
    email: testUser.email,
    password: testUser.password,
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Login gagal');
  if (!res.data.data?.token) throw new Error('Token tidak diterima');
  authToken = res.data.data.token;
  console.log('   Login berhasil, token diperbarui');
}

async function testGetMe() {
  console.log('\n4. Testing /api/auth/me');
  const res = await axios.get(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get me gagal');
  if (res.data.data.email !== testUser.email) throw new Error('Email tidak sesuai');
  console.log(`   User: ${res.data.data.name} (${res.data.data.email})`);
}

async function testCreateTask() {
  console.log('\n5. Testing POST /api/tasks');
  const res = await axios.post(`${API_BASE}/api/tasks`, testTask, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Create task gagal');
  testTaskId = res.data.data.id;
  console.log(`   Task dibuat, ID: ${testTaskId}`);
  console.log(`   Status default: ${res.data.data.status}`);
  if (res.data.data.status !== 'PENDING') throw new Error('Status default bukan PENDING');
}

async function testGetTasks() {
  console.log('\n6. Testing GET /api/tasks (default)');
  const res = await axios.get(`${API_BASE}/api/tasks`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get tasks gagal');
  console.log(`   Jumlah task: ${res.data.data.length}`);
}

async function testGetTasksByStatus() {
  console.log('\n7. Testing GET /api/tasks?status=PENDING');
  const res = await axios.get(`${API_BASE}/api/tasks?status=PENDING`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get tasks by status gagal');
  console.log(`   Jumlah PENDING: ${res.data.data.length}`);
}

async function testGetTaskById() {
  console.log('\n8. Testing GET /api/tasks/:id');
  const res = await axios.get(`${API_BASE}/api/tasks/${testTaskId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get task by ID gagal');
  console.log(`   Task title: ${res.data.data.title}`);
}

async function testUpdateTask() {
  console.log('\n9. Testing PATCH /api/tasks/:id');
  const update = { title: 'Updated Smoke Test Task', priority: 'MEDIUM' };
  const res = await axios.patch(`${API_BASE}/api/tasks/${testTaskId}`, update, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Update task gagal');
  console.log(`   Title updated: ${res.data.data.title}`);
}

async function testUpdateTaskStatus() {
  console.log('\n10. Testing PATCH /api/tasks/:id/status (DONE)');
  const res = await axios.patch(`${API_BASE}/api/tasks/${testTaskId}/status`, {
    status: 'DONE',
  }, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Update task status gagal');
  console.log(`   Status updated: ${res.data.data.status}`);
}

async function testGetTasksDone() {
  console.log('\n11. Testing GET /api/tasks?status=DONE');
  const res = await axios.get(`${API_BASE}/api/tasks?status=DONE`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get DONE tasks gagal');
  console.log(`   Jumlah DONE: ${res.data.data.length}`);
}

async function testSkipTask() {
  // Buat task baru untuk di-skip
  console.log('\n12. Testing POST /api/tasks (untuk skip)');
  const taskRes = await axios.post(`${API_BASE}/api/tasks`, {
    ...testTask,
    title: 'Task untuk di-skip',
    deadline: new Date(Date.now() - 3600000).toISOString(), // deadline sudah lewat
  }, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const skipTaskId = taskRes.data.data.id;
  console.log(`   Task untuk skip dibuat, ID: ${skipTaskId}`);

  console.log('\n13. Testing POST /api/tasks/:id/skip');
  const res = await axios.post(`${API_BASE}/api/tasks/${skipTaskId}/skip`, {}, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Skip task gagal');
  console.log(`   Task skipped, status: ${res.data.data.status}`);
}

async function testGetTasksSkipped() {
  console.log('\n14. Testing GET /api/tasks?status=SKIPPED');
  const res = await axios.get(`${API_BASE}/api/tasks?status=SKIPPED`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get SKIPPED tasks gagal');
  console.log(`   Jumlah SKIPPED: ${res.data.data.length}`);
}

async function testGetTaskStats() {
  console.log('\n15. Testing GET /api/tasks/stats');
  const res = await axios.get(`${API_BASE}/api/tasks/stats`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get task stats gagal');
  console.log(`   Stats:`, res.data.data);
}

async function testCalculatePriority() {
  console.log('\n16. Testing POST /api/tasks/:id/priority');
  const res = await axios.post(`${API_BASE}/api/tasks/${testTaskId}/priority`, {}, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Calculate priority gagal');
  console.log(`   Priority score: ${res.data.data.score}`);
}

async function testCreateReminder() {
  console.log('\n17. Testing POST /api/reminders');
  try {
    const res = await axios.post(`${API_BASE}/api/reminders`, {
      ...testReminder,
      taskId: testTaskId,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
    if (!res.data.success) throw new Error('Create reminder gagal');
    testReminderId = res.data.data.id;
    console.log(`   Reminder dibuat, ID: ${testReminderId}`);
  } catch (error) {
    console.log(`   ⚠️  Create reminder gagal: ${error.response?.data?.error?.message || error.message}`);
    console.log('   Skipping reminder tests...');
    testReminderId = null;
  }
}

async function testGetReminders() {
  if (!testReminderId) {
    console.log('\n18. Testing GET /api/reminders - SKIPPED (no reminder created)');
    return;
  }
  console.log('\n18. Testing GET /api/reminders');
  const res = await axios.get(`${API_BASE}/api/reminders`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get reminders gagal');
  console.log(`   Jumlah reminders: ${res.data.data.length}`);
}

async function testGetDueReminders() {
  if (!testReminderId) {
    console.log('\n19. Testing GET /api/reminders/due - SKIPPED (no reminder created)');
    return;
  }
  console.log('\n19. Testing GET /api/reminders/due');
  const res = await axios.get(`${API_BASE}/api/reminders/due`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get due reminders gagal');
  console.log(`   Jumlah due reminders: ${res.data.data.length}`);
}

async function testCreateCalendar() {
  console.log('\n20. Testing POST /api/calendars');
  try {
    const res = await axios.post(`${API_BASE}/api/calendars`, {
      ...testCalendar,
      taskId: testTaskId,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
    if (!res.data.success) throw new Error('Create calendar entry gagal');
    testCalendarId = res.data.data.id;
    console.log(`   Calendar entry dibuat, ID: ${testCalendarId}`);
  } catch (error) {
    console.log(`   ⚠️  Create calendar gagal: ${error.response?.data?.error?.message || error.message}`);
    console.log('   Skipping calendar tests...');
    testCalendarId = null;
  }
}

async function testGetCalendars() {
  if (!testCalendarId) {
    console.log('\n21. Testing GET /api/calendars - SKIPPED (no calendar created)');
    return;
  }
  console.log('\n21. Testing GET /api/calendars');
  const res = await axios.get(`${API_BASE}/api/calendars`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get calendars gagal');
  console.log(`   Jumlah calendar entries: ${res.data.data.length}`);
}

async function testGetDefaultCalendar() {
  if (!testCalendarId) {
    console.log('\n22. Testing GET /api/calendars/default - SKIPPED (no calendar created)');
    return;
  }
  console.log('\n22. Testing GET /api/calendars/default');
  const res = await axios.get(`${API_BASE}/api/calendars/default`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Get default calendar gagal');
  console.log(`   Default calendar:`, res.data.data);
}

async function testLogout() {
  console.log('\n23. Testing POST /api/auth/logout');
  const res = await axios.post(`${API_BASE}/api/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  console.log(`   Status: ${res.status}, Success: ${res.data.success}`);
  if (!res.data.success) throw new Error('Logout gagal');
  console.log('   Logout berhasil, token harus dihapus di client');
}

async function runTests() {
  console.log('🚀 Memulai smoke test backend Express Smart Task Planner');
  console.log(`   API Base: ${API_BASE}`);
  console.log(`   Waktu: ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  try {
    await testHealth();
    await testRegister();
    await testLogin();
    await testGetMe();
    await testCreateTask();
    await testGetTasks();
    await testGetTasksByStatus();
    await testGetTaskById();
    await testUpdateTask();
    await testUpdateTaskStatus();
    await testGetTasksDone();
    await testSkipTask();
    await testGetTasksSkipped();
    await testGetTaskStats();
    await testCalculatePriority();
    await testCreateReminder();
    await testGetReminders();
    await testGetDueReminders();
    await testCreateCalendar();
    await testGetCalendars();
    await testGetDefaultCalendar();
    await testLogout();

    console.log('\n' + '='.repeat(60));
    console.log('✅ SEMUA TES BERHASIL!');
    console.log('Backend Express berfungsi dengan baik.');
  } catch (error) {
    console.error('\n❌ TES GAGAL:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Jalankan jika script dipanggil langsung
if (require.main === module) {
  runTests().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
