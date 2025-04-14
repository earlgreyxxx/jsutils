type FunctionAction = (event: Event) => void;
type ArrowAction = (element:Element,event:Event) => void;
type Action = FunctionAction | ArrowAction;

declare export function swipe(element: EventTarget,selector: string,action: Action,direction: 'x'|'X'|'y'|'Y') :void;
declare export function swipe(element: EventTarget,action: Action,direction: 'x'|'X'|'y'|'Y') :void;