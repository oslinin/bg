/*
 * RuleBgCasual.js
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

var util = require('util');
var Rule = require('./Rule.js');
var model = require('../model.js');

function RuleBgCasual() {
  Rule.call(this);
}

util.inherits(RuleBgCasual, Rule);

RuleBgCasual.prototype.resetState = function(state) {
  state.points[0].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[0].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[5].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[5].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[5].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[5].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[5].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[7].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[7].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[7].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[11].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[11].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[11].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[11].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[11].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[12].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[12].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[12].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[12].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[12].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[16].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[16].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[16].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[18].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[18].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[18].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[18].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[18].pieces.push(new model.Piece(model.PieceType.BLACK));
  state.points[23].pieces.push(new model.Piece(model.PieceType.WHITE));
  state.points[23].pieces.push(new model.Piece(model.PieceType.WHITE));
};

RuleBgCasual.prototype.incPos = function(from, die) {
  return from + die;
};

RuleBgCasual.prototype.normPos = function(pos, player) {
  return player.home ? 23 - pos : pos;
};

RuleBgCasual.prototype.denormPos = function(pos, player) {
  return player.home ? 23 - pos : pos;
};

RuleBgCasual.prototype.getMoveActions = function(from, to, state, player, dice) {
  var actions = [];

  if (from == to) {
    return actions;
  }

  // handle pieces from bar
  if (state.bar.length > 0) {
    if (from != -1) {
      return actions;
    } else {
      var piece = state.bar[state.bar.length - 1];
      if (piece.type == player.type) {
        var point = state.points[this.denormPos(to, player)];
        if (point.pieces.length == 1 && point.pieces[0].type != player.type) {
          actions.push(new model.MoveAction(model.MoveActionType.RECOVER));
          actions.push(new model.MoveAction(model.MoveActionType.HIT));
        } else if (point.pieces.length <= 1) {
          actions.push(new model.MoveAction(model.MoveActionType.RECOVER));
        }
      }
    }
  } else { // handle pieces from board
    var die = Math.abs(to - from);
    if (dice.indexOf(die) != -1) {
      var point = state.points[this.denormPos(to, player)];
      if (point.pieces.length == 1 && point.pieces[0].type != player.type) {
        actions.push(new model.MoveAction(model.MoveActionType.MOVE));
        actions.push(new model.MoveAction(model.MoveActionType.HIT));
      } else if (point.pieces.length <= 1) {
        actions.push(new model.MoveAction(model.MoveActionType.MOVE));
      }
    }
  }

  // bearing off
  var canBearOff = true;
  for (var i = 0; i < 18; i++) {
    var point = state.points[this.denormPos(i, player)];
    for (var j = 0; j < point.pieces.length; j++) {
      if (point.pieces[j].type == player.type) {
        canBearOff = false;
        break;
      }
    }
  }

  if (canBearOff) {
    var die = Math.abs(to - from);
    if (to == 24) {
      actions.push(new model.MoveAction(model.MoveActionType.BEAR));
    }
  }

  return actions;
};

module.exports = RuleBgCasual;
