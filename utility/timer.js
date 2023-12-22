/*****************************************************************************

  setTimeout()関数のPromise対応版

  ms: milli second, fn: callback function
  (1)
   const timer = new Timer(ms) or Timer(ms)
     timer.then(fn) : returns Promise;
  (2)
   const timer = new Timer;
     timer.then(ms,fn) : returns Promise

  (3)
   const timer = new Timer;
     timer.set(ms) : returns this;
     timer.set(ms).then(fn) : returns promise;    

  timer.clear() means clearTimer do. and promise rejected.
  timer.reset() means initialize again.

*****************************************************************************/
import * as Type from './type.js';

export function Timer(timeout)
{
  if(!(this instanceof Timer))
    return new Timer(timeout);

  if(Type.isNumber(timeout))
    this.set(timeout);
}

Timer.prototype = {

  then : function(timeout,fn)
  {
    if(Type.isNumber(timeout))
    {
      if(!this?.promise)
        this.set(timeout);

      return this.promise.then(fn);
    }
    else if(Type.isFunction(timeout) && this?.promise)
    {
      return this.promise.then(timeout);
    }
    else
    {
      throw new Error('argument is valid type');
    }
  },

  set : function(timeout)
  {
    const _this = this;
    this.promise = new Promise((resolve,reject) => {
      if(Type.isNumber(timeout))
        _this.id = window.setTimeout(() => {
          resolve()
          delete _this.id;
        },timeout);
      else
        reject(new Error('timeout must be Number'));
    });

    return this;
  },

  clear : function(message)
  {
    if(this?.id)
    {
      clearTimeout(this.id);
      delete this.id;
    }

    if(this?.promise)
      Promise.reject(this.promise,new Error(message ?? 'abort Timer by clearTimeout()'))

    return this;
  },

  detach: function()
  {
    if(this?.promise)
      delete this.promise;

    if(this?.id)
      this.clear();
    
    return this;
  }
};
