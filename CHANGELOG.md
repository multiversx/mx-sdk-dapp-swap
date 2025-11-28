# Change Log

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [[4.1.2](https://github.com/multiversx/mx-sdk-dapp-swap/pull/84)] - 2025-11-28

- [Added `enableProgressiveFetching` option to `useFilteredTokens`](https://github.com/multiversx/mx-sdk-dapp-swap/pull/83)
- [Added missing `client` option to `useSubscription`](https://github.com/multiversx/mx-sdk-dapp-swap/pull/82)

## [[4.1.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/81)] - 2025-11-25

- [Migrated sdk-dapp-utils to ^3.x](https://github.com/multiversx/mx-sdk-dapp-swap/pull/80)

## [[4.1.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/79)] - 2025-11-24

- [Migrated to sdk-dapp v5.3.3 and pnpm package manager](https://github.com/multiversx/mx-sdk-dapp-swap/pull/78)

## [[4.0.9](https://github.com/multiversx/mx-sdk-dapp-swap/pull/77)] - 2025-11-10

- [Implement customizable polling interval. Lowers default interval to 2s. Maintenance interval increased to 30s.](https://github.com/multiversx/mx-sdk-dapp-swap/pull/76)

## [[4.0.8](https://github.com/multiversx/mx-sdk-dapp-swap/pull/75)] - 2025-11-06

- [Implement subscriptions for token prices](https://github.com/multiversx/mx-sdk-dapp-swap/pull/46)

## [[4.0.7](https://github.com/multiversx/mx-sdk-dapp-swap/pull/74)] - 2025-10-02

- [Fixes swap route polling issue after form submission](https://github.com/multiversx/mx-sdk-dapp-swap/pull/73)

## [[4.0.6](https://github.com/multiversx/mx-sdk-dapp-swap/pull/72)] - 2025-07-25

- [Price impact improvements](https://github.com/multiversx/mx-sdk-dapp-swap/pull/71)

## [[4.0.5](https://github.com/multiversx/mx-sdk-dapp-swap/pull/70)] - 2025-07-23

- [Price impact refactor. Moves price deviation logic from dapp to package.](https://github.com/multiversx/mx-sdk-dapp-swap/pull/69)

## [[4.0.4](https://github.com/multiversx/mx-sdk-dapp-swap/pull/68)] - 2025-07-22

- [Wrapping fix](https://github.com/multiversx/mx-sdk-dapp-swap/pull/67)

## [[4.0.3](https://github.com/multiversx/mx-sdk-dapp-swap/pull/65)] - 2025-07-21

- [Removes sass. Fixes minimum received edge case. Enables tests](https://github.com/multiversx/mx-sdk-dapp-swap/pull/64)
- [Added swc and removed ts-jest to fix tests](https://github.com/multiversx/mx-sdk-dapp-swap/pull/63)

## [[4.0.2](https://github.com/multiversx/mx-sdk-dapp-swap/pull/60)] - 2025-07-17

- [Adds smart swap feature](https://github.com/multiversx/mx-sdk-dapp-swap/pull/59)

## [[4.0.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/58)] - 2025-07-14

- [Upgrade axios to 1.10.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/57)

## [[4.0.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/56)] - 2025-07-10

- [Upgrade sdk-dapp V5 to major version](https://github.com/multiversx/mx-sdk-dapp-swap/pull/55)

## [[4.0.0-alpha.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/54)] - 2025-07-04

- [Upgrade MVX packages. Fixes EGLD balance check](https://github.com/multiversx/mx-sdk-dapp-swap/pull/54)

## [[4.0.0-alpha.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/52)] - 2025-06-23

- [Upgrade sdk-dapp to v.5](https://github.com/multiversx/mx-sdk-dapp-swap/pull/51)
- [Moved sdk-dapp and sdk-core imports to the lib folder](https://github.com/multiversx/mx-sdk-dapp-swap/pull/50)

## [[3.0.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/48)] - 2025-03-27

- [Upgrade sdk-core to v.14](https://github.com/multiversx/mx-sdk-dapp-swap/pull/47)

## [[2.1.5](https://github.com/multiversx/mx-sdk-dapp-swap/pull/45)] - 2025-01-17

- [FIX: Swap route is defined when both inputs don't have amounts](https://github.com/multiversx/mx-sdk-dapp-swap/pull/44)

## [[2.1.4](https://github.com/multiversx/mx-sdk-dapp-swap/pull/43)] - 2025-01-14

- [Fixed swap calculation when first amount was entered before second token](https://github.com/multiversx/mx-sdk-dapp-swap/pull/42)

## [[2.1.3](https://github.com/multiversx/mx-sdk-dapp-swap/pull/41)] - 2024-12-04

- [Progressive Fetching for Tokens](https://github.com/multiversx/mx-sdk-dapp-swap/pull/40)

## [[2.1.2](https://github.com/multiversx/mx-sdk-dapp-swap/pull/39)] - 2024-11-12

- [Removed onlySafeTokens](https://github.com/multiversx/mx-sdk-dapp-swap/pull/39)

## [[2.1.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/37)] - 2024-10-24

- [Fixed tests](https://github.com/multiversx/mx-sdk-dapp-swap/pull/37)
- [Remove network-providers dependency](https://github.com/multiversx/mx-sdk-dapp-swap/pull/35)

## [[2.1.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/34)] - 2024-10-21

- [Upgrade sdk-dapp](https://github.com/multiversx/mx-sdk-dapp-swap/pull/31)

## [[2.0.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/33)] - 2024-10-18

- [Fixes balances not updating on authenticated change. Many other fixes.](https://github.com/multiversx/mx-sdk-dapp-swap/pull/32)

## [[1.8.4](https://github.com/multiversx/mx-sdk-dapp-swap/pull/30)] - 2024-10-09

- [Update isError flag on useQueryWrapper](https://github.com/multiversx/mx-sdk-dapp-swap/pull/29)

## [[1.8.3](https://github.com/multiversx/mx-sdk-dapp-swap/pull/28)] - 2024-10-08

- [Improve RouteError Handling](https://github.com/multiversx/mx-sdk-dapp-swap/pull/27)

## [[1.8.2](https://github.com/multiversx/mx-sdk-dapp-swap/pull/26)] - 2024-09-12

- [Fixes EGLD <-> WEGLD missing transactions](https://github.com/multiversx/mx-sdk-dapp-swap/pull/26)

## [[1.8.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/25)] - 2024-09-03

- [Adds price info](https://github.com/multiversx/mx-sdk-dapp-swap/pull/25)

## [[1.8.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/24)] - 2024-08-23

- [Disables polling when no amounts](https://github.com/multiversx/mx-sdk-dapp-swap/pull/23)

## [[1.7.9](https://github.com/multiversx/mx-sdk-dapp-swap/pull/22)] - 2024-06-03

- [Fixes amount parsing issue on token change](https://github.com/multiversx/mx-sdk-dapp-swap/pull/21)

## [[1.7.8](https://github.com/multiversx/mx-sdk-dapp-swap/pull/20)] - 2024-05-22

- [Adds amount required validation rule](https://github.com/multiversx/mx-sdk-dapp-swap/pull/19)

## [[1.7.7](https://github.com/multiversx/mx-sdk-dapp-swap/pull/18)] - 2024-05-21

- [Fixes validation rules](https://github.com/multiversx/mx-sdk-dapp-swap/pull/17)

## [[1.7.6](https://github.com/multiversx/mx-sdk-dapp-swap/pull/15)] - 2024-05-14

- [Adds price polling feature](https://github.com/multiversx/mx-sdk-dapp-swap/pull/14)
- [Preserve input values on login/logout](https://github.com/multiversx/mx-sdk-dapp-swap/pull/14)

## [[1.7.5](https://github.com/multiversx/mx-sdk-dapp-swap/pull/13)] - 2024-02-01

- [Added publish script next](https://github.com/multiversx/mx-sdk-dapp-swap/pull/13)

## [[1.7.4](https://github.com/multiversx/mx-sdk-dapp-swap/pull/12)] - 2024-02-01

- [Fixed network provider depnendencies](https://github.com/multiversx/mx-sdk-dapp-swap/pull/12)

## [[1.7.3](https://github.com/multiversx/mx-sdk-dapp-swap/pull/11)] - 2024-02-01

- [Regenerate yarn.lock](https://github.com/multiversx/mx-sdk-dapp-swap/pull/11)

## [[1.7.2](https://github.com/multiversx/mx-sdk-dapp-swap/pull/10)] - 2024-01-11

- [Upgrade sdks](https://github.com/multiversx/mx-sdk-dapp-swap/pull/9)

## [[1.7.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/6)] - 2023-01-09

- [Update sdk-dapp](https://github.com/multiversx/mx-sdk-dapp-swap/pull/6)

## [[1.7.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/5)] - 2023-12-21

- [Removed axios](https://github.com/multiversx/mx-sdk-dapp-swap/pull/4)

## [[1.6.1](https://github.com/multiversx/mx-sdk-dapp-swap/pull/3)] - 2023-12-11

- [Added ability to add additional validation rules](https://github.com/multiversx/mx-sdk-dapp-swap/pull/2)

## [[1.6.0](https://github.com/multiversx/mx-sdk-dapp-swap/pull/1)] - 2023-10-10

- [First sdk-dapp-swap public release](https://github.com/multiversx/mx-sdk-dapp-swap/pull/1)
