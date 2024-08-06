import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UserBalancesModule = buildModule("UserBalancesModule", (m) => {
  const whitelistInit = '0xf342a7fA133e8BEcFf39b7667d12515Dd5e57cE2';

  const whitelist = m.contract("UserBalances", [whitelistInit]);

  return { whitelist };
});

export default UserBalancesModule;
