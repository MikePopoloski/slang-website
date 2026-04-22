import LZ from 'lz-string';

export function encodeState(source, options) {
    const state = { source, options };
    const json = JSON.stringify(state);
    return LZ.compressToBase64(json);
}

export function decodeState(encoded) {
    try {
        const json = LZ.decompressFromBase64(encoded);
        if (!json) return null;
        const state = JSON.parse(json);
        return state;
    } catch (e) {
        return null;
    }
}

export function getStateFromHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    return decodeState(hash);
}

export function setStateInHash(source, options) {
    const encoded = encodeState(source, options);
    window.location.hash = encoded;
}
