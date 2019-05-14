# Minder

### Track third-party packages with security issues before they make it into production

_minder_ is a wrapper for npm audit and yarn audit.<br>
You can configure _minder_ to call either npm or yarn audit and set it to fail CI builds if the audit finds packages with security issues matching your specified severity level. <br>
You can also output the results to an HTML report.

**Usage**: minder

You can create a config file called "minder.config.json" to commit with your project. <br>
Example: <br>

```javascript
{
  "severity": "critical",
  "package-manager": "npm",
  "report": true,
  "html-report-filepath": "audit-reports/report.html",
  "registry": "https://registry.npmjs.org/"
}
```

**Explaination of options:** <br>
severity: configure what severity you would like to fail on <br>
package-manager: choose what pacakge manager audit endpoint to use <br>
registry: choose what registry the audit payload will be sent to <br>
report: choose to output a HTML report of the audit results <br>
html-report-filepath: set a custom file name of HTML report, only applicable if "report" is set to true <br>
audit-fail-build: sets the exit code to 1 when true or 0 when false <br>

If no config file is passed then the following defaults will be used: <br>
"severity": "critical" <br>
"package-manager": "npm" <br>
"registry": "" <br>
"report": false <br>
"html-report-filepath": "" <br>
"audit-fail-build": false <br>

**Add plugin** <br>
minder-plugin.js <br>

```javascript
module.exports = function auditCIPlugin(data, config) {
  console.log(`Do something with: ${data} and ${config}`);
};
```
