const { execFile } = require("child_process");
const fs = require("fs");

function execute(command) {
  return new Promise((resolve, reject) => {
    const script = "./util_execute";
    fs.writeFileSync(script, command);
    fs.chmodSync(script, 0755);

    execFile(script,
      {
        env: {
          PATH: process.env.PATH
        }
      },
      (error, stdout, stderr) => {
        try {
          fs.unlinkSync(script);
        } catch (error) { }
        if (error) {
          console.error(stderr);
          console.error(error);
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
  })
}

module.exports = { execute };