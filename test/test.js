'use strict';

var LyngkTestCase = TestCase("LyngkTestCase");

//Rechercher une coordonnée qui n'existe pas -> A1
LyngkTestCase.prototype.testA = function()
{
    var coord = new Lyngk.Coordinates('A',1);
    assertFalse(coord.isValid());
};

LyngkTestCase.prototype.testB = function()
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