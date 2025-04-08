export declare const BlockWindow: {
  $frame: HTMLElement;
  timeout: number[];
  refCounter: number;
  isLocking: () => boolean;
  lock: (delay?: number,setting?: {loading:string,message: string,spinner: str}) => this;
  unlock: (clear?: boolean) => this;
  message: (m: string) => this;
  delayLock: (delay?: number,options: {loading:string,message: string,spinner: str}) => this;
  cancelTimeout: () => void;
  cancelTimeoutAll: () => void;
};

export declare function Blocking(promise: Promise<any>, m: string) : Promise<any> 
export declare namespace Blocking {
  function fetch(url:string, params:any,fetchOptions: any) : Promise<Response>;
  function fetchJson(url:string, params:any,fetchOptions: any) : Promise<any>;
  function fetchText(url:string, params:any,fetchOptions: any) : Promise<string>;
  function fetchBlob(url:string, params:any,fetchOptions: any) : Promise<Blob>;
  function cachedFetch(url:string, params:any,fetchOptions: any) : Promise<Response>;
  function cachedJson(url:string, params:any,fetchOptions: any) : Promise<any>;
  function cachedText(url:string, params:any,fetchOptions: any) : Promise<string>;
  function cachedBlob(url:string, params:any,fetchOptions: any) : Promise<Blob>;
  function lock(delay?: number,setting?: {loading:string,message: string,spinner: str}):this;
  function unlock(clear?: boolean):this;
  function isLocking():boolean;
  function message(m: string):this;
}

export declare namespace NonBlocking {
  function fetch(url:string, params:any,fetchOptions: any) : Promise<Response>;
  function fetchJson(url:string, params:any,fetchOptions: any) : Promise<any>;
  function fetchText(url:string, params:any,fetchOptions: any) : Promise<string>;
  function fetchBlob(url:string, params:any,fetchOptions: any) : Promise<Blob>;
  function cachedFetch(url:string, params:any,fetchOptions: any) : Promise<Response>;
  function cachedJson(url:string, params:any,fetchOptions: any) : Promise<any>;
  function cachedText(url:string, params:any,fetchOptions: any) : Promise<string>;
  function cachedBlob(url:string, params:any,fetchOptions: any) : Promise<Blob>;
}

export declare const config : Map<string,number|string|boolean>;
