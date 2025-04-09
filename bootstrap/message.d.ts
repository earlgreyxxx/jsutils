type action = (ev: Event) => void;
type enumPosition = 'top:left'|'top:right'|'top:center'|'bottom:left'|'bottom:right'|'bottom:center';
type ModelessMessageOption = { message?:string; title?:string; delay?: number; };
type ModalMessageOption = { message?:string; title?:string; size?: string; opening?: action; callback?: action; closing?: action; backdrop?:string };

declare export function SetModelessMessagePosition(position:enumPosition ,width?:number) : boolean;
declare export function ModelessMessage(m:ModelessMessageOption|string ,t?:string,d?:number) : HTMLElement;
declare export function ModalMessage(m:ModalMessageOption|string,t?:string) : HTMLElement;
declare export function Popup(message:string,url:string,name:string,feature?:string|null|undefined,btnOkName?:string) : HTMLElement;