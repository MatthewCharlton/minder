const https = require("https");

module.exports = (data, config) => {
  let body = "";
  return new Promise((resolve, reject) =>
    https
      .get("https://www.google.com/", res => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);

        res.on("data", d => {
          // process.stdout.write(d);
          body += d;
        });

        res.on("end", () => {
          console.log("body", body);
          resolve();
        });
      })
      .on("error", e => {
        console.error(e);
        reject();
      })
      .on("end", () => {
        console.log("body", body);
        resolve();
      })
  );
};
