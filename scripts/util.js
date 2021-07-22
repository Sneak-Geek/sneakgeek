const { spawn } = require("child_process");

function execute(command) {
    const result = spawn(command);
    result.stdout.on("data", function (data) {
        console.log(data);
    });
    result.stderr.on("data", function (error) {
        console.error(error);
    });
    result.on("exit", function (code) {
        console.log(`Execute "${command}" exited with code ${code}`);
    })
}

module.exports = { execute };