'use strict';

var LyngkTestCase = TestCase("LyngkTestCase");

LyngkTestCase.prototype.testA = function()
{
    var coord = new Lyngk.Coordinates('A',1);
    assertTrue(coord.isValid());
};