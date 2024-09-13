/*****************************************************************************
*
*  XMLHttpRequest (support Promise)
*
*****************************************************************************/ 
export default { download,upload };

export function download(url,init)
{
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest;
    xhr.addEventListener('readystatechange', ev => {
      switch(xhr.readyState)
      {

      }
    });

    if(init?.progressHandler)
      xhr.addEventListener('progress', ev => {

      });

    xhr.send(init?.body)
  });
}

export function upload(url,init)
{
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest;
    const xhru = xhr.upload;

    if(init?.progressHandler)
      xhru.addEventListener('progress', ev => {
        init?.progressHandler(ev);
      });

    xhru.addEventListener('load',ev => {
      resolve("success");
    });

    xhru.addEventListener('error',ev => {
      reject("failed");
    });

    xhru.addEventListener('timeout',ev => {
      reject("timout");
    });

    xhr.open('POST',url,true,init?.user,init?.password);
    xhr.send(init.body);
  });
}