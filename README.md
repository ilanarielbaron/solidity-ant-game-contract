# Crypto Ants game

> - [x] EGGs should be ERC20 tokens
> - [x] EGGs should be indivisable
> - [x] ANTs should be ERC721 tokens (**NFTs**)
> - [x] Users can buy EGGs with ETH
> - [x] EGGs should cost 0.01 ETH
> - [x] An EGG can be used to create an ANT
> - [x] An ANT can be sold for less ETH than the EGG price
> - [x] Governance should be able to change the price of an egg
> - [x] Finish the e2e tests
> - [x] Ants should be able to create/lay eggs once every 10 minutes
> - [x] Ants should be able to randomly create multiple eggs at a time.
> - [x] Ants have a % chance of dying when creating eggs
>

ANT `ERC721` https://ropsten.etherscan.io/address/0x2FD41659678fC38D0f07b046091b98FBB018F0DC
EGG `ERC20`
https://ropsten.etherscan.io/address/0xb15473106aE57241E12D2bbCb8bE5596beCAb99D

### Running the repo

That should install all we need. What we need now is an API key from an RPC provider, so create an account in https://www.alchemy.com/ and grab generate an API key. Then you should create a `.env` file and complete it using the `.env.example` file we provide as as a guide.

We highly discourage using accounts that may hold ETH in mainnet, to avoid any unnecessary errors. So even if you have an ETH account, we recommend creating a new one in https://vanity-eth.tk/ for having an badass name like: 0xBadA55ebb20DCf99F56988d2A087C4D2077fa62d.

If you don't hold ETH in Ropsten, don't worry! People are very generous there, you can head to a faucet: https://faucet.ropsten.be/ and just ask for some! Crazy huh?

After you have your `.env` all set up, you're ready to go.

### Running the tests

```
yarn test
```

### Deploying the contracts

To deploy and verify the contracts, you can run:

```jsx
npx hardhat deploy --network <network_name>
```

We highly recommend passing in ropsten as the test network, like this:

```jsx
npx hardhat deploy --network ropsten
```
