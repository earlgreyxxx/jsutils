/*****************************************************************************
*
*  Convert plain object to FormData object.(for php can accept values)
*    { a: 1,b: [1,2,3],c: {x: 1,y: 2,z: [3,4,5]} }
*    ↓
*    'a':1,
*    'b[0]':1,'b[1]':2,'b[2]':3,
*    'c[x]':1,'c[y]':2,'c[z][0]':3,'c[z][1]':4,'c[z][2]':5
*
*****************************************************************************/ 
import * as Type from './type.js';

export default function(params,defaultName = 'param')
{
  let rv;

  if(Type.isPlainObject(params))
  {
    if(Object.keys(params).length > 0)
    {
      const fd = new FormData;
      Object.entries(params).forEach(v => _value_to(fd,...v));

      return fd;
    }
  }
  else if(Array.isArray(params))
  {
    if(params.length > 0)
    {
      const n = Type.isString(defaultName) && defaultName.length > 0 ? defaultName : 'param';
      const fd = new FormData;
      _value_to(fd,n,params);

      return fd;
    }
  }
  else
  {
    return params;
  }
}

function _value_to(fd,name,value)
{
  switch(Type.getType(value))
  {
    case 'Object':
      Object.entries(value).forEach(([n,v]) => _value_to(fd,`${name}[${n}]`,v));
      break;

    case 'Array':
      value.forEach((v,i) => _value_to(fd,`${name}[${i}]`,v));
      break;

    default:
      fd.append(name,value);
      break;
  }
}