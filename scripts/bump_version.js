const version = require("../version.json");
const { execute } = require("./util");
const flags = require("flags");
const fs = require("fs");

flags.defineString("type", "", "Release type, either \"service\" or \"app\"");
flags.parse();
const type = flags.get("type");

const releaseBaseVersion = "1.0";
const date = new Date();
const today = `${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate()}${date.getFullYear().toString().slice(2, 4)}`;
const commonVersion = `${releaseBaseVersion}.${today}`;

function increateVersionAndTag() {
    const curVer = version[type].version.split(".")[2];
    if (today === curVer) {
        version[type].build += 1;
    } else {
        version[type].build = 1;
    }
    type === "app" ? version[type].version = commonVersion : version[type].version = today;
    const gitClientTag = `${commonVersion}-${version.app.build}-${type}`;
    execute(`git tag ${gitClientTag}`);
}

function main() {
    increateVersionAndTag();
    switch (type) {
        case "app":
            execute(`
                cd ${process.cwd()}/client/app
                export IOS_VERSION_NUMBER=${version.app.version}
                export IOS_BUILD_NUMBER=${version.app.build}
                fastlane ios bump_version_number
                fastlane ios bump_build_number
            `);
            break;
        case "service":
            break;
        default:
            console.error("Invalid \"type\" flag, exit");
            process.exit(1);
            break;
    }
    const versionString = JSON.stringify(version, null, 2);
    fs.writeFile(`${process.cwd()}/version.json`, versionString, (err) => {
        if (err) {
            process.exit(1);
            console.error(err);
        }
    })
}

main();