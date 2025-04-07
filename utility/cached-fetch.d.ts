// Type definitions for cached-fetch.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare export default class
{
  enabled:boolean;
  constructor(name:string,expire:number);
  fetch(url:string,params:any = null) : any
  async clear() : Promise;
};