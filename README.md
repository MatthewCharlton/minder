# Audit CI
### A JavaScript module to fail builds if an NPM or Yarn audit fails
audit-ci is a wrapper for npm audit and yarn audit.<br>
You can configure audit-ci to call either package manager and 

**Usage**: audit-ci

You can create a config file called "audit-ci.config.json" to commit with your project. <br>
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
audit-ci-plugin.js <br>
```javascript
module.exports = function auditCIPlugin(data, config) {
  console.log(`Do something with: ${data} and ${config}`);
}
```
  
