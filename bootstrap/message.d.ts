type action = (ev: Event) => void;

declare export function ModelessMessage(m:{ message:string?; title:string?; delay: number?; } ,t:string?,d:number?) : HTMLElement;
declare export function ModalMessage(m: { message:string?; title:string?; size: string?; opening: action?; callback: action?; closing: action?; backdrop:string? },t:string?) : HTMLElement;
declare export function Popup(message:string,url:string,name:string,feature:string|null|undefined,btnOkName:string) : HTMLElement;