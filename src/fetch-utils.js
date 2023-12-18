/*****************************************************************************
*
*  fetch wrapper utility
*    - export functions fetchJson,fetchText,fetchBlob and fetchResponse
*
*****************************************************************************/ 
import ObjectToFormData from "./object-formdata.js";

export const fetchJson = (url,params,fetchOptions) => fetchResponse(url,params,fetchOptions).then(response => response.json());
export const fetchText = (url,params,fetchOptions) => fetchResponse(url,params,fetchOptions).then(response => response.text());
export const fetchBlob = (url,params,fetchOptions) => fetchResponse(url,params,fetchOptions).then(response => response.blob());

// non blocking fetch
export function fetchResponse(url,params,fetchOptions = {})
{
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
  return fetch(url,options).then(done).catch(fail);
}