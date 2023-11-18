/*****************************************************************************
*
* BASE64 Codec  ArrayBuffer to Base64 and Base64 to ArrayBuffer
*
*****************************************************************************/
export const b64encode = buffer => btoa(new Uint8Array(buffer).reduce((t,i) => t + String.fromCharCode(i),''));
export const b64decode = str => Uint8Array.from(atob(str),c => c.charCodeAt()).buffer;
