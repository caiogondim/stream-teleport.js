<img src="https://cdn.rawgit.com/caiogondim/stream-teleport.js/master/logo/banner.svg">

# stream-teleport

<div>
<img src="http://travis-ci.org/caiogondim/stream-teleport.js.svg?branch=master" alt="Travis CI"> <a href='https://coveralls.io/github/caiogondim/stream-teleport.js?branch=master'><img src='https://coveralls.io/repos/github/caiogondim/stream-teleport.js/badge.svg?branch=master' alt='Coverage Status' /></a>
 <img src="http://img.badgesize.io/caiogondim/redux-whenever.js/master/src/index.js?compression=gzip" alt="Size"> <a href="https://www.npmjs.com/package/stream-teleport"><img src="https://img.shields.io/npm/v/stream-teleport.svg" alt="Version" /></a>
</div>

<br>

Send big files or chunks of data over a stream.
Useful to overcome WebRTC data channel message size limit.

## Installation

```bash
npm install -S stream-teleport
```

## Usage

Use `.dematerialize` to break a chunk into smaller chunks. Then on the other end use `.rematerialize`
to reassemble it.

Example sending a big file over WebRTC and [simple-peer lib](https://github.com/feross/simple-peer):

```js
// On sender machine
const dematerializeStream = streamTeleport.dematerialize({ chunkSize: 1024 })
const fileStream = fs.createReadStream('massive-video.mp4')
fileStream.pipe(dematerializeStream).pipe(peer)

// On receiver machine
const rematerializeStream = streamTeleport.rematerialize()
const fileStream = fs.createWriteStream('massive-video.mp4')
peer.pipe(rematerializeStream).pipe(fileStream)
```

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
