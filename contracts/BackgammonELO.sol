// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BackgammonELO {
    mapping(address => uint) public eloScores;

    event ScoreUpdated(address player, uint newScore);

    function setScore(address player, uint score) public {
        eloScores[player] = score;
        emit ScoreUpdated(player, score);
    }

    function getScore(address player) public view returns (uint) {
        return eloScores[player];
    }
}
