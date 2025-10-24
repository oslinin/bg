// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BackgammonELO {
    mapping(address => uint256) public eloScores;

    event EloScoreSet(address indexed player, uint256 elo);

    function setEloScore(address player, uint256 elo) public {
        eloScores[player] = elo;
        emit EloScoreSet(player, elo);
    }

    function getEloScore(address player) public view returns (uint256) {
        return eloScores[player];
    }
}
