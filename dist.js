/*---------------------------------------------------------------------------

  ユーティリティモジュールのインポート
  jQueryがロードされていれば、jQueryに追加、なければ globalThis に追加

---------------------------------------------------------------------------*/
import * as Type from './utility/type.js';
import { getQueryString,createQueryString } from './utility/querystring.js';
import { getCookie,getCookies,setCookie,setCookies } from './utility/cookie.js';
import { Storage,StorageEx,Session,SessionEx } from './utility/storage.js';
import { Timer } from './utility/timer.js';
import { isHirakana,convertKana } from './utility/japanese.js';
import objectToFormData from './utility/object-formdata.js';
import CachedFetch from './utility/cached-fetch.js';
import { fetchJson,fetchText,fetchBlob,cachedJson,cachedText,cachedBlob } from './utility/fetch-utils.js';
import { b64encode,b64decode } from './utility/base64-codec.js';
import tableToArray from './utility/table-toarray.js';
import rowsToTable from './utility/rows-totable.js';
import resize from './utility/resize-image.js';
import { sprintf,vsprintf } from './utility/sprintf.js';
import Dom from './utility/dom-utils.js';
import { shuffle } from './utility/shuffle.js';

Object.assign(typeof(jQuery) === 'undefined' ? globalThis : jQuery,{
  Type,
  getCookie,getCookies,setCookie,setCookies,
  getQueryString,createQueryString,
  Storage,StorageEx,Session,SessionEx,
  Timer,
  isHirakana,convertKana,
  objectToFormData,
  CachedFetch,
  fetchJson,fetchText,fetchBlob,cachedJson,cachedText,cachedBlob,
  b64encode,b64decode,
  tableToArray,rowsToTable,
  resize,
  sprintf,vsprintf,
  Dom,
  shuffle,
});
