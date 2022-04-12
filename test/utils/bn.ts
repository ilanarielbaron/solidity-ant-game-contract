import { BigNumber, utils } from 'ethers';

export const toUnit = (value: number): BigNumber => {
  return utils.parseUnits(value.toString());
};
