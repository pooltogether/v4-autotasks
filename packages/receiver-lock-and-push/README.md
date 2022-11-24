# @pooltogether/v4-autotasks-receiver-lock-and-push

OpenZeppelin Defender autotask to lock draw and push prize pool network TVL on L2s.

## Development

### Env

We use [direnv](https://direnv.net) to manage environment variables. You'll likely need to install it.

Copy `.envrc.example` and write down the env variables needed to run this project.
```
cp .envrc.example .envrc
```

Once your env variables are setup, load them with:
```
direnv allow
```

### Autotasks

Depending on which autotask you wish to update, you need to set the following env variables:

```
export AUTOTASK_ID=
export RECEIVER_CHAIN_ID=
export RELAYER_API_KEY=
export RELAYER_API_SECRET=
```

The following env variables are needed if you wish to run the autotask locally:
```
# Mainnet
export ETHEREUM_MAINNET_PROVIDER_URL=
export AVALANCHE_MAINNET_PROVIDER_URL=
export OPTIMISM_MAINNET_PROVIDER_URL=
export POLYGON_MAINNET_PROVIDER_URL=

# Testnet
export ETHEREUM_GOERLI_PROVIDER_URL=
export ARBITRUM_GOERLI_PROVIDER_URL=
export AVALANCHE_FUJI_PROVIDER_URL=
export OPTIMISM_GOERLI_PROVIDER_URL=
export POLYGON_MUMBAI_PROVIDER_URL=
```

Here are the currently deployed autotasks and their corresponding ID.

#### Mainnet
##### Avalanche

```
export AUTOTASK_ID=7fd3321b-bd15-4c3d-96a3-ab515d7e9933
export RECEIVER_CHAIN_ID=43114
```

##### Optimism

```
export AUTOTASK_ID=bd7296c4-2f1d-4e8c-b678-6274320fb802
export RECEIVER_CHAIN_ID=10
```

##### Polygon

```
export AUTOTASK_ID=d4d2473e-cdab-495d-9e9e-eb4645911868
export RECEIVER_CHAIN_ID=137
```

#### Testnet
##### Avalanche Fuji

```
export AUTOTASK_ID=222891ef-ef3f-454c-8011-648a8a908347
export RECEIVER_CHAIN_ID=43113
```

##### Arbitrum Goerli

```
export AUTOTASK_ID=ec3355b4-197c-41a5-b03a-1e5909c36fab
export RECEIVER_CHAIN_ID=421613
```

##### Optimism Goerli

```
export AUTOTASK_ID=5323ff16-83e3-47cf-82e5-5a7b0e6a1b38
export RECEIVER_CHAIN_ID=420
```

##### Polygon Mumbai

```
export AUTOTASK_ID=28c8e065-0cac-4387-a49d-bf0247a8d495
export RECEIVER_CHAIN_ID=80001
```

### Run autotask

To run the autotask locally, run:

```
npm start
```

### Update autotask

To update the autotask, run:

```
npm run update
```
