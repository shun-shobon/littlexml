# Changelog

## [0.6.2](https://github.com/shun-shobon/littlexml/compare/v0.6.1...0.6.2) (2023-12-19)


### Bug Fixes

* Exclude component name in release tag ([854898d](https://github.com/shun-shobon/littlexml/commit/854898ddd818fe43078d03009bcd0a9731e601df))

## [0.6.1](https://github.com/shun-shobon/littlexml/compare/littlexml-0.6.0...littlexml-0.6.1) (2023-12-19)


### Bug Fixes

* Exclude component name in release tag ([4dccacf](https://github.com/shun-shobon/littlexml/commit/4dccacf58712f4b7e2b87b361de3a6598c73a697))

## [0.6.0](https://github.com/shun-shobon/littlexml/compare/littlexml-v0.5.0...littlexml-0.6.0) (2023-12-19)


### ⚠ BREAKING CHANGES

* Migrate to bun
* **element.ts:** remove getters from Element class
* Strictify re-exporting

### Features

* Add indent ([478ea04](https://github.com/shun-shobon/littlexml/commit/478ea04029f8baee905f87ad5541c1dbe486bc7b))
* Add xml builder ([fd90598](https://github.com/shun-shobon/littlexml/commit/fd9059893e107f8ee931b09b9c294dc28c80a3b2))
* **element.ts:** allow adding multiple children to an element at once ([e8a0dc3](https://github.com/shun-shobon/littlexml/commit/e8a0dc32efb4da32d97045beef842fe702425d3b))
* **element.ts:** remove getters from Element class ([5667afd](https://github.com/shun-shobon/littlexml/commit/5667afd8c9e5aeb2480f3812f997a3c6d2af0dea))
* Initial commit ([f08eb31](https://github.com/shun-shobon/littlexml/commit/f08eb31fcdd731d763e445bcd03aca6d80ef5f77))
* Migrate to bun ([58ea2d8](https://github.com/shun-shobon/littlexml/commit/58ea2d846cb2b19e6770cb2cbde3280b025b0ff6))
* **render.ts:** add renderToIterator function to render XML to an iterable iterator of strings ([31c6f8f](https://github.com/shun-shobon/littlexml/commit/31c6f8f501fcaaf5d525d3c6efb1371b81d0eab2))
* **render.ts:** add renderToStream function to render an XML element to a ReadableStream ([e92bbcf](https://github.com/shun-shobon/littlexml/commit/e92bbcf2903e960b31e48d87b38830194be04649))
* **render.ts:** add support for encoding option ([5697fea](https://github.com/shun-shobon/littlexml/commit/5697fea6b583fc7f50ac23cf643bd92167c8062b))
* Strictify re-exporting ([a24efee](https://github.com/shun-shobon/littlexml/commit/a24efeebce86e34a10e3776ef22ef5c4b30db1b9))


### Bug Fixes

* **element.ts:** fix infinite recursion in attributes getter by returning private field #attributes instead of the getter function itself ([b483e75](https://github.com/shun-shobon/littlexml/commit/b483e75d172d78c0475e44ab4c964c98f228fae5))
* Fix npm build script ([d6dbd33](https://github.com/shun-shobon/littlexml/commit/d6dbd33c5ed3a0cb031ff0fca8f5d6ebdf3dcca8))
* Fix publish ci ([d744aac](https://github.com/shun-shobon/littlexml/commit/d744aac0c35ae80554cbcb36504bc2161950d307))
* **scripts:** add compilerOptions.lib to build_npm.ts script for support of browser ([b1c959b](https://github.com/shun-shobon/littlexml/commit/b1c959bfead7614362a83ad0280f227d399128b2))

## [0.5.0](https://github.com/shun-shobon/littlexml/compare/0.4.1...0.5.0) (2023-03-17)


### ⚠ BREAKING CHANGES

* **element.ts:** remove getters from Element class

### Features

* **element.ts:** remove getters from Element class ([5667afd](https://github.com/shun-shobon/littlexml/commit/5667afd8c9e5aeb2480f3812f997a3c6d2af0dea))
* **render.ts:** add support for encoding option ([5697fea](https://github.com/shun-shobon/littlexml/commit/5697fea6b583fc7f50ac23cf643bd92167c8062b))

## [0.4.1](https://github.com/shun-shobon/littlexml/compare/0.4.0...0.4.1) (2023-03-17)


### Bug Fixes

* **scripts:** add compilerOptions.lib to build_npm.ts script for support of browser ([b1c959b](https://github.com/shun-shobon/littlexml/commit/b1c959bfead7614362a83ad0280f227d399128b2))

## [0.4.0](https://github.com/shun-shobon/littlexml/compare/0.3.0...0.4.0) (2023-03-17)


### Features

* **render.ts:** add renderToIterator function to render XML to an iterable iterator of strings ([31c6f8f](https://github.com/shun-shobon/littlexml/commit/31c6f8f501fcaaf5d525d3c6efb1371b81d0eab2))
* **render.ts:** add renderToStream function to render an XML element to a ReadableStream ([e92bbcf](https://github.com/shun-shobon/littlexml/commit/e92bbcf2903e960b31e48d87b38830194be04649))

## [0.3.0](https://github.com/shun-shobon/littlexml/compare/0.2.0...0.3.0) (2023-03-17)


### Features

* **element.ts:** allow adding multiple children to an element at once ([e8a0dc3](https://github.com/shun-shobon/littlexml/commit/e8a0dc32efb4da32d97045beef842fe702425d3b))


### Bug Fixes

* **element.ts:** fix infinite recursion in attributes getter by returning private field #attributes instead of the getter function itself ([b483e75](https://github.com/shun-shobon/littlexml/commit/b483e75d172d78c0475e44ab4c964c98f228fae5))

## [0.2.0](https://github.com/shun-shobon/littlexml/compare/0.1.2...0.2.0) (2023-03-16)


### ⚠ BREAKING CHANGES

* Strictify re-exporting

### Features

* Strictify re-exporting ([a24efee](https://github.com/shun-shobon/littlexml/commit/a24efeebce86e34a10e3776ef22ef5c4b30db1b9))

## [0.1.2](https://github.com/shun-shobon/littlexml/compare/0.1.1...0.1.2) (2023-03-16)


### Bug Fixes

* Fix publish ci ([d744aac](https://github.com/shun-shobon/littlexml/commit/d744aac0c35ae80554cbcb36504bc2161950d307))

## [0.1.1](https://github.com/shun-shobon/littlexml/compare/0.1.0...0.1.1) (2023-03-16)


### Bug Fixes

* Fix npm build script ([d6dbd33](https://github.com/shun-shobon/littlexml/commit/d6dbd33c5ed3a0cb031ff0fca8f5d6ebdf3dcca8))

## 0.1.0 (2023-03-16)


### Features

* Add indent ([478ea04](https://github.com/shun-shobon/littlexml/commit/478ea04029f8baee905f87ad5541c1dbe486bc7b))
* Add xml builder ([fd90598](https://github.com/shun-shobon/littlexml/commit/fd9059893e107f8ee931b09b9c294dc28c80a3b2))
* Initial commit ([f08eb31](https://github.com/shun-shobon/littlexml/commit/f08eb31fcdd731d763e445bcd03aca6d80ef5f77))
