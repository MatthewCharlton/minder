'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var path = _interopDefault(require('path'));
var process = require('process');
var child_process = require('child_process');

function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function formatText(str) {
  return str
    .replace(/[/\-_]/g, ' ')
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/* eslint-disable no-console */

class Auditor {
  constructor(config = {}) {
    this.config = config;
    this.packageManager =
      config['package-manager'] &&
      config['package-manager'].toLowerCase() === 'yarn'
        ? 'yarn'
        : 'npm';
    this.registry = (config.registry || '').replace(/[^\w-/.:]/g, '');
    this.severity = ['low', 'moderate', 'high', 'critical'].includes(
      config.severity && config.severity.toLowerCase()
    )
      ? config.severity.toLowerCase()
      : 'high';
    this.report = !!config.report;
    this.reportFilePath = (config['html-report-filepath'] || '').replace(
      /[^\w_/\\.]/g,
      '-'
    );
    this.auditFailBuild = config['audit-fail-build'] === true ? 1 : 0;

    this.isNPM = this.packageManager === 'npm';
  }

  createLockFileIfNeeded() {
    // npm audit requires a package-lock file, yarn can audit without one
    if (this.isNPM) {
      try {
        fs.readFileSync('./package-lock.json');
      } catch (ignore) {
        try {
          console.log(
            'No lock file found in current folder. Creating one now.'
          );
          child_process.execSync('npm install --package-lock-only');
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  handlePlugin(data) {
    let plugin;
    try {
      // eslint-disable-next-line global-require,import/no-unresolved
      plugin = require('./auditor-plugin.js');
    } catch (err) {
      plugin = () => {};
    }
    plugin(data);
  }

  getSeverityType(vulnerabilities, severityLevel) {
    const { low, moderate, high, critical } = vulnerabilities;
    let severityType = '';

    if (severityLevel === 'critical' && critical > 0) {
      severityType = severityLevel;
    }

    if (severityLevel === 'high' && (critical > 0 || high > 0)) {
      severityType = severityLevel;
    }

    if (
      severityLevel === 'moderate' &&
      (critical > 0 || high > 0 || moderate > 0)
    ) {
      severityType = severityLevel;
    }

    if (
      severityLevel === 'low' &&
      (critical > 0 || high > 0 || moderate > 0 || low > 0)
    ) {
      severityType = severityLevel;
    }

    return severityType;
  }

  outputLog() {
    this.reportFilePath
      ? console.log(`Report saved to: ${this.reportFilePath}`)
      : null;
  }

  handleResults(auditResponse) {
    try {
      const data = this.isNPM
        ? auditResponse
        : auditResponse.split(/\n/).filter(line => line !== '');

      const metadata = this.isNPM
        ? JSON.parse(data).metadata
        : JSON.parse(data[data.length - 1]).data;

      this.handlePlugin(data);

      const { vulnerabilities } = metadata;
      const severityType = this.getSeverityType(vulnerabilities, this.severity);

      console.log('---- Summary ----');
      Object.keys(vulnerabilities).forEach(key =>
        console.log(`${capitalize(key)}: ${vulnerabilities[key]}`)
      );
      console.log('-----------------\n');

      if (severityType.toUpperCase() === this.severity.toUpperCase()) {
        console.log(
          `Audit failed: there are packages that have vulnerabilities that match your configured fail criteria: ${capitalize(
            this.severity
          )}`
        );
        this.outputLog();
        process.exit(this.auditFailBuild);
      } else {
        console.log('Audit passed');
        this.outputLog();
        process.exit(0);
      }
    } catch (e) {
      console.log(e);
      console.log('Error parsing JSON. Exiting');
      process.exit(1);
    }
  }

  runAudit() {
    console.log('\n *** Auditor *** \n');

    if (Object.keys(this.config).length < 1) {
      console.log('No config supplied, using defaults.');
      console.log(
        'You can configure Auditor by creating an "auditor-config.[js,json]" file in your projects root folder\n'
      );
    } else {
      console.log('---- Config ----');
      Object.keys(this.config).forEach(key => {
        console.log(`${formatText(key)}: ${this.config[key]}`);
      });
      console.log('----------------\n');
    }

    const auditArgs = ['audit', '--json'];

    if (this.registry) {
      auditArgs.push(`--registry=${this.registry}`);
      if (!this.registry.includes(this.packageManager)) {
        console.log('------ ! ------');
        console.log(
          'It looks like the registry you have supplied does not use the package manager you specified.'
        );
        console.log(
          'Be aware that using a registry from a different package manager can lead to errors.'
        );
        console.log(
          'Make sure that the registry you supplied is compatible with your selected package manager.'
        );
        console.log('---------------\n');
      }
    }

    this.createLockFileIfNeeded();

    console.log('--- Command ---');
    console.log(`${this.packageManager} ${auditArgs.join(' ')}`);
    console.log('---------------\n');

    const audit = child_process.spawn(this.packageManager, auditArgs);

    let auditResponse = '';

    let auditErrorBuffer = '';

    audit.stdout.on('data', data => {
      auditResponse += data.toString();
    });

    audit.stderr.on('data', data => {
      auditErrorBuffer += data;
    });

    if (this.report) {
      const reporterArgs = [];
      const nodeModulesFolder = path.join(__dirname, '../', 'node_modules');
      this.isNPM
        ? reporterArgs.push(`${nodeModulesFolder}/npm-audit-html`)
        : reporterArgs.push(`${nodeModulesFolder}/yarn-audit-html`);
      if (this.reportFilePath) {
        reporterArgs.push('--output', this.reportFilePath);
      }
      const reporter = child_process.spawn('node', reporterArgs);
      let reporterErrorBuffer = '';
      reporter.stderr.on('data', data => {
        reporterErrorBuffer += data;
      });
      audit.stdout.pipe(reporter.stdin);
      reporter.on('exit', () => {
        if (reporterErrorBuffer) {
          console.log(`Reporter error: ${reporterErrorBuffer}`);
          process.exit(1);
        }
        this.handleResults(auditResponse);
      });
    } else {
      audit.on('exit', () => {
        if (auditErrorBuffer) {
          console.log(`Audit error: ${auditErrorBuffer}`);
          process.exit(1);
        }
        this.handleResults(auditResponse);
      });
    }
  }
}

function handleGetConfig() {
  try {
    // eslint-disable-next-line global-require,import/no-unresolved
    return require(`${process.cwd()}/auditor-config`);
  } catch (ignore) {
    return {};
  }
}

const auditor = new Auditor(handleGetConfig());

var index = auditor.runAudit();

module.exports = index;
