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

    function init() {
        currentPlayer = Lyngk.Players.PlayerOne;
        var validCoordinate = Lyngk.goodCoordinates;
        var index;
        var coordinate;
        for (index = 0; index < validCoordinate.length; index += 1) {
            coordinate = validCoordinate[index];
            coordinatesIntersections[coordinate] = new Lyngk.Intersection();
        }
    }

    this.initOnePiece = function () {
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            if (coordinatesIntersections.hasOwnProperty(coord)) {
                coordinatesIntersections[coord].pose(Lyngk.Color.IVORY);
            }
        });
    };

    function initOnePieceEveryColor() {
        var availableColors = [8, 8, 8, 8, 8, 3];
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            if (coordinatesIntersections.hasOwnProperty(coord)) {
                var randomColor;
                do {
                    randomColor = Math.floor(Math.random() * 6);
                } while (availableColors[randomColor] <= 0);
                availableColors[randomColor] -= 1;
                coordinatesIntersections[coord].pose(randomColor);
                //Pour Jean Rochefort
            }
        });
    }

    this.board = function () {
        return coordinatesIntersections;
    };

    this.getCurrentPlayer = function () {
        return currentPlayer;
    };

    this.getClaimedColors = function (player) {
        if (player === Lyngk.Players.PlayerOne) {
            return claimedColorsPlayerOne;
        } else {
            return claimedColorsPlayerTwo;
        }
    };

    this.getGameState = function () {
        return gameState;
    };

    this.getWinner = function () {
        return winner;
    };

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
    };

    this.getScore = function (player) {
        if (player === Lyngk.Players.PlayerOne) {
            return scorePlayerOne;
        } else {
            return scorePlayerTwo;
        }
    };

    this.numberOfPieces = function () {
        var nb = 0;
        Object.keys(coordinatesIntersections).forEach(function (coord) {
            nb += coordinatesIntersections[coord].getHeight();
        });
        return nb;
    };

    function isVacant(pos) {
        return coordinatesIntersections[pos].getState() === Lyngk.State.VACANT;
    }

    function moveStack(removedStack, p2) {
        var index;
        for (index = 0; index < removedStack.length; index += 1) {
            coordinatesIntersections[p2].pose(removedStack[index].getColor());
        }
    }

    this.move = function (pos1, pos2) {
        var p1 = new Lyngk.Coordinates(pos1[0], parseInt(pos1[1]));
        var p2 = new Lyngk.Coordinates(pos2[0], parseInt(pos2[1]));
        if (p1.isValid() && p2.isValid()) {
            if (!isVacant(p2) && validMove(p1, p2)) {
                var removedStack = coordinatesIntersections[p1].removeStack();
                moveStack(removedStack, p2);
                this.checkGameState(p2);
                this.refreshGameState();
                this.changePlayer();
            }
        }
    };
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
    };

    function isFullStack(pos) {
        var state = coordinatesIntersections[pos].getState();
        return state === Lyngk.State.FULL_STACK;
    }

    this.isColorClaimedByPlayer = function (color) {
        return this.getClaimedColors(currentPlayer).indexOf(color) >= 0;
    };

    this.isFullStackForPlayer = function (lastPos, color) {
        return isFullStack(lastPos) && this.isColorClaimedByPlayer(color);
    };

    this.checkGameState = function (lastPos) {
        var color = coordinatesIntersections[lastPos].color();

        if (this.isFullStackForPlayer.call(this, lastPos, color)) {
            if (currentPlayer === Lyngk.Players.PlayerOne) {
                scorePlayerOne += 1;
            } else {
                scorePlayerTwo += 1;
            }
            coordinatesIntersections[lastPos].removeStack();
        }
    };

    this.changePlayer = function () {
        if (currentPlayer === Lyngk.Players.PlayerOne) {
            currentPlayer = Lyngk.Players.PlayerTwo;
        } else {
            currentPlayer = Lyngk.Players.PlayerOne;
        }
    };

    function getLineDifference(p1, p2) {
        return p1.getLine() - p2.getLine();
    }

    function isVerticalMove(p1, p2, flag) {
        var lineDiff = getLineDifference(p1, p2);
        var columnP1 = p1.getColumn().charCodeAt(0);
        var columnP2 = p2.getColumn().charCodeAt(0);
        if (columnP1 === columnP2 && (lineDiff === 1 || lineDiff === -1)) {
            flag = true;
        }
        return flag;
    }

    function moveRight(columnP1, columnP2, lineDiff, flag) {
        if (columnP1 < columnP2 && (lineDiff === -1 || lineDiff === 0)) {
            flag = true;
        }
        return flag;
    }

    function moveLeft(columnP1, columnP2, lineDiff, flag) {
        if (columnP1 > columnP2 && (lineDiff === 1 || lineDiff === 0)) {
            flag = true;
        }
        return flag;
    }

    function isHorizontalMove(p1, p2, flag) {
        var lineDiff = getLineDifference(p1, p2);
        var columnP1 = p1.getColumn().charCodeAt(0);
        var columnP2 = p2.getColumn().charCodeAt(0);
        flag = moveRight(columnP1, columnP2, lineDiff, flag);
        flag = moveLeft(columnP1, columnP2, lineDiff, flag);
        return flag;
    }

    function isValidMoveVerticalOrHorizontal(p1, p2, flag) {
        flag = isVerticalMove(p1, p2, flag);
        flag = isHorizontalMove(p1, p2, flag);

        //if moving too far on the right on the left
        var columnP1 = (p1.getColumn()).charCodeAt(0);
        var columnP2 = (p2.getColumn()).charCodeAt(0);
        var columnDiff = (columnP1 - columnP2);
        if (columnDiff > 1 || columnDiff < -1) {
            flag = false;
        }
        return flag;
    }

    function isColorNotDuplicatedExceptWhite(p1, p2, flag) {
        var piecesP1 = coordinatesIntersections[p1].getPieces();
        var index, isDifferentFromWhite, isColorsP1InP2, p2Inter, p1Color;
        for (index = 0; index < piecesP1.length; index += 1) {
            p1Color = piecesP1[index].getColor();
            p2Inter = coordinatesIntersections[p2];
            isColorsP1InP2 = p2Inter.isColorInIntersection(p1Color);
            isDifferentFromWhite = p1Color !== Lyngk.Color.WHITE;
            if (isColorsP1InP2 && isDifferentFromWhite) {
                flag = false;
            }
        }
        return flag;
    }

    function isStackOneHigherThanStackTwo(p1, p2, flag) {
        var heightP1 = coordinatesIntersections[p1].getHeight();
        var heightP2 = coordinatesIntersections[p2].getHeight();
        if (heightP1 < heightP2) {
            flag = false;
        }
        return flag;
    }

    function hasPlayerClaimedColors(player) {
        if (player === Lyngk.Players.PlayerOne) {
            return claimedColorsPlayerOne.length !== 0;
        } else {
            return claimedColorsPlayerTwo.length !== 0;
        }
    }

    function isColorClaimedByPlayer(color, player) {
        if (player === Lyngk.Players.PlayerOne) {
            return claimedColorsPlayerOne.indexOf(color) >= 0;
        } else {
            return claimedColorsPlayerTwo.indexOf(color) >= 0;
        }
    }

    function isColorWhite(color)
    {
        return color === Lyngk.Color.WHITE;
    }

    function isColorClaimedByPlayerOne(colorP1, flag) {
        if (isColorClaimedByPlayer(colorP1, Lyngk.Players.PlayerOne)) {
            flag = false;
        }
        return flag;
    }

    function isColorClaimedByPlayerTwo(colorP1, flag) {
        if (isColorClaimedByPlayer(colorP1, Lyngk.Players.PlayerTwo)) {
            flag = false;
        }
        return flag;
    }

    function isColorNotUsedByOtherPlayer(colorP1, flag) {
        if (currentPlayer === Lyngk.Players.PlayerOne) {
            flag = isColorClaimedByPlayerTwo(colorP1, flag);
        } else {
            flag = isColorClaimedByPlayerOne(colorP1, flag);
        }
        return flag;
    }

    function canCurrentPlayerMoveThisColor(p1, flag) {
        var colorP1 = coordinatesIntersections[p1].color();
        flag = isColorNotUsedByOtherPlayer(colorP1, flag);
        if (!hasPlayerClaimedColors(currentPlayer) && isColorWhite(colorP1)) {
            flag = false;
        }
        return flag;
    }

    function areVacant(p1, p2, flag) {
        if (isVacant(p1) || isVacant(p2)) {
            flag = false;
        }
        return flag;
    }

    function isMoveDoable(p1, p2, flag) {
        flag = areVacant(p1, p2, flag);

        if (isFullStack(p1)) {
            flag = false;
        }
        return flag;
    }

    var validMove = function (p1, p2) {
        var flag = false;
        flag = isValidMoveVerticalOrHorizontal(p1, p2, flag);

        flag = isMoveDoable(p1, p2, flag);

        flag = isStackOneHigherThanStackTwo(p1, p2, flag);

        flag = isColorNotDuplicatedExceptWhite(p1, p2, flag);

        flag = canCurrentPlayerMoveThisColor(p1, flag);
        return flag;
    };

    function coordinateFromString(pos1, pos2) {
        var p1 = new Lyngk.Coordinates(pos1[0], parseInt(pos1[1]));
        var p2 = new Lyngk.Coordinates(pos2[0], parseInt(pos2[1]));
        return {p1: p1, p2: p2};
    }

    function pushStringValidMoveIntTab(positions, moves, pos1, pos2) {
        if (validMove(positions.p1, positions.p2)) {
            moves.push(pos1 + ";" + pos2);
        }
    }

    this.availableMovesForCurrentPlayer = function () {
        var moves = [];
        var index, indexBis, pos1, pos2, positions;
        var length = Lyngk.goodCoordinates.length;
        for (index = 0; index < length; index += 1) {
            for (indexBis = 0; indexBis < length; indexBis += 1) {
                pos1 = Lyngk.goodCoordinates[index];
                pos2 = Lyngk.goodCoordinates[indexBis];
                positions = coordinateFromString(pos1, pos2);
                pushStringValidMoveIntTab(positions, moves, pos1, pos2);
            }
        }
        return moves;
    };

    function addMovablePieceForPlayerTwo(color, movablePieces, coordinates) {
        if (!isColorClaimedByPlayer(color, Lyngk.Players.PlayerOne)) {
            movablePieces.push(coordinates);
        }
    }

    function addMovablePieceForPlayerOne(Color, movablePieces, coordinates) {
        if (!isColorClaimedByPlayer(Color, Lyngk.Players.PlayerTwo)) {
            movablePieces.push(coordinates);
        }
    }

    function addMovablePieceForPlayer(player, color, movableP, coordinates) {
        if (player === Lyngk.Players.PlayerOne) {
            addMovablePieceForPlayerOne(color, movableP, coordinates);
        } else {
            addMovablePieceForPlayerTwo(color, movableP, coordinates);
        }
    }

    function isColorMovableByPlayer(player, currentColor) {
        return hasPlayerClaimedColors(player) || !isColorWhite(currentColor);
    }

    this.availableMovablePiecesForPlayer = function (player) {
        var movableP = [];
        var currCol, index, currCoord;
        for (index = 0; index < Lyngk.goodCoordinates.length; index += 1) {
            currCoord = Lyngk.goodCoordinates[index];
            currCol = coordinatesIntersections[currCoord].color();
            if (isColorMovableByPlayer(player, currCol)) {
                addMovablePieceForPlayer(player, currCol, movableP, currCoord);
            }
        }
        return movableP;
    };

    this.availableMoveFromCoordinate = function (coordinate) {
        var moves = [];
        var index, p2, pos2;
        var p1 = new Lyngk.Coordinates(coordinate[0], parseInt(coordinate[1]));
        for (index = 0; index < Lyngk.goodCoordinates.length; index += 1) {
            pos2 = Lyngk.goodCoordinates[index];
            p2 = new Lyngk.Coordinates(pos2[0], parseInt(pos2[1]));
            if (validMove(p1, p2)) {
                moves.push(pos2);
            }
        }
        return moves;
    };

    this.refreshGameState = function () {
        var nbMoveLeft = 0;
        nbMoveLeft += this.availableMovesForCurrentPlayer().length;
        this.changePlayer();
        nbMoveLeft += this.availableMovesForCurrentPlayer().length;
        this.changePlayer();

        if (nbMoveLeft === 0) {
            gameState = Lyngk.GameState.OVER;
            this.setWinner();
        }
    };

    this.setWinner = function () {
        if (scorePlayerOne > scorePlayerTwo) {
            winner = Lyngk.Players.PlayerOne;
        } else if (scorePlayerOne < scorePlayerTwo) {
            winner = Lyngk.Players.PlayerTwo;
        } else {
            winner = Lyngk.Players.PlayerOne;
        }
    };

    init();
    initOnePieceEveryColor();
};
