import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("UserBalance.sol", function () {

  const SOME_ADDRESS = '0x13CB6AE34A13a0977F4d7101eBc24B87Bb23F0d5';
  const SOME_POSITIVE_AMOUNT = 10;
  const SOME_SMALLER_NEGATIVE_AMOUNT = -5;

  async function deployFixture() {
    const [ownerAccount, initAccount] = await hre.ethers.getSigners();

    const UserBalanceFactory = await hre.ethers.getContractFactory("UserBalance");
    const sut = await UserBalanceFactory.deploy(initAccount.address);
    await sut.waitForDeployment();

    return { sut, ownerAccount,  initAccount };
  }

  describe("Whitelist", function () {
    it("Should allow initial address to modify whitelist", async function () {
      const {sut, initAccount} = await loadFixture(deployFixture);

      expect(await sut.connect(initAccount).addToWhitelist(SOME_ADDRESS)).not.to.be.reverted;
    });

    it("Should not allow unauthorised addresses to modify whitelist", async function () {
      const {sut, ownerAccount} = await loadFixture(deployFixture);

      await expect(sut.connect(ownerAccount).addToWhitelist(SOME_ADDRESS)).to.be.revertedWith(
          'Caller address is not whitelisted'
      );
    });

    it("Should not whitelisting the same address twice", async function () {
      const {sut, initAccount} = await loadFixture(deployFixture);

      await expect(sut.connect(initAccount).addToWhitelist(initAccount.address)).to.be.revertedWith(
          'This address is already whitelisted'
      );
    });
  });

  describe("ETHbalance", function () {
    it("Should not allow unauthorised address to change ETH balance", async function () {
      const {sut, ownerAccount} = await loadFixture(deployFixture);

      await expect(sut.connect(ownerAccount).changeEthBalance(SOME_ADDRESS, SOME_POSITIVE_AMOUNT)).to.be.revertedWith(
          'Caller address is not whitelisted'
      );
    });

    it("Should change ETH balance", async function () {
      const {sut, initAccount} = await loadFixture(deployFixture);

      expect(await sut.connect(initAccount).getEthBalance(SOME_ADDRESS)).to.equal(0);
      expect(await sut.connect(initAccount).changeEthBalance(SOME_ADDRESS, SOME_POSITIVE_AMOUNT)).not.to.be.reverted;
      expect(await sut.connect(initAccount).getEthBalance(SOME_ADDRESS)).to.equal(SOME_POSITIVE_AMOUNT);
      expect(await sut.connect(initAccount).changeEthBalance(SOME_ADDRESS, SOME_SMALLER_NEGATIVE_AMOUNT)).not.to.be.reverted;
      expect(await sut.connect(initAccount).getEthBalance(SOME_ADDRESS)).to.equal(SOME_POSITIVE_AMOUNT + SOME_SMALLER_NEGATIVE_AMOUNT);
    });

    it("Should not decrease ETH balance by more than its value", async function () {
      const {sut, initAccount} = await loadFixture(deployFixture);

      expect(await sut.connect(initAccount).changeEthBalance(SOME_ADDRESS, SOME_POSITIVE_AMOUNT)).not.to.be.reverted;
      await expect(sut.connect(initAccount).changeEthBalance(SOME_ADDRESS, -(SOME_POSITIVE_AMOUNT + 1))).to.be.revertedWith(
          'You are trying to reduce balance by higher amount than it is'
      );
    });
  });
});
