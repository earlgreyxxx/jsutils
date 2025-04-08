declare class cachedFetch {
  enabled:boolean;
  constructor(name:string,expire:number);
  fetch(url:string,params?:any) : any
  clear() : Promise<any>;
}

export default cachedFetch;