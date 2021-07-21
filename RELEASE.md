# Release flow for SneakGeek

## App release
App release for Staging should be tagged and uploaded to AppCenter. The kickoff app release pipeline on Github actions include:
- Run script to increment app version
- Tag a branch with `${app-version}.(${app-build-number})-client`
- Commit version to repository
- Build and deploy app to appcenter
- Send email to testers once completed

## Service release
- Run script to increment service version
- Tag a branch with `${service-version}.(${app-build-number})-service`
- Commit version to repository
- Build and deploy to GAE with version specified