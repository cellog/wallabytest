import stuff from './stuff.js'
const should = require('should')

describe('stuff', function() {
  it('does stuff', function() {
    should(stuff('hi')).equal('hi there')
  })
})
