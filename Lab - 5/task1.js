'use strict';

const supportedPrograms = new Set(['BSCS', 'BSSE', 'BSAI', 'BSIT']);

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return { valid: false, reason: 'Missing value' };
  }

  const number = Number(value);
  if (Number.isNaN(number)) {
    return { valid: false, reason: 'Invalid numeric conversion' };
  }

  return { valid: true, value: number };
}

function processApplicants(applicants) {
  const processed = applicants.map((applicant) => {
    const id = applicant.id ?? 'UNKNOWN';
    const ageResult = toNumber(applicant.age);
    const matricResult = toNumber(applicant.matricMarks);
    const intermediateResult = toNumber(applicant.intermediateMarks);
    const entryTestResult = toNumber(applicant.entryTest);

    if (
      !applicant.name ||
      !applicant.program ||
      !supportedPrograms.has(applicant.program) ||
      !ageResult.valid ||
      !matricResult.valid ||
      !intermediateResult.valid ||
      !entryTestResult.valid
    ) {
      return {
        ...applicant,
        sanitized: {
          age: ageResult.valid ? ageResult.value : null,
          matricMarks: matricResult.valid ? matricResult.value : null,
          intermediateMarks: intermediateResult.valid ? intermediateResult.value : null,
          entryTest: entryTestResult.valid ? entryTestResult.value : null,
        },
        status: 'INVALID DATA',
        merit: null,
        reason: 'Missing/invalid data or unsupported program'
      };
    }

    const age = ageResult.value;
    const matricMarks = matricResult.value;
    const intermediateMarks = intermediateResult.value;
    const entryTest = entryTestResult.value;

    const hasValidRange =
      age >= 17 && age <= 30 &&
      matricMarks >= 0 && matricMarks <= 100 &&
      intermediateMarks >= 0 && intermediateMarks <= 100 &&
      entryTest >= 0 && entryTest <= 100;

    if (!hasValidRange) {
      return {
        ...applicant,
        sanitized: {
          age,
          matricMarks,
          intermediateMarks,
          entryTest,
        },
        status: 'INVALID DATA',
        merit: null,
        reason: 'Value out of valid range'
      };
    }

    const merit = (matricMarks * 0.20) + (intermediateMarks * 0.30) + (entryTest * 0.50);
    const isEligible = merit >= 70 && entryTest >= 60 && intermediateMarks >= 60;

    let status;
    if (!isEligible) {
      status = 'REJECTED';
    } else if (merit >= 80) {
      status = 'SELECTED';
    } else {
      status = 'WAITING';
    }

    return {
      ...applicant,
      id,
      sanitized: {
        age,
        matricMarks,
        intermediateMarks,
        entryTest,
      },
      merit: Number(merit.toFixed(2)),
      status,
      reason: 'Checked against admissions rules'
    };
  });

  return processed;
}

function createAdmissionSummary(applicants) {
  const processed = processApplicants(applicants);
  const validApplicants = processed.filter((applicant) => applicant.status !== 'INVALID DATA');
  const invalidApplicants = processed.filter((applicant) => applicant.status === 'INVALID DATA');

  const validMeritValues = validApplicants.map((applicant) => applicant.merit).filter((value) => value !== null);
  const highestMeritApplicant = validApplicants.reduce((best, current) => {
    if (!best || (current.merit ?? 0) > (best.merit ?? 0)) {
      return current;
    }
    return best;
  }, null);

  const averageMerit = validMeritValues.length
    ? validMeritValues.reduce((total, value) => total + value, 0) / validMeritValues.length
    : 0;

  const programCounts = processed.reduce((counts, applicant) => {
    const program = applicant.program || 'UNKNOWN';
    counts[program] = (counts[program] || 0) + 1;
    return counts;
  }, {});

  return {
    validApplicants: validApplicants.length,
    invalidApplicants: invalidApplicants.length,
    highestMeritApplicant: highestMeritApplicant
      ? {
          id: highestMeritApplicant.id,
          name: highestMeritApplicant.name,
          merit: highestMeritApplicant.merit,
          program: highestMeritApplicant.program,
        }
      : null,
    lowestMeritAmongValidApplicants: validMeritValues.length ? Math.min(...validMeritValues) : null,
    averageMerit: Number(averageMerit.toFixed(2)),
    programCounts,
    detailedApplicants: processed,
  };
}

const applicants = [
  {
    id: 'A101',
    name: 'Sara Khan',
    age: '19',
    matricMarks: '91',
    intermediateMarks: '87',
    entryTest: '78',
    program: 'BSCS',
    feePaid: 'true'
  },
  {
    id: 'A102',
    name: 'Ahmed Ali',
    age: 'twenty',
    matricMarks: '88',
    intermediateMarks: '',
    entryTest: '72',
    program: 'BSSE',
    feePaid: 'false'
  },
  {
    id: 'A103',
    name: 'Hassan',
    age: '18',
    matricMarks: '76',
    intermediateMarks: '83',
    entryTest: '91',
    program: 'BSAI',
    feePaid: 'true'
  }
];

const processedApplicants = processApplicants(applicants);
const admissionSummary = createAdmissionSummary(applicants);

console.log('Task 1 - Admission Decision and Data Sanitization Engine');
console.log(processedApplicants);
console.log('Admission summary:', admissionSummary);

export { processApplicants, createAdmissionSummary };
