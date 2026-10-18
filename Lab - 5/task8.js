'use strict';

async function getJSON(url, fetchImplementation) {
  try {
    const response = await fetchImplementation(url);

    if (!response || typeof response.ok !== 'boolean') {
      throw new TypeError('Invalid response object');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON from ${url}`);
    }
    throw error;
  }
}

async function fetchWithTimeout(url, milliseconds, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function fakeFetch(url) {
  const responses = {
    '/users': { ok: true, status: 200, json: async () => [{ id: 1, name: 'Ali', department: 'CS' }, { id: 2, name: 'Sara', department: 'AI' }] },
    '/courses': { ok: true, status: 200, json: async () => [{ code: 'CS301', title: 'FSWD' }, { code: 'CS302', title: 'DB' }] },
    '/results': { ok: true, status: 200, json: async () => [{ studentId: 1, marks: 82, department: 'CS' }, { studentId: 2, marks: 91, department: 'AI' }, { studentId: 3, marks: 48, department: 'SE' }] },
    '/broken-json': { ok: true, status: 200, json: async () => { throw new SyntaxError('Invalid JSON'); } },
    '/not-found': { ok: false, status: 404, json: async () => ({ message: 'Not found' }) },
    '/server-error': { ok: false, status: 500, json: async () => ({ message: 'Server error' }) },
    '/network-failure': { ok: true, status: 200, json: async () => { throw new Error('Network failed'); } },
    '/timeout': { ok: true, status: 200, json: async () => new Promise(() => {}) }
  };

  if (!responses[url]) {
    return { ok: false, status: 404, json: async () => ({ message: 'Missing route' }) };
  }

  return responses[url];
}

async function loadDashboard() {
  const [users, courses, results] = await Promise.all([
    getJSON('/users', fakeFetch),
    getJSON('/courses', fakeFetch),
    getJSON('/results', fakeFetch)
  ]);

  const totalStudents = users.length;
  const totalCourses = courses.length;
  const overallAverage = results.reduce((sum, result) => sum + result.marks, 0) / results.length;
  const highestPerformingStudent = results.reduce((best, current) => (current.marks > best.marks ? current : best), results[0]);
  const failedStudents = results.filter((result) => result.marks < 50).length;

  const departmentStats = results.reduce((accumulator, result) => {
    const department = result.department;
    if (!accumulator[department]) {
      accumulator[department] = { count: 0, totalMarks: 0 };
    }
    accumulator[department].count += 1;
    accumulator[department].totalMarks += result.marks;
    return accumulator;
  }, {});

  const processedDepartmentStats = Object.fromEntries(
    Object.entries(departmentStats).map(([department, stats]) => [
      department,
      {
        students: stats.count,
        average: Number((stats.totalMarks / stats.count).toFixed(2))
      }
    ])
  );

  return {
    totalStudents,
    totalCourses,
    overallAverage: Number(overallAverage.toFixed(2)),
    highestPerformingStudent,
    failedStudents,
    departmentStats: processedDepartmentStats
  };
}

console.log('Task 8 - Concurrent Academic API Aggregator with async/await');
try {
  const dashboard = await loadDashboard();
  console.log('Dashboard summary:', dashboard);
} catch (error) {
  console.error('Dashboard load error:', error.message);
}

try {
  const response = await fetchWithTimeout('https://example.com', 1000);
  console.log('Timeout test response status:', response.status);
} catch (error) {
  console.log('Timeout test failure:', error.name, error.message);
}

export { getJSON, fetchWithTimeout, fakeFetch, loadDashboard };
