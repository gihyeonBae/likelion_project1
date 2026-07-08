export function isRequired(value) {
  return String(value ?? '').trim().length > 0;
}

export function isPhoneNumber(value) {
  return /^01[016789]-?\d{3,4}-?\d{4}$/.test(String(value ?? '').trim());
}
