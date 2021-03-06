import { expect } from 'chai';
import { ethers } from 'hardhat';
import { utils } from 'ethers';
import { CryptoAnts, CryptoAnts__factory, Egg, Egg__factory } from '@typechained';
import { evm } from '@utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { advanceTime, advanceTimeAndBlock, advanceToTimeAndBlock } from '@utils/evm';

const FORK_BLOCK_NUMBER = 11298165;

describe('CryptoAnts', function () {
  // signers
  let deployer: SignerWithAddress;
  let randomUser: SignerWithAddress;

  // factories
  let cryptoAntsFactory: CryptoAnts__factory;
  let eggFactory: Egg__factory;

  // contracts
  let cryptoAnts: CryptoAnts;
  let egg: Egg;

  // misc
  let eggPrecalculatedAddress: string;
  let snapshotId: string;

  before(async () => {
    // forking mainnet
    await evm.reset({
      jsonRpcUrl: process.env.RPC_ROPSTEN,
      blockNumber: FORK_BLOCK_NUMBER,
    });

    // getting signers with ETH
    [, deployer, randomUser] = await ethers.getSigners();

    // precalculating egg's contract address as both cryptoAnts' contract and Eggs' contract depend on
    // one another
    const currentNonce = await ethers.provider.getTransactionCount(deployer.address);
    eggPrecalculatedAddress = utils.getContractAddress({ from: deployer.address, nonce: currentNonce });

    // deploying contracts
    cryptoAntsFactory = (await ethers.getContractFactory('CryptoAnts')) as CryptoAnts__factory;
    cryptoAnts = await cryptoAntsFactory.deploy(eggPrecalculatedAddress);
    eggFactory = (await ethers.getContractFactory('Egg')) as Egg__factory;
    egg = await eggFactory.connect(deployer).deploy(cryptoAnts.address);

    // snapshot
    snapshotId = await evm.snapshot.take();
  });

  beforeEach(async () => {
    await evm.snapshot.revert(snapshotId);
  });

  it('should only allow the CryptoAnts contract to mint eggs', async () => {
    await expect(egg.mint(randomUser.address, 1)).to.be.revertedWith('Unauthorized');
  });

  it('should buy an egg and create a new ant with it', async () => {
    await cryptoAnts.buyEggs(1);
    await expect(cryptoAnts.createAnt()).to.emit(cryptoAnts, 'AntCreated');
    const antsCreated = await cryptoAnts.antsCreated();
    expect(antsCreated).to.be.equal(1);
  });

  it('should send funds to the user who sells an ant', async () => {
    const cryptoAntsContract = cryptoAnts.connect(randomUser);
    await cryptoAntsContract.buyEggs(1, { value: ethers.utils.parseEther('0.1') });
    await cryptoAntsContract.createAnt();
    const initialBalance = await randomUser.getBalance();
    await cryptoAntsContract.sellAnt(1);
    const finalBalance = await randomUser.getBalance();
    expect(Number(ethers.utils.formatUnits(finalBalance.sub(initialBalance)))).to.be.greaterThan(0);
  });

  it('should burn the ant after the user sells it', async () => {
    const cryptoAntsContract = cryptoAnts.connect(randomUser);
    await cryptoAntsContract.buyEggs(1, { value: ethers.utils.parseEther('0.1') });
    await cryptoAntsContract.createAnt();
    expect(await cryptoAntsContract.balanceOf(randomUser.address)).to.be.equal(1);
    await cryptoAntsContract.sellAnt(1);
    expect(await cryptoAntsContract.balanceOf(randomUser.address)).to.be.equal(0);
  });

  /*
    This is a completely optional test.
    Hint: you may need advanceTimeAndBlock (from utils) to handle the egg creation cooldown
  */
  it('should be able to create a 100 ants with only one initial egg', async () => {
    const cryptoAntsContract = cryptoAnts.connect(randomUser);
    await cryptoAntsContract.buyEggs(1, { value: ethers.utils.parseEther('0.1') });
    await cryptoAntsContract.createAnt();
    for (let i = 1; i < 101; i++) {
      const transaction = await cryptoAntsContract.createEgg(i);
      let antAlive = i;
      while (Number(await cryptoAntsContract.antToOwner(antAlive)) === 0) {
        if (i === 1) {
          return;
        }
        await advanceTime(transaction.timestamp ?? 0 + 600);
        antAlive = i - 1;
        await cryptoAntsContract.createEgg(antAlive);
        await cryptoAntsContract.createAnt();
      }
      await cryptoAntsContract.createAnt();
    }
    expect(await cryptoAntsContract.balanceOf(randomUser.address)).to.be.equal(101);
  });
});
