# Change Log

> All notable changes to this project will be documented in this file.
>
> The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.0.1] 2017-09-14
### Changed
- Now requires Node 8 or above. This makes the compiled code smaller and easier to debug, as it has real async functions and doesn't need runtime dependencies.
- Flow libdef now declares bertha-client as an ES6 module instead of a CommonJS one.

### Added
- Poller class.

## [4.0.0] – 2017-09-14
*Bad release*

## [3.0.0] – 2017-06-07
### Changed
- The object transform no longer coerces values to strings. So you can use Bertha's magic values like `"y"` (which becomes `true`), or specify your own [column transform](https://github.com/ft-interactive/bertha/wiki/Tutorial#column-transforms). This is a small but breaking change, hence the major version bump.

## [2.2.1] – 2017-06-05
### Changed
- Upgraded dependencies.

## [2.2.0] – 2017-06-05
### Added
- `createURL` function.
- This changelog.

[Unreleased]: https://github.com/Financial-Times/bertha-client/compare/v4.0.1...HEAD
[4.0.1]: https://github.com/Financial-Times/bertha-client/compare/v3.0.0...v4.0.1
[3.0.0]: https://github.com/Financial-Times/bertha-client/compare/v2.2.0...v3.0.0
[2.2.1]: https://github.com/Financial-Times/bertha-client/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/Financial-Times/bertha-client/compare/v2.1.0...v2.2.0
