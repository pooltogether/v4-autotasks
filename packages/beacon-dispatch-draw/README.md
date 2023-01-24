# `@pooltogether/v4-autotasks-beacon-dispatch-draw`

OpenZeppeling Defender autotask to dispatch the newest draw from a beacon chain to a receiver chain.

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
export RECEIVER_CHAIN_ID=
export RELAYER_API_KEY=
export RELAYER_API_SECRET=
```

Here are the currently deployed autotasks and their corresponding ID.

#### Testnet
##### Ethereum Goerli to Optimism Goerli

```
export AUTOTASK_ID=cd1f23a8-dc67-447a-827b-d7e67234534b
export CHAIN_ID=5
export RECEIVER_CHAIN_ID=420
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
