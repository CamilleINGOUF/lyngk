'use strict';
Math.seedrandom('1234');

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

//scenar 19
LyngkTestCase.prototype.testMoveByOne = function()
{
    var engine = new Lyngk.Engine();
    //Impossible move
    engine.move("H5","H8");
    var plateau = engine.plateau();

    assertTrue(plateau["H5"].getHeight() === 1 && plateau["H8"].getHeight() === 1);
}

//scenar 20
LyngkTestCase.prototype.testMoveFullStackImpossible = function()
{
    var engine = new Lyngk.Engine();
    engine.move("D2","C1")
    engine.move("C1", "C2");
    engine.move("C2","C3");
    engine.move("C3","C4");
    //Impossible move because F3 is fullstack
    engine.move("C4","B5");
    var plateau = engine.plateau();

    assertTrue(plateau["C4"].getHeight() === 5 && plateau["B5"].getHeight() === 1);
}

//scenar 21
LyngkTestCase.prototype.testMoveOnePieceOnStackImpossible = function()
{
    var engine = new Lyngk.Engine();
    engine.move("I7", "H6");
    //Impossible move because h5 is one_piece and h6 is stack
    engine.move("H5","H6");
    var plateau = engine.plateau();
    assertTrue(plateau["H5"].getHeight() === 1 && plateau["H6"].getHeight() === 2);
}

//scenar 22
LyngkTestCase.prototype.testMoveHistoire22 = function()
{
    var engine = new Lyngk.Engine();
    engine.move("G4","H5");
    //impossible move because H5 is higher than H6
    engine.move("H6","H5")
    var plateau = engine.plateau();
    assertTrue(plateau["H6"].getHeight() === 1 && plateau["H5"].getHeight() === 2);
}

//scenar 23
LyngkTestCase.prototype.testOnly1ColorInStack = function()
{
    var engine = new Lyngk.Engine();
    var plateau = engine.plateau();

    var heightC1 = plateau["C1"].getHeight();
    var heughtC2 = plateau["C2"].getHeight();

    engine.move("C1","C2");
    assertTrue(heightC1 == plateau["C1"].getHeight() && heughtC2 == plateau["C2"].getHeight());
}

//scenar 24
LyngkTestCase.prototype.testGameStartsWithPlayerOne = function ()
{
    var engine = new Lyngk.Engine();
    assertTrue(engine.getCurrentPlayer() == Lyngk.Players.PlayerOne);
}

//scenar 25
LyngkTestCase.prototype.testChangePlayerEveryMove = function()
{
    var engine = new Lyngk.Engine();
    engine.move("A3","B3");
    assertTrue(engine.getCurrentPlayer() == Lyngk.Players.PlayerTwo);
}

//scenar 26
LyngkTestCase.prototype.testPlayersClaimColors = function ()
{
    var engine = new Lyngk.Engine();
    engine.claim(Lyngk.Color.BLACK);
    engine.move("C1","C2");
    engine.claim(Lyngk.Color.BLUE);

    var claimedColorsOne = engine.getClaimedColors(Lyngk.Players.PlayerOne);
    var claimedColorstwo = engine.getClaimedColors(Lyngk.Players.PlayerTwo);

    assertTrue(claimedColorsOne[0] == Lyngk.Color.BLACK && claimedColorstwo[0] == Lyngk.Color.BLUE);
}