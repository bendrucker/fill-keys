'use strict'

var isObject = require('is-object')
var hasOwnProperty = Object.prototype.hasOwnProperty

function fill (destination, source, merge) {
  if (destination && (isObject(source) || isFunction(source))) {
    merge(destination, source)
    if (isFunction(destination) && isFunction(source) && source.prototype) {
      merge(destination.prototype, source.prototype)
    }
  }
  return destination
}

exports = module.exports = function fillKeys (destination, source) {
  return fill(destination, source, mergeDescriptors)
}

exports.es3 = function fillKeysEs3 (destination, source) {
  return fill(destination, source, es3Merge)
}

function es3Merge (destination, source) {
  for (var key in source) {
    if (isKeyMissing(destination, key)) {
      destination[key] = source[key]
    }
  }
  return destination
}

function mergeDescriptors (destination, source) {
  Object.getOwnPropertyNames(source).forEach(function forEachOwnPropertyName (key) {
    if (isKeyMissing(destination, key)) {
      Object.defineProperty(destination, key, Object.getOwnPropertyDescriptor(source, key))
    }
  })
  return destination
}

function isFunction (value) {
  return typeof value === 'function'
}

function isKeyMissing (obj, key) {
  return !hasOwnProperty.call(obj, key) || typeof obj[key] === 'undefined'
}
