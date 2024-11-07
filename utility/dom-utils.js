/******************************************************************************
 *  DOM helper utilities
******************************************************************************/
import { isString,isHtmlElement,isNodeList,isFunction,isArrowFunction } from './type.js';

export const createElement = str => new DOMParser().parseFromString(str,"text/html").body.firstElementChild;

export function create(str)
{
  const template = document.createElement('template');
  template.innerHTML = str;

  const rv = template.content.firstElementChild;
  template.remove();

  return rv;
}

export function empty(element)
{
  while (element.firstChild)
    element.removeChild(element.firstChild);
}

export function css(element,style)
{
  Object.entries(style).forEach(([ property,value ]) => element.style.setProperty(property.replace(/[A-Z]/g,m => ('-'+m.toLowerCase())),value,'important'));
}

export function show(element,value = 'block')
{
  element.style.setProperty('display',value);
}

export function hide(element)
{
  element.style.setProperty('display','none');
}

// _handlers:map<myId:string,names:map<name:string,handlers:[]>>
const _handlers = new Map;

// alternative for jQuery.on(eventname,selector,handler) and .on(eventname,handler)
export function on(element_or_selector,eventname,selector,handler)
{
  const invoker = (_,event) => isArrowFunction(handler) ? handler(_,event) : handler.call(_,event);

  const listener = ev => {
    const element = ev.target.closest(selector);
    if(element && ev.currentTarget.contains(element))
      invoker(element,ev);
  };

  const eventHandler = isFunction(selector) ? selector : listener;

  const inserter = (el,nm,eh) => {
    const myId = el.dataset.myId = Math.random().toString().slice(2);
    if(!_handlers.has(myId))
      _handlers.set(myId,new Map);

    const eventnames = _handlers.get(myId);
    if(!eventnames.has(nm))
      eventnames.set(nm,[])

    const handlers = eventnames.get(nm);

    handlers.push(eh);
  };

  if(isHtmlElement(element_or_selector))
  {
    const element = element_or_selector;
    inserter(element,eventname,eventHandler);
    element.addEventListener(eventname,eventHandler);
  }
  else
  {
    let root;
    if(isNodeList(element_or_selector))
      root = element_or_selector;
    else if(isString(element_or_selector))
      root = document.querySelectorAll(element_or_selector) ?? [];
    else
      throw new Error('argument type error');

    root.forEach(el => {
      inserter(el, eventname, eventHandler);
      el.addEventListener(eventname,eventHandler);
    });
  }
}

// alternative for jQuery.off(eventname)
export function off(element_or_selector,eventname)
{
  const remover = (el,nm) => {
    const { myId } = el.dataset;
    if(!myId)
      return;

    const eventnames = _handlers.get(myId);
    if(!eventnames)
      return;

    const handlers = eventnames.get(nm) ?? [];
    eventnames.delete(nm);

    return handlers;
  };

  if(isHtmlElement(element_or_selector))
  {
    const element = element_or_selector;
    remover(element,eventname).forEach(handler => element.removeEventListener(eventname, item.eventHandler));
  }
  else
  {
    let root;
    if(isNodeList(element_or_selector))
      root = element_or_selector;
    else if(isString(element_or_selector))
      root = document.querySelectorAll(element_or_selector) ?? [];
    else
      throw new Error('argument type error');

    root.forEach(el => {
      remover(el, eventname).forEach(handler => el.removeEventListener(eventname, handler));
    });
  }
}