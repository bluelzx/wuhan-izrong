var sum = require('./sum.js');
var expect = require('chai').expect;

describe('sum', function () {
  it('adds 1 + 2 to equal 3', function () {
    expect(sum(1, 2)).to.be.equal(3);
  });
});

