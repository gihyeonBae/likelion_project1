export function createOptionSummary(options = {}) {
  return Object.entries(options)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join(' / ');
}
