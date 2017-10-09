"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function ()
{
    var state = Lyngk.State.VACANT;
    var piece;

    this.getState = function()
    {
        return state;
    }

    this.getPiece = function()
    {
        return piece;
    }

    this.pose = function(c)
    {

        if(state == Lyngk.State.ONE_PIECE)
            state = Lyngk.State.STACK;
        else
            state = Lyngk.State.ONE_PIECE;
        piece = new Lyngk.Piece(c);
    }
};
