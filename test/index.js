const test = require('ava')
const through = require('through2')
const streamTeleport = require('../src')

//
// Dematerialize
//

test('break each chunk in smaller chunks of byte length equals to `chunkSize`', (t) => {
  t.plan(5)

  const stream1 = through()
  const stream2 = through()
  const dematerialize = streamTeleport.dematerialize({ chunkSize: 2 })
  let count = 0

  stream1.pipe(dematerialize).pipe(stream2)

  stream2.on('data', data => {
    count += 1
    switch (count) {
      case 1:
        return t.is(data.toString(), '{{begin}}')
      case 2:
        return t.is(data.toString(), 'ab')
      case 3:
        return t.is(data.toString(), 'cd')
      case 4:
        return t.is(data.toString(), 'e')
      case 5:
        return t.is(data.toString(), '{{end}}')
    }
  })

  stream1.push('abcde')
})

test('accepts custom `beginMarker` and `endMarker`', (t) => {
  t.plan(3)

  const stream1 = through()
  const stream2 = through()
  const dematerialize = streamTeleport.dematerialize({
    chunkSize: 2,
    beginMarker: '//begin',
    endMarker: '//end'
  })
  let count = 0

  stream1.pipe(dematerialize).pipe(stream2)

  stream2.on('data', data => {
    count += 1
    switch (count) {
      case 1:
        return t.is(data.toString(), '//begin')
      case 2:
        return t.is(data.toString(), 'a')
      case 3:
        return t.is(data.toString(), '//end')
    }
  })

  stream1.push('a')
})

test('throws if `chunkSize` is missing', (t) => {
  t.throws(() => streamTeleport.dematerialize(), TypeError)
})

//
// Rematerialize
//

test('reassembles smaller chunks into one', (t) => {
  const stream1 = through()
  const stream2 = through()
  const rematerialize = streamTeleport.rematerialize()

  stream1.pipe(rematerialize).pipe(stream2)

  stream2.on('data', data => {
    t.is(data.toString(), 'abcd')
  })

  stream1.push('{{begin}}')
  stream1.push('ab')
  stream1.push('cd')
  stream1.push('{{end}}')
})

test('accepts custom `beginMarker` and `endMarker`', (t) => {
  const stream1 = through()
  const stream2 = through()
  const rematerialize = streamTeleport.rematerialize({
    beginMarker: '🌜',
    endMarker: '🌛'
  })

  stream1.pipe(rematerialize).pipe(stream2)

  stream2.on('data', data => {
    t.is(data.toString(), 'abcd')
  })

  stream1.push('🌜')
  stream1.push('ab')
  stream1.push('cd')
  stream1.push('🌛')
})

//
// Integration
//

test('integration', (t) => {
  const stream1 = through()
  const stream2 = through()
  const dematerialize = streamTeleport.dematerialize({ chunkSize: 2 })
  const rematerialize = streamTeleport.rematerialize()

  stream1.pipe(dematerialize).pipe(rematerialize).pipe(stream2)

  stream2.on('data', data => {
    t.is(data.toString(), 'abcde')
  })

  stream1.push('abcde')
})
