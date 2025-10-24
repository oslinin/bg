/*
 * model.js
 *
 * http://www.backgammon.js.org
 * https://github.com/quasoft/backgammonjs
 *
 * Copyright (c) 2016, Quasoft
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

var PieceType = {
  'NONE': 0,
  'WHITE': 1,
  'BLACK': 2
};

function Utils() {
}

Utils.generateId = function() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

Utils.getURLParameter = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function Random() {
}

Random.get = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function Piece(type, id) {
  this.type = type;
  this.id = id;
}

function Dice(values) {
  this.values = values || [];
}

Dice.prototype.roll = function() {
  var die1 = Random.get(1, 6);
  var die2 = Random.get(1, 6);
  this.values = die1 == die2 ? [die1, die1, die1, die1] : [die1, die2];
  return this.values;
};

function State() {
  this.points = [];
  for (var i = 0; i < 24; i++) {
    this.points[i] = {
      'pieces': []
    };
  }
  this.bar = [];
}

function Player(id, name, home) {
  this.id = id;
  this.name = name;
  this.home = home; // 0 or 1
}

function Game(state, turn, dice, board) {
  this.state = state || new State();
  this.turn = turn || PieceType.NONE;
  this.dice = dice || [];
  this.board = board || this.state; // for now, board is the same as state
}

function Match(id, rule, length) {
  this.id = id;
  this.rule = rule;
  this.length = length;
  this.game = new Game();
}

function MoveActionType() {
}

function MoveAction() {
}

exports.PieceType = PieceType;
exports.Utils = Utils;
exports.Random = Random;
exports.Piece = Piece;
exports.Dice = Dice;
exports.State = State;
exports.Player = Player;
exports.Game = Game;
exports.Match = Match;
exports.MoveActionType = MoveActionType;
exports.MoveAction = MoveAction;
