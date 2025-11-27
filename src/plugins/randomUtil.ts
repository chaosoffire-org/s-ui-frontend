const seq = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const RandomUtil = {
  randomIntRange(min: number, max: number): number {
    if (!Number.isSafeInteger(min)){
      return this.randomIntRange(Number.MIN_SAFE_INTEGER, max)
    }
    if (!Number.isSafeInteger(max)){
      return this.randomIntRange(min, Number.MAX_SAFE_INTEGER)
    }
    if (max < min) {
      return this.randomIntRange(max, min)
    }
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const highbits = array[0]
    const lowbits = array[1] >>> 11
    const random = (highbits * 2 ** 21 + lowbits) / (Number.MAX_SAFE_INTEGER + 1)
    return Math.floor(random * (max - min + 1) + min)
  },
  randomInt(n: number): number {
    return this.randomIntRange(0, n)
  },
  // This will work for seq with length < 256
  randomSeq(count: number): string {
    if (count <= 0) {
      return ''
    }
    const chars = seq
    const charsLen = chars.length
    if (charsLen < 1 || charsLen > 256) {
      throw new Error('Character set must be between 1 and 256 characters.')
    }
    const limit = 256 - (256 % charsLen);
    const p = limit / 256;

    // Calculate buffer size for 95% confidence (z = 1.645)
    const safetyFactor = 1.645;
    const MAX_BYTES = 65536;
    const expectedBytes = Math.ceil((count + safetyFactor * Math.sqrt(count * (1 - p))) / p)
    const bufferSize = Math.min(expectedBytes, MAX_BYTES)
    const cache = new Uint8Array(bufferSize)
    let str = ''
    do {
      window.crypto.getRandomValues(cache)
      for (let i = 0; i < bufferSize && str.length < count; i++) {
        if (cache[i] < limit) {
          str += chars[cache[i] % charsLen]
        }
      }
    } while (str.length < count)
    return str
  },
  randomLowerAndNum(count: number): string {
    if (count <= 0) {
      return ''
    }
    let str = ''
    for (let i = 0; i < count; ++i) {
        str += seq[this.randomInt(36)]
    }
    return str
  },
  randomBase64(size: number): string {
    if (size <= 0) {
      return ''
    }
    const array = new Uint8Array(size)
    window.crypto.getRandomValues(array)
    let binary = '';
    const len = array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(array[i]);
    }
    return btoa(binary);
  },
  randomHex(size: number): string {
    if (size <= 0) return '';
    const rng = new Uint8Array(size);
    window.crypto.getRandomValues(rng);
    let hex = '';
    for (let i = 0; i < size; i++) {
      hex += byteToHex[rng[i]];
    }
    return hex;
  },
  randomUUID(): string {
    const rng = new Uint8Array(16);
    window.crypto.getRandomValues(rng);
    rng[6] = (rng[6] & 0x0f) | 0x40;
    rng[8] = (rng[8] & 0x3f) | 0x80;
    return (
      byteToHex[rng[0]] + byteToHex[rng[1]] + byteToHex[rng[2]] + byteToHex[rng[3]] + '-' +
      byteToHex[rng[4]] + byteToHex[rng[5]] + '-' +
      byteToHex[rng[6]] + byteToHex[rng[7]] + '-' +
      byteToHex[rng[8]] + byteToHex[rng[9]] + '-' +
      byteToHex[rng[10]] + byteToHex[rng[11]] + byteToHex[rng[12]] +
      byteToHex[rng[13]] + byteToHex[rng[14]] + byteToHex[rng[15]]
    );
  },
  randomShadowsocksPassword(n: 16 | 32): string {
    return this.randomBase64(n)
  },
  randomShortId(count: number = 24): string[] {
    const ids: string[] = new Array(count);
    const lengthBytes = new Uint8Array(count);
    window.crypto.getRandomValues(lengthBytes);
    let totalBytes = 0;
    const lengths = new Int8Array(count);
    for (let i = 0; i < count; i++) {
      const len = (lengthBytes[i] & 0x07) + 1;
      lengths[i] = len;
      totalBytes += len;
    }

    const rng = new Uint8Array(totalBytes);
    window.crypto.getRandomValues(rng);
    let offset = 0;
    for (let i = 0; i < count; i++) {
      let hex = '';
      const len = lengths[i];
      for (let j = 0; j < len; j++) {
        hex += byteToHex[rng[offset++]];
      }
      ids[i] = hex;
    }
    return ids;
  }
}

const byteToHex = Array.from(
  { length: 256 },
  (_, i) => (i + 0x100)
    .toString(16)
    .slice(1)
)

export default RandomUtil