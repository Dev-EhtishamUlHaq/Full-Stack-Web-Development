export function calculateGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function calculateAverage(courseMarks) {
  if (!Array.isArray(courseMarks) || courseMarks.length === 0) {
    return 0;
  }

  const total = courseMarks.reduce((sum, mark) => sum + mark, 0);
  return total / courseMarks.length;
}

export function calculateGPA(courseMarks) {
  const gradePoints = {
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    F: 0.0
  };

  if (!Array.isArray(courseMarks) || courseMarks.length === 0) {
    return 0;
  }

  const gradeValues = courseMarks.map((mark) => gradePoints[calculateGrade(mark)] ?? 0);
  const total = gradeValues.reduce((sum, value) => sum + value, 0);
  return Number((total / courseMarks.length).toFixed(2));
}
