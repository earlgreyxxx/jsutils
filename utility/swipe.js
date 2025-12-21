/*********************************************************************
   スワイプ対応
*********************************************************************/
import * as Dom from './dom-utils.js';
import { isString,isFunction,isArrowFunction } from './type.js';

const invoker = (fn,...args) => isArrowFunction(fn) ? fn(...args) : fn.call(...args);

export function swipe(element,selector,action,direction)
{
  const idle = { x: 32, y: 32 };
  
  if(isString(selector))
  {
    const listeners = makeListeners(action, direction, idle);
    Dom.on(element, 'touchstart', selector, listeners.onTouchStart);
    Dom.on(element, 'touchmove', selector, listeners.onTouchMove);
    Dom.on(element, 'touchend', selector, listeners.onTouchEnd);
  }
  else if(isFunction(selector))
  {
    const listeners = makeListeners(selector, action, idle);
    Dom.on(element, 'touchstart', listeners.onTouchStart);
    Dom.on(element, 'touchmove', listeners.onTouchMove);
    Dom.on(element, 'touchend', listeners.onTouchEnd);
  }
}

function makeListeners(action,direction,idle)
{
  let startX = 0, startY = 0;
  let endX = 0, endY = 0;
  let moving = false;

  return {
    onTouchStart: function(event) {
      event.stopImmediatePropagation()
      startX = event.touches[0].pageX;
      startY = event.touches[0].pageY;
    },

    onTouchMove: function(event) {
      event.stopImmediatePropagation()
      endX = event.touches[0].pageX;
      endY = event.touches[0].pageY;
      moving = true;
    },

    onTouchEnd: function (event) {
      event.stopImmediatePropagation()
      const dx = Math.abs(startX - endX);
      const dy = Math.abs(startY - endY);
      if (moving === false)
        return;
      else
        moving = false;
      
      switch(direction)
      {
        case 'y':
        case 'Y':
          if (dx > dy || dx > idle.x || dy <= idle.y)
            return;

          if (startY - endY > 0)
            invoker(action,this,event);

          startY = 0;
          endY = 0;
          break;

        case 'x':
        case 'X':
          if (dx < dy || dy > idle.y || dx <= idle.x)
            return;

          if (startX - endX > 0)
            invoker(action,this,event);

          startX = 0;
          endX = 0;

          break;
        default:
          throw new Error('direction must be x or y');
      }
    }
  };
}
