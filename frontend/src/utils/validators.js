const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function isPdfFile(file) {
  return Boolean(file) && file.type === 'application/pdf';
}

export function isWithinSizeLimit(file, maxSizeMb) {
  return Boolean(file) && file.size <= maxSizeMb * 1024 * 1024;
}
