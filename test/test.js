'use strict';

var LyngkTestCase = TestCase("LyngkTestCase");

//Rechercher une coordonnée qui n'existe pas -> A1
LyngkTestCase.prototype.testCoordinateNotExist = function()
{
    var coord = new Lyngk.Coordinates('A',1);
    assertFalse(coord.isValid());
};


LyngkTestCase.prototype.test43AvailablesCoordinates = function()
{
    var count = 0;
    var alpha = "ABCDEFGHI"

    for(var i = 0; i < alpha.length; i++)
    {
        for(var j = 1; j < 10; j++)
        {
            var tempCoord = new Lyngk.Coordinates(alpha[i],j)
            if(tempCoord.isValid())
                count++;
        }
    }
    assertTrue(count === 43);
};

LyngkTestCase.prototype.testGoodRepresentation = function()
{
    var tempCoord = new Lyngk.Coordinates('A',3);
    assertTrue(tempCoord.toString() === "A3");
}

LyngkTestCase.prototype.testInvalidRepresention = function()
{
    var tempCoord = new Lyngk.Coordinates('A',1);
    assertTrue(tempCoord.toString() === "invalid");
}

LyngkTestCase.prototype.testCloneCoordinates = function()
{
    var coord1 = new Lyngk.Coordinates("A",3);
    var coord2 = coord1.clone();
    assertTrue(coord1.toString() === coord2.toString());
}

//Hash -> column ascii value + line number
LyngkTestCase.prototype.testHashCode = function()
{
    var tempCoord = new Lyngk.Coordinates("A",3);
    assertTrue(tempCoord.hash() == (65 + 3));
}

LyngkTestCase.prototype.testDefaultIntersec = function()
{
    var inter = new Lyngk.Intersection();
    assertTrue(inter.getState() === Lyngk.State.VACANT);
}

LyngkTestCase.prototype.testPlaceColor = function()
{
    var inter = new Lyngk.Intersection();
    inter.pose("bleu");
    assertTrue(inter.getState() === Lyngk.State.ONE_PIECE && inter.getPiece().getColor() === "bleu");
}

LyngkTestCase.prototype.testStack = function()
{
    var inter = new Lyngk.Intersection();
    inter.pose("bleu");
    inter.pose("rouge");
    assertTrue(inter.getState() === Lyngk.State.STACK && inter.getPiece().getColor() === "rouge");
}