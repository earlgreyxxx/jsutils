/*****************************************************************************
*
* Blocking or Non Blocking window in processing asynchronus method.
*
*   * required jQuery and Bootstrap spinner
*
*   exprot BlockWindow { lock(delay,{message,loading}),unlock(),message(HTMLElement || string(if not-string x.toString())) }
*   export Blocking { fetch,fetchJson,fetchText,fetchBlob,cachedJson,cachedText,cachedBlob,lock,unlock,config }
*   export NonBlocking { fetch,fetchJson,fetchText,fetchBlob,cachedJson,cachedText,cachedBlob, }
*   export config
*
*****************************************************************************/ 
import { isFunction } from '../utility/type.js';
import CachedFetch from "../utility/cached-fetch.js";
import ObjectToFormData from '../utility/object-formdata.js';
import * as FetchUtils from '../utility/fetch-utils.js';

const $ = window.jQuery;

const _lock_layer_css = {
  backdropFilter: 'blur(1rem)',
  backgroundColor: 'rgba(0,0,0,.5)',
  bottom: 0,
  display: 'none',
  left: 0,
  paddingTop: 200,
  position: 'fixed',
  right: 0,
  textAlign: 'center',
  top: 0,
  width: '100%',
  zIndex: 9999,
};

export const BlockWindow = {
  $frame : null,
  timeout: null,
  refCounter: 0,
  lock: function(delay,{loading,message,spinner} = {}) {
    this.refCounter++;

    if(typeof(loading) !== 'boolean')
      loading = true;

    if(message)
      this.message(message);

    if(delay && typeof(delay) === 'number' && delay > 0)
    {
      this.timeout = setTimeout(() => {
        if(this.refCounter <= 1)
          this.$frame = createBackDrop(loading,spinner).show()
      },delay);
    }
    else
    {
      if(this.refCounter <= 1)
        this.$frame = createBackDrop(loading,spinner).show();
    }

    return this;
  },

  unlock : function() {
    if(this.timeout)
    {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if(--this.refCounter <= 0)
    {
      this.$frame?.remove();
      this.$frame = null;
    }

    return this;
  },

  message: function(m) {
    if(this.$frame)
    {
      if(m)
      {
        const $message = this.$frame.find('#progress-message');
        if(m instanceof HTMLElement)
          $message.empty().append(m);
        else
          $message.empty().html(m.toString());
      }
    }

    return this;
  },

  delayLock: function(delay,options = {}) {
    if(!delay || typeof(delay) !== 'number')
      delay = config.get('delay');

    this.lock(delay,options);

    return this.timeout;
  }
};

function createBackDrop(loading,spinner)
{
  if(!spinner)
    spinner = '<span class="spinner-border text-light" style="width:64px;height:64px;"></span>';

  const $frame = $('<div />').css(_lock_layer_css);
  if(loading === true)
    $frame.append($(spinner));

  $frame.append($('<span />').addClass('d-block my-5 text-center text-light blinking').attr('id', 'progress-message'));

  return $frame.appendTo(document.body);
}

// blocking fetch
function _bck_fetch(url,params,fetchOptions = { cache: 'no-store' })
{
  return __imp_bck_fetch(globalThis.fetch,url,params,fetchOptions);
}

// blocking cached fetch
// url must have prefix 'cache:{appname,expire time(second)}/'
function _bck_cached_fetch(cachedUrl,params,fetchOptions = { cache: 'no-store' })
{
  const m = cachedUrl.match(/^cache:(\w+),(\d+);(.+)/);
  if(!m)
    throw new Error('1st argument is valid pattern');

  m.shift();
  const [name,expire,url] = m;
  if(expire <= 0)
    throw new Error('expire must be higher than 0');

  const cf = new CachedFetch(name,parseInt(expire));
  if(CachedFetch.firstCall)
    return cf.clear().then(() => {
      const ps = __imp_bck_fetch(cf,url,params,fetchOptions);
      CachedFetch.firstCall = false;
      return ps;
    });
  else
    return __imp_bck_fetch(cf,url,params,fetchOptions)
}

function __imp_bck_fetch(funcFetch,url,params,fetchOptions = { cache: 'no-store' })
{
  if(!isFunction(funcFetch) && !(funcFetch instanceof CachedFetch))
    throw new Error('1st argument not function or CachedFetch');

  const options = params ? { method: 'POST', body: ObjectToFormData(params), ...fetchOptions } : { method: 'GET', ...fetchOptions };
  if(!options.body)
  {
    delete options.body;
    options.method = 'GET';
  }

  const done = response => {
    if(tid)
      clearTimeout(tid);

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
    if(tid)
      clearTimeout(tid);
    throw e;
  };
  const always = () => BlockWindow.unlock();
  const tid = BlockWindow.delayLock();

  if(funcFetch instanceof CachedFetch)
    return funcFetch.fetch(url,options).then(done).catch(fail).finally(always);
  else
    return funcFetch(url,options).then(done).catch(fail).finally(always);
}

const _bck_fetch_json = (url,params,fetchOptions) => _bck_fetch(url,params,fetchOptions).then(response => response.json());
const _bck_fetch_text = (url,params,fetchOptions) => _bck_fetch(url,params,fetchOptions).then(response => response.text());
const _bck_fetch_blob = (url,params,fetchOptions) => _bck_fetch(url,params,fetchOptions).then(response => response.blob());
const _bck_cached_json = (cachedUrl,params,fetchOptions) => _bck_cached_fetch(cachedUrl,params,fetchOptions).then(response => response.json());
const _bck_cached_text = (cachedUrl,params,fetchOptions) => _bck_cached_fetch(cachedUrl,params,fetchOptions).then(response => response.text());
const _bck_cached_blob = (cachedUrl,params,fetchOptions) => _bck_cached_fetch(cachedUrl,params,fetchOptions).then(response => response.blob());
export const config = new Map(
  [
    ['delay',500],
    ['message',''],
    ['loading',true]
  ]
);

export const Blocking = function(promise,m)
{
  if(!m)
    m = config.get('message');

  const delay = config.get('delay');
  const timeoutID = BlockWindow.delayLock(delay);
  BlockWindow.message(m);
  return promise.then(() => clearTimeout(timeoutID)).catch(e => e).finally(() => BlockWindow.unlock());
};

Blocking.fetch = _bck_fetch;
Blocking.fetchJson = _bck_fetch_json;
Blocking.fetchText = _bck_fetch_text;
Blocking.fetchBlob = _bck_fetch_blob;
Blocking.cachedFetch = _bck_cached_fetch;
Blocking.cachedJson = _bck_cached_json;
Blocking.cachedText = _bck_cached_text;
Blocking.cachedBlob = _bck_cached_blob;

Blocking.lock = (delay,params) => BlockWindow.lock(delay,params);
Blocking.unlock = () => BlockWindow.unlock();

/// 非ブロック(通常の) fetch response
export const NonBlocking = function(promise) {
  throw new Error('No implementation. This method is for dummy.');
};

NonBlocking.fetch = FetchUtils.fetchResponse;
NonBlocking.fetchJson = FetchUtils.fetchJson;
NonBlocking.fetchText = FetchUtils.fetchText;
NonBlocking.fetchBlob = FetchUtils.fetchBlob;
NonBlocking.cachedFetch = FetchUtils.cachedResponse;
NonBlocking.cachedJson = FetchUtils.fetchJson;
NonBlocking.cachedText = FetchUtils.fetchText;
NonBlocking.cachedBlob = FetchUtils.fetchBlob;
