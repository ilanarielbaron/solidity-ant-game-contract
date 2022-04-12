import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { shouldVerifyContract } from 'utils/deploy';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const currentNonce: number = await ethers.provider.getTransactionCount(deployer);

  // precalculate the address of Egg contract
  const eggAddress: string = ethers.utils.getContractAddress({ from: deployer, nonce: currentNonce + 1 });

  const cryptoAntsHelperArgs = [eggAddress];

  const cryptoAnts = await hre.deployments.deploy('CryptoAnts', {
    contract: 'contracts/CryptoAnts.sol:CryptoAnts',
    args: cryptoAntsHelperArgs,
    from: deployer,
    log: true,
  });

  if (hre.network.name !== 'hardhat' && (await shouldVerifyContract(cryptoAnts))) {
    await hre.run('verify:verify', {
      address: cryptoAnts.address,
      constructorArguments: cryptoAntsHelperArgs,
    });
  }

  const eggArgs = [cryptoAnts.address];

  const egg = await hre.deployments.deploy('Egg', {
    contract: 'contracts/Egg.sol:Egg',
    from: deployer,
    args: eggArgs,
    log: true,
  });

  if (hre.network.name !== 'hardhat' && (await shouldVerifyContract(egg))) {
    await hre.run('verify:verify', {
      address: egg.address,
      constructorArguments: eggArgs,
    });
  }
};

deployFunction.tags = ['CryptoAnts', 'Egg', 'testnet'];

export default deployFunction;
