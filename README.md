<img src="https://cdn.rawgit.com/caiogondim/stream-teleport.js/master/logo/banner.svg">

<h1 align="center">stream-teleport.js</h1>

<div align="center">
<img src="http://travis-ci.org/caiogondim/stream-teleport.js.svg?branch=master" alt="Travis CI"> <img src="https://codecov.io/gh/caiogondim/stream-teleport.js/branch/master/graph/badge.svg" alt="Codecov"> <img src="http://img.badgesize.io/caiogondim/redux-whenever.js/master/src/index.js?compression=gzip" alt="Size"> <a href="https://www.npmjs.com/package/stream-teleport"><img src="https://img.shields.io/npm/v/stream-teleport.svg" alt="Version" /></a>
</div>

<br>

Send big files or chunks of data over a stream.
Useful to overcome WebRTC data channel message size limit.

### Installation

```bash
npm install -S stream-teleport
```

### Usage

Use `.dematerialize` to break a chunk into smaller chunks. Then on the other end use `.rematerialize`
to reassemble it.

Example with WebRTC and [simple-peer lib](https://github.com/feross/simple-peer):

```js
// On sender machine
const dematerializeStream = streamTeleport.dematerialize({ chunkSize: 1024 })
process.stdin.pipe(dematerializeStream).pipe(peer)

// On receiver machine
const rematerializeStream = streamTeleport.rematerialize()
peer.pipe(rematerializeStream).pipe(process.stdout)
```

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
