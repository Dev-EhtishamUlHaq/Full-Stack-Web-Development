'use strict';

const students = new Map([
  [101, { id: 101, name: 'Ali' }],
  [102, { id: 102, name: 'Sara' }]
]);

const courses = new Map([
  ['CS401', { code: 'CS401', title: 'Advanced JavaScript', prerequisites: ['CS101'], seats: 2, enrolled: [] }],
  ['CS402', { code: 'CS402', title: 'Web Engineering', prerequisites: ['CS201'], seats: 2, enrolled: [] }]
]);

function getStudent(studentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = students.get(studentId);
      if (!student) {
        reject(new Error('Student not found'));
      } else {
        resolve(student);
      }
    }, 80);
  });
}

function getCourse(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = courses.get(courseCode);
      if (!course) {
        reject(new Error('Course not found'));
      } else {
        resolve(course);
      }
    }, 90);
  });
}

function checkPrerequisites(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const hasPrereq = student.id === 101 && course.code === 'CS401';
      if (!hasPrereq) {
        reject(new Error('Prerequisite not completed'));
      } else {
        resolve({ student, course });
      }
    }, 100);
  });
}

function checkSeats(course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.enrolled.length >= course.seats) {
        reject(new Error('Course is full'));
      } else {
        resolve(course);
      }
    }, 100);
  });
}

function registerStudent(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.enrolled.includes(student.id)) {
        reject(new Error('Student already registered'));
      } else {
        course.enrolled.push(student.id);
        resolve({ studentId: student.id, course: course.code, status: 'REGISTERED' });
      }
    }, 110);
  });
}

function sendEmail(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (student.id === 0) reject(new Error('Email service failed'));
      else resolve({ service: 'Email', status: 'fulfilled' });
    }, 120);
  });
}

function sendSMS(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (student.id === 101) reject(new Error('SMS service failed'));
      else resolve({ service: 'SMS', status: 'fulfilled' });
    }, 130);
  });
}

function writeAuditLog(student) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ service: 'Audit', status: 'fulfilled' });
    }, 110);
  });
}

function runRegistrationChain() {
  return getStudent(101)
    .then((student) => getCourse('CS401').then((course) => ({ student, course })))
    .then(({ student, course }) => checkPrerequisites(student, course).then(() => ({ student, course })))
    .then(({ student, course }) => checkSeats(course).then(() => ({ student, course })))
    .then(({ student, course }) => registerStudent(student, course))
    .then((result) => {
      console.log('Registration chain result:', result);
      return result;
    })
    .catch((error) => {
      console.error('Registration chain error:', error.message);
      throw error;
    })
    .finally(() => {
      console.log('Registration chain finished.');
    });
}

function runPostRegistrationServices(student) {
  return Promise.allSettled([
    sendEmail(student).then(() => ({ service: 'Email', status: 'fulfilled' })),
    sendSMS(student).then(() => ({ service: 'SMS', status: 'fulfilled' })).catch(() => ({ service: 'SMS', status: 'rejected' })),
    writeAuditLog(student).then(() => ({ service: 'Audit', status: 'fulfilled' }))
  ]).then((results) => results.map((item) => item.value ?? item.reason));
}

function getCourseFromServerA(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (courseCode === 'CS401') {
        resolve({ code: 'CS401', source: 'Server A', message: 'First result from A' });
      } else {
        reject(new Error('Server A does not have this course'));
      }
    }, 100);
  });
}

function getCourseFromServerB(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (courseCode === 'CS401') {
        resolve({ code: 'CS401', source: 'Server B', message: 'First successful response from B' });
      } else {
        reject(new Error('Server B does not have this course'));
      }
    }, 50);
  });
}

console.log('Task 7 - Promise-Based Multi-Service Registration Engine');
runRegistrationChain()
  .then(() => getStudent(101))
  .then((student) => runPostRegistrationServices(student))
  .then((results) => console.log('Post-registration service report:', results))
  .catch((error) => console.error('Task 7 failed:', error.message));

console.log('Used Promise.any() because CampusFlow should accept the first successful result, not merely the first settled response. Promise.any() resolves as soon as one promise fulfills, and rejects only if all fail.');
Promise.any([
  getCourseFromServerA('CS401'),
  getCourseFromServerB('CS401')
]).then((course) => {
  console.log('Selected course from first successful server:', course);
}).catch((error) => {
  console.error('No successful course server was available:', error.message);
});

export { getStudent, getCourse, checkPrerequisites, checkSeats, registerStudent, sendEmail, sendSMS, writeAuditLog, runRegistrationChain, runPostRegistrationServices };
