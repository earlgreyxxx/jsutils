/******************************************************************************

  Bootstrap toast helper

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
      m = { message,title,size,opening,callback,closing,backdrop } for ModalMessage

    ModalMessage.onClose(cb) regist close handler(global)
    ModelssMessage.onClose(cb) regist close handler(global)
    ModelessMessage.style(css) regist css style.

    return value: jqo

******************************************************************************/
import * as Type from '../utility/type.js';

const $ = require('jquery');
let bootstrap;

if(!window?.jQuery)
  window.jQuery = $;

bootstrap = require('bootstrap');

let restoreReader = false;

if(!$)
  throw new Error('require jQuery');

/****************************************************************************
 * モードレスメッセージ
*****************************************************************************/ 
let refCount = 0;
const defaultDelay = 10000;
const defaultTitle = 'メッセージ';
const ctnStyle = {
  position: 'fixed',
  top: '3rem',
  right: '1rem',
  width: 275,
  zIndex: 9999
};
const $container =
  $('<div>')
  .attr({id:'toast-container'})
  .css(ctnStyle)
  .hide()
  .on('hidden.bs.toast','.toast',function() {
    $(this).remove();

    if(--refCount == 0)
      $container.detach();
  });

const create = (m,t,d) => `
<div class="toast shadow-sm border-0 hide" data-bs-delay="${d}">
  <div class="toast-header border-0 pt-2 toast-header-custom">
    <span class="d-inline-block me-auto"><big class="me-2 fontawesome">&#xf05a;</big>${t}</span>
    <button type="button" class="ms-auto text-light font-weight-normal mt-n1 border-0" style="background-color: transparent;" data-bs-dismiss="toast">
      <span class="text-dark fontawesome d-inline-block align-middle">&#xf057;</span>
    </button>
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

  if(s)
    $container.css(s);

  if(refCount <= 0)
    $container.appendTo(document.body).show();

  const $tooltip = $(html).appendTo($container).toast('show');

  refCount++;
  return $tooltip;
}

const onClickCloseModelessMessage = function(cb)
{
  $(document.body).on('click','.toast .close',cb);
};

ModelessMessage.onClose = function(cb)
{
  onClickCloseModelessMessage(cb);
};

ModelessMessage.style = function(props)
{
  return Object.assign(ctnStyle,props);
};


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

  let s,fnOpening,fnClosing,bd = 'static';
  if(Type.isPlainObject(m))
  {
    let {title,message,size,opening,callback,closing,backdrop} = m;
    m = message;
    t = title;
    s = size;
    fnOpening = opening || callback;
    fnClosing = closing;
    bd = backdrop ?? 'static';
  }

  const $modal = $(create(m || '',t || defaultTitle,s || '',bd));

  $modal
    .on('hidden.bs.modal',function() {
      $(this).modal('dispose');
      $(this).remove();

      $(window).trigger('focus');
    })
    .on('hide.bs.modal',function(ev) {
      if(fnClosing)
        fnClosing.call(this,ev);
    })
    .on('show.bs.modal',function(ev) {
      if(fnOpening)
        fnOpening.call(this,ev);
    });


  $modal.modal('show');

  return $modal;
};

const onClickCloseModalMessage = function(cb)
{
  $(document.body).on('click','div#modal-message.modal button',cb);
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
        <button type="button" class="btn btn-sm btn-dark" data-dismiss="modal">キャンセル</button>
        <button type="button" class="btn btn-sm btn-success" id="open-window">${btnOkName}</button>
      </div>
    </div>
  </div>
</div>`.trim();

  const $dlg = $(getModal(message))
    .on('shown.bs.modal', function () {
      $('#open-window', this).focus();
    })
    .on('hidden.bs.modal', function () {
      $(this).modal('dispose');
      $(this).remove();
      $(window).trigger('focus');
    })
    .on('click', '#open-window', function () {
      window.open(url,name,feature);
    }).modal('show');

  return $dlg;
}
