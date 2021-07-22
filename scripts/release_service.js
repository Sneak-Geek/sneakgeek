const version = require("../version.json");
const { execute } = require("./util");

const backendVersion = `${version.service.version}-${version.service.build}-service`;
execute(`gcloud app deploy ./app-prod.yaml
    --version=${backendVersion}
    --no-cache --promote --verbosity=info --quiet
    --account=${process.env.GAE_PROD_SERVICE_ACCOUNT}
    --project=${process.env.PROD_PROJECT_ID}`,
    (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
        }
        console.log(stdout);
        console.error(stderr);
    }
);