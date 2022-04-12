import { BigNumber } from 'ethers';
import { network } from 'hardhat';

export const setBalance = async (address: string, amount: BigNumber): Promise<void> => {
  await network.provider.send('hardhat_setBalance', [address, amount.toHexString()]);
};
