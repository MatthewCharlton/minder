# Auditor
### A JavaScript module to fail builds if an NPM or Yarn audit fails

Usage: auditor

You can create a config file to commit with your project. Must be named "auditor-config".
```javascript
{
  "severity": "critical",
  "package-manager": "yarn",
  "report": true,
  "html-report-filepath": "audit-reports/report.html",
  "registry": "https://registry.npmjs.org/"
}
```

Explaination of options:
severity: configure what severity you would like to fail on
package-manager: choose what pacakge manager audit endpoint to use
registry: choose what registry the audit payload will be sent to
report: choose to output a HTML report of the audit results
html-report-filepath: set a custom file name of HTML report, only applicable if "report" is set to true
audit-fail-build: sets the exit code to 1 when true or 0 when false

If no config file is passed then the following defaults will be used:
  "severity": "high"
  "package-manager": "npm"
  "registry": ""
  "report": false
  "html-report-filepath": ""
  "audit-fail-build": false
  
