'use strict'

var test = require('tape')
var fillKeys = require('./')

test('fill-keys', function (t) {
  t.test('es5', function (t) {
    run(fillKeys, t)

    var dest = {}
    fillKeys(dest, Object.defineProperty({}, 'foo', {
      enumerable: true
    }))
    t.ok(Object.getOwnPropertyDescriptor(dest, 'foo').enumerable, 'copies descriptor')

    t.end()
  })

  t.test('es3', function (t) {
    run(fillKeys.es3, t)
    t.end()
  })

  t.end()
})

function run (fill, t) {
  t.deepEqual(fill({}, {foo: 'bar'}), {foo: 'bar'}, 'simple deep equality')

  let dest = {}
  fill(dest, {foo: 'bar'})
  t.deepEqual(dest, {foo: 'bar'}, 'mutates dest')

  function sourceFn () {}
  function destFn () {}
  sourceFn.prototype = {foo: 'bar'}
  t.deepEqual(fill(destFn, sourceFn).prototype, {foo: 'bar'}, 'fills prototype')

  t.equal(fill(undefined, undefined), undefined, 'both')
  t.deepEqual(fill({}, undefined), {}, 'source undefined')
  t.deepEqual(fill(undefined, {}), undefined, 'dest undefined')

  t.deepEqual(fill({foo: undefined}, {foo: 'bar'}), {foo: 'bar'}, 'destination obj has a property set to undefined')

  t.deepEqual(fill(Object.create(null), {foo: 'bar'}), {foo: 'bar'}, 'destination obj has no proto')
}

test('fn with no prototype', function (t) {
  t.doesNotThrow(fillKeys.bind(null, function () {}, Date.now))
  t.end()
})
