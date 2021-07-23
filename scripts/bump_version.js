const version = require("../version.json");
const { execute } = require("./util");
const flags = require("flags");
const fs = require("fs");

flags.defineString("type", "", "Release type, either \"service\" or \"app\"");
flags.parse();
const releaseType = flags.get("type");

if (releaseType !== "app" && releaseType !== "service") {
  console.error(`Wrong type input: ${releaseType}`);
  process.exit(1);
}

const releaseBaseVersion = "1.0";
const date = new Date();
const today = `${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate()}${date.getFullYear().toString().slice(2, 4)}`;
const commonVersion = `${releaseBaseVersion}.${today}`;

function increateVersionAndTag() {
  let curVer = version[releaseType].version; 
  if (releaseType === "app") {
    curVer = curVer.split(".")[2];
  }
  if (today === curVer) {
    version[releaseType].build += 1;
  } else {
    version[releaseType].build = 1;
  }
  releaseType === "app" ? version[releaseType].version = commonVersion : version[releaseType].version = today;
  return `${commonVersion}-${version[releaseType].build}-${releaseType}`;
}

async function main() {
  const tag = increateVersionAndTag();
  switch (releaseType) {
    case "app":
      await execute(`
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
  }
  const versionString = JSON.stringify(version, null, 2);
  fs.writeFileSync(`${process.cwd()}/version.json`, versionString);
  console.log(tag);
}

main();