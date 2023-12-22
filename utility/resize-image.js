/**************************************************************************
*
* resize image
*
**************************************************************************/
export default async function(file,max_pixcels)
{
  let canvas;
  let done = () => false;

  if('OffscreenCanvas' in window)
  {
    canvas = new OffscreenCanvas(0,0);
  }
  else
  {
    canvas = document.createElement('canvas');
    canvas.setAttribute('width',0);
    canvas.setAttribute('height',0);
    canvas.setAttribute('id','canvas');
    canvas.style.display = 'none';
    document.body.append(canvas);

    done = () => canvas.remove();
  }

  const outputType = 'image/jpeg';
  const img = await createImageBitmap(file);

  let width = max_pixcels;
  let height = max_pixcels;
  let ratio = img.width / img.height;
  if((ratio < 1 && img.width <= max_pixcels) || (ratio >= 1 && img.height <= max_pixcels))
  {
    width = img.width;
    height = img.height;
  }
  else
  {
    // calculate resized image width/height
    if(img.width > img.height)
      width = height * img.width / img.height;
    else if(img.width < img.height) 
      height = width * img.height / img.width;
  }

  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');

  // clear canvas rect
  ctx.clearRect(0,0,width,height);

  // draw image to canvas
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

  // get blob object from canvas and create File instance from blob object
  let rv = new File([await getBlobFromCanvas(canvas,outputType)],file.name.replace(/\.\w+$/,'.jpg'),{type: outputType,lastModified: file.lastModified});

  // post process
  done();
  
  return rv;
}

function getBlobFromCanvas(canvas,type,quality)
{
  if(!type)
    type = 'image/png';

  if(!quality)
    quality = '0.8';

  if(canvas.constructor.name === 'OffscreenCanvas')
    return canvas.convertToBlob({'type': type,'quality': quality});

  return new Promise(function(resolve) {
    canvas.toBlob(resolve,type,quality);
  });
}