# Changelog

## [7.0.0 / 2026-04-28]
### Changed
* Migrate from `ts-node` to `tsx` for running theming task

## [6.2.1 / 2026-04-13]
### Changed
* OpenSource clean up

## [6.2.0 / 2026-01-07]
### Changed
* Cleanup build script and unwanted content

## [6.1.0 / 2025-09-04]
### Changes
* Upgrade rimraf and clean script

## [6.0.1 / 2025-08-06]
No changes

## [6.0.0 / 2025-05-14]
### Breaking changes
* Upgrade `@com.mgmtp.a12.devtools/devtools` to version `9.0.0` and `antlr4` to version `4.13.2`

## [5.1.0 / 2025-01-15]
### Changed
* Support passing gradle wrapper executable path

## [5.0.0 / 2024-05-10]
### Breaking changes
* The tool required Gradle >= 7.x

### Bug fixes
* Fix resolving path on Windows
* Fix resolving tsconfig from A12 devtools

### Changed
* Support Node 18
* Upgrade `antlr4` to version `4.13.1`

## [4.0.0 / 2023-07-10]
### Breaking changes
* Upgrade `antlr4` to version `4.13.0`. Javascript target is replaced by Typescript target.

## [3.0.0 / 2023-03-29]
### Breaking changes
* Updated the package group name from `@com.mgmtp.a12addons/antlr4-build-tool` to `@com.mgmtp.a12.antlrcodeeditor/antlrcodeeditor-build-tool` and publish artifacts under A12 group

## [2.2.0 / 2022-11-15]
Nothing changed

## [2.1.0 / 2022-07-12]
Nothing changed

## 2.0.1 / 2022-04-19
### Changed
* Move `@babel/core`, `@babel/node`, `@babel/preset-env` from `devDependencies` to `dependencies`

## [2.0.0 / 2022-04-06]
### Breaking changes
* Upgrade `antlr4` to version `4.9.3`. The js generated code is now using ES6 syntax

### Added
* Use `babel-node` to run js code with ES6 syntax in node cli

## [1.5.0 / 2022-02-15]
Nothing changed

## [1.4.0 / 2021-11-16]
Nothing changed

## [1.3.0 / 2021-08-16]
Nothing changed

## [1.2.0 / 2021-04-16]
Nothing changed

## [1.1.0 / 2020-12-22]
Nothing changed

## [1.0.0 / 2020-08-25]
Nothing changed

## [0.8.0 / 2020-08-07]
### Added
* New parameter `--init-script`/`-I` to pass the gradle initialization scripts
### Changed
* CLI now requires global Gradle 3.5 to 6.5 to work normally

### Bug fixes
* Wrong generated js path fails the build

## [0.7.0 / 2020-06-08]
### Added
* CLI for build-tool

### Changed
* Release the first version on Artifactory
* Type-safe for generated Lexer and Parser

The migration steps are described under the 
[release page]
