/******************************************************************************

  Bootstrap toast helper ( FontAwesom 4.7 required and overide bootstrap 5 css )

  export below functions.
    ModelessMessage(m,t,d)
    ModalMessage(m,t)
    Popup(m,u,n,f)

    m: text for show message
    t: text for title bar
    d: time of milli second for hide message (ModelessMessage only)
    u: url pass to window.open()
    n: window name pass to window.open()
    f: window feature pass to window.open()

    if m is plain object, t or d ignored.
      m = { message,title,delay } for ModelessMessage
      m = { message,title,size,opening,opened,callback,closing,backdrop } for ModalMessage

    ModalMessage.onClose(cb) regist close handler(global)
    ModelssMessage.onClose(cb) regist close handler(global)
    ModelessMessage.style(css) regist css style.

    return value: Element

******************************************************************************/
import * as Type from '../utility/type.js';
import * as Dom from '../utility/dom-utils.js';
import { Toast,Modal } from 'bootstrap';

/****************************************************************************
 * モードレスメッセージ
*****************************************************************************/ 
let refCount = 0;
let defaultDelay = 10000;
const defaultTitle = 'メッセージ';
const ctnStyle = {
  top: '3rem',
  right: '1rem',
  width: '275px',
  zIndex: 2000,
  position: 'fixed',
  display: 'none'
};

const $container = document.createElement('div');
$container.setAttribute('id','toast-container');
Dom.css($container,ctnStyle);

$container.addEventListener('hidden.bs.toast',ev => {
  const $el = ev.target;
  if(!$el.classList.contains('toast'))
    return;
  $el.remove();

  if(--refCount == 0)
    ev.currentTarget.remove();
});

const create = (m,t,d) => `
<div class="toast shadow-sm hide mb-3" data-bs-delay="${d}">
  <div class="toast-header border-0 pt-2 toast-header-custom">
    <span class="d-inline-block me-auto"><span class="me-2 fontawesome d-inline-block">&#xf05a;</span>${t}</span>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" style="background-size: 45%;"></button>
  </div>
  <div class="toast-body toast-body-custom text-black">${m}</div>
</div>
`.trim();

export function ModelessMessage(m,t,d)
{
  let s;
  if(Type.isPlainObject(m))
  {
    let {title,message,delay,style} = m;

    m = message;
    t = title;
    d = parseInt(delay);
    s = style;
  }
  const html = create(m || '',t || defaultTitle,d || defaultDelay);
  const $el = Dom.create(html);

  if(s && Type.isPlainObject(s))
    Object.entries(s).forEach(([property,value]) => $container.style.setProperty(property.replace(/[A-Z]/g,m => ('-'+m.toLowerCase())),value));

  if(refCount <= 0)
  {
    document.body.appendChild($container);
    $container.style.setProperty('display','block','important');
  }

  $container.append($el);

  const toast = new Toast($el);
  toast.show();
  refCount++;

  return $el;
}

const onClickCloseModelessMessage = function(cb)
{
  document.body.addEventListener('click',ev => {
    if(Array.from(ev.currentTarget.querySelectorAll('.toast .close')).some(el => ev.target === el))
      cb.call(ev.target);
  })
};

ModelessMessage.onClose = function(cb)
{
  onClickCloseModelessMessage(cb);
};

ModelessMessage.style = function(props)
{
  return Object.assign(ctnStyle,props);
};

ModelessMessage.delay = function(ms)
{
  if(!ms || isNaN(parseInt(ms)))
    return;

  defaultDelay = parseInt(ms);
}


/****************************************************************************
 * モーダルメッセージ
*****************************************************************************/ 
export function ModalMessage(m,t)
{
  const defaultTitle = 'メッセージ';
  const create = (m,t,s,backdrop) =>  `
<div class="modal fade" tabindex="-1" data-bs-backdrop="${backdrop}">
  <div class="modal-dialog modal-dialog-scrollable ${s ? `modal-${s}` : ''}">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="h5 modal-title no-icon"><span class="me-1 text-danger" style="font-family:FontAwesome;">&#xf05a;</span>${t}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="text-start text-md-center" style="min-height: 3rem;">${m}</div>
      </div>
      <div class="modal-footer p-2 justify-content-center">
        <button type="button" class="btn btn-sm btn-dark" data-bs-dismiss="modal">閉じる</button>
      </div>
    </div>
  </div>
</div>
`.trim();

  let s,fnOpening,fnClosing,fnOpened,bd = 'static';
  if(Type.isPlainObject(m))
  {
    let {title,message,size,opening,opened,callback,closing,backdrop} = m;
    m = message;
    t = title;
    s = size;
    fnOpening = opening || callback;
    fnOpened = opened;
    fnClosing = closing;
    bd = backdrop ?? 'static';
  }

  const $modal = Dom.create(create(m || '',t || defaultTitle,s || '',bd))
  const modal = new Modal($modal,{backdrop: 'static'});

  $modal.addEventListener('hidden.bs.modal',ev => {
    modal.dispose();
    ev.currentTarget.remove();
    window.focus();
  });
  $modal.addEventListener('hide.bs.modal',ev => {
    fnClosing?.call(ev.currentTarget,ev);
  });
  $modal.addEventListener('show.bs.modal',ev => {
    fnOpening?.call(ev.currentTarget,ev);
  });
  $modal.addEventListener('shown.bs.modal',ev => {
    fnOpened?.call(ev.currentTarget,ev);
  });

  modal.show();
  return $modal;
};

const onClickCloseModalMessage = function(cb)
{
  document.body.addEventListener('click', ev => {
    if(Array.from(ev.currentTarget.querySelectorAll('div#modal-message.modal button').some(el => ev.target === el)))
      cb.call(ev.target);
  })
};

ModalMessage.onClose = function(cb)
{
  onClickCloseModalMessage(cb);
};

/****************************************************************************
 * 新しいウィンドウを開く確認ダイアログ(ポップアップブロック対策)
*****************************************************************************/ 
export function Popup(message,url,name = '_blank',feature = null,btnOkName = '　開く　')
{
  const getModal = message => `
<div class="modal fade" tabindex="-1" role="dialog" data-bs-backdrop="static">
  <div class="modal-dialog modal-dialog-scrollable" role="document">
    <div class="modal-content">

      <div class="modal-header">
        <h6 class="modal-title"><big class="me-1 text-danger" style="font-family:FontAwesome;">&#xf05a;</big>新しいウィンドウを開きます</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">${message}</div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-sm btn-dark" data-bs-dismiss="modal">キャンセル</button>
        <button type="button" class="btn btn-sm btn-success" id="open-window">${btnOkName}</button>
      </div>
    </div>
  </div>
</div>`.trim();

  const $modal = Dom.create(getModal(message));
  const modal = new Modal($modal,{backdrop: 'static'});

  $modal.addEventListener('shown.bs.modal',ev => {
    ev.target.querySelector('#open-window').focus();
  });
  $modal.addEventListener('hidden.bs.modal',ev => {
    modal.dispose();
    ev.target.remove();
    window.focus();
  });
  $modal.addEventListener('click',ev => {
    if(ev.target.getAttribute('id') === 'open-window')
      window.open(url,name,feature);
  });

  modal.show();
  
  return $modal;
}
