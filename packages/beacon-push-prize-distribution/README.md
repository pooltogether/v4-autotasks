# @pooltogether/v4-autotasks-beacon-push-prize-distribution

OpenZeppelin Defender autotask to push Prize Distribution onto the PrizeDistributionBuffer once the Draw has been computed.

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
export AUTOTASK_ID=7d226540-b3d1-4dd5-93d7-9e01c989a1ab
export CHAIN_ID=1
```

##### Avalanche

```
export AUTOTASK_ID=da814bdc-0779-4905-a80a-35b5ce9f40b2
export CHAIN_ID=43114
```

##### Optimism

```
export AUTOTASK_ID=284eb751-32e5-4f3d-aa30-12a888d52dc8
export CHAIN_ID=10
```

##### Polygon

```
export AUTOTASK_ID=b984446b-fed6-4385-b0ff-7d96d8891063
export CHAIN_ID=137
```

#### Testnet
##### Goerli

```
export AUTOTASK_ID=b3edadf2-9391-469e-8e62-c014ee86eac2
export CHAIN_ID=5
```

##### Fuji

```
export AUTOTASK_ID=8b901546-e61e-4d41-bf86-0f9c2195c945
export CHAIN_ID=43113
```

##### Optimism Goerli

```
export AUTOTASK_ID=77bff4ba-269d-4f42-9356-6654fc8f5c37
export CHAIN_ID=420
```

##### Mumbai

```
export AUTOTASK_ID=eab9907d-ea60-42c4-a320-d0f97e92c9a2
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
