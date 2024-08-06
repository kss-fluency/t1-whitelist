import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("UserBalance.sol", function () {

  const SOME_ADDRESS = '0x13CB6AE34A13a0977F4d7101eBc24B87Bb23F0d5';

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [ownerAccount, initAccount] = await hre.ethers.getSigners();

    const UserBalanceFactory = await hre.ethers.getContractFactory("UserBalance");
    console.log(`address init: ${initAccount.address}`);
    const sut = await UserBalanceFactory.deploy(initAccount.address);
    await sut.waitForDeployment();

    return { sut, ownerAccount,  initAccount };
  }

  it("Should allow initial address to modify whitelist", async function () {
    const { sut, initAccount } = await loadFixture(deployFixture);

    expect(await sut.connect(initAccount).addToWhitelist(SOME_ADDRESS)).not.to.be.reverted;
  });

  it("Should not allow unauthorised addresses to modify whitelist", async function () {
    const { sut, ownerAccount } = await loadFixture(deployFixture);

    await expect(sut.connect(ownerAccount).addToWhitelist(SOME_ADDRESS)).to.be.revertedWith(
        'Caller address is not whitelisted'
    );
  });

  it("Should not whitelisting the same address twice", async function () {
    const { sut, initAccount } = await loadFixture(deployFixture);

    await expect(sut.connect(initAccount).addToWhitelist(initAccount.address)).to.be.revertedWith(
        'This address is already whitelisted'
    );
  });
});
