module.exports = {
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "skipLegacyWorkersInjection": true,
  "apps": {
    "ios": {
      "type": "ios.app",
      "build": "export RCT_NO_LAUNCH_PACKAGER=true &&\
        xcodebuild\
        -workspace ios/app.xcworkspace\
        -scheme app-staging\
        -sdk iphonesimulator\
        -configuration Release\
        -derivedDataPath ios/build\
      ",
      "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/SneakGeek.app"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 12 Pro"
      }
    }
  },
  "configurations": {
    "ios": {
      "device": "simulator",
      "app": "ios"
    }
  }
}