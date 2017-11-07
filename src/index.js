const through = require('through2')

function dematerialize ({ chunkSize, beginMarker = '{{begin}}', endMarker = '{{end}}' } = {}) {
  if (!chunkSize) {
    throw new TypeError('chunkSize is a mandatory argument')
  }

  return through(function (chunk, encoding, next) {
    this.push(Buffer.from(beginMarker))

    for (let i = 0; i < chunk.byteLength; i += chunkSize) {
      this.push(chunk.slice(i, i + chunkSize))
    }

    this.push(Buffer.from(endMarker))
    next(null)
  })
}

function rematerialize ({ beginMarker = '{{begin}}', endMarker = '{{end}}' } = {}) {
  let isReceiving = false
  let accumulator = Buffer.from([])

  var stream = through(function (chunk, encoding, next) {
    if (chunk.toString() === beginMarker) {
      accumulator = Buffer.from([])
      isReceiving = true
      return next()
    }

    if (chunk.toString() === endMarker) {
      isReceiving = false
      return next(null, accumulator)
    }

    if (isReceiving) {
      accumulator = Buffer.concat([accumulator, chunk])
      next()
    }

    if (!isReceiving) {
      return next(null, chunk)
    }
  })

  return stream
}

module.exports = {
  dematerialize,
  rematerialize
}
