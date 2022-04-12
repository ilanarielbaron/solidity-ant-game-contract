import { ethers } from 'hardhat';
import { DeployResult } from 'hardhat-deploy/dist/types';

export const shouldVerifyContract = async (deploy: DeployResult): Promise<boolean> => {
  if (process.env.FORK || process.env.TEST) return false;
  if (!deploy.newlyDeployed) return false;
  const txReceipt = await ethers.provider.getTransaction(deploy.receipt!.transactionHash);
  await txReceipt.wait(10);
  return true;
};
