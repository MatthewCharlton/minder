export const noNPMAdvisoriesJSON = `{
  "actions": [],
  "advisories": {},
  "muted": [],
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 0,
      "high": 0,
      "critical": 0
    },
    "dependencies": 136,
    "devDependencies": 872213,
    "optionalDependencies": 11529,
    "totalDependencies": 872352
  },
  "runId": "77421e8f-7a26-4208-85e5-f29c34a83cef"
}`;

export const findingNPMAdvisoryJSON = `{
  "advisories": {
    "118": {
      "findings": [
        {
          "version": "2.0.10",
          "paths": [
            "gulp>vinyl-fs>glob-stream>glob>minimatch",
            "gulp>vinyl-fs>glob-stream>minimatch"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "version": "0.2.14",
          "paths": [
            "gulp>vinyl-fs>glob-watcher>gaze>globule>glob>minimatch",
            "gulp>vinyl-fs>glob-watcher>gaze>globule>minimatch"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "version": "0.3.0",
          "paths": [
            "gulp-mocha>mocha>glob>minimatch",
            "mocha>glob>minimatch"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 118,
      "created": "2016-05-25T16:37:20.000Z",
      "updated": "2018-03-01T21:58:01.072Z",
      "deleted": null,
      "title": "Regular Expression Denial of Service",
      "found_by": {
        "name": "Nick Starke"
      },
      "reported_by": {
        "name": "Nick Starke"
      },
      "module_name": "minimatch",
      "cves": [
        "CVE-2016-10540"
      ],
      "vulnerable_versions": "<=3.0.1",
      "patched_versions": ">=3.0.2",
      "overview": "Affected versions of minimatch are vulnerable to regular expression denial of service attacks when user input is passed into the",
      "recommendation": "Update to version 3.0.2 or later.",
      "references": "",
      "access": "public",
      "severity": "high",
      "cwe": "CWE-400",
      "metadata": {
        "module_type": "Multi.Library",
        "exploitability": 4,
        "affected_components": "Internal::Code::Function::minimatch({type:'args', key:0, vector:{type:'string'}})"
      },
      "url": "https://npmjs.com/advisories/118"
    }
  },
  "muted": [],
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 9,
      "moderate": 1,
      "high": 7,
      "critical": 2
    },
    "dependencies": 1948,
    "devDependencies": 2173,
    "optionalDependencies": 0,
    "totalDependencies": 4121
  },
  "runId": "aa533080-0f2c-4fad-aa70-046512800d1b"
}`;

export const errorNPMJSON = `{
  "error": {
    "code": "ENOTFOUND",
    "summary": "request to https://registry.npmjs.org/-/npm/v1/security/audits failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org registry.npmjs.org:443",
    "detail": "This is a problem related to network connectivity.\\nIn most cases you are behind a proxy or have bad network settings.\\n\\nIf you are behind a proxy, please make sure that the\\n'proxy' config is set properly.  See: 'npm help config'"
  }
}`;

