"use strict";
Math.seedrandom("1234");

var LyngkTestCase = TestCase("LyngkTestCase");

LyngkTestCase.prototype.testCoordinateNotExist = function()
{
    var coord = new Lyngk.Coordinates('A',1);
    assertFalse(coord.isValid());
};


LyngkTestCase.prototype.test43AvailablesCoordinates = function()
{
    var count = 0;
    var alpha = "ABCDEFGHI";

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
    var board = new Lyngk.Engine();
    assertTrue(board.isFullOnePiece());
}

//8 * each colour plus 3 white pieces
LyngkTestCase.prototype.testInitEveryColor = function()
{
    var engine = new Lyngk.Engine();
    var board = engine.board();

    var colorNumber = [0,0,0,0,0,0];

    for (var coord in board) {
        if (board.hasOwnProperty(coord))
        {
            colorNumber[board[coord].color()]++;
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
    var board = engine.board();
    var flag = true;

    for(var coord in board)
    {
        if(board[coord].getHeight() !== 1)
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
    var board = engine.board();
    var colorA3 = board["A3"].color();

    engine.move("A3","B3");
    var board = engine.board();
    assertTrue(board["A3"].getHeight() === 0 && board["B3"].color() === colorA3 && board["B3"].getHeight() === 2);
}

//scenar 16
LyngkTestCase.prototype.testMoveStack = function()
{
    var engine = new Lyngk.Engine();
    var board = engine.board();
    var colorA3 = board["A3"].color();

    engine.move("A3","B3");
    var colorB3 = board["B3"].color();
    engine.move("B3","B2");

    assertTrue(board["B3"].getHeight() === 0 && board["B2"].color() === colorA3 && board["B2"].color() === colorB3 && board["B2"].getHeight() === 3);
}

//scenar 17
LyngkTestCase.prototype.testMoveOnlyOnStack = function()
{
    var engine = new Lyngk.Engine();
    engine.move("B2","B3");

    var board = engine.board();
    var colorB3 = board["B3"].color();

    //Supposed to be impossible because B2 is empty
    engine.move("B3","B2");
    assertTrue(board["B2"].getState() === Lyngk.State.VACANT && board["B3"].color() === colorB3);
}

//scenar 18
LyngkTestCase.prototype.testNoValidMove = function()
{
    var engine = new Lyngk.Engine();
    //Impossible Move
    engine.move("B3", "C2");
    var board = engine.board();
    assertTrue(board["B3"].getHeight() === 1 && board["C2"].getHeight() === 1);
}

//scenar 19
LyngkTestCase.prototype.testMoveByOne = function()
{
    var engine = new Lyngk.Engine();
    //Impossible move
    engine.move("H5","H8");
    var board = engine.board();

    assertTrue(board["H5"].getHeight() === 1 && board["H8"].getHeight() === 1);
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
    var board = engine.board();

    assertTrue(board["C4"].getHeight() === 5 && board["B5"].getHeight() === 1);
}

//scenar 21
LyngkTestCase.prototype.testMoveOnePieceOnStackImpossible = function()
{
    var engine = new Lyngk.Engine();
    engine.move("I7", "H6");
    //Impossible move because h5 is one_piece and h6 is stack
    engine.move("H5","H6");
    var board = engine.board();
    assertTrue(board["H5"].getHeight() === 1 && board["H6"].getHeight() === 2);
}

//scenar 22
LyngkTestCase.prototype.testMoveHistoire22 = function()
{
    var engine = new Lyngk.Engine();
    engine.move("G4","H5");
    //impossible move because H5 is higher than H6
    engine.move("H6","H5")
    var board = engine.board();
    assertTrue(board["H6"].getHeight() === 1 && board["H5"].getHeight() === 2);
}

//scenar 23
LyngkTestCase.prototype.testOnly1ColorInStack = function()
{
    var engine = new Lyngk.Engine();
    var board = engine.board();

    var heightC1 = board["C1"].getHeight();
    var heughtC2 = board["C2"].getHeight();

    engine.move("C1","C2");
    assertTrue(heightC1 == board["C1"].getHeight() && heughtC2 == board["C2"].getHeight());
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

//scenar 27
LyngkTestCase.prototype.testScenar27 = function ()
{
    var engine = new Lyngk.Engine();
    var board = engine.board();

    //Only player one is important here

    //player 1
    engine.claim(Lyngk.Color.GREEN);
    engine.move("B3","B4");
    //player 2
    engine.claim(Lyngk.Color.BLUE);
    engine.move("H8","H7");

    //player 1
    engine.move("B4","C4");
    //player 2
    engine.move("H7","H6");

    //player 1
    engine.move("C4","D4");
    //player 2
    engine.move("H6","G5");

    //player 1 (now full stack on D3)
    engine.move("D4","D3");
    //player 2 (makes a bad move so he doesn't win a point)
    engine.move("G5","F3");

    //Player one has a score of 1 and only 38 pieces remain on the board
    assertTrue(engine.getScore(Lyngk.Players.PlayerOne) == 1 && engine.numberOfPieces() == 38);
}

//scenar 28
LyngkTestCase.prototype.testOnlyMoveClaimedColor = function ()
{
    var engine = new Lyngk.Engine();
    var board = engine.board();

    //player 1
    engine.claim(1);
    engine.move("B2","B3");
    //player 2
    engine.claim(2);
    engine.move("B3","B4");//impossible move, the color is claimed by player 1

    assertTrue(board["B3"].getHeight() == 2 && board["B4"].getHeight() == 1);
}

//scenar 29
LyngkTestCase.prototype.testScenar29 = function ()
{
    var engine = new Lyngk.Engine();
    //No color claimed so player can't move white pieces
    var availableMovablePieces = engine.availableMovablePiecesForPlayer(engine.getCurrentPlayer());
    assertTrue(availableMovablePieces.length == 40);
}

//scenar 30
LyngkTestCase.prototype.testScenar30 = function ()
{
    var engine = new Lyngk.Engine();
    engine.claim(Lyngk.Color.BLACK);

    engine.move("B3","B2");

    assertTrue(engine.availableMovablePiecesForPlayer(engine.getCurrentPlayer()).length == 32);
}

//scenar 31
LyngkTestCase.prototype.testScenar31 = function ()
{
    var engine = new Lyngk.Engine();
    var board = engine.board();

    assertTrue(engine.availableMoveFromCoordinate("F7").length == 6);
}

//scenar 32
LyngkTestCase.prototype.testScenar32 = function ()
{
    var engine = new Lyngk.Engine();

    //Player 1
    engine.claim(Lyngk.Color.BLACK);
    engine.move("I7","H6");

    //Player 2
    engine.claim(Lyngk.Color.BLUE);
    engine.move("A3","B3");

    //Player 1
    engine.claim(Lyngk.Color.IVORY);
    engine.move("G6","G5");

    //Player 2
    engine.claim(Lyngk.Color.GREEN);
    engine.move("E3","E2");

    //Player 1
    engine.move("G5","G4");

    //Player 2
    engine.move("B3","B4");

    //Player 1
    engine.move("G4","F3");

    //Player 2
    engine.move("B4","C4");

    //Player 1
    engine.move("E5","E6");

    //Player 2
    engine.move("E4","D4");

    //Player 1
    engine.move("E6","E7");

    //Player 2
    engine.move("D4","C3");

    //Player 1
    engine.move("E7","E8");

    //Player 2
    engine.move("C3","C2");

    //Player 1
    engine.move("D7","D6");

    //Player 2
    engine.move("C6","C7");

    //Player 1
    engine.move("D6","D5");

    //Player 2
    engine.move("F8","F7");

    //Player 1
    engine.move("F6","F5");

    //Player 2
    engine.move("C1","D2");

    //Player 1
    engine.move("H7","G7");

    //Player 2
    engine.move("C2","B2");

    //Player 1
    engine.move("F5","F4");

    //Player 2
    engine.move("D2","D3");

    //Player 1
    engine.move("G8","H8");

    var board = engine.board();
    for(var coord in board)
        console.log(coord+" "+board[coord].getHeight()+" "+board[coord].color());


    console.log("Player : "+engine.getCurrentPlayer());
    console.log("Move restants : "+engine.availableMovesForCurrentPlayer());

    console.log("score player one : "+engine.getScore(Lyngk.Players.PlayerOne));
    console.log("score player two : "+engine.getScore(Lyngk.Players.PlayerTwo));

    assertTrue(engine.getGameState() == Lyngk.GameState.OVER && engine.getWinner() == Lyngk.Players.PlayerTwo);
}