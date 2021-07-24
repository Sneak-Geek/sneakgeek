#!/bin/bash

cd ../
yarn install --frozen-lockfile
IOS_VERSION_NUMBER=`node -e "const v=require('../../version.json');console.log(v.app.version)"`
IOS_BUILD_NUMBER=`node -e "const v=require('../../version.json');console.log(v.app.build)"`        
fastlane ios bump_version_number
fastlane ios bump_build_number
MATCH_PASSWORD=sneakgeek
FASTLANE_PASSWORD=