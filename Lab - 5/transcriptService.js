import Student from './Student.js';
import { calculateAverage, calculateGPA } from './gradeUtils.js';

export function processTranscript(rawData) {
  let parsed;

  try {
    parsed = JSON.parse(rawData);
  } catch (error) {
    throw new TypeError('Malformed transcript JSON');
  }

  if (!Array.isArray(parsed)) {
    throw new TypeError('Transcript data must be an array of students');
  }

  const seenIds = new Set();
  const students = parsed.map((studentEntry) => {
    if (!studentEntry || typeof studentEntry !== 'object') {
      throw new TypeError('Each student record must be an object');
    }

    if (studentEntry.id === undefined || studentEntry.id === null || studentEntry.id === '') {
      throw new Error('Student ID is missing');
    }

    if (seenIds.has(studentEntry.id)) {
      throw new Error(`Duplicate student ID found: ${studentEntry.id}`);
    }

    seenIds.add(studentEntry.id);

    if (!Array.isArray(studentEntry.courses)) {
      throw new TypeError(`Student ${studentEntry.id} does not have a valid courses array`);
    }

    const validCourses = studentEntry.courses.map((course) => {
      if (!course || typeof course !== 'object') {
        throw new TypeError(`Student ${studentEntry.id} has an invalid course entry`);
      }

      if (!course.code || typeof course.code !== 'string') {
        throw new Error(`Course code is missing for student ${studentEntry.id}`);
      }

      if (course.marks < 0 || course.marks > 100) {
        throw new RangeError(`Marks out of range for ${course.code} in student ${studentEntry.id}`);
      }

      return { ...course };
    });

    return new Student({
      id: studentEntry.id,
      name: studentEntry.name ?? 'Unknown',
      courses: validCourses
    });
  });

  const report = {
    students: students.map((student) => {
      const marks = student.courses.map((course) => course.marks);

      return {
        id: student.id,
        name: student.name,
        average: Number(calculateAverage(marks).toFixed(2)),
        gpa: calculateGPA(marks),
        courses: student.courses.map((course) => ({
          code: course.code,
          marks: course.marks,
          grade: calculateGradeFromMarks(course.marks)
        }))
      };
    })
  };

  return report;
}

function calculateGradeFromMarks(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function transcriptToJson(report) {
  return JSON.stringify(report, null, 2);
}
