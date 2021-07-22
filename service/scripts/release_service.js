const version = require("../../version.json");
const { execute } = require("../../scripts/util");

const backendVersion = `${version.service.version}-${version.service.build}`;
execute(`gcloud app deploy ./app-prod.yaml \
    --version=${backendVersion} \
    --no-cache --promote --verbosity=info --quiet \
    --account=${process.env.GAE_PROD_SERVICE_ACCOUNT} \
    --project=${process.env.PROD_PROJECT_ID}` 
);