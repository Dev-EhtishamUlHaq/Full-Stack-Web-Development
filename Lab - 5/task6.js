'use strict';

const studentStore = new Map([
  [101, { id: 101, name: 'Ali', prerequisites: ['CS101'] }],
  [102, { id: 102, name: 'Sara', prerequisites: ['CS201'] }]
]);

const courseCatalog = new Map([
  ['CS401', { code: 'CS401', seats: 2, prerequisites: ['CS101'], students: [102] }],
  ['CS402', { code: 'CS402', seats: 1, prerequisites: ['CS201'], students: [] }]
]);

function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = studentStore.get(studentId);
    if (!student) {
      return callback(new Error('Student does not exist'));
    }
    callback(null, student);
  }, 100);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = courseCatalog.get(courseCode);
    if (!course) {
      return callback(new Error('Course not found'));
    }

    const hasCompleted = student.prerequisites.includes(course.prerequisites[0]);
    if (!hasCompleted) {
      return callback(new Error('Prerequisite not completed'));
    }
    callback(null, { student, course });
  }, 120);
}

function checkAvailableSeats(course, callback) {
  setTimeout(() => {
    if (course.students.length >= course.seats) {
      return callback(new Error('Course is full'));
    }
    callback(null, { ...course, seatsLeft: course.seats - course.students.length });
  }, 140);
}

function registerCourse(student, course, callback) {
  setTimeout(() => {
    const courseInfo = courseCatalog.get(course.code);
    if (courseInfo.students.includes(student.id)) {
      return callback(new Error('Student already registered'));
    }

    courseInfo.students.push(student.id);
    callback(null, {
      studentId: student.id,
      course: course.code,
      status: 'REGISTERED'
    });
  }, 160);
}

function registerStudentCourse(studentId, courseCode, callback) {
  loadStudent(studentId, (studentError, student) => {
    if (studentError) {
      return callback(studentError);
    }

    checkPrerequisites(student, courseCode, (prereqError, prerequisiteResult) => {
      if (prereqError) {
        return callback(prereqError);
      }

      checkAvailableSeats(prerequisiteResult.course, (seatError, availableCourse) => {
        if (seatError) {
          return callback(seatError);
        }

        registerCourse(student, availableCourse, (registerError, result) => {
          if (registerError) {
            return callback(registerError);
          }

          callback(null, result);
        });
      });
    });
  });
}

console.log('Task 6 - Legacy Course Registration Service Using Callbacks');
registerStudentCourse(101, 'CS401', (error, result) => {
  if (error) {
    console.error('Registration failed:', error.message);
  } else {
    console.log('Registration success:', result);
  }
});

export { registerStudentCourse, loadStudent, checkPrerequisites, checkAvailableSeats, registerCourse };
