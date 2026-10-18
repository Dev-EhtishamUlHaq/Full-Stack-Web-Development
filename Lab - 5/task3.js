'use strict';

const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: {
    city: 'Islamabad',
    sector: 'F-10'
  },
  contact: {
    email: 'ali@university.edu'
  }
};

const update = {
  name: 'Ali Khan',
  address: {
    city: 'Rawalpindi'
  },
  contact: {
    phone: '03001234567'
  }
};

function mergeStudentProfile(currentStudent, profileUpdate) {
  const {
    name: updatedName = currentStudent.name,
    marks: updatedMarks = currentStudent.marks,
    scholarship: updatedScholarship = currentStudent.scholarship,
    ...restObject
  } = profileUpdate;

  const {
    address: incomingAddress = {},
    contact: incomingContact = {},
    ...otherValues
  } = restObject;

  const newAddress = {
    ...currentStudent.address,
    ...incomingAddress
  };

  const newContact = {
    ...currentStudent.contact,
    ...incomingContact
  };

  const result = {
    ...currentStudent,
    ...otherValues,
    name: updatedName ?? currentStudent.name,
    marks: updatedMarks ?? currentStudent.marks,
    scholarship: updatedScholarship ?? currentStudent.scholarship,
    address: newAddress,
    contact: newContact
  };

  return result;
}

function demonstratePatterns(studentObject, profileUpdate) {
  const [primaryId, ...otherValues] = [studentObject.id, studentObject.name, studentObject.marks];
  const {
    address: { city: updatedCity = 'Unknown', ...addressRest } = {},
    contact: { phone: phoneNumber = 'No phone', ...contactRest } = {},
    ...remainingUpdate
  } = profileUpdate;

  const fallbackCity = profileUpdate?.address?.city ?? studentObject.address.city;
  const fallbackEmail = studentObject.contact?.email ?? 'no-email@example.com';
  const fallbackScholarship = studentObject.scholarship ?? true;

  return {
    primaryId,
    otherValues,
    updatedCity,
    addressRest,
    phoneNumber,
    contactRest,
    remainingUpdate,
    fallbackCity,
    fallbackEmail,
    fallbackScholarship
  };
}

const updatedStudent = mergeStudentProfile(student, update);
const patternDemo = demonstratePatterns(student, update);

console.log('Task 3 - Safe Student Profile Update Service');
console.log('Original student:', student);
console.log('Updated student:', updatedStudent);
console.log('Pattern demonstration:', patternDemo);
console.log('Original object vs updated object:', student === updatedStudent);
console.log('Original address vs updated address:', student.address === updatedStudent.address);
console.log('Original contact vs updated contact:', student.contact === updatedStudent.contact);
console.log('Reference explanation: the top-level object is a new reference, and nested address/contact objects are also new copies because spread creates fresh objects. Only unchanged properties are reused by reference when they are not replaced.');

export { student, update, mergeStudentProfile, demonstratePatterns };
