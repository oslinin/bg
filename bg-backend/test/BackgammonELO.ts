import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAddress } from "viem/utils";

import { network } from "hardhat";

describe("BackgammonELO", async function () {
  const { viem } = await network.connect();

  it("Should emit the EloScoreSet event when calling the setEloScore() function", async function () {
    const backgammonELO = await viem.deployContract("BackgammonELO");
    const [, otherAccount] = await viem.getWalletClients();

    const elo = 1500n;

    await viem.assertions.emitWithArgs(
      backgammonELO.write.setEloScore([otherAccount.account.address, elo]),
      backgammonELO,
      "EloScoreSet",
      [getAddress(otherAccount.account.address), elo]
    );
  });

  it("Should set and get an ELO score", async function () {
    const backgammonELO = await viem.deployContract("BackgammonELO");
    const [, otherAccount] = await viem.getWalletClients();

    const elo = 1500n;
    await backgammonELO.write.setEloScore([otherAccount.account.address, elo]);

    const retrievedElo = await backgammonELO.read.getEloScore([
      otherAccount.account.address,
    ]);
    assert.equal(retrievedElo, elo);
  });

  it("Should return 0 for a player without a score", async function () {
    const backgammonELO = await viem.deployContract("BackgammonELO");
    const [, otherAccount] = await viem.getWalletClients();

    const retrievedElo = await backgammonELO.read.getEloScore([
      otherAccount.account.address,
    ]);
    assert.equal(retrievedElo, 0n);
  });
});
