/******************************************************************************
 *  DOM helper utilities
******************************************************************************/
import { isString,isHtmlElement,isNodeList,isArrowFunction } from './type.js';

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

// alternative for jQuery.on(eventname,selector,handler)
export function on(element_or_selector,eventname,selector,handler)
{
  const invoker = (_,event) => isArrowFunction(handler) ? handler(_,event) : handler.call(_,event);

  const listener = ev => {
    ev.preventDefault();
    const element = ev.currentTarget.querySelectorAll(selector);
    if (element)
      Array.from(element).filter(_ => _ === ev.target || _.contains(ev.target)).forEach(_ => invoker(_,ev));
  }

  if(isHtmlElement(element_or_selector))
  {
    element_or_selector.addEventListener(eventname,listener);
  }
  else
  {
    let root;
    if(isNodeList(element_or_selector))
      root = element_or_selector;
    else if(isString(element_or_selector))
      root = document.querySelectorAll(element_or_selector);
    else
      throw new Error('argument type error');

    root.forEach(el => el.addEventListener(eventname,listener));
  }
}
