import { spawn } from 'child_process';
import { exit } from 'process';

import {
  testNPMJSON,
  noNPMAdvisoriesJSON,
  findingNPMAdvisoryJSON
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

describe('Auditor Class', () => {
  describe('config', () => {
    it('uses default settings when no config is passed', () => {
      const { Auditor } = require('../src');
      const auditCI = new Auditor();
      const auditFnSpy = jest.spyOn(auditCI, 'runAudit');
      auditCI.runAudit();
      expect(auditCI.config).toEqual({});
      expect(auditCI.packageManager).toEqual('npm');
      expect(auditCI.severity).toEqual('critical');
      expect(auditCI.auditFailBuild).toEqual(0);
      expect(auditCI.report).toEqual(false);
      expect(auditCI.reportFilePath).toEqual('');
      expect(auditCI.isNPM).toEqual(true);
      expect(auditFnSpy).toBeCalledTimes(1);
      expect(spawn).toBeCalledWith('npm', ['audit', '--json']);
    });
    it('uses custom settings when config is passed', () => {
      const { Auditor } = require('../src');
      const config = {
        severity: 'high',
        'package-manager': 'yarn',
        report: true,
        'audit-fail-build': true,
        'html-report-filepath': 'auditor-report.html',
        registry: 'http://registry.yarnpkg.com/'
      };
      const auditCI = new Auditor(config);
      const auditFnSpy = jest.spyOn(auditCI, 'runAudit');
      auditCI.runAudit();
      expect(auditCI.config).toEqual(config);
      expect(auditCI.packageManager).toEqual('yarn');
      expect(auditCI.severity).toEqual('high');
      expect(auditCI.auditFailBuild).toEqual(1);
      expect(auditCI.report).toEqual(true);
      expect(auditCI.reportFilePath).toEqual('auditor-report.html');
      expect(auditCI.isNPM).toEqual(false);
      expect(auditFnSpy).toBeCalledTimes(1);
      expect(spawn).toBeCalledWith('yarn', [
        'audit',
        '--json',
        '--registry=http://registry.yarnpkg.com/'
      ]);
    });
  });
  describe('getSeverityType', () => {
    it('returns severity from vulnerabilities', () => {
      const vulnerabilities = {
        info: 0,
        low: 9,
        moderate: 1,
        high: 7,
        critical: 2
      };

      const { Auditor } = require('../src');
      const auditCI = new Auditor();
      auditCI.severity = 'high';
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

      const { Auditor } = require('../src');
      const auditCI = new Auditor();
      auditCI.severity = 'high';
      const severity = auditCI.getSeverityType(
        vulnerabilities,
        auditCI.severity
      );
      expect(severity).toBe(auditCI.severity);
    });
  });
  describe('handleResults', () => {
    it('if vulnerabilities has matching severity and auditFailBuild = true then exit(1)', () => {
      const { Auditor } = require('../src');
      const auditCI = new Auditor();
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
    it('if vulnerabilities does not match severity but are higher than severity then exit(0)', () => {
      const { Auditor } = require('../src');
      const auditCI = new Auditor();
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
      const { Auditor } = require('../src');
      const auditCI = new Auditor();
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
      expect(exit).toBeCalledWith(1);
    });
  });
});
