const utf8decoder = new TextDecoder() // default 'utf-8' or 'utf8'

const u8arr = new Uint8Array([240, 160, 174, 183])
const i8arr = new Int8Array([-16, -96, -82, -73])
const u16arr = new Uint16Array([41200, 47022])
const i16arr = new Int16Array([-24336, -18514])
const i32arr = new Int32Array([-1213292304])

console.log(utf8decoder.decode(u8arr))
console.log(utf8decoder.decode(i8arr))
console.log(utf8decoder.decode(u16arr))
console.log(utf8decoder.decode(i16arr))
console.log(utf8decoder.decode(i32arr))
