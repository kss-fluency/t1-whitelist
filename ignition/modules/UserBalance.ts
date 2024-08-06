import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UserBalanceModule = buildModule("UserBalanceModule", (m) => {
  const whitelistInit = '0xf342a7fA133e8BEcFf39b7667d12515Dd5e57cE2';

  const whitelist = m.contract("UserBalance.sol", [whitelistInit]);

  return { whitelist };
});

export default UserBalanceModule;
