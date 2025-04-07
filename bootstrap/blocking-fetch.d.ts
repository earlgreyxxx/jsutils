declare type BlockWindow = {
  $frame: HTMLElement;
  timeout: number[];
  refCounter: number;
  isLocking: () => boolean;
  lock: (delay: boolean?,setting: {loading:string,message: string,spinner: str}) => this;
  unlock: (clear: boolean) => this;
  message: (m: string) => this;
  delayLock: (delay: number,options: {loading:string,message: string,spinner: str}) => this;
  cancelTimeout: () => void;
  cancelTimeoutAll: () => void;
};

declare export function Blocking(promise:Promise<any>,m:string) : Promise<any>;