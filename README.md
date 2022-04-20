# DeFi Wonderland Challenge

Ooooh no! Robert, our lead developer had an urgent flight and left us with an unfinished game.

Hey you, yes **YOU**, are you a developer?! Do you know some Solidity? Could you please help us finish this game?

This is the note he left us:

> Hey guys, sorry but I had an urgent thing to attend to with some ~~friends~~ family.
> The game is **almost** there but I didn't have time to test or organize the code properly. I also didn't have time to read the logic twice to see if I missed something.
>
> Oh, here's the status of the thingies we've discussed:
>
> - [x] EGGs should be ERC20 tokens
> - [x] EGGs should be indivisable
> - [x] ANTs should be ERC721 tokens (**NFTs**)
> - [x] Users can buy EGGs with ETH
> - [x] EGGs should cost 0.01 ETH
> - [x] An EGG can be used to create an ANT
> - [x] An ANT can be sold for less ETH than the EGG price
> - [x] Governance should be able to change the price of an egg
> - [x] Finish the e2e tests
>
> The following features we said they would be nice to have, but were not required, so i guess they're out of the equation for now...
>
> - [x] Ants should be able to create/lay eggs once every 10 minutes
> - [x] Ants should be able to randomly create multiple eggs at a time. The range of how many should be reasonable (0-20?)
> - [x] Ants have a % chance of dying when creating eggs
>
> I feel very proud of it, I can't wait to come back from ~~Ibiza~~ Mom's to play it!

Good news is that Robert implemented at least some of this before leaving:

ANT `ERC721` https://ropsten.etherscan.io/address/0x647Fdb71eEA4f9A94E14964C40027718C931bEe5#writeContract
EGG `ERC20`
https://ropsten.etherscan.io/address/0xFE17174Bca5168a5179AE8Df8f865DbF9c771776#code

### Assignment

We would need your help in finishing what Robert started. We hardly think he's going to come back soon, so we should start thinking on hiring somebody to cover his place.

Please fork or clone [Robert's Repo](https://github.com/Billy-103/ants-challenge) and as soon as you have gone through the code and implemented the changes you thought were appropiate along with the features, send it to us.

You will find a short guide with instructions to run this repo in the `README.md` file. If you have **any** question, please don't hesitate to contact us , we are here for that and we encourage it!

Just in case, Robert seemed a bit distracted when working on the game, it may be a good idea to take a close look at what he did. **There are more than 20 audited issues in the code he's made**, we would appreciate if you can spot them and deploy an improved version of it.

Best of lucks, and get ready to go fully anon and deep **down the rabbit hole**!

#

### Extra points

Oh! And send us as much ANTs as you can to 0x7D4BF49D39374BdDeB2aa70511c2b772a0Bcf91e, we are building an army!

#

### Running the repo

Here's a brief guide as to how run this repo.

- First, you can fork the repo, or clone it:

```
git clone https://github.com/Billy-103/ants-challenge
cd ants-challenge
yarn install
```

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

The verification of the contracts may take a couple of minutes, so be aware of that if it seems that your terminal got stuck.
