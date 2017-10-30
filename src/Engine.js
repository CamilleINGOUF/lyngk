"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Players = {PlayerOne : 0, PlayerTwo : 1};

Lyngk.Engine = function ()
{
    var coordinatesIntersections = [];

    var currentPlayer;

    var claimedColorsPlayerOne = [];
    var claimedColorsPlayerTwo = [];

    var scorePlayerOne = 0;
    var scorePlayerTwo = 0;

    var init = function() {
        currentPlayer = Lyngk.Players.PlayerOne;
        var validCoord = Lyngk.goodCoordinates;
        for (var i = 0; i < validCoord.length; i++)
        {
            coordinatesIntersections[validCoord[i]] = new Lyngk.Intersection();
        }
        init_one_piece_every_color();
    }

    this.init_one_piece = function()
    {
        for (var coord in coordinatesIntersections) {
            if (coordinatesIntersections.hasOwnProperty(coord))
            {
                coordinatesIntersections[coord].pose(Lyngk.Color.IVORY);
            }
        }
    }

    var init_one_piece_every_color = function()
    {
        var availableColors = [8,8,8,8,8,3];
        for (var coord in coordinatesIntersections) {
            if (coordinatesIntersections.hasOwnProperty(coord))
            {
                var randomColor;
                do{
                    randomColor = Math.floor(Math.random() * 6);
                }while(availableColors[randomColor] <= 0)
                availableColors[randomColor]--;
                coordinatesIntersections[coord].pose(randomColor);
                //Pour Jean Rochefort
            }
        }
    }

    this.plateau = function()
    {
        return coordinatesIntersections;
    }

    this.getCurrentPlayer = function ()
    {
        return currentPlayer;
    }

    this.getClaimedColors = function (player)
    {
        if(player == Lyngk.Players.PlayerOne)
            return claimedColorsPlayerOne;
        else
            return claimedColorsPlayerTwo;
    }

    this.is_full_one_piece = function()
    {
        for (var coord in coordinatesIntersections) {
            if (coordinatesIntersections.hasOwnProperty(coord))
            {
                if(coordinatesIntersections[coord].getState() != Lyngk.State.ONE_PIECE)
                    return false;
            }
        }
        return true;
    }

    this.getScore = function(player)
    {
        if(player == Lyngk.Players.PlayerOne)
            return scorePlayerOne
        else
            return scorePlayerTwo
    }

    this.nbOfPieces = function ()
    {
        var nb = 0;
        for(var coord in coordinatesIntersections)
        {
            nb += coordinatesIntersections[coord].getHeight();
        }
        return nb;
    }

    this.move =  function (pos1, pos2)
    {
        var p1 = new Lyngk.Coordinates(pos1[0],parseInt(pos1[1]));
        var p2 = new Lyngk.Coordinates(pos2[0],parseInt(pos2[1]));
        if(p1.isValid() && p2.isValid())
        {
            if(coordinatesIntersections[p2].getState() !== Lyngk.State.VACANT
                && validMove(p1, p2))
            {
                var removedStack = coordinatesIntersections[p1].removeStack();
                for (var i = 0; i < removedStack.length; i++)
                    coordinatesIntersections[p2].pose(removedStack[i].getColor());
                this.checkGameState(p2);
                changePlayer();
            }
        }
    }

    this.claim = function (color)
    {
        if(claimedColorsPlayerOne.indexOf(color) < 0 && claimedColorsPlayerTwo.indexOf(color) < 0)
        {
            if(currentPlayer == Lyngk.Players.PlayerOne)
            {
                if( claimedColorsPlayerOne.length < 2)
                    claimedColorsPlayerOne.push(color);
            }
            else
            {
                if( claimedColorsPlayerTwo.length < 2)
                    claimedColorsPlayerTwo.push(color);
            }
        }
    }

    this.checkGameState = function (lastPos)
    {
        var color = coordinatesIntersections[lastPos].color();

        //if last move makes full stake AND if the color of the stack is claimed by the current player
        if(coordinatesIntersections[lastPos].getState() == Lyngk.State.FULL_STACK && this.getClaimedColors(currentPlayer).indexOf(color) >= 0)
        {
            if(currentPlayer == Lyngk.Players.PlayerOne)
                scorePlayerOne++;
            else
                scorePlayerTwo++;

            coordinatesIntersections[lastPos].removeStack();
        }
    }

    var changePlayer = function()
    {
        if(currentPlayer == Lyngk.Players.PlayerOne)
            currentPlayer = Lyngk.Players.PlayerTwo;
        else
            currentPlayer = Lyngk.Players.PlayerOne;
    }

    var validMove = function(p1, p2)
    {
        var flag = false;
        //If vertical move
        if(p1.getColumn().charCodeAt(0) === p2.getColumn().charCodeAt(0))
        {
            var lineDiff = p1.getLine() - p2.getLine();
            //up or down
            if(lineDiff === 1 || lineDiff === -1)
            {
                flag = true;
            }
        }
        //IF move to left
        else if(p1.getColumn().charCodeAt(0) < p2.getColumn().charCodeAt(0))
        {
            var lineDiff = p1.getLine() - p2.getLine();
            //Only if it stays on same line or go down
            if(lineDiff === 0 || lineDiff === -1)
            {
                flag = true;
            }
        }//OR right
        else if(p1.getColumn().charCodeAt(0) > p2.getColumn().charCodeAt(0))
        {
            var lineDiff = p1.getLine() - p2.getLine();
            //Only if it stays on same line or go up
            if(lineDiff === 1 || lineDiff === 0)
            {
                flag = true;
            }
        }

        //if moving too far on the right on the left
        var columnDiff = ((p1.getColumn()).charCodeAt(0) - (p2.getColumn()).charCodeAt(0));
        if(columnDiff > 1 || columnDiff < -1)
            flag = false;

        if(coordinatesIntersections[p1].getState() === Lyngk.State.FULL_STACK)
            flag = false;

        if(coordinatesIntersections[p1].getState() === Lyngk.State.ONE_PIECE &&
            coordinatesIntersections[p2].getState() === Lyngk.State.STACK)
            flag = false;

        //Le pile p1 doit etre plus grande que p2
        if(coordinatesIntersections[p1].getHeight() < coordinatesIntersections[p2].getHeight())
            flag = false;

        var piecesP1 = coordinatesIntersections[p1].getPieces();

        for(var i = 0; i < piecesP1.length; i++)
        {
            //Can't have same color on one stack except for WHITE
            if(coordinatesIntersections[p2].isColorInIntersection(piecesP1[i].getColor()) && piecesP1[i].getColor() != Lyngk.Color.WHITE)
                flag = false;
        }

        if(currentPlayer == Lyngk.Players.PlayerOne)
        {

            if(claimedColorsPlayerTwo.indexOf(coordinatesIntersections[p1].color()) >= 0)
                flag = false;

            if(claimedColorsPlayerOne.length == 0 && coordinatesIntersections[p1].color() == Lyngk.Color.WHITE)
                flag = false;
        }
        else
        {
            if(claimedColorsPlayerOne.indexOf(coordinatesIntersections[p1].color()) >= 0)
                flag = false;

            if(claimedColorsPlayerTwo.length == 0 && coordinatesIntersections[p1].color() == Lyngk.Color.WHITE)
                flag = false;
        }



        return flag;

    }

    this.availableMoves = function ()
    {
        var moves = [];
        for(var i = 0; i < Lyngk.goodCoordinates.length; i++)
        {
            for(var j = i; j < Lyngk.goodCoordinates.length; j++)
            {
                var pos1 = Lyngk.goodCoordinates[i];
                var pos2 = Lyngk.goodCoordinates[j];
                var p1 = new Lyngk.Coordinates(pos1[0],parseInt(pos1[1]));
                var p2 = new Lyngk.Coordinates(pos2[0],parseInt(pos2[1]));
                if(validMove(p1,p2))
                    moves.push(pos1+";"+pos2);
            }
        }
        return moves;
    }

    this.availableMovablePiecesForPlayer = function (player)
    {
        var movablePieces = [];
        for(var i = 0; i < Lyngk.goodCoordinates.length; i++)
        {
            if(player = Lyngk.Players.PlayerOne)
            {

                if((claimedColorsPlayerOne.length != 0 || coordinatesIntersections[Lyngk.goodCoordinates[i]].color() != Lyngk.Color.WHITE)
                    && claimedColorsPlayerTwo.indexOf(coordinatesIntersections[Lyngk.goodCoordinates[i]].color()) < 0)
                    movablePieces.push(Lyngk.goodCoordinates[i])
            }
            else
            {
                if((claimedColorsPlayerTwo.length != 0 || coordinatesIntersections[Lyngk.goodCoordinates[i]].color() != Lyngk.Color.WHITE)
                    && claimedColorsPlayerOne.indexOf(coordinatesIntersections[Lyngk.goodCoordinates[i]].color()) < 0)
                    movablePieces.push(Lyngk.goodCoordinates[i])
            }
        }
        return movablePieces;
    }

    this.availableMoveFromCoordinate = function (coordinate)
    {
        var moves = [];
        var p1 = new Lyngk.Coordinates(coordinate[0],parseInt(coordinate[1]));
        for(var i = 0; i < Lyngk.goodCoordinates.length; i++)
        {
            var pos2 = Lyngk.goodCoordinates[i];
            var p2 = new Lyngk.Coordinates(pos2[0],parseInt(pos2[1]));
            if(validMove(p1,p2))
            {
                moves.push(pos2);
            }
        }
        return moves;
    }

    init();
};
