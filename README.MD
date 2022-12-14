# Boilerplate smart contract for a decentralized NFT Marketplace 

## Here are a few Open source projects we are proposing 
 - Identity decentralization using blockchain
 - Decentralized experience aggregation system

Jump on the discussion (https://github.com/M-Marcel/NFT--Marketplace/discussions) as we decide on which to start.



- [Hardhat NFT Marketplace](#hardhat-nft-marketplace)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
  - [Typescript](#typescript)
    - [Optional Gitpod](#optional-gitpod)
- [Usage](#usage)
  - [Testing](#testing)
- [Deployment to a testnet or mainnet](#deployment-to-a-testnet-or-mainnet)
- [Thank you!](#thank-you)


# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to install it with `npm`

## Quickstart

```
git clone https://github.com/M-Marcel/NFT--Marketplace
cd NFT--Marketplace
yarn
```

### Optional Gitpod

If you can't or don't want to run and install locally, you can work with this repo in Gitpod. If you do this, you can skip the `clone this repo` part.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#github.com/M-Marcel/NFT--Marketplace)


# Usage

Deploy:

```
yarn hardhat deploy
```

## Testing

```
yarn hardhat test
```



# Deployment to a testnet or mainnet

1. Setup environment variabltes

You'll want to set your `KOVAN_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `KOVAN_RPC_URL`: This is url of the kovan testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy.

```
yarn hardhat deploy --network kovan
```


# Thank you!

If you appreciated this, feel free to follow me or donate!

ETH/Polygon/Avalanche/etc Address: 0x39d366c9D9A35BB0A01a27AF1e817Ee96b11d820

[![Marcellus Nwankwo Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/Marcel_di_Maria)
[![Marcellus Nwankwo Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marcellus-nwankwo/)

1. Instead of reading from Moralis, we will 
  1. Index them with TheGraph
  2. Read from the graph