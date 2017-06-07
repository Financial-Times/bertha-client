# Change Log

> All notable changes to this project will be documented in this file.
>
> The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0]
### Changed
- The object transform no longer coerces values to strings. So you can use Bertha's magic values like `"y"` (which becomes `true`), or specify your own [column transform](https://github.com/ft-interactive/bertha/wiki/Tutorial#column-transforms). This is a small but breaking change, hence the major version bump.

## [2.2.1]
### Changed
- Upgraded dependencies

## [2.2.0]
### Added
- `createURL` function
- This changelog

---

> TODO: add earlier versions

[Unreleased]: https://github.com/Financial-Times/bertha-client/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/Financial-Times/bertha-client/compare/v2.2.0...v3.0.0
[2.2.1]: https://github.com/Financial-Times/bertha-client/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/Financial-Times/bertha-client/compare/v2.1.0...v2.2.0
