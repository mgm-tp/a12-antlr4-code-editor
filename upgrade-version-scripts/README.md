# Upgrade version script
### Description
This script is used for upgrading the A12 dependencies across this project.

### Usage
* Update the [version.json](./versions.json) file:
  * The `versions` property specifies the versions of the A12 components regarding the namespace of them
  * The `exceptions` property is for specifying the exceptions for some dependencies that doesn't follow the namespace versions
* Run the tool from the root of the project:
  * `yarn upgrade-a12`: Upgrade the versions but don't upgrade the peers dependencies versions
  * `yarn upgrade-a12-peers`: Upgrade the versions and the peers dependencies versions
