export function getUniqueStringId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 12).padStart(12, '0')
  );
}

export function getUniqueNumericalId() {
  return Math.floor(Math.random() * Math.random() * 100000);
}
