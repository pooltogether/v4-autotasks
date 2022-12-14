# @pooltogether/v4-autotasks-draw-beacon

OpenZeppelin Defender autotask to start and complete a draw.

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

Here are the currently deployed autotasks and their corresponding ID.

#### Mainnet
##### Ethereum

```
export AUTOTASK_ID=aa31b5e6-b1fb-4975-9b2b-0f82ef39848e
export CHAIN_ID=1
```

##### Avalanche

```
export AUTOTASK_ID=2930275d-bc67-488a-9066-3326e3089c5e
export CHAIN_ID=43114
```

##### Polygon

```
export AUTOTASK_ID=fc1e3196-6429-4956-b74a-2f3b6e31487b
export CHAIN_ID=137
```

#### Testnet
##### Goerli

```
export AUTOTASK_ID=8363cd07-39b2-426a-a132-e3a1b842065f
export CHAIN_ID=5
```

##### Fuji

```
export AUTOTASK_ID=d777bb3a-ef92-4d6c-9af3-ab3e5b01ef04
export CHAIN_ID=43113
```

##### Mumbai

```
export AUTOTASK_ID=52587953-d1d2-4102-8357-3451d45021f8
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
