"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function () {
    var state = Lyngk.State.VACANT;
    var pieces = [];
    var lastIndexPieces = 0;

    this.getState = function () {
        return state;
    }

    this.getPieces = function () {
        return pieces;
    }

    this.color = function () {
        if (pieces.length > 0) {
            return pieces[lastIndexPieces - 1].getColor();
        } else {
            return -1;
        }
    }

    this.pose = function (c) {
        if (pieces.length <= 0) {
            state = Lyngk.State.ONE_PIECE;
        } else if (pieces.length >= 4) {
            state = Lyngk.State.FULL_STACK;
        } else {
            state = Lyngk.State.STACK;
        }

        pieces.push(new Lyngk.Piece(c));
        lastIndexPieces += 1;
    }

    this.removeStack = function () {
        if (pieces.length > 0) {
            state = Lyngk.State.VACANT;
            var stack = pieces;
            pieces = [];
            return stack;
        }
        return -1;
    }

    this.getHeight = function () {
        return pieces.length;
    }

    this.isColorInIntersection = function (color) {
        var flag = false;
        var index;
        for (index = 0; index < pieces.length; index += 1) {
            if (pieces[index].getColor() === color) {
                flag = true;
            }
        }
        return flag;
    };
};
