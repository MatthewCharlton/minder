import mockFs from 'mock-fs';
import { exit } from 'process';
import { spawn } from 'child_process';

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
  afterEach(() => {
    mockFs.restore();
  });
  it('uses default settings when no config is passed', async () => {
    const { Auditor } = require('.');
    const auditCI = new Auditor();
    const auditFnSpy = jest.spyOn(auditCI, 'runAudit');
    auditCI.runAudit();
    expect(auditCI.config).toEqual({});
    expect(auditCI.packageManager).toEqual('npm');
    expect(auditFnSpy).toBeCalled();
    expect(spawn).toBeCalled();
  });
});
