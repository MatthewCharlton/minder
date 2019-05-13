export const noNPMAdvisoriesJSON = `{
  "advisories": {}
}
`;

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

export const testNPMJSON = `{
  "actions": [
    {
      "action": "install",
      "module": "gulp",
      "target": "4.0.0",
      "isMajor": true,
      "resolves": [
        {
          "id": 577,
          "path": "gulp>vinyl-fs>glob-watcher>gaze>globule>lodash",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 118,
          "path": "gulp>vinyl-fs>glob-stream>glob>minimatch",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 118,
          "path": "gulp>vinyl-fs>glob-stream>minimatch",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 118,
          "path": "gulp>vinyl-fs>glob-watcher>gaze>globule>glob>minimatch",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 118,
          "path": "gulp>vinyl-fs>glob-watcher>gaze>globule>minimatch",
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ]
    },
    {
      "action": "install",
      "module": "gulp-mocha",
      "target": "6.0.0",
      "isMajor": true,
      "resolves": [
        {
          "id": 534,
          "path": "gulp-mocha>mocha>debug",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 118,
          "path": "gulp-mocha>mocha>glob>minimatch",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 146,
          "path": "gulp-mocha>mocha>growl",
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ]
    },
    {
      "action": "install",
      "module": "mocha",
      "target": "5.2.0",
      "isMajor": true,
      "resolves": [
        {
          "id": 534,
          "path": "mocha>debug",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 118,
          "path": "mocha>glob>minimatch",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 146,
          "path": "mocha>growl",
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ]
    },
    {
      "action": "install",
      "module": "apidoc",
      "target": "0.17.7",
      "isMajor": false,
      "resolves": [
        {
          "id": 577,
          "path": "apidoc>apidoc-core>lodash",
          "dev": false,
          "optional": false,
          "bundled": false
        },
        {
          "id": 577,
          "path": "apidoc>lodash",
          "dev": false,
          "optional": false,
          "bundled": false
        }
      ]
    },
    {
      "action": "install",
      "module": "supertest",
      "target": "3.3.0",
      "isMajor": true,
      "resolves": [
        {
          "id": 535,
          "path": "supertest>superagent>mime",
          "dev": true,
          "optional": false,
          "bundled": false
        },
        {
          "id": 479,
          "path": "supertest>superagent",
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ]
    },
    {
      "action": "install",
      "module": "express-winston",
      "target": "3.0.1",
      "isMajor": true,
      "resolves": [
        {
          "id": 577,
          "path": "express-winston>lodash",
          "dev": false,
          "optional": false,
          "bundled": false
        }
      ]
    },
    {
      "module": "apidoc",
      "resolves": [
        {
          "id": 577,
          "path": "gulp-apidoc>apidoc>apidoc-core>lodash",
          "dev": false,
          "optional": false,
          "bundled": false
        },
        {
          "id": 577,
          "path": "gulp-apidoc>apidoc>lodash",
          "dev": false,
          "optional": false,
          "bundled": false
        }
      ],
      "target": "0.17.7",
      "action": "update",
      "depth": 2
    },
    {
      "action": "review",
      "module": "string",
      "resolves": [
        {
          "id": 536,
          "path": "string",
          "dev": false,
          "optional": false,
          "bundled": false
        }
      ]
    }
  ],
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
    },
    "146": {
      "findings": [
        {
          "version": "1.9.2",
          "paths": [
            "gulp-mocha>mocha>growl",
            "mocha>growl"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 146,
      "created": "2016-09-06T12:49:40.000Z",
      "updated": "2018-03-02T21:07:28.071Z",
      "deleted": null,
      "title": "Command Injection",
      "found_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "reported_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "module_name": "growl",
      "cves": [
        "CVE-2017-16042"
      ],
      "vulnerable_versions": "<1.10.2",
      "patched_versions": ">=1.10.2",
      "overview": "Affected versions of growl do not properly sanitize input prior to passing it into a shell command, allowing for arbitrary command execution.",
      "recommendation": "Update to version 1.10.2 or later.",
      "references": "[Issue #60](https://github.com/tj/node-growl/issues/60)[PR #61](https://github.com/tj/node-growl/pull/61)",
      "access": "public",
      "severity": "critical",
      "cwe": "CWE-94",
      "metadata": {
        "module_type": "CLI.Library",
        "exploitability": 5,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/146"
    },
    "479": {
      "findings": [
        {
          "version": "1.8.5",
          "paths": [
            "supertest>superagent"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 479,
      "created": "2017-07-28T21:07:54.490Z",
      "updated": "2018-04-05T22:22:03.826Z",
      "deleted": null,
      "title": "Large gzip Denial of Service",
      "found_by": {
        "name": "Dennis Appelt"
      },
      "reported_by": {
        "name": "Dennis Appelt"
      },
      "module_name": "superagent",
      "cves": [
        "CVE-2017-16129"
      ],
      "vulnerable_versions": "<3.7.0",
      "patched_versions": ">=3.7.0",
      "overview": "Affected versions of superagent do not check the post-decompression size of ZIP compressed HTTP responses prior to decompressing. This results in the package being vulnerable to a [ZIP bomb](https://en.wikipedia.org/wiki/Zip_bomb) attack, where an extremely small ZIP file becomes many orders of magnitude larger when decompressed. This may result in unrestrained CPU/Memory/Disk consumption, causing a denial of service condition.",
      "recommendation": "Update to version 3.7.0 or later.",
      "references": "[Issue #1259](https://github.com/visionmedia/superagent/issues/1259)- https://en.wikipedia.org/wiki/Zip_bomb",
      "access": "public",
      "severity": "low",
      "cwe": "CWE-409",
      "metadata": {
        "module_type": "Network.Library",
        "exploitability": 5,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/479"
    },
    "534": {
      "findings": [
        {
          "version": "2.2.0",
          "paths": [
            "gulp-mocha>mocha>debug",
            "mocha>debug"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 534,
      "created": "2017-09-25T18:55:55.956Z",
      "updated": "2018-05-16T19:37:43.686Z",
      "deleted": null,
      "title": "Regular Expression Denial of Service",
      "found_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "reported_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "module_name": "debug",
      "cves": [
        "CVE-2017-16137"
      ],
      "vulnerable_versions": "<= 2.6.8 || >= 3.0.0 <= 3.0.1",
      "patched_versions": ">= 2.6.9 < 3.0.0 || >= 3.1.0",
      "overview": "Affected versions of debug are vulnerable to regular expression denial of service when untrusted user input is passed into the o formatter. As it takes 50,000 characters to block the event loop for 2 seconds, this issue is a low severity issue.",
      "recommendation": "Version 2.x.x: Update to version 2.6.9 or later.Version 3.x.x: Update to version 3.1.0 or later.",
      "references": "- [Issue #501](https://github.com/visionmedia/debug/issues/501)- [PR #504](https://github.com/visionmedia/debug/pull/504)",
      "access": "public",
      "severity": "low",
      "cwe": "CWE-400",
      "metadata": {
        "module_type": "",
        "exploitability": 5,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/534"
    },
    "535": {
      "findings": [
        {
          "version": "1.3.4",
          "paths": [
            "supertest>superagent>mime"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 535,
      "created": "2017-09-25T19:02:28.152Z",
      "updated": "2018-04-09T00:38:22.785Z",
      "deleted": null,
      "title": "Regular Expression Denial of Service",
      "found_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "reported_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "module_name": "mime",
      "cves": [
        "CVE-2017-16138"
      ],
      "vulnerable_versions": "< 1.4.1 || > 2.0.0 < 2.0.3",
      "patched_versions": ">= 1.4.1 < 2.0.0 || >= 2.0.3",
      "overview": "Affected versions of mime are vulnerable to regular expression denial of service when a mime lookup is performed on untrusted user input.",
      "recommendation": "Update to version 2.0.3 or later.",
      "references": "[Issue #167](https://github.com/broofa/node-mime/issues/167)",
      "access": "public",
      "severity": "moderate",
      "cwe": "CWE-400",
      "metadata": {
        "module_type": "Multi.Library",
        "exploitability": 4,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/535"
    },
    "536": {
      "findings": [
        {
          "version": "3.3.3",
          "paths": [
            "string"
          ],
          "dev": false,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 536,
      "created": "2017-09-25T19:16:01.331Z",
      "updated": "2018-04-09T00:42:15.653Z",
      "deleted": null,
      "title": "Regular Expression Denial of Service",
      "found_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "reported_by": {
        "name": "Cristian-Alexandru Staicu"
      },
      "module_name": "string",
      "cves": [
        "CVE-2017-16116"
      ],
      "vulnerable_versions": "<=99.999.99999",
      "patched_versions": "<0.0.0",
      "overview": "Affected versions of string are vulnerable to regular expression denial of service when specifically crafted untrusted user input is passed into the underscore or unescapeHTML methods.",
      "recommendation": "There is currently no direct patch for this vulnerability. Currently, the best solution is to avoid passing user input to the underscore and unescapeHTML methods.Alternatively, a user provided patch is available in [Pull Request #217]( https://github.com/jprichardson/string.js/pull/217/commits/eab9511e4efbc8c521e18b6cf2e8565ae50c5a16), however this patch has not been tested, nor has it been merged by the package author.",
      "references": "[Issue #212](https://github.com/jprichardson/string.js/issues/212)",
      "access": "public",
      "severity": "high",
      "cwe": "CWE-400",
      "metadata": {
        "module_type": "Multi.Library",
        "exploitability": 5,
        "affected_components": "Internal::Code::Method::underscore([*])Internal::Code::Method::unescapeHTML([*])"
      },
      "url": "https://npmjs.com/advisories/536"
    },
    "577": {
      "findings": [
        {
          "version": "4.11.2",
          "paths": [
            "express-winston>lodash",
            "apidoc>apidoc-core>lodash",
            "apidoc>lodash",
            "gulp-apidoc>apidoc>apidoc-core>lodash",
            "gulp-apidoc>apidoc>lodash"
          ],
          "dev": false,
          "optional": false,
          "bundled": false
        },
        {
          "version": "1.0.2",
          "paths": [
            "gulp>vinyl-fs>glob-watcher>gaze>globule>lodash"
          ],
          "dev": true,
          "optional": false,
          "bundled": false
        }
      ],
      "id": 577,
      "created": "2018-04-24T14:27:02.796Z",
      "updated": "2018-04-24T14:27:13.049Z",
      "deleted": null,
      "title": "Prototype Pollution",
      "found_by": {
        "name": "Olivier Arteau (HoLyVieR)"
      },
      "reported_by": {
        "name": "Olivier Arteau (HoLyVieR)"
      },
      "module_name": "lodash",
      "cves": [
        "CVE-2018-3721"
      ],
      "vulnerable_versions": "<4.17.5",
      "patched_versions": ">=4.17.5",
      "overview": "Versions of lodash before 4.17.5 are vulnerable to prototype pollution. The vulnerable functions are 'defaultsDeep', 'merge', and 'mergeWith' which allow a malicious user to modify the prototype of Object via __proto__ causing the addition or modification of an existing property that will exist on all objects.",
      "recommendation": "Update to version 4.17.5 or later.",
      "references": "- [HackerOne Report](https://hackerone.com/reports/310443)",
      "access": "public",
      "severity": "low",
      "cwe": "CWE-471",
      "metadata": {
        "module_type": "",
        "exploitability": 1,
        "affected_components": ""
      },
      "url": "https://npmjs.com/advisories/577"
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
