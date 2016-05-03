const should = require('should')
const m = require('meteor/meteor')

describe('stuff', function() {
  it('does stuff', function() {
    should('hi there').equal('hi there')
  })
  it('meteor included', function() {
    should(m).have.property('Meteor')
  })
})
