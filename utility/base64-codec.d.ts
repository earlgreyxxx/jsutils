// Type definitions for base64-codec.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 * @param buffer 
 */
export declare function b64encode(buffer : ArrayBuffer): string;

/**
 * 
 * @param str 
 */
export declare function b64decode(str : string): Uint8Array;
