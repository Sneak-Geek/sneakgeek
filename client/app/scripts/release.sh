#!/bin/bash

IOS_VERSION_NUMBER=`node -e "const v=require('../../version.json');console.log(v.app.version)"`
IOS_BUILD_NUMBER=`node -e "const v=require('../../version.json');console.log(v.app.build)"`
MATCH_PASSWORD=sneakgeek
APPSTORE_CONNECT_KEY_ID=
APPSTORE_CONNECT_ISSUER_ID=
fastlane ios bump_version_number
fastlane ios bump_build_number
fastlane ios archive_staging
fastlane ios distribute_staging_app_center