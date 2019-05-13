import { cwd } from 'process';
import { readFileSync } from 'fs';

export function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function formatText(str) {
  return str
    .replace(/[/\\\-_+]/g, ' ')
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

export function handleGetConfig() {
  try {
    return JSON.parse(readFileSync(`${cwd()}/audit-ci.config.json`));
  } catch (ignore) {
    return {};
  }
}

export function handlePlugin(data, config) {
  let plugin;
  try {
    // eslint-disable-next-line global-require,import/no-unresolved
    plugin = require(`${cwd()}/audit-ci-plugin.js`);
  } catch (err) {
    plugin = () => err;
  }

  return plugin(data, config);
}
