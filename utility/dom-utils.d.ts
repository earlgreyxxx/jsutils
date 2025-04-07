// Type definitions for dom-utils.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * 
 * @param str 
 */
export declare function createElement(str : string): HTMLElement;

/**
 * 
 * @param str 
 */
export declare function create(str : string): HTMLElement;

/**
 * 
 * @param element 
 */
export declare function empty(element : HTMLElement): void;

/**
 * 
 * @param element 
 * @param style 
 */
export declare function css(element : HTMLElement, style : any): void;

/**
 * 
 * @param element 
 * @param value 
 */
export declare function show(element : HTMLElement, value : string): void;

/**
 * 
 * @param element 
 */
export declare function hide(element : HTMLElement): void;



/**
 * 
 * @param element_or_selector 
 * @param eventname 
 * @param selector 
 * @param handler 
 */
export declare function on(element_or_selector : HTMLElement|string, eventname : string, selector : string, handler : any): void;

/**
 * 
 * @param element_or_selector 
 * @param eventname 
 */
export declare function off(element_or_selector : HTMLElement|string, eventname : string): void;

/**
 * 
 * @param selector 
 * @param element 
 */
export declare function query(selector : string, element : HTMLElement): void;

/**
 * 
 * @param selector 
 * @param element 
 */
export declare function queries(selector : string, element : HTMLElement): void;

/**
 * 
 * @param id 
 */
export declare function byId(id : string): HTMLElement

/**
 * 
 * @param tagname 
 */
export declare function byTag(tagname : string): HTMLCollectionOf<Element>

/**
 * 
 * @param classname 
 */
export declare function byClass(classname : any): HTMLCollectionOf<Element>

/**
 * 
 * @param src 
 * @param dest 
 */
export declare function insertAfter(src : any, dest : any): void;

/**
 * 
 * @param src 
 * @param dest 
 */
export declare function insertBefore(src : any, dest : any): void;

/**
 * 
 * @param src 
 * @param dest 
 */
export declare function appendTo(src : any, dest : any): void;

/**
 * 
 * @param src 
 * @param dest 
 */
export declare function prependTo(src : any, dest : any): void;

/**
 * 
 * @param position 
 * @param src 
 */
export declare function _element_inserter(position : string, src : any): void;
