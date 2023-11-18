/*****************************************************************************

 URL引数(QUERY_STRING)の展開・作成
   getQueryString(value,delimitor,options):
     value     => [default] location.search
     delimitor => [default] /[&;]+/
     options   => [default] { decoder: decodeURIComponent,override: true, retMap: true}

    createQueryString(object,delimitor,options)
     object    => required
     delimitor => [default] '&'
     options   => [default] { encoder: encodeURIComponent, replacer: defaultReplacer }

     object : Map or Object
      key must be String and value is Map,Object,Set,Array,String,Number,Date ...
        children elements of Map,Object,Set,Array(except String,Number) are converted with JSON.stringify. 

****************************************************************************/
'use strict';
import * as Type from './type.js';

const gConfig = new Map([
  ['decoder',decodeURIComponent],
  ['encoder',encodeURIComponent],
  ['replacer',defaultReplacer]
]);

export function getQueryString(q,delimitor,options)
{
  if(!delimitor)
    delimitor = /[&;]+/;

  if(!Type.isPlainObject(options))
    options = {};

  options = Object.assign({override: true,retMap: false},options);

  return __get_query_string(q,delimitor,options);
}

export function createQueryString(o,delimitor,options)
{
  return __create_query_string(o,delimitor,options ?? { });
}

function __get_query_string(q,delimitor,{ decoder,override,retMap })
{
  if(!Type.isFunction(decoder))
    decoder = gConfig.get('decoder');

  const rv = new Map;

  if(!delimitor)
    delimitor = '';

  if(!q)
    q = window.location.search.slice(1);

  const re1 = /(\w+)\[\]$/;
  const re2 = /(\w+)\[([^\[\]]+)\]$/;

  q = q.trim();
  if(q)
  {
    q.split(delimitor).forEach(v => {
      try{
        v = decoder(v.trim());
        let [key,value] = v.split('=',2);
        let m;

        m = key.match(re1);
        if(m)
        {
          key = m[1];
          if(rv.has(key))
            rv.get(key).push(value ?? '');
          else
            rv.set(key,[value ?? '']);

          return;
        }

        m = key.match(re2);
        if(m)
        {
          key = m[1];
          if(!rv.has(key))
            rv.set(key,{});

          (rv.get(key))[m[2]] = value ?? '';

          return;
        }

        if(rv.has(key) && override === false)
        {
          if(Array.isArray(rv.get(key)))
            rv.get(key).push(value ?? '')
          else
            rv.set(key,[rv.get(key),value ?? '']);
        }
        else
        {
          rv.set(key,value ?? key);
        }
      }
      catch(e) {
        console.error(e);
      }
    });
  }

  return retMap ? rv : Object.fromEntries(rv);
}

function __create_query_string(o,delimitor = '&',{ encoder,replacer })
{
  if(!o)
    throw new Error('1st argument must be specified.')
  let rv = '';
  if(!Type.isFunction(encoder))
    encoder = gConfig.get('encoder');

  if(!Type.isFunction(replacer))
    replacer = gConfig.get('replacer');

  if(Type.isPlainObject(o))
    o = new Map(Object.entries(o));

  if(Type.isMap(o))
  {
    const ar = [];
    for(let [k,v] of o)
    {
      if(!Type.isString(k))
        continue;

      if(Array.isArray(v))
        ar.push(...v.map(vv => [encoder(`${k}[]`),encoder(replacer(vv))].join('=')));
      else if(Type.isSet(v))
        ar.push(...Array.from(v.values()).map(vv => [encoder(`${k}[]`),encoder(replacer(vv))].join('=')));
      else if(Type.isPlainObject(v))
        ar.push(...Object.entries(v).map(([kk,vv]) => [encoder(`${k}[${kk}]`),encoder(replacer(vv))].join('=')));
      else if(Type.isMap(v))
        ar.push(...Array.from(v.entries()).map(([kk,vv]) => [encoder(`${k}[${kk}]`),encoder(replacer(vv))].join('=')));
      else
        ar.push(k === v ? encoder(k) : `${encoder(k)}=${encoder(replacer(v))}`);
    }
    rv = ar.join(delimitor);
  }
  return rv;
}

function defaultReplacer(o)
{
  let rv;
  switch(Type.getType(o))
  {
    case 'Set':
      o = Array.from(o);
    case 'Array':
    case 'Object':
      rv = JSON.stringify(o);
      break;
    case 'Map':
      rv = JSON.stringify(Object.fromEntries(o));
      break;
    case 'Date':
      rv = o.toUTCString();
      break;
    default:
      rv = o.toString();
      break;
  }
  return rv;
}
