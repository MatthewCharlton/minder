import { cwd } from 'process';
import { readFileSync, existsSync } from 'fs';

import { YARN, NO_VULNS_OBJECT } from './constants';

export function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function hasCorrectLockFile(packageManager) {
  let lockfileName = '';
  if (packageManager === YARN) {
    lockfileName = 'yarn.lock';
  } else {
    lockfileName = 'package-lock.json';
  }
  return !!existsSync(`./${lockfileName}`);
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

  return plugin(data, config);
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
            .reduce(count => count + 1, 0),
        }),
        {}
      ),
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
          .reduce(count => count + 1, 0),
      }),
      {}
    ),
  };
}

export function logAffectedDependencies(packageManager, parsedRes) {
  console.log('\nThe following dependencies should be reviewed:\n');
  if (packageManager === YARN) {
    parsedRes
      .filter(item => item.type === 'warning')
      .map(item => {
        console.log(item.data);
      });

    // Object.keys(parsedRes.advisories).forEach(item => {
    //   const moduleObj = parsedRes.advisories[item];
    //   console.log(
    //     `Module name: ${moduleObj.module_name}, version\s: ${moduleObj.vulnerable_versions}`
    //   );
    //   console.log(moduleObj.overview);
    //   const modulePaths = moduleObj.findings.map(
    //     item => `Version ${item.version} located: ${item.paths.join(", ")}\n`
    //   );
    //   console.log(`Path/s to affected module: ${modulePaths}`);
    //   moduleObj.url && console.log(`For more info visit: ${moduleObj.url}`);
    // });
    return;
  }

  Object.keys(parsedRes.advisories).forEach(item => {
    const moduleObj = parsedRes.advisories[item];
    console.log(`-----  Module name: ${moduleObj.module_name} -----`);
    console.log(`Affected version/s: ${moduleObj.vulnerable_versions}`);
    console.log(moduleObj.overview);
    if (moduleObj.findings && moduleObj.findings.length) {
      const modulePaths = moduleObj.findings.map(
        item => `Version ${item.version} located: ${item.paths.join(', ')}\n`
      );
      console.log(`Path/s to affected module: ${modulePaths}`);
    }
    moduleObj.url && console.log(`For more info visit: ${moduleObj.url}`);
    console.log('---------------------------\n');
  });
  return;
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
          [advisory]: advisories[advisory],
        };
      },
      {}
    );
    return {
      ...json,
      advisories: filteredAdvisories,
    };
  }
  return json;
}
