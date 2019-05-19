import { cwd } from 'process';
import { readFileSync } from 'fs';

import { YARN, NO_VULNS_OBJECT } from './constants';

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
    return JSON.parse(readFileSync(`${cwd()}/minder.config.json`));
  } catch (ignore) {
    return {};
  }
}

export function handlePlugin(data, config) {
  let plugin;
  try {
    // eslint-disable-next-line global-require,import/no-unresolved
    plugin = require(`${cwd()}/minder-plugin.js`);
  } catch (_) {
    plugin = () => {};
  }

  plugin(data, config);
}

export function returnVulnDataFromResponse(packageManager, parsedRes) {
  if (packageManager === YARN) {
    const sevArr = parsedRes
      .filter(item => item.type === 'auditAdvisory')
      .map(item => item.data.advisory.severity);

    return {
      ...NO_VULNS_OBJECT,
      ...sevArr.reduce(
        (acc, next) => ({
          ...acc,
          [next]: sevArr
            .filter(item => item === next)
            .reduce(count => count + 1, 0)
        }),
        {}
      )
    };
  }

  const { advisories } = parsedRes;
  const sevArr =
    advisories &&
    Object.keys(advisories).map(item => advisories[item].severity);
  return {
    ...NO_VULNS_OBJECT,
    ...sevArr.reduce(
      (acc, next) => ({
        ...acc,
        [next]: sevArr
          .filter(item => item === next)
          .reduce(count => count + 1, 0)
      }),
      {}
    )
  };
}

export function filterOutWhiteListedAdvisories(
  packageManager,
  response,
  whitelistedAdvisories
) {
  if (packageManager === YARN) {
    return response
      .split(/\n/)
      .filter(line => line !== '')
      .map(item => item.replace(/((")(\d+)("):)/, '$3:'))
      .map(JSON.parse)
      .filter(
        item =>
          item.type === 'auditAdvisory' &&
          !whitelistedAdvisories.includes(String(item.data.advisory.id))
      );
  }
  const json = JSON.parse(response);
  const { advisories } = json;
  if (advisories) {
    const filteredAdvisories = Object.keys(advisories).reduce(
      (acc, advisory) => {
        if (whitelistedAdvisories.includes(String(advisory))) {
          return {};
        }
        return {
          ...acc,
          [advisory]: advisories[advisory]
        };
      },
      {}
    );
    return {
      ...json,
      advisories: filteredAdvisories
    };
  }
  return json;
}
