'use strict';

const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];

function calculateGrade(marks) {
  if (marks >= 85) return { grade: 'A', gradePoints: 4.0, status: 'PASS' };
  if (marks >= 80) return { grade: 'A-', gradePoints: 3.7, status: 'PASS' };
  if (marks >= 75) return { grade: 'B+', gradePoints: 3.3, status: 'PASS' };
  if (marks >= 70) return { grade: 'B', gradePoints: 3.0, status: 'PASS' };
  if (marks >= 65) return { grade: 'B-', gradePoints: 2.7, status: 'PASS' };
  if (marks >= 60) return { grade: 'C+', gradePoints: 2.3, status: 'PASS' };
  if (marks >= 50) return { grade: 'C', gradePoints: 2.0, status: 'PASS' };
  return { grade: 'F', gradePoints: 0.0, status: 'FAIL' };
}

function gradeStudents(studentList) {
  return studentList.map((student) => ({
    ...student,
    ...calculateGrade(student.marks)
  }));
}

function sortByMarksDescending(studentList) {
  return [...studentList].sort((a, b) => {
    if (b.marks !== a.marks) return b.marks - a.marks;
    return a.name.localeCompare(b.name);
  });
}

function buildDepartmentStatistics(studentList) {
  const grouped = studentList.reduce((collection, student) => {
    const department = student.department;
    if (!collection[department]) {
      collection[department] = [];
    }
    collection[department].push(student);
    return collection;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).map(([department, departmentStudents]) => {
      const studentCount = departmentStudents.length;
      const average = departmentStudents.reduce((sum, student) => sum + student.marks, 0) / studentCount;
      const highest = Math.max(...departmentStudents.map((student) => student.marks));
      const passed = departmentStudents.filter((student) => student.marks >= 50).length;

      return [department, { students: studentCount, average: Number(average.toFixed(2)), highest, passed }];
    })
  );
}

function academicQueries(studentList) {
  const overallAverage = studentList.reduce((sum, student) => sum + student.marks, 0) / studentList.length;

  return {
    firstStudentAbove85: studentList.find((student) => student.marks > 85),
    firstFailedStudentIndex: studentList.findIndex((student) => student.marks < 50),
    hasAnyFailedStudent: studentList.some((student) => student.marks < 50),
    allMarksWithinRange: studentList.every((student) => student.marks >= 0 && student.marks <= 100),
    aboveAverage: studentList.filter((student) => student.marks > overallAverage).map((student) => student.name),
    topThreeNames: sortByMarksDescending(studentList).slice(0, 3).map((student) => student.name)
  };
}

const gradedResults = gradeStudents(results);
const sortedResults = sortByMarksDescending(results);
const departmentStats = buildDepartmentStatistics(results);
const queries = academicQueries(results);

console.log('Task 2 - Academic Performance Intelligence Engine');
console.log('Graded results:', gradedResults);
console.log('Sorted merit list:', sortedResults);
console.log('Department statistics:', departmentStats);
console.log('Academic queries:', queries);

export { calculateGrade, gradeStudents, sortByMarksDescending, buildDepartmentStatistics, academicQueries };
