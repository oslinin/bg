/*
 * comm.js
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

var Protocol = {
  'BindAddress': '0.0.0.0',
  'Port': 8080
};

var Message = {
  'MSG': 'message',
  'CONNECT': 'connect',
  'DISCONNECT': 'disconnect',
  'CREATE_GUEST': 'createGuest',
  'GET_MATCH_LIST': 'getMatchList',
  'PLAY_RANDOM': 'playRandom',
  'CREATE_MATCH': 'createMatch',
  'JOIN_MATCH': 'joinMatch',
  'ROLL_DICE': 'rollDice',
  'MOVE_PIECE': 'movePiece',
  'CONFIRM_MOVES': 'confirmMoves',
  'UNDO_MOVES': 'undoMoves',
  'RESIGN_GAME': 'resignGame',
  'RESIGN_MATCH': 'resignMatch',
  'EVENT_PLAYER_JOINED': 'eventPlayerJoined',
  'EVENT_TURN_START': 'eventTurnStart',
  'EVENT_DICE_ROLL': 'eventDiceRoll',
  'EVENT_PIECE_MOVE': 'eventPieceMove',
  'EVENT_MOVES_CONFIRMED': 'eventMovesConfirmed',
  'EVENT_MATCH_START': 'eventMatchStart',
  'EVENT_GAME_START': 'eventGameStart',
  'EVENT_GAME_OVER': 'eventGameOver',
  'EVENT_MATCH_OVER': 'eventMatchOver',
  'EVENT_GAME_RESTART': 'eventGameRestart',
  'EVENT_UNDO_MOVES': 'eventUndoMoves'
};

var Status = {
  'OK': 'ok',
  'ERROR': 'error'
};

exports.Protocol = Protocol;
exports.Message = Message;
exports.Status = Status;
