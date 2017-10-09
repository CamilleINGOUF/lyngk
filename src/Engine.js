"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};

Lyngk.Engine = function ()
{
    var coordinatesIntersections = [];

    var init = function()
    {
        var validCoord = Lyngk.goodCoordinates;
        for(var i = 0; i < validCoord.length; i++)
        {
            coordinatesIntersections[validCoord[i]] = new Lyngk.Intersection();
        }
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

    this.init_one_piece_every_color = function()
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

    init();
};
