/* eslint-disable no-console */
import path from 'path';
import { exit } from 'process';
import { spawn } from 'child_process';

import { capitalize, formatText, handleGetConfig, handlePlugin } from './utils';

export class Auditor {
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
      : 'critical';
    this.report = !!config.report;
    this.reportFilePath = (config['html-report-filepath'] || '').replace(
      /[^\w_/\\.]/g,
      '-'
    );
    this.auditFailBuild = config['audit-fail-build'] === true ? 1 : 0;

    this.isNPM = this.packageManager === 'npm';
  }

  getSeverityType(vulnerabilities, severityLevel) {
    const { low, moderate, high, critical } = vulnerabilities;
    let severityType = '';

    if (severityLevel === 'critical' && critical > 0) {
      severityType = 'critical';
    }

    if (severityLevel === 'high' && (critical > 0 || high > 0)) {
      severityType = 'high';
    }

    if (
      severityLevel === 'moderate' &&
      (critical > 0 || high > 0 || moderate > 0)
    ) {
      severityType = 'moderate';
    }

    if (
      severityLevel === 'low' &&
      (critical > 0 || high > 0 || moderate > 0 || low > 0)
    ) {
      severityType = 'low';
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

      handlePlugin(data, this.config);

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
        exit(this.auditFailBuild);
      } else {
        console.log('Audit passed');
        this.outputLog();
        exit(0);
      }
    } catch (e) {
      if (this.isNPM && JSON.parse(auditResponse).error) {
        console.log(
          `${JSON.parse(auditResponse).error.code}\n${
            JSON.parse(auditResponse).error.summary
          }\n${JSON.parse(auditResponse).error.detail}`
        );
        exit(1);
      }
      console.log(e);
      console.log('Error parsing JSON. Exiting');
      exit(1);
    }
  }

  runAudit() {
    console.log('\n *** Auditor *** \n');

    if (Object.keys(this.config).length < 1) {
      console.log('No config supplied, using defaults.');
      console.log(
        'You can configure "audit-ci" by creating an "audit-ci.config.json" file in your projects root folder\n'
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

    console.log('--- Command ---');
    console.log(`${this.packageManager} ${auditArgs.join(' ')}`);
    console.log('---------------\n');

    const audit = spawn(this.packageManager, auditArgs);

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
      const reporter = spawn('node', reporterArgs);
      let reporterErrorBuffer = '';
      reporter.stderr.on('data', data => {
        reporterErrorBuffer += data;
      });
      audit.stdout.pipe(reporter.stdin);
      reporter.on('exit', () => {
        if (reporterErrorBuffer) {
          console.log(`Reporter error: ${reporterErrorBuffer}`);
          exit(1);
        }
        this.handleResults(auditResponse);
      });
    } else {
      audit.on('exit', () => {
        if (auditErrorBuffer) {
          console.log(`Audit error: ${auditErrorBuffer}`);
          exit(1);
        }
        this.handleResults(auditResponse);
      });
    }
  }
}

const auditor = new Auditor(handleGetConfig());

export default auditor.runAudit();
