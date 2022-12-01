# @pooltogether/v4-autotasks-draw-lock-and-push

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
##### Ethereum

```
export AUTOTASK_ID=c2f332a6-c1fd-42fd-8503-1e5cfdeca860
export CHAIN_ID=1
```

##### Polygon

```
export AUTOTASK_ID=8b0e9303-1d48-4801-8727-7e61c853a711
export CHAIN_ID=137
```

#### Testnet
##### Goerli

```
export AUTOTASK_ID=7f3c5e7d-5712-47f6-bafd-70a292749d90
export CHAIN_ID=5
```

##### Fuji

```
export AUTOTASK_ID=7a13c144-b126-4f63-bea5-d7b98ede3a6a
export CHAIN_ID=43113
```

##### Mumbai

```
export AUTOTASK_ID=d4ac0479-0f6d-4d72-979b-a3252db0679d
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

