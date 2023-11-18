/*---------------------------------------------------------------------------

  ユーティリティモジュールのインポート
  jQueryがロードされていれば、jQueryに追加、なければ globalThis に追加

---------------------------------------------------------------------------*/
import { getQueryString,createQueryString } from './src/querystring.js';
import { getCookie,getCookies,setCookie,setCookies } from './src/cookie.js';
import { Storage,StorageEx,Session,SessionEx } from './src/storage.js';
import { Timer } from './src/timer.js';
import { isHirakana,convertKana } from './src/japanese.js';
import ObjectToFormData from './src/object-formdata.js';
import CachedFetch from './src/cached-fetch.js';
import { fetchJson,fetchText,fetchBlob } from './src/fetch-utils.js'

Object.assign(typeof(jQuery) === 'undefined' ? globalThis : jQuery,{
  getCookie,getCookies,setCookie,setCookies,
  getQueryString,createQueryString,
  Storage,StorageEx,Session,SessionEx,
  Timer,
  isHirakana,convertKana,
  ObjectToFormData,
  CachedFetch,
  fetchJson,fetchText,fetchBlob,
});
