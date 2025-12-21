export declare namespace CachedFetch{
	export var firstCall : boolean;
}

export declare function fetchJson(url : string, params : any, fetchOptions : any): Promise<any>;
export declare function fetchText(url : string, params : any, fetchOptions : any): Promise<string>;
export declare function fetchBlob(url : string, params : any, fetchOptions : any): Promise<Blob>;
export declare function cachedJson(cachedUrl : string, params : any, fetchOptions : any): Promise<any>;
export declare function cachedText(cachedUrl : string, params : any, fetchOptions : any): Promise<string>;
export declare function cachedBlob(cachedUrl : string, params : any, fetchOptions : any): Promise<Blob>;
export declare function fetchResponse(url : string, params : any, fetchOptions : any): Promise<Response>;
export declare function cachedResponse(cachedUrl : string, params : any, fetchOptions : any): Promise<Response>;

