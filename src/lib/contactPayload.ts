const CHUNK = 0x8000;

function bytesToBinary(bytes: Uint8Array) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK));
  }
  return binary;
}

export function encodeContactPayload(payload: unknown, prefix: string) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return prefix + btoa(bytesToBinary(bytes));
}

export async function fileToBase64(file: File) {
  return btoa(bytesToBinary(new Uint8Array(await file.arrayBuffer())));
}
