/*
 * client.js
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

var io = require('socket.io-client');
var model = require('./model.js');
var comm = require('./comm.js');

function Client() {
  this._socket = null;
  this._clientMsgSeq = 0;
  this._callbackList = {};
  this._msgSubscriptions = {};
  this.player = null;
  this.otherPlayer = null;
  this.match = null;
  this.rule = null;
  this.boardUI = null;
  this.config = {
    'containerID': 'backgammon',
    'boardUI': '../app/browser/js/SimpleBoardUI.js',
    'rulePath': './rules'
  };
}

Client.prototype.init = function(config) {
  this.config = this.config || {};
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      this.config[key] = config[key];
    }
  }

  var BoardUI = require(this.config.boardUI);
  this.boardUI = new BoardUI($('#' + this.config.containerID), this);

  this._openSocket();
};

Client.prototype._openSocket = function() {
  var self = this;
  this._socket = io();

  this._socket.on('connect', function() {
    self.reqCreateGuest();
  });

  this._socket.on(comm.Message.MSG, function(msg) {
    self.handleMessage(msg);
  });

  this.subscribe(comm.Message.CREATE_GUEST, this.handleCreateGuest.bind(this));
  this.subscribe(comm.Message.GET_MATCH_LIST, this.handleGetMatchList.bind(this));
  this.subscribe(comm.Message.PLAY_RANDOM, this.handlePlayRandom.bind(this));
  this.subscribe(comm.Message.CREATE_MATCH, this.handleCreateMatch.bind(this));
  this.subscribe(comm.Message.JOIN_MATCH, this.handleJoinMatch.bind(this));
  this.subscribe(comm.Message.ROLL_DICE, this.handleRollDice.bind(this));
  this.subscribe(comm.Message.MOVE_PIECE, this.handleMovePiece.bind(this));

  this.subscribe(comm.Message.EVENT_PLAYER_JOINED, this.handleEventPlayerJoined.bind(this));
  this.subscribe(comm.Message.EVENT_TURN_START, this.handleEventTurnStart.bind(this));
  this.subscribe(comm.Message.EVENT_DICE_ROLL, this.handleEventDiceRoll.bind(this));
  this.subscribe(comm.Message.EVENT_PIECE_MOVE, this.handleEventPieceMove.bind(this));
  this.subscribe(comm.Message.EVENT_MATCH_START, this.handleEventMatchStart.bind(this));
  this.subscribe(comm.Message.EVENT_GAME_OVER, this.handleEventGameOver.bind(this));
  this.subscribe(comm.Message.EVENT_MATCH_OVER, this.handleEventMatchOver.bind(this));
  this.subscribe(comm.Message.EVENT_GAME_RESTART, this.handleEventGameRestart.bind(this));
  this.subscribe(comm.Message.EVENT_UNDO_MOVES, this.handleEventUndoMoves.bind(this));
};

Client.prototype.sendMessage = function(msg, callback) {
  msg.clientMsgSeq = this._clientMsgSeq;
  if (callback) {
    this._callbackList[this._clientMsgSeq] = callback;
  }
  this._socket.send(msg);
  this._clientMsgSeq++;
};

Client.prototype.handleMessage = function(msg) {
  if (msg.serverMsgSeq && this._callbackList[msg.serverMsgSeq]) {
    this._callbackList[msg.serverMsgSeq](msg);
    delete this._callbackList[msg.serverMsgSeq];
  } else {
    this._notify(msg.type, msg);
  }
};

Client.prototype.handleCreateGuest = function(msg) {
  this.updatePlayer(msg.player);
};

Client.prototype.handleGetMatchList = function(msg) {
};

Client.prototype.handlePlayRandom = function(msg) {
};

Client.prototype.handleCreateMatch = function(msg) {
};

Client.prototype.handleJoinMatch = function(msg) {
  if (msg.status == comm.Status.OK) {
    this.updateMatch(msg.match);
    this.updateOtherPlayer(msg.otherPlayer);
    this.loadRule(msg.match.rule);
  } else {
    BootstrapDialog.show({
      'title': 'Error',
      'message': 'Cannot join match: ' + msg.status
    });
  }
};

Client.prototype.handleRollDice = function(msg) {
};

Client.prototype.handleMovePiece = function(msg) {
};

Client.prototype.handleEventPlayerJoined = function(msg) {
  this.updateOtherPlayer(msg.player);
  this._notify(msg.type, msg);
};

Client.prototype.handleEventTurnStart = function(msg) {
  this.match.game.turn = msg.turn;
  this.updateUI();
  this._notify(msg.type, msg);
};

Client.prototype.handleEventDiceRoll = function(msg) {
  this.match.game.dice = msg.dice;
  this.updateUI();
};

Client.prototype.handleEventPieceMove = function(msg) {
  this.match.game.board = msg.board;
  this.updateUI();
};

Client.prototype.handleEventMatchStart = function(msg) {
  this.updateMatch(msg.match);
  this.loadRule(msg.match.rule);
  this._notify(msg.type, msg);
};

Client.prototype.handleEventGameOver = function(msg) {
  this._notify(msg.type, msg);
};

Client.prototype.handleEventMatchOver = function(msg) {
  this._notify(msg.type, msg);
};

Client.prototype.handleEventGameRestart = function(msg) {
  this.match.game = msg.game;
  this.updateUI();
  this._notify(msg.type, msg);
};

Client.prototype.handleEventUndoMoves = function(msg) {
  this.match.game.board = msg.board;
  this.match.game.dice = msg.dice;
  this.updateUI();
};

Client.prototype.loadRule = function(ruleName) {
  var Rule = require(this.config.rulePath + '/' + ruleName + '.js');
  this.updateRule(new Rule());
  this.resetBoard();
};

Client.prototype.resetBoard = function() {
  this.rule.resetState(this.match.game.state);
  this.updateUI();
};

Client.prototype.updatePlayer = function(player) {
  this.player = new model.Player(player.id, player.name, player.home);
};

Client.prototype.updateOtherPlayer = function(player) {
  this.otherPlayer = new model.Player(player.id, player.name, player.home);
};

Client.prototype.updateMatch = function(match) {
  this.match = new model.Match(match.id, match.rule, match.length);
  this.match.game = new model.Game(match.game.state, match.game.turn, match.game.dice, match.game.board);
};

Client.prototype.updateRule = function(rule) {
  this.rule = rule;
};

Client.prototype.updateUI = function() {
  this.boardUI.drawBoard();
};

Client.prototype.subscribe = function(msgType, callback) {
  if (!this._msgSubscriptions[msgType]) {
    this._msgSubscriptions[msgType] = [];
  }
  this._msgSubscriptions[msgType].push(callback);
};

Client.prototype._notify = function(msgType, msg) {
  if (this._msgSubscriptions[msgType]) {
    for (var i = 0; i < this._msgSubscriptions[msgType].length; i++) {
      this._msgSubscriptions[msgType][i](msg);
    }
  }
};

Client.prototype.reqCreateGuest = function() {
  this.sendMessage({
    'type': comm.Message.CREATE_GUEST
  });
};

Client.prototype.reqPlayRandom = function(rule) {
  this.sendMessage({
    'type': comm.Message.PLAY_RANDOM,
    'rule': rule
  });
};

Client.prototype.reqCreateMatch = function(rule) {
  this.sendMessage({
    'type': comm.Message.CREATE_MATCH,
    'rule': rule
  });
};

Client.prototype.reqJoinMatch = function(matchId) {
  this.sendMessage({
    'type': comm.Message.JOIN_MATCH,
    'matchId': matchId
  });
};

Client.prototype.reqRollDice = function() {
  this.sendMessage({
    'type': comm.Message.ROLL_DICE
  });
};

Client.prototype.reqConfirmMoves = function() {
  this.sendMessage({
    'type': comm.Message.CONFIRM_MOVES
  });
};

Client.prototype.reqUndoMoves = function() {
  this.sendMessage({
    'type': comm.Message.UNDO_MOVES
  });
};

Client.prototype.reqResignGame = function() {
  this.sendMessage({
    'type': comm.Message.RESIGN_GAME
  });
};

Client.prototype.reqResignMatch = function() {
  this.sendMessage({
    'type': comm.Message.RESIGN_MATCH
  });
};

Client.prototype.reqMove = function(from, to) {
  this.sendMessage({
    'type': comm.Message.MOVE_PIECE,
    'from': from,
    'to': to
  });
};

Client.prototype.getChallengeUrl = function(rule) {
  var url = location.protocol + '//' + location.host + location.pathname;
  url += '?challenge=' + this.player.id + '-' + rule;
  return url;
};

Client.prototype.resizeUI = function() {
  this.boardUI.onResize();
};

module.exports = Client;
