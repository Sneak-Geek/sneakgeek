const version = require("../version.json");
const { execute } = require("./util");
const flags = require("flags");
const fs = require("fs");

flags.defineString("type", "", "Release type, either \"service\" or \"app\"");
flags.parse();
const releaseType = flags.get("type");

if (!["app", "service", "cms"].some(t => t === releaseType)){
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
  const versionString = JSON.stringify(version, null, 2);
  fs.writeFileSync(`${process.cwd()}/version.json`, versionString);
  console.log(tag);
}

main();