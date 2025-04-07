// Type definitions for cookie.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 * @param name 
 */
export declare function getCookie(name : string): string|undefined;

/**
 * 
 */
export declare function getCookies(): Map<string,string>;

/**
 * 
 * @param name 
 * @param value 
 * @param options 
 * @return  
 */
export declare function setCookie(name : string, value : any, options : any): boolean;

/**
 * 
 * @param o 
 * @param options 
 */
export declare function setCookies(o : any, options : any): boolean;