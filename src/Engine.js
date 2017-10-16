"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};

Lyngk.Engine = function ()
{
    var coordinatesIntersections = [];

    var init = function() {
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
            }
        }
    }

    var validMove = function(p1, p2)
    {
        var flag = false;
        //If vertical move
        if(p1.getColumn() === p2.getColumn())
        {
            var lineDiff = p1.getLine() - p2.getLine();
            //up or down
            if(lineDiff === 1 || lineDiff === -1)
            {
                flag = true;
            }
        }
        //IF move to left
        else if(p1.getColumn() < p2.getColumn())
        {
            var lineDiff = p1.getLine() - p2.getLine();
            //Only if stay on same line or go down
            if(lineDiff === 0 || lineDiff === -1)
            {
                flag = true;
            }
        }
        else if(p1.getColumn() > p2.getColumn())
        {
            var lineDiff = p1.getLine() - p2.getLine();
            //Only if stay on same line or go down
            if(lineDiff === 1 || lineDiff === 0)
            {
                flag = true;
            }
        }

        if(coordinatesIntersections[p1].getState() === Lyngk.State.FULL_STACK)
            flag = false;

        if(coordinatesIntersections[p1].getState() === Lyngk.State.ONE_PIECE &&
            coordinatesIntersections[p2].getState() === Lyngk.State.STACK)
            flag = false;

        if(coordinatesIntersections[p1].getHeight() < coordinatesIntersections[p2].getHeight())
            flag = false;

        return flag;
    }

    init();
};
