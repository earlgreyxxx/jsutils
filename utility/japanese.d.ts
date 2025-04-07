// Type definitions for japanese.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 * @param str 
 * @return  
 */
export declare function isHirakana(str : string): boolean;

/**
 * 
 * @param s 
 * @param options 
 */
export declare function convertKana(s : string, options : any): string|undefined;