import { readFileSync } from 'fs';

import { capitalize, formatText, handleGetConfig } from '../src/utils';

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
    it('uses default config when no auditor-ci.config.json present', () => {
      readFileSync.mockReturnValue({});
      expect(handleGetConfig()).toStrictEqual({});
    });
    it('uses config from auditor-ci.config.json file', async () => {
      const config =
        '{"severity":"critical","package-manager":"npm","report":true,"audit-fail-build":true,"html-report-filepath":"auditor-report.html"}';

      readFileSync.mockReturnValue(config);

      expect(handleGetConfig()).toStrictEqual(JSON.parse(config));
    });
  });
});
