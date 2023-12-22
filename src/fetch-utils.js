/*****************************************************************************
*
*  fetch wrapper utility
*    - export functions fetchJson,fetchText,fetchBlob and fetchResponse
*
*****************************************************************************/ 
import { isFunction } from "./type.js";
import CachedFetch from "./cached-fetch.js";
import ObjectToFormData from "./object-formdata.js";

export const fetchJson = (url,params,fetchOptions) => fetchResponse(url,params,fetchOptions).then(response => response.json());
export const fetchText = (url,params,fetchOptions) => fetchResponse(url,params,fetchOptions).then(response => response.text());
export const fetchBlob = (url,params,fetchOptions) => fetchResponse(url,params,fetchOptions).then(response => response.blob());

export const cachedJson = (url,params,fetchOptions) => cachedResponse(url,params,fetchOptions).then(response => response.json());
export const cachedText = (url,params,fetchOptions) => cachedResponse(url,params,fetchOptions).then(response => response.text());
export const cachedBlob = (url,params,fetchOptions) => cachedResponse(url,params,fetchOptions).then(response => response.blob());

// non blocking fetch
export function fetchResponse(url,params,fetchOptions = {})
{
  return __imp_fetchResponse(globalThis.fetch,url,params,fetchOptions)
}

// url must have prefix 'cache:{appname,expire time(second)}/'
// ex. cachedResponse('cache:apps1,3600;http://hogehoge.com/api/get');
export function cachedResponse(url,params,fetchOptions = {})
{
  const m = url.match(/^cache:(\w+),(\d+);(.+)/);
  if(!m)
    throw new Error('1st argument is valid pattern');

  m.shift();
  const [name,expire,url] = m;
  if(expire <= 0)
    throw new Error('expire must be higher than 0');

  const cf = new CachedFetch(name,expire);
  return __imp_fetchResponse(cf.fetch,url,params,fetchOptions)
}

function __imp_fetchResponse(funcFetch,url,params,fetchOptions = {})
{
  if(!isFunction(funcFetch))
    throw new Error('1st argument not function');

  const options = params ? { method: 'POST',body: ObjectToFormData(params), ...fetchOptions } : { method: 'GET', ...fetchOptions };
  if(!options.body)
    options.method = 'GET';

  const done = response => {
    if(!response.ok)
    {
      const e = new Error('Failed to server connection.');
      e.result = { 
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      };

      throw e;
    }

    return response;
  };
  const fail = e => {
    throw e;
  };
  return funcFetch(url,options).then(done).catch(fail);
}
