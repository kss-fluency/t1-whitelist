import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from 'dotenv';
import { env } from "process";

dotenv.config();

const UserBalanceModule = buildModule("UserBalanceModule", (m) => {
  const whitelistInit = env.INIT_ADDRESS as string;

  const whitelist = m.contract("UserBalance", [whitelistInit]);

  return { whitelist };
});

export default UserBalanceModule;
