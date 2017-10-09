"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function (c)
{
    var state = Lyngk.State.VACANT;

    this.getState = function()
    {
        return state;
    }
};
