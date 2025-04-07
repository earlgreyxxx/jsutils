// Type definitions for resize-image.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// getBlobFromCanvas.!0
//declare export default async function test() : Promise<File>;
declare const resizeImage: (file:File,max_pixcels:number) => Promise<File>;

export default resizeImage;
