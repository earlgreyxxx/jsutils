// Type definitions for fetch-utils.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 */
export declare namespace CachedFetch{
		
	/**
	 * 
	 */
	export var firstCall : boolean;
}

/**
 * 
 * @param url 
 * @param params 
 * @param fetchOptions 
 */
export declare function fetchJson(url : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param url 
 * @param params 
 * @param fetchOptions 
 */
export declare function fetchText(url : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param url 
 * @param params 
 * @param fetchOptions 
 */
export declare function fetchBlob(url : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param cachedUrl 
 * @param params 
 * @param fetchOptions 
 */
export declare function cachedJson(cachedUrl : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param cachedUrl 
 * @param params 
 * @param fetchOptions 
 */
export declare function cachedText(cachedUrl : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param cachedUrl 
 * @param params 
 * @param fetchOptions 
 */
export declare function cachedBlob(cachedUrl : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param url 
 * @param params 
 * @param fetchOptions 
 */
export declare function fetchResponse(url : any, params : any, fetchOptions : any): void;

/**
 * 
 * @param cachedUrl 
 * @param params 
 * @param fetchOptions 
 */
export declare function cachedResponse(cachedUrl : any, params : any, fetchOptions : any): void;

