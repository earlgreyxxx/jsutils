// Type definitions for type.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 * @param o 
 */
export declare function getType(o : any): string;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isPlainObject(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isNumber(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isNumeric(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isString(o : any): boolean;

/**
 * 
 * @param o 
 */
export declare function isFunction(o : any): void;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isBoolean(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isMap(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isSet(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isDate(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isHtmlElement(o : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isNodeList(o : any): boolean;

/**
 * 
 * @param value 
 * @return  
 */
export declare function isArray(value : any): boolean;

/**
 * 
 * @param o 
 * @return  
 */
export declare function isArrowFunction(o : any): boolean;

/**
 * 
 * @param o 
 * @param typename 
 * @return  
 */
export declare function is(o : any, typename : string): boolean;
