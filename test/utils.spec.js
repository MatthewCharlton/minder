import { readFileSync } from 'fs';

import {
  capitalize,
  formatText,
  handleGetConfig,
  filterOutWhiteListedAdvisories,
  returnVulnDataFromResponse
} from '../src/utils';

import { findingYarnAdvisoriesJSON } from './fixtures/yarnJSON';
import { findingNPMAdvisoryJSON } from './fixtures/npmJSON';

jest.mock('fs', () => ({
  readFileSync: jest.fn()
}));
jest.mock('process', () => ({
  cwd: jest.fn().mockReturnValue('/test')
}));

describe('Utils', () => {
  describe('capitalize', () => {
    expect(capitalize('hello there')).toEqual('Hello there');
  });

  describe('formatText', () => {
    expect(formatText('hey+yo-funky_peeps\\check/this')).toEqual(
      'Hey Yo Funky Peeps Check This'
    );
  });

  describe('handleGetConfig', () => {
    it('uses default config when no minder.config.json present', () => {
      readFileSync.mockReturnValue({});
      expect(handleGetConfig()).toStrictEqual({});
    });
    it('uses config from minder.config.json file', () => {
      const config =
        '{"severity":"critical","package-manager":"npm","report":true,"audit-fail-build":true,"html-report-filepath":"auditor-report.html"}';

      readFileSync.mockReturnValue(config);

      expect(handleGetConfig()).toStrictEqual(JSON.parse(config));
    });
  });

  describe('returnVulnDataFromResponse', () => {
    it('return vuln data from NPM', () => {
      expect(
        returnVulnDataFromResponse(
          'npm',
          filterOutWhiteListedAdvisories('npm', findingNPMAdvisoryJSON, [])
        )
      ).toStrictEqual({
        info: 0,
        low: 0,
        moderate: 0,
        high: 1,
        critical: 0
      });
    });
    it('return vuln data from Yarn', () => {
      expect(
        returnVulnDataFromResponse(
          'yarn',
          filterOutWhiteListedAdvisories('yarn', findingYarnAdvisoriesJSON, [])
        )
      ).toStrictEqual({ info: 0, low: 2, moderate: 1, high: 2, critical: 0 });
    });
  });

  describe('filterOutWhiteListedAdvisories', () => {
    it('return advisories without whitelisted ids from NPM', () => {
      expect(
        filterOutWhiteListedAdvisories('npm', findingNPMAdvisoryJSON, ['118'])
      ).toStrictEqual({
        ...JSON.parse(findingNPMAdvisoryJSON),
        advisories: {}
      });
    });
    it('return all advisories if no whitelisted ids present from NPM', () => {
      expect(
        filterOutWhiteListedAdvisories('npm', findingNPMAdvisoryJSON, [])
      ).toStrictEqual(JSON.parse(findingNPMAdvisoryJSON));
    });
    it('return advisories without whitelisted ids from Yarn', () => {
      const whitelistedAdvisories = ['803'];
      expect(
        filterOutWhiteListedAdvisories(
          'yarn',
          findingYarnAdvisoriesJSON,
          whitelistedAdvisories
        )
      ).toStrictEqual(
        findingYarnAdvisoriesJSON
          .split(/\n/)
          .filter(line => line !== '')
          .map(item => item.replace(/((")(\d+)("):)/, '$3:'))
          .map(JSON.parse)
          .filter(
            item =>
              item.type === 'auditAdvisory' &&
              !whitelistedAdvisories.includes(String(item.data.advisory.id))
          )
      );
    });
    it('return all advisories if no whitelisted ids present from Yarn', () => {
      const whitelistedAdvisories = [];
      expect(
        filterOutWhiteListedAdvisories(
          'yarn',
          findingYarnAdvisoriesJSON,
          whitelistedAdvisories
        )
      ).toStrictEqual(
        findingYarnAdvisoriesJSON
          .split(/\n/)
          .filter(line => line !== '')
          .map(item => item.replace(/((")(\d+)("):)/, '$3:'))
          .map(JSON.parse)
          .filter(
            item =>
              item.type === 'auditAdvisory' &&
              !whitelistedAdvisories.includes(String(item.data.advisory.id))
          )
      );
    });
  });
});
