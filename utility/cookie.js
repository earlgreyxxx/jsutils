/*****************************************************************************

  クッキー処理

  setCookie(name,value,option)
    name  : required
    value : required but if empty pass empty string.
    option: plain object(has key-value expire,path,domain,secure,httpOnly,samesite)
            if Number or Date, option points expire,
            if String, option points path

  setCookies(o,option)
    same as setCookie, but 1st arguments are Object or Map.

*****************************************************************************/
import * as Type from './type.js';
import { createQueryString,getQueryString } from './querystring.js';

export function getCookie(name) 
{
  const cookies = getQueryString(document.cookie,/\s*;\s*/,{ retMap: true });

  if(Type.isString(name) && name.length > 0)
    return cookies.get(name);

  throw new Error('argument must be string and be not zero length.')
}

export function getCookies()
{
  return getQueryString(document.cookie,/\s*;\s*/,{ retMap: true });
}

export function setCookie(name,value = '',options = {})
{
  return __imp_set_cookie(name,value,options);
}

export function setCookies(o,options = {})
{
  const rv = new Map;
  for(let [k,v] of (Type.isPlainObject(o) ? Object.entries(o) : o))
    rv.set([k,v],__imp_set_cookie(k,v,options));

  return rv;
}


function __imp_set_cookie(name,value,options)
{
  var expires,path,domain,secure,httpOnly,samesite;

  if(Type.isPlainObject(options))
    var {expires,path,domain,secure,httpOnly,samesite} = options;
  else if(Type.isString(options))
    path = options;
  else if(Type.isNumber(options) || Type.isDate(options))
    expires = options;

  if(!name)
    return false;

  const cookie = new Map([[name,value ?? '']]);

  if(expires)
  {
    const t = Type.getType(expires);
    if(t === 'Date')
    {
      cookie.set('Expires',expires);
    }
    else if(t === 'Number')
    {
      const d = new Date;
      d.setTime(Date.now() + expires * 1000);
      cookie.set('Expires', d);
    }
    else if(t === 'String')
    {
      cookie.set('Expires',new Date(expires));
    }
  }

  if(!path)
    path = location.pathname.replace(/\/[^\/]+$/,'');

  if(path !== '/')
    cookie.set('Path',path);

  if(domain)
    cookie.set('Domain',domain);

  if(secure === true)
    cookie.set('Secure','Secure');

  if(httpOnly === true)
    cookie.set('HttpOnly','HttpOnly');

  if(samesite)
    cookie.set('SameSite',samesite);

  const encoder = str => str === name || str === value ? encodeURIComponent(str) : str;

  document.cookie = createQueryString(cookie,'; ',{encoder});

  return true;
}
