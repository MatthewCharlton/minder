export function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function formatText(str) {
  return str
    .replace(/[/\-_]/g, ' ')
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}
