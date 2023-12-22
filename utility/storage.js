/*****************************************************************************

     ローカル記憶域へのアクセス
       export: Storage,Session,StorageEx,SessionEx

     let stg = Storage('キー名');
     stg.set('値');
     let v = stg.get();

*****************************************************************************/
import * as Type from './type.js';

export function Storage(key)
{
  if(!(this instanceof Storage))
    return new Storage(key);

  this.key = key;
  this.initialize('localStorage');
}

Storage.prototype = {
  initialize: function(storage = 'localStorage')
  {
    if(!(storage in window))
      throw new Error(`${storage} can not support in this web browser`);

    this.storage = window[storage];
  },

  //コールバックの登録
  regist: function(type,cb)
  {
    if(type !== 'set' && type !== 'get')
      return false;

    //コールバックの作成
    if(this?.callbacks)
      this.callbacks = new Map;

    if(!this.callbacks.has(type))
      this.callbacks.set(type,new Set);

    if(type(cb) !== 'Function')
      return false;

    this.callbacks.get(type).add(cb);
  },

  //セッター
  set: function(value)
  {
    this.storage[this.key] = value;

    if(this?.callbacks && this.callbacks.has('set'))
      Array.from(this.callbacks.get('set')).forEach(cb => cb(this.key,value));

    return this;
  },

  //ゲッター
  get: function(isCall = true)
  {
    let rv = '';

    if(this.storage[this.key] !== undefined)
      rv = this.storage[this.key];

    if(isCall && this?.callbacks && this.callbacks.has('get'))
      Array.from(this.callbacks.get('get')).forEach(cb => cb(this.key,rv));

    return rv;
  },

  clear: function()
  {
    this.storage.removeItem(this.key);

    if(this?.callbacks && this.callbacks.has('set'))
      Array.from(this.callbacks.get('set')).forEach(cb => cb(this.key,null));

    return this;
  },

  // 比較します。
  eq : function(x)
  {
    return x === this.get(false);
  },

  ne : function(x)
  {
    return x !== this.get(false);
  },

  not : function()
  {
    var v = this.get(false);
    return (v === undefined || v == false || v === '' || v === 0 || v === null);
  },

  //正規表現マッチを行います。
  re : function(re)
  {
    let rv = false;

    if(Type.isString(this.get(false)) && this.ne(''))
      rv = this.storage[this.key].match(re);

    return rv;
  }
};

export function StorageEx(key)
{
  if(!(this instanceof StorageEx))
    return new StorageEx(key);

  this.key = key;
  this.initialize('localStorage');
}

StorageEx.prototype = Object.assign({},Storage.prototype);
StorageEx.prototype.parentSet = StorageEx.prototype.set;
StorageEx.prototype.parentGet = StorageEx.prototype.get;

StorageEx.prototype.set = function(value)
{
  if(Type.isPlainObject(value) || Array.isArray(value))
    value = JSON.stringify(value);

  return this.parentSet(value);
};

StorageEx.prototype.get = function()
{
  let rv;
  let value = this.parentGet();
  try {
    rv = JSON.parse(value);
  } catch (e) {
    rv = value;
  }

  return rv;
};


/*****************************************************************************

     セッションストレージへのアクセス

*****************************************************************************/
export function Session(key)
{
  if(!(this instanceof Session))
    return new Session(key);

  this.key = key;
  this.initialize('sessionStorage');
  this.expires = 0;
}
Session.prototype = Object.assign({},Storage.prototype);


/*****************************************************************************

     オブジェクトの保存に対応したセッションストレージへのアクセス

 *****************************************************************************/
export function SessionEx(key)
{
  if(!(this instanceof SessionEx))
    return new SessionEx(key);

  this.key = key;
  this.initialize('sessionStorage');
  this.expires = 0;
}
SessionEx.prototype = Object.assign({},StorageEx.prototype);