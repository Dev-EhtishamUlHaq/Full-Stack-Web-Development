'use strict';

class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  introduce() {
    return `Hello, I am ${this.name}. My email is ${this.email}.`;
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }

  introduce() {
    return `${super.introduce()} I am a student with roll number ${this.rollNo}.`;
  }

  getResult() {
    return this.marks >= 50 ? 'PASS' : 'FAIL';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    return `${super.introduce()} I am a faculty member in the ${this.department} department.`;
  }
}

const studentA = new Student('Ali', 'ali@uni.edu', 'CS-101', 88);
const studentB = new Student('Sara', 'sara@uni.edu', 'CS-102', 67);
const facultyA = new FacultyMember('Dr. Ahmed', 'ahmed@uni.edu', 'F-1', 'Computer Science');
const facultyB = new FacultyMember('Ms. Hina', 'hina@uni.edu', 'F-2', 'AI');

const users = [studentA, studentB, facultyA, facultyB];

const guest = {
  name: 'Dr. Ahmed',
  email: 'ahmed@example.com'
};

console.log('Task 4 - University User Hierarchy and Dynamic this');
users.forEach((user) => console.log(user.introduce()));
console.log('call():', Person.prototype.introduce.call(guest));

const fn = studentA.introduce;
try {
  console.log('Detached method call result:', fn());
} catch (error) {
  console.log('Detached method failed because this is not bound:', error.message);
}

const boundIntro = studentA.introduce.bind(studentA);
console.log('Bound method result:', boundIntro());
console.log('instanceof Student:', studentA instanceof Student);
console.log('instanceof Person:', studentA instanceof Person);
console.log('instanceof FacultyMember:', facultyA instanceof FacultyMember);

export { Person, Student, FacultyMember, users, guest };
