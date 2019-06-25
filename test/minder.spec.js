import { spawn } from 'child_process';
import { exit } from 'process';

import {
  noNPMAdvisoriesJSON,
  findingNPMAdvisoryJSON,
  errorNPMJSON
} from './fixtures/npmJSON';
import { noYarnAdvisoriesJSON } from './fixtures/yarnJSON';

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

let minder;

describe('Auditor Class', () => {
  beforeEach(() => {
    const { Auditor } = require('../src');
    minder = new Auditor();
  });
  describe('config', () => {
    it('uses default settings when no config is passed', () => {
      expect(minder.config).toEqual({});
      expect(minder.packageManager).toEqual('npm');
      expect(minder.severity).toEqual('critical');
      expect(minder.auditFailBuild).toEqual(0);
      expect(minder.report).toEqual(false);
      expect(minder.registry).toEqual('');
      expect(minder.reportFilePath).toEqual('');
      expect(minder.isNPM).toEqual(true);
    });
    it('uses custom settings when config is passed', () => {
      const config = {
        severity: 'high',
        'package-manager': 'yarn',
        report: true,
        'audit-fail-build': true,
        'html-report-filepath': 'auditor-report.html',
        registry: 'http://registry.yarnpkg.com/',
        'whitelisted-advisories': ['803']
      };
      const { Auditor } = require('../src');
      minder = new Auditor(config);
      expect(minder.config).toEqual(config);
      expect(minder.packageManager).toEqual('yarn');
      expect(minder.registry).toEqual('http://registry.yarnpkg.com/');
      expect(minder.severity).toEqual('high');
      expect(minder.auditFailBuild).toEqual(1);
      expect(minder.report).toEqual(true);
      expect(minder.reportFilePath).toEqual('auditor-report.html');
      expect(minder.isNPM).toEqual(false);
      expect(minder.whitelistedAdvisories).toEqual(['803']);
    });
  });
  describe('runAudit', () => {
    it('uses default settings when no config is passed', () => {
      const auditFnSpy = jest.spyOn(minder, 'runAudit');
      minder.runAudit();
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
      const minder = new Auditor(config);
      const auditFnSpy = jest.spyOn(minder, 'runAudit');
      minder.runAudit();
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
      minder.severity = 'high';
      const vulnerabilities = {
        info: 0,
        low: 9,
        moderate: 1,
        high: 7,
        critical: 2
      };
      const severity = minder.getSeverityType(vulnerabilities, minder.severity);
      expect(severity).toBe(minder.severity);
    });
    it('returns severity from vulnerabilities', () => {
      const vulnerabilities = {
        info: 0,
        low: 9,
        moderate: 1,
        high: 0,
        critical: 2
      };
      minder.severity = 'high';
      const severity = minder.getSeverityType(vulnerabilities, minder.severity);
      expect(severity).toBe(minder.severity);
    });
  });
  describe('handleResults', () => {
    describe('NPM', () => {
      it('if vulnerabilities does not match severity and are lower than severity then exit(0)', async () => {
        minder.packageManager = 'npm';
        minder.isNPM = true;
        minder.severity = 'low';
        minder.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(minder, 'getSeverityType');
        await minder.handleResults(noNPMAdvisoriesJSON);
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
      it('if vulnerabilities has matching severity and auditFailBuild = true then exit(1)', async () => {
        minder.severity = 'high';
        minder.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(minder, 'getSeverityType');
        await minder.handleResults(findingNPMAdvisoryJSON);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 0,
            moderate: 0,
            high: 1,
            critical: 0
          },
          'high'
        );
        expect(exit).toBeCalledWith(1);
      });
      it('if vulnerabilities does not match severity but are higher than severity then exit(1)', async () => {
        minder.severity = 'moderate';
        minder.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(minder, 'getSeverityType');
        await minder.handleResults(`{
          "advisories": {
            "112":{
              "severity": "high"
            },
            "547":{
              "severity": "moderate"
            },
            "976":{
              "severity": "high"
            }
          }
        }`);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 0,
            moderate: 1,
            high: 2,
            critical: 0
          },
          'moderate'
        );
        expect(exit).toBeCalledWith(1);
      });
      it('if vulnerabilities does not match severity and are lower than severity then exit(0)', async () => {
        minder.severity = 'high';
        minder.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(minder, 'getSeverityType');
        await minder.handleResults(`{
          "advisories": {
            "443":{
              "severity": "low"
            },
            "886":{
              "severity": "low"
            },
            "903":{
              "severity": "moderate"
            }
          }
        }`);
        expect(getSeverityTypeSpy).toBeCalledWith(
          {
            info: 0,
            low: 2,
            moderate: 1,
            high: 0,
            critical: 0
          },
          'high'
        );
        expect(exit).toBeCalledWith(0);
      });
      it('if audit call fails', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        await minder.handleResults(errorNPMJSON);
        expect(consoleLogSpy).toBeCalledWith(
          `${JSON.parse(errorNPMJSON).error.code}\n${
            JSON.parse(errorNPMJSON).error.summary
          }\n${JSON.parse(errorNPMJSON).error.detail}`
        );
        expect(exit).toBeCalledWith(1);
      });
    });
    describe('Yarn', () => {
      it('if vulnerabilities does not match severity and are lower than severity then exit(0)', async () => {
        minder.packageManager = 'yarn';
        minder.isNPM = false;
        minder.severity = 'low';
        minder.auditFailBuild = 1;
        const getSeverityTypeSpy = jest.spyOn(minder, 'getSeverityType');
        await minder.handleResults(noYarnAdvisoriesJSON);
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
