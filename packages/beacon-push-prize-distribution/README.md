# @pooltogether/v4-autotasks-beacon-push-prize-distribution

OpenZeppelin Defender autotask to lock draw and push prize pool network TVL.

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
export CHAIN_ID=
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

#### Testnet

##### Ethereum Goerli

```
export AUTOTASK_ID=
export CHAIN_ID=5
```

##### Polygon Mumbai

```
export AUTOTASK_ID=
export CHAIN_ID=80001
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
