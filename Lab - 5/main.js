import Student from './Student.js';
import { calculateGrade as getGrade, calculateAverage, calculateGPA } from './gradeUtils.js';
import { processTranscript, transcriptToJson } from './transcriptService.js';

const rawData = `[
  {
    "id": 101,
    "name": "Ali",
    "courses": [
      { "code": "CS301", "marks": 81 },
      { "code": "CS302", "marks": 74 }
    ]
  },
  {
    "id": 102,
    "name": "Sara",
    "courses": [
      { "code": "CS311", "marks": 90 },
      { "code": "CS312", "marks": 88 }
    ]
  }
]`;

try {
  const report = processTranscript(rawData);
  console.log('Task 5 - Modular Transcript Processing and Fault-Tolerant JSON');
  console.log('Report object:', report);
  console.log('JSON string:', transcriptToJson(report));

  const student = new Student({
    id: 100,
    name: 'Usman',
    courses: [{ code: 'CS101', marks: 90 }, { code: 'CS102', marks: 87 }]
  });

  console.log('Student average:', calculateAverage(student.courses.map((course) => course.marks)));
  console.log('Student GPA:', calculateGPA(student.courses.map((course) => course.marks)));
  console.log('Grade for 90:', getGrade(90));
} catch (error) {
  console.error('Transcript processing failed:', error.message);
} finally {
  console.log('Transcript processing completed.');
}
