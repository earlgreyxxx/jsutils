/******************************************************************************
 *  DOM helper utilities
******************************************************************************/
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
