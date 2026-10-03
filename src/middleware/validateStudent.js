const validateStudent = (req, res, next) => {
  const {
    reg_no,
    student_name,
    email,
    phone,
    department_id,
    date_of_birth,
    status,
  } = req.body;

  const errors = [];

  const allowedFields = [
    'reg_no',
    'student_name',
    'email',
    'phone',
    'department_id',
    'date_of_birth',
    'status',
  ];

  const providedFields = Object.keys(req.body);

  const unknownFields = providedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (unknownFields.length > 0) {
    errors.push(`Unknown fields: ${unknownFields.join(', ')}`);
  }

  if (req.method === 'POST') {
    if (!reg_no) errors.push('Registration number is required');
    if (!student_name) errors.push('Student name is required');
    if (!email) errors.push('Email is required');
    if (department_id === undefined) {
      errors.push('Department ID is required');
    }
  }

  if (req.method === 'PATCH') {
    const providedFields = Object.keys(req.body);
    const hasAllowedField = providedFields.some((field) =>
      allowedFields.includes(field),
    );

    if (!hasAllowedField) {
      errors.push('Provide at least one valid field to update');
    }
  }

  if (reg_no !== undefined && (typeof reg_no !== 'string' || !reg_no.trim())) {
    errors.push('Registration number must be a non-empty string');
  }

  if (
    student_name !== undefined &&
    (typeof student_name !== 'string' || !student_name.trim())
  ) {
    errors.push('Student name must be a non-empty string');
  }

  if (email !== undefined) {
    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.push('Provide a valid email address');
    }
  }

  if (
    department_id !== undefined &&
    (!Number.isInteger(Number(department_id)) || Number(department_id) <= 0)
  ) {
    errors.push('Department ID must be a positive integer');
  }

  if (phone !== undefined && typeof phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (
    date_of_birth !== undefined &&
    date_of_birth !== null &&
    (typeof date_of_birth !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth))
  ) {
    errors.push('Date of birth must use YYYY-MM-DD format');
  }

  if (status !== undefined && (typeof status !== 'string' || !status.trim())) {
    errors.push('Status must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export default validateStudent;
