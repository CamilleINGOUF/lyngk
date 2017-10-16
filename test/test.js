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
    assertTrue(tempCoord.hash() == (653));
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
    assertTrue(inter.getState() === Lyngk.State.ONE_PIECE && inter.color() === "bleu");
}

LyngkTestCase.prototype.testStack = function()
{
    var inter = new Lyngk.Intersection();
    inter.pose("bleu");
    inter.pose("rouge");
    assertTrue(inter.getState() === Lyngk.State.STACK && inter.color() === "rouge");
}

LyngkTestCase.prototype.testFullStack = function()
{
    var inter = new Lyngk.Intersection();
    inter.pose("bleu");
    inter.pose("rouge");
    inter.pose("bleu");
    inter.pose("rouge");
    inter.pose("jaune");
    assertTrue(inter.getState() === Lyngk.State.FULL_STACK && inter.color() === "jaune");
}

LyngkTestCase.prototype.testOnePieceOnEveryInter = function()
{
    var plateau = new Lyngk.Engine();
    assertTrue(plateau.is_full_one_piece());
}

//8 * each colour plus 3 white pieces
LyngkTestCase.prototype.testInitEveryColor = function()
{
    var engine = new Lyngk.Engine();
    var plateau = engine.plateau();

    var colorNumber = [0,0,0,0,0,0];

    for (var coord in plateau) {
        if (plateau.hasOwnProperty(coord))
        {
            colorNumber[plateau[coord].color()]++;
        }
    }

    var flag = true;
    for(var i = 0; i < colorNumber.length; i++)
    {
        if(i <= 4 && colorNumber[i] != 8)
            flag = false;
        else if(i == 5 && colorNumber[i] != 3)
            flag = false;
    }
    assertTrue(flag);
}

// Scenar 13
LyngkTestCase.prototype.testPileHeight1 = function()
{
    var engine = new Lyngk.Engine();
    var plateau = engine.plateau();
    var flag = true;

    for(var coord in plateau)
    {
        if(plateau[coord].getHeight() !== 1)
            flag = false;
    }
    assertTrue(flag);
}

//scenar 14
LyngkTestCase.prototype.testStackColor = function()
{
    var inter = new Lyngk.Intersection();
    inter.pose(Lyngk.Color.BLACK);
    inter.pose(Lyngk.Color.IVORY);
    assertTrue(inter.color() == Lyngk.Color.IVORY);
}

//scenar 15
LyngkTestCase.prototype.testMovePiece = function()
{
    var engine = new Lyngk.Engine();
    var plateau = engine.plateau();
    var colorA3 = plateau["A3"].color();

    engine.move("A3","B3");
    var plateau = engine.plateau();
    assertTrue(plateau["A3"].getHeight() === 0 && plateau["B3"].color() === colorA3 && plateau["B3"].getHeight() === 2);
}

//scenar 16
LyngkTestCase.prototype.testMoveStack = function()
{
    var engine = new Lyngk.Engine();
    var plateau = engine.plateau();
    var colorA3 = plateau["A3"].color();

    engine.move("A3","B3");
    var colorB3 = plateau["B3"].color();
    engine.move("B3","B2");

    assertTrue(plateau["B3"].getHeight() === 0 && plateau["B2"].color() === colorA3 && plateau["B2"].color() === colorB3 && plateau["B2"].getHeight() === 3);
}

//scenar 17
LyngkTestCase.prototype.testMoveOnlyOnStack = function()
{
    var engine = new Lyngk.Engine();
    engine.move("B2","B3");

    var plateau = engine.plateau();
    var colorB3 = plateau["B3"].color();

    //Supposed to be impossible because B2 is empty
    engine.move("B3","B2");
    assertTrue(plateau["B2"].getState() === Lyngk.State.VACANT && plateau["B3"].color() === colorB3);
}

//scenar 18
LyngkTestCase.prototype.testNoValidMove = function()
{
    var engine = new Lyngk.Engine();
    //Impossible Move
    engine.move("B3", "C2");
    var plateau = engine.plateau();
    assertTrue(plateau["B3"].getHeight() === 1 && plateau["C2"].getHeight() === 1);
}