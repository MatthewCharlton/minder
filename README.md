# Minder

A Node application to audit project dependencies with security issues before they make it into production

## Overview

**minder** is a wrapper for `npm audit` and `yarn audit`.<br>
You can configure **minder** to call either `npm audit` or `yarn audit` and set it to fail CI builds or a pre-commit hook if the audit finds packages with security issues matching your configured severity level. <br>
You can also output the results to an HTML report courtesy of [npm-audit-html](https://github.com/eventOneHQ/npm-audit-html) and [yarn-audit-html](https://github.com/davityavryan/yarn-audit-html).

### Getting Started

**Usage**: minder

You can create a config file to commit with your project. **minder** looks for a file named `minder.config.json` in the current working directory from which the script was called. <br>
Example: <br>

```javascript
{
  "severity": "high",
  "report": true,
  "html-report-filepath": "audit-report.html",
  "registry": "https://registry.npmjs.org/",
  "whitelisted-advisories": ["803"]
}
```

### Explaination of options

| Option                 | Description                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| severity               | configure what severity you would like to fail on. Must be one of: "info", "low", "moderate", "high" or "critical" |
| package-manager        | choose what package manager audit endpoint to use. Must be one of: "npm" or "yarn"                                 |
| registry               | choose what registry URL the audit payload will be sent to                                                         |
| report                 | choose to output a HTML report of the audit results. Must be one of: `true` or `false`                             |
| html-report-filepath   | set a custom file name of HTML report, only applicable if "report" is set to true                                  |
| audit-fail-build       | sets the exit code to 1 when true or 0 when false. Must be one of: `true` or `false`                               |
| whitelisted-advisories | array of advisory IDs to allow/ignore. Must be an array of strings                                                 |

If no config file is passed then the following defaults will be used:

| Option                 | Default value |
| ---------------------- | ------------- |
| severity               | "critical"    |
| package-manager        | "npm"         |
| registry               | ""            |
| report                 | false         |
| html-report-filepath   | ""            |
| audit-fail-build       | false         |
| whitelisted-advisories | []            |

### Add a plugin

You can also extend functionality by writing your own plugin. **minder** looks for a file named `minder-plugin.js` in the current working directory from which the script was called. <br>
The audit response is passed as the first parameter and the config overrides as the second. <br>

Example:

```javascript
module.exports = function minderPlugin(data, config) {
  console.log(`Do something with: ${data} and ${config}`);
};
```

## Built With

- [npm-audit-html](https://github.com/eventOneHQ/npm-audit-html) - NPM Audit HTML Report Generator
- [yarn-audit-html](https://github.com/davityavryan/yarn-audit-html) - Yarn Audit HTML Report Generator
- [npm-run](https://github.com/timoxley/npm-run) - Runs locally-installed node module executables. Used to trigger the HTML Reports

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
