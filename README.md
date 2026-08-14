# sdk-dapp-swap

> A library to hold the main logic for swapping between tokens on the MultiversX blockchain

[![NPM](https://img.shields.io/npm/v/@multiversx/sdk-dapp-swap.svg)](https://www.npmjs.com/package/@multiversx/sdk-dapp-swap) [![License: GPL-3.0-or-later](https://img.shields.io/npm/l/@multiversx/sdk-dapp-swap.svg)](#license)

# Installation

```bash
npm install @multiversx/sdk-dapp-swap
```

or

```bash
pnpm add @multiversx/sdk-dapp-swap
```

or

```bash
yarn add @multiversx/sdk-dapp-swap
```

## Peer dependencies

The following packages are expected to be installed by the consuming application:

| Package | Range |
| --- | --- |
| `react` / `react-dom` | `>=18` |
| `@apollo/client` | `^3.14.1` |
| `graphql` | `>=16.9.0` |
| `graphql-ws` | `^6.0.3` |
| `@multiversx/sdk-core` | `^14.0.0 \|\| ^15.0.0` |
| `@multiversx/sdk-dapp` | `^5.x` |
| `bignumber.js` | `^9.x` |

The package ships both ESM (`dist/` root) and CommonJS (`dist/__commonjs/`) builds as one file per
module, so bundlers can tree-shake it without any `optimizeDeps` configuration.

# Usage

sdk-dapp-swap proposes to simplify the process of implementing the swap functionality on MultiversX, providing easy to use utility functions and hooks for a specific application.

## Prerequisites

There are a couple of requirements that need to be met for the application to work properly.

**_If you experience bugs, please make sure that you read these, before opening an issue_**

<details>
  <summary>
      React
  </summary>

### React

This library was built for applications that use React, it might not be suitable for usage with other libraries or frameworks.

  </details>

<details>
  <summary>
    SwapAuthorizationProvider
 </summary>

### SwapAuthorizationProvider

You need to wrap your application with the **SwapAuthorizationProvider** component, which is exported by the library, as we need to create a global Context to be able to manipulate the data.

- import the Provider:

```typescript
import { SwapAuthorizationProvider } from '@multiversx/sdk-dapp-swap/components/SwapAuthorizationProvider/SwapAuthorizationProvider';
or;
import { SwapAuthorizationProvider } from '@multiversx/sdk-dapp-swap/components';
```

- Wrap your application with this Provider.

```jsx
<SwapAuthorizationProvider
    accessToken={accessToken}
    graphQLAddress={network.graphQlAddress}
    getAuthorizationHeaders={getAuthorizationHeaders} // optional
>
```

`graphQLAddress` is a required key that is needed to tell the Apollo Client on what graphQL address it should send the requests. Accepted values are any url string as well as the xExchange GraphQL service environment based endpoint (provided in `SwapGraphQLAddressEnum`).

`accessToken` is the accessToken mandatory for authorizing the requests.

SwapAuthorizationProvider also accepts an optional `getAuthorizationHeaders` async function that returns the headers object that will be provided on each request.
This allows the user to specify extra rules for the authorization of the requests.
`getAuthorizationHeaders` accepts the `requestParams` parameter which is of type `AuthorizationHeadersRequestParamsType` (also exported from the package).

  </details>

# Hooks

This area covers the hooks required to implement a basic swap functionality.

These hooks are exposed as named exports, which can be imported from sdk-dapp-swap.

```typescript
import { useFilteredTokens } from '@multiversx/sdk-dapp-swap/hooks';
or;
import { useFilteredTokens } from '@multiversx/sdk-dapp-swap/hooks/useFilteredTokens';

const {
  tokens,
  refetch,
  getTokens,
  swapConfig,
  wrappedEgld,
  isTokensError,
  isTokensLoading,
  totalTokensCount
} = useFilteredTokens(options);
```

The useFilteredTokens hook returns the state of the tokens based on whether you are authenticated or not. This hook accepts the `options` object in case the user wants to provide extra variables information for the query (see GetTokensType type).

```typescript
import { useSwapRoute } from '@multiversx/sdk-dapp-swap/hooks';
or;
import { useSwapRoute } from '@multiversx/sdk-dapp-swap/hooks/useSwapRoute';

// reduces load on the microservice side by not querying transactions if the user does not have enough balance for the swap
const [hasEnoughBalance, setHasEnoughBalance] = useState(false);

const {
  swapRoute,
  getSwapRoute,
  swapActionType,
  swapRouteError,
  isAmountInLoading,
  isSwapRouteLoading,
  isAmountOutLoading
} = useSwapRoute({
  wrappedEgld,
  hasEnoughBalance,
  isPollingEnabled: true
});
```

The useSwapRoute hook returns the swapRoute required to compute the informations regarding both tokens provided in the fields. This hook accepts 2 optional parameters: `wrappedEgld` EsdtType object and a boolean parameter called `isPollingEnabled` to decide if the query should have polling or not.

```typescript
import { useSwapFormHandlers } from '@multiversx/sdk-dapp-swap/hooks';
or;
import { useSwapFormHandlers } from '@multiversx/sdk-dapp-swap/hooks/useSwapFormHandlers';

const {
  firstToken,
  firstAmount,
  secondToken,
  secondAmount,
  activeRoute,
  handleOnChangeFirstAmount,
  handleOnChangeSecondAmount,
  handleOnChangeFirstSelect,
  handleOnChangeSecondSelect,
  handleOnChangeSwapRoute,
  handleOnFirstMaxBtnChange,
  handleSwitchTokens
} = useSwapFormHandlers({
  getSwapRoute,
  tolerancePercentage
});

useMemo(() => {
  setHasEnoughBalance(
    getHasEnoughBalance({ token: firstToken?.token, amount: firstAmount })
  );
}, [firstToken?.token, firstAmount]);
```

The useSwapFormHandlers hook returns the state of both the tokens and amounts, as well as the callbacks required for the inputs, selects, the maximum amount button and the button that triggers both tokens to switch. This hook accepts a mandatory parameter called `getSwapRoute` which is a function that comes from useSwapRoute (see useSwapRoute for reference) and an optional `tolerancePercentage`, which is the tolerance of the user account.

```typescript
import { useSwapInfo } from '@multiversx/sdk-dapp-swap/hooks';
or;
import { useSwapInfo } from '@multiversx/sdk-dapp-swap/hooks/useSwapInfo';

const {
  tokenInId,
  tokenOutId,
  exchangeRate,
  pricesImpact,
  totalTransactionsFee,
  minimumAmountReceived,
  exchangeRateUsdValue,
  switchTokensDirection
} = useSwapInfo({
  tolerance,
  activeRoute,
  firstToken,
  firstAmount,
  secondToken,
  secondAmount,
  swapActionType
});
```

The useSwapInfo hook provides all the informations regarding the swap route, like exchange rate, details about fees, minimum amount received etc. This hook accepts a couple of parameters that implies both tokens and amounts, as well as the active swap route and account tolerance.

```typescript
import { useSwapValidationSchema } from '@multiversx/sdk-dapp-swap/validation/hooks';
or;
import { useSwapValidationSchema } from '@multiversx/sdk-dapp-swap/validation/hooks/useSwapValidationSchema';

const validationSchema = useSwapValidationSchema({
  firstToken,
  secondToken,
  minAcceptedAmount: minSwapAmount
});
```

The useSwapValidationSchema hook provides the validation schema in order to facilitate a proper swap. This schema provides rules like insufficient balance, token / minimum token required etc. This hook accepts 2 mandatory `firstToken` and `secondToken` parameters, as well as an optional number called `minAcceptedAmount` which is the minimum amount required for the validation schema.

It returns a [yup](https://github.com/jquense/yup) `ObjectSchema` (yup 1.x), ready to be passed to Formik's `validationSchema`. Extra rules can be appended per field through the optional `firstTokenValidations` / `secondTokenValidations` parameters, each an array of `{ name, message, test }` objects:

```typescript
const validationSchema = useSwapValidationSchema({
  firstToken,
  secondToken,
  firstTokenValidations: [
    {
      name: 'maxAmount',
      message: 'Amount too large',
      test: (amount?: string) => Number(amount ?? 0) <= 100
    }
  ]
});
```

# sdk-dapp-swap exports

We recommend to import everything from its own file, in this way you won't be stressed about importing unused code.

You can either go into their specific folder in the module for extra trimming, or import everything together.

for example, these 2 imports are both valid:

```typescript
import {
  useSwapRoute,
  useSwapFormHandlers
} from '@multiversx/sdk-dapp-swap/hooks';
```

and

```typescript
import { useSwapRoute } from '@multiversx/sdk-dapp-swap/hooks/useSwapRoute';
import { useSwapFormHandlers } from '@multiversx/sdk-dapp-swap/hooks/useSwapFormHandlers';
```

## constants exports

```typescript
import {
  FIXED_INPUT,
  FIXED_OUTPUT,
  EGLD_IDENTIFIER,
  DIGITS,
  MIN_EGLD_DUST,
  POLLING_INTERVAL
} from '@multiversx/sdk-dapp-swap/constants/general';
```

## hooks exports

```typescript
import {
  usePrevious,
  useWrapEgld,
  useSwapInfo,
  useSwapRoute,
  useUnwrapEgld,
  useQueryWrapper,
  useIsPageVisible,
  useFilteredTokens,
  useRateCalculator,
  useLazyQueryWrapper,
  useSwapFormHandlers,
  useInputAmountUsdValue,
  useFetchMaintenanceFlag,
  useIntersectionObserver,
  useTokenPriceSubscription
} from '@multiversx/sdk-dapp-swap/hooks';
```

## utils exports

```typescript
import {
  roundAmount,
  removeCommas,
  getPriceImpact,
  canParseAmount,
  getTokenRoutes,
  getPriceImpacts,
  mergeTokenArrays,
  getTokenDecimals,
  getTransactionFee,
  getSwapActionType,
  getTokensFromPairs,
  translateSwapError,
  getBalanceMinusDust,
  getHasEnoughBalance,
  meaningfulFormatAmount,
  calculateMinimumReceived,
  createTransactionFromRaw,
  getSortedTokensByUsdValue,
  calculateSwapTransactionsFee,
  getCorrectAmountsOnTokenChange
} from '@multiversx/sdk-dapp-swap/utils';
```

### components exports

```typescript
import {
  SwapForm,
  SelectOption,
  TokenSelect,
  SwapAuthorizationProvider
} from '@multiversx/sdk-dapp-swap/components';
```

## Development

Requires Node >= 24 and pnpm.

```bash
pnpm install
pnpm build   # full ESM + CJS build, and the primary typecheck gate
pnpm test
pnpm lint
```

[AGENTS.md](./AGENTS.md) documents the repository layout, architecture, conventions, the build
output contract, and the verification steps expected before a change is published.

## Roadmap

See the [open issues](https://github.com/multiversx/mx-sdk-dapp-swap/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Before opening the pull request, run `pnpm build`, `pnpm test` and `pnpm lint`, and add a
`CHANGELOG.md` entry describing the change.

## License

GPL-3.0-or-later
