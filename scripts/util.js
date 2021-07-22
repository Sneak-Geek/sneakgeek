const { execFile } = require("child_process");
const fs = require("fs");

function execute(command) {
    const script = "./util_execute";
    fs.writeFileSync(script, command);
    fs.chmodSync(script, 0755);

    execFile(script, (error, stdout, stderr) => {
        try {
            fs.unlinkSync(script);
        } catch (error) {

        }
        if (error) {
            console.error(stderr);
            console.error(error);
            throw error;
        }
        console.log(stdout);

    });
}

module.exports = { execute };