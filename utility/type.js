/*---------------------------------------------------------------------------

  型チェック

---------------------------------------------------------------------------*/

export const getType = o => Object.prototype.toString.call(o).match(/(\w+)/g)?.at(1);

export const isPlainObject = o => 'Object' === getType(o);
export const isNumber = o => 'Number' === getType(o);
export const isNumeric = o => isNumber(o) || !isNaN(parseInt(o));
export const isString = o => 'String' === getType(o);
export const isFunction = o => getType(o).match(/^(?:Async)?Function$/);
export const isBoolean = o => 'Boolean' === getType(o);
export const isMap = o => 'Map' === getType(o);
export const isSet = o => 'Set' === getType(o);
export const isDate = o => 'Date' === getType(o);
export const isHtmlElement = o => null !== getType(o).match(/^HTML(\w+)Element$/) 
export const isNodeList = o => 'NodeList' === getType(o);
export const isArray = Array.isArray;
export const isArrowFunction = o => isFunction(o) && !o.hasOwnProperty('prototype');

export const is = (o,typename) => typename === getType(o);
