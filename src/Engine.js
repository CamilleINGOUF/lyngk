"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Players = {PlayerOne: 0, PlayerTwo: 1};
Lyngk.GameState = {ONGOING: 0, OVER: 1};

Lyngk.Engine = function () {
    var coordinatesIntersections = [];

    var currentPlayer;

    var claimedColorsPlayerOne = [];
    var claimedColorsPlayerTwo = [];

    var scorePlayerOne = 0;
    var scorePlayerTwo = 0;

    var gameState = Lyngk.GameState.ONGOING;

    var winner = -1;

    var init = function () {
        currentPlayer = Lyngk.Players.PlayerOne;
        var validCoord = Lyngk.goodCoordinates;
        var index;
        for (index = 0; index < validCoord.length; index += 1) {
            coordinatesIntersections[validCoord[index]] = new Lyngk.Intersection();
        }
        initOnePieceEveryColor();
    }

    this.initOnePiece = function () {
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            if (coordinatesIntersections.hasOwnProperty(coord)) {
                coordinatesIntersections[coord].pose(Lyngk.Color.IVORY);
            }
        });
    }

    var initOnePieceEveryColor = function () {
        var availableColors = [8, 8, 8, 8, 8, 3];
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            if (coordinatesIntersections.hasOwnProperty(coord)) {
                var randomColor;
                do {
                    randomColor = Math.floor(Math.random() * 6);
                } while (availableColors[randomColor] <= 0)
                availableColors[randomColor]--;
                coordinatesIntersections[coord].pose(randomColor);
                //Pour Jean Rochefort
            }
        });
    }

    this.board = function () {
        return coordinatesIntersections;
    }

    this.getCurrentPlayer = function () {
        return currentPlayer;
    }

    this.getClaimedColors = function (player) {
        if (player === Lyngk.Players.PlayerOne) {
            return claimedColorsPlayerOne;
        } else {
            return claimedColorsPlayerTwo;
        }
    }

    this.getGameState = function () {
        return gameState;
    }

    this.getWinner = function () {
        return winner;
    }

    this.isFullOnePiece = function () {
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            if (coordinatesIntersections.hasOwnProperty(coord)) {
                var state = coordinatesIntersections[coord].getState();
                if (state !== Lyngk.State.ONE_PIECE) {
                    return false;
                }
            }
        });
        return true;
    }

    this.getScore = function (player) {
        if (player === Lyngk.Players.PlayerOne) {
            return scorePlayerOne;
        } else {
            return scorePlayerTwo;
        }
    }

    this.numberOfPieces = function () {
        var nb = 0;
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            nb += coordinatesIntersections[coord].getHeight();
        });
        return nb;
    }

    function isVacant(pos) {
        return coordinatesIntersections[pos].getState() === Lyngk.State.VACANT;
    }

    function moveStack(index, removedStack, p2) {
        for (index = 0; index < removedStack.length; index += 1) {
            coordinatesIntersections[p2].pose(removedStack[index].getColor());
        }
    }

    this.move = function (pos1, pos2) {
        var p1 = new Lyngk.Coordinates(pos1[0], parseInt(pos1[1]));
        var p2 = new Lyngk.Coordinates(pos2[0], parseInt(pos2[1]));
        var index;
        if (p1.isValid() && p2.isValid()) {
            if (!isVacant(p2) && validMove(p1, p2)) {
                var removedStack = coordinatesIntersections[p1].removeStack();
                moveStack(index, removedStack, p2);
                this.checkGameState(p2);
                this.refreshGameState();
                changePlayer();
            }
        }
    }

    function isColorClaimed(color) {
        var isClaimedByPlayerOne = claimedColorsPlayerOne.indexOf(color) < 0;
        var isClaimedByPlayerTwo = claimedColorsPlayerTwo.indexOf(color) < 0;
        return isClaimedByPlayerOne && isClaimedByPlayerTwo;
    }

    function claimColorForPlayerTwo(color) {
        if (claimedColorsPlayerTwo.length < 2) {
            claimedColorsPlayerTwo.push(color);
        }
    }

    function claimColorForPlayerOne(color) {
        if (claimedColorsPlayerOne.length < 2) {
            claimedColorsPlayerOne.push(color);
        }
    }

    this.claim = function (color) {
        if (isColorClaimed(color)) {
            if (currentPlayer === Lyngk.Players.PlayerOne) {
                claimColorForPlayerOne(color);
            } else {
                claimColorForPlayerTwo(color);
            }
        }
    }

    function isFullStack(pos) {
        var state = coordinatesIntersections[pos].getState();
        return state === Lyngk.State.FULL_STACK;
    }

    this.isColorClaimedByPlayer = function (color) {
        return this.getClaimedColors(currentPlayer).indexOf(color) >= 0;
    };

    this.isFullStackForPlayer = function (lastPos, color) {
        return isFullStack(lastPos) && this.isColorClaimedByPlayer(color);
    }

    this.checkGameState = function (lastPos) {
        var color = coordinatesIntersections[lastPos].color();

        if (this.isFullStackForPlayer.call(this, lastPos, color)) {
            if (currentPlayer === Lyngk.Players.PlayerOne) {
                scorePlayerOne++;
            } else {
                scorePlayerTwo++;
            }

            coordinatesIntersections[lastPos].removeStack();
        }
    }

    var changePlayer = function () {
        if (currentPlayer === Lyngk.Players.PlayerOne) {
            currentPlayer = Lyngk.Players.PlayerTwo;
        } else {
            currentPlayer = Lyngk.Players.PlayerOne;
        }
    }

    function isValidMoveVerticalOrHorizontal(p1, p2) {
        var flag = false;
        var lineDiff;
        //if vertical
        if (p1.getColumn().charCodeAt(0) === p2.getColumn().charCodeAt(0)) {
            lineDiff = p1.getLine() - p2.getLine();
            //up or down
            if (lineDiff === 1 || lineDiff === -1) {
                flag = true;
            }
        }
        //IF move to left
        else if (p1.getColumn().charCodeAt(0) < p2.getColumn().charCodeAt(0)) {
            lineDiff = p1.getLine() - p2.getLine();
            //Only if it stays on same line or go down
            if (lineDiff === 0 || lineDiff === -1) {
                flag = true;
            }
        }//OR right
        else if (p1.getColumn().charCodeAt(0) > p2.getColumn().charCodeAt(0)) {
            lineDiff = p1.getLine() - p2.getLine();
            //Only if it stays on same line or go up
            if (lineDiff === 1 || lineDiff === 0) {
                flag = true;
            }
        }

        //if moving too far on the right on the left
        var columnDiff = ((p1.getColumn()).charCodeAt(0) - (p2.getColumn()).charCodeAt(0));
        if (columnDiff > 1 || columnDiff < -1) {
            flag = false;
        }
        return flag;
    }

    function checkStackOneIsHigherThanStackOne(p1, p2) {
        if (coordinatesIntersections[p1].getHeight() < coordinatesIntersections[p2].getHeight()) {
            return false;
        }
        return true;
    }

    var validMove = function (p1, p2) {
        var flag = false;
        flag = isValidMoveVerticalOrHorizontal(p1, p2);

        if (isVacant(p1) || isVacant(p2)) {
            flag = false;
        }

        if (isFullStack(p1)) {
            flag = false;
        }

        flag = checkStackOneIsHigherThanStackOne(p1, p2);

        var piecesP1 = coordinatesIntersections[p1].getPieces();
        var index;
        for (index = 0; index < piecesP1.length; index += 1) {
            //Can't have same color on one stack except for WHITE
            if (coordinatesIntersections[p2].isColorInIntersection(piecesP1[index].getColor()) && piecesP1[index].getColor() !== Lyngk.Color.WHITE) {
                flag = false;
            }
        }

        if (currentPlayer === Lyngk.Players.PlayerOne) {

            if (claimedColorsPlayerTwo.indexOf(coordinatesIntersections[p1].color()) >= 0) {
                flag = false;
            }

            if (claimedColorsPlayerOne.length == 0 && coordinatesIntersections[p1].color() == Lyngk.Color.WHITE) {
                flag = false;
            }
        }
        else {
            if (claimedColorsPlayerOne.indexOf(coordinatesIntersections[p1].color()) >= 0) {
                flag = false;
            }

            if (claimedColorsPlayerTwo.length == 0 && coordinatesIntersections[p1].color() == Lyngk.Color.WHITE) {
                flag = false;
            }
        }
        return flag;
    }

    this.availableMoves = function () {
        var moves = [];
        for (var i = 0; i < Lyngk.goodCoordinates.length; i++) {
            for (var j = 0; j < Lyngk.goodCoordinates.length; j++) {
                var pos1 = Lyngk.goodCoordinates[i];
                var pos2 = Lyngk.goodCoordinates[j];
                var p1 = new Lyngk.Coordinates(pos1[0], parseInt(pos1[1]));
                var p2 = new Lyngk.Coordinates(pos2[0], parseInt(pos2[1]));
                if (validMove(p1, p2))
                    moves.push(pos1 + ";" + pos2);
            }
        }
        return moves;
    }

    this.availableMovablePiecesForPlayer = function (player) {
        var movablePieces = [];
        for (var i = 0; i < Lyngk.goodCoordinates.length; i++) {
            if (player = Lyngk.Players.PlayerOne) {

                if ((claimedColorsPlayerOne.length != 0 || coordinatesIntersections[Lyngk.goodCoordinates[i]].color() != Lyngk.Color.WHITE)
                    && claimedColorsPlayerTwo.indexOf(coordinatesIntersections[Lyngk.goodCoordinates[i]].color()) < 0)
                    movablePieces.push(Lyngk.goodCoordinates[i])
            }
            else {
                if ((claimedColorsPlayerTwo.length != 0 || coordinatesIntersections[Lyngk.goodCoordinates[i]].color() != Lyngk.Color.WHITE)
                    && claimedColorsPlayerOne.indexOf(coordinatesIntersections[Lyngk.goodCoordinates[i]].color()) < 0)
                    movablePieces.push(Lyngk.goodCoordinates[i])
            }
        }
        return movablePieces;
    }

    this.availableMoveFromCoordinate = function (coordinate) {
        var moves = [];
        var p1 = new Lyngk.Coordinates(coordinate[0], parseInt(coordinate[1]));
        for (var i = 0; i < Lyngk.goodCoordinates.length; i++) {
            var pos2 = Lyngk.goodCoordinates[i];
            var p2 = new Lyngk.Coordinates(pos2[0], parseInt(pos2[1]));
            if (validMove(p1, p2)) {
                moves.push(pos2);
            }
        }
        return moves;
    }

    this.refreshGameState = function () {
        var nbMoveLeft = 0;
        nbMoveLeft += this.availableMoves().length;
        changePlayer();
        nbMoveLeft += this.availableMoves().length;
        changePlayer();

        if (nbMoveLeft == 0) {
            gameState = Lyngk.GameState.OVER;
            this.setWinner();
        }
    }

    this.setWinner = function () {
        if (this.getScore(Lyngk.Players.PlayerOne) > this.getScore(Lyngk.Players.PlayerTwo))//if player one has more full stack
            winner = Lyngk.Players.PlayerOne;
        else if (this.getScore(Lyngk.Players.PlayerOne) < this.getScore(Lyngk.Players.PlayerTwo))//if player two has more full stack
            winner = Lyngk.Players.PlayerTwo
        else {
            winner = Lyngk.Players.PlayerOne;
        }
    }

    init();
};
