type EventHandler = (ev:Event) => void;

export declare function createElement(str : string): HTMLElement;
export declare function create(str : string): HTMLElement;
export declare function empty(element : HTMLElement): void;
export declare function css(element : HTMLElement, style : any): void;
export declare function show(element : HTMLElement, value : string): void;
export declare function hide(element : HTMLElement): void;

export declare function on(element_or_selector : EventTarget|string, eventname : string, handler : EventHandler): void;
export declare function on(element_or_selector : EventTarget|string, eventname : string, selector : string, handler? : EventHandler): void;

export declare function once(element_or_selector : EventTarget|string, eventname : string, handler : EventHandler): void;
export declare function once(element_or_selector : EventTarget|string, eventname : string, selector : string, handler : EventHandler): void;

export declare function off(element_or_selector : EventTarget|string, eventname : string): void;
export declare function query(selector : string, element : Document|Window|Element): void;
export declare function queries(selector : string, element : Document|Window|Element): void;
export declare function byId(id : string): HTMLElement
export declare function byTag(tagname : string): HTMLCollectionOf<Element>
export declare function byClass(classname : string): HTMLCollectionOf<Element>
export declare function insertAfter(src : Element, dest : Window|Document|Element): void;
export declare function insertBefore(src : Element, dest : Window|Document|Element): void;
export declare function appendTo(src : Element, dest : Window|Document|Element): void;
export declare function prependTo(src : Element, dest : Window|Document|Element): void;