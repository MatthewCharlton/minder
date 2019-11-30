/* eslint-disable no-console */
import { exit } from 'process';
import { spawn } from 'child_process';
import { spawn as npmRunSpwan } from 'npm-run';

import { NPM, YARN } from './constants';

import {
  capitalize,
  formatText,
  handleGetConfig,
  handlePlugin,
  returnVulnDataFromResponse,
  filterOutWhiteListedAdvisories,
  hasCorrectLockFile,
  logAffectedDependencies,
} from './utils';

export class Auditor {
  constructor(config = {}) {
    this.config = config;
    this.packageManager =
      config['package-manager'] &&
      config['package-manager'].toLowerCase() === YARN
        ? YARN
        : NPM;
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
    this.whitelistedAdvisories = Array.isArray(config['whitelisted-advisories'])
      ? config['whitelisted-advisories']
      : [];

    this.isNPM = this.packageManager === NPM;
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

  async handleResults(auditResponse) {
    try {
      await handlePlugin(auditResponse, this.config);

      const filteredRes = filterOutWhiteListedAdvisories(
        this.packageManager,
        auditResponse,
        this.whitelistedAdvisories
      );

      const vulnerabilities = returnVulnDataFromResponse(
        this.packageManager,
        filteredRes
      );
      const severityType = this.getSeverityType(vulnerabilities, this.severity);

      console.log('---- Summary ----');
      Object.keys(vulnerabilities).forEach(key =>
        console.log(`${capitalize(key)}: ${vulnerabilities[key]}`)
      );
      console.log('-----------------\n');

      if (severityType.toUpperCase() === this.severity.toUpperCase()) {
        console.log(
          `Audit failed! There are packages that have vulnerabilities that match your configured fail criteria: ${capitalize(
            this.severity
          )}`
        );

        if (!this.report) {
          logAffectedDependencies(this.packageManager, filteredRes);
        } else {
          this.outputLog();
        }
        exit(this.auditFailBuild);
      } else {
        console.log('Audit passed');
        if (this.report) this.outputLog();
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
    console.log(`
    ███╗   ███╗██╗███╗   ██╗██████╗ ███████╗██████╗ 
    ████╗ ████║██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
    ██╔████╔██║██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
    ██║╚██╔╝██║██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
    ██║ ╚═╝ ██║██║██║ ╚████║██████╔╝███████╗██║  ██║
    ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝                                   
    `);
    console.log('                   Dependency auditor\n\n');

    if (Object.keys(this.config).length < 1) {
      console.log('No config supplied, using defaults.');
      console.log(
        'You can configure "minder" by creating an "minder.config.json" file in your projects root folder.\n'
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

    if (!hasCorrectLockFile(this.packageManager)) {
      console.log(
        'No lockfile found for your configured package manager:',
        this.packageManager,
        '\n'
      );
      exit(1);
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
      if (this.reportFilePath) {
        reporterArgs.push('--output', this.reportFilePath);
      }
      const reporterCmd = this.isNPM ? 'npm-audit-html' : 'yarn-audit-html';
      const reporter = npmRunSpwan(reporterCmd, reporterArgs);
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

export { returnVulnDataFromResponse, filterOutWhiteListedAdvisories };

const auditor = new Auditor(handleGetConfig());

export default auditor.runAudit();
