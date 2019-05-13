import { spawn } from 'child_process';
import { exit } from 'process';

import {
  noNPMAdvisoriesJSON,
  findingNPMAdvisoryJSON,
  errorNPMJSON
} from './fixtures/npmJSON';
import {
  testYarnJSON,
  noYarnAdvisoriesJSON,
  findingYarnAdvisoryJSON
} from './fixtures/yarnJSON';

jest.mock('process', () => ({
  exit: jest.fn()
}));
jest.mock('child_process', () => ({
  spawn: jest.fn().mockReturnValue({
    on: jest.fn(),
    stdout: { on: jest.fn(), pipe: jest.fn() },
    stderr: { on: jest.fn() }
  })
}));

let auditCI;

describe('Auditor Class', () => {
  beforeEach(() => {
    const { Auditor } = require('../src');
    auditCI = new Auditor();
  });
  describe('config', () => {
    it('uses default settings when no config is passed', () => {
      expect(auditCI.config).toEqual({});
      expect(auditCI.packageManager).toEqual('npm');
      expect(auditCI.severity).toEqual('critical');
      expect(auditCI.auditFailBuild).toEqual(0);
      expect(auditCI.report).toEqual(false);
      expect(auditCI.registry).toEqual('');
      expect(auditCI.reportFilePath).toEqual('');
      expect(auditCI.isNPM).toEqual(true);
    });
    it('uses custom settings when config is passed', () => {
      const config = {
        severity: 'high',
        'package-manager': 'yarn',
        report: true,
        'audit-fail-build': true,
        'html-report-filepath': 'auditor-report.html',
        registry: 'http://registry.yarnpkg.com/'
      };
      const { Auditor } = require('../src');
      auditCI = new Auditor(config);
      expect(auditCI.config).toEqual(config);
      expect(auditCI.packageManager).toEqual('yarn');
      expect(auditCI.registry).toEqual('http://registry.yarnpkg.com/');
      expect(auditCI.severity).toEqual('high');
      expect(auditCI.auditFailBuild).toEqual(1);
      expect(auditCI.report).toEqual(true);
      expect(auditCI.reportFilePath).toEqual('auditor-report.html');
      expect(auditCI.isNPM).toEqual(false);
    });
  });
  describe('runAudit', () => {
    it('uses default settings when no config is passed', () => {
      const auditFnSpy = jest.spyOn(auditCI, 'runAudit');
      auditCI.runAudit();
      expect(auditFnSpy).toBeCalledTimes(1);
      expect(spawn).toBeCalledWith('npm', ['audit', '--json']);
    });
    it('uses custom settings when config is passed', () => {
      const config = {
        report: true,
        'audit-fail-build': true,
        'html-report-filepath': 'auditor-report.html',
        registry: 'http://registry.yarnpkg.com/'
      };
      const { Auditor } = require('../src');
      const auditCI = new Auditor(config);
      const auditFnSpy = jest.spyOn(auditCI, 'runAudit');
      auditCI.runAudit();
      expect(auditFnSpy).toBeCalledTimes(1);
      expect(spawn).toBeCalledWith('npm', [
        'audit',
        '--json',
        '--registry=http://registry.yarnpkg.com/'
      ]);
    });
  });
  describe('getSeverityType', () => {
    it('returns severity from vulnerabilities', () => {
      auditCI.severity = 'high';
      const vulnerabilities = {
        info: 0,
        low: 9,
        moderate: 1,
        high: 7,
        critical: 2
      };
      const severity = auditCI.getSeverityType(
        vulnerabilities,
        auditCI.severity
      );
      expect(severity).toBe(auditCI.severity);
    });
    it('returns severity from vulnerabilities', () => {
      const vulnerabilities = {
        info: 0,
        low: 9,
        moderate: 1,
        high: 0,
        critical: 2
      };
      auditCI.severity = 'high';
      const severity = auditCI.getSeverityType(
        vulnerabilities,
        auditCI.severity
      );
      expect(severity).toBe(auditCI.severity);
    });
  });
  describe('handleResults', () => {
    describe('NPM', () => {
      it('if vulnerabilities does not match severity and are lower than severity then exit(0)', () => {
        auditCI.packageManager = 'npm';
        auditCI.isNPM = true;
        auditCI.severity = 'low';
        auditCI.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(auditCI, 'getSeverityType');
        auditCI.handleResults(noNPMAdvisoriesJSON);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 0,
            moderate: 0,
            high: 0,
            critical: 0
          },
          'low'
        );
        expect(exit).toBeCalledWith(0);
      });
      it('if vulnerabilities has matching severity and auditFailBuild = true then exit(1)', () => {
        auditCI.severity = 'high';
        auditCI.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(auditCI, 'getSeverityType');
        auditCI.handleResults(findingNPMAdvisoryJSON);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 9,
            moderate: 1,
            high: 7,
            critical: 2
          },
          'high'
        );
        expect(exit).toBeCalledWith(1);
      });
      it('if vulnerabilities does not match severity but are higher than severity then exit(1)', () => {
        auditCI.severity = 'moderate';
        auditCI.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(auditCI, 'getSeverityType');
        auditCI.handleResults(`{
            "metadata":{
              "vulnerabilities": {
                "info": 0,
                "low": 9,
                "moderate": 0,
                "high": 0,
                "critical": 1
              }
            }
        }`);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 9,
            moderate: 0,
            high: 0,
            critical: 1
          },
          'moderate'
        );
        expect(exit).toBeCalledWith(1);
      });
      it('if vulnerabilities does not match severity and are lower than severity then exit(0)', () => {
        auditCI.severity = 'moderate';
        auditCI.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(auditCI, 'getSeverityType');
        auditCI.handleResults(`{
        "metadata":{
          "vulnerabilities": {
            "info": 0,
            "low": 9,
            "moderate": 0,
            "high": 0,
            "critical": 0
          }
        }
     }`);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 9,
            moderate: 0,
            high: 0,
            critical: 0
          },
          'moderate'
        );
        expect(exit).toBeCalledWith(0);
      });
      it.skip('if audit call fails', () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        auditCI.handleResults(errorNPMJSON);
        expect(consoleLogSpy).toBeCalledWith(
          `${JSON.parse(errorNPMJSON).error.summary}\n${
            JSON.parse(errorNPMJSON).error.detail
          }`
        );
        expect(exit).toBeCalledWith(1);
      });
    });
    describe('Yarn', () => {
      it('if vulnerabilities does not match severity and are lower than severity then exit(0)', () => {
        auditCI.packageManager = 'yarn';
        auditCI.isNPM = false;
        auditCI.severity = 'low';
        auditCI.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(auditCI, 'getSeverityType');
        auditCI.handleResults(noYarnAdvisoriesJSON);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 0,
            moderate: 0,
            high: 0,
            critical: 0
          },
          'low'
        );
        expect(exit).toBeCalledWith(0);
      });
    });
  });
});
