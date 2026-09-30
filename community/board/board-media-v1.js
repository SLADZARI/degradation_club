export const BOARD_IMAGE_LONG_EDGE=1800;
export const BOARD_IMAGE_WEBP_QUALITY=0.82;

const ACCEPTED_IMAGE_TYPES=new Set(['image/jpeg','image/png','image/webp']);

function webpName(name){
  const raw=String(name||'image').replace(/\.[^.]+$/,'')||'image';
  return `${raw}.webp`;
}

async function decodeWithImageElement(file){
  const url=URL.createObjectURL(file);
  const image=new Image();
  image.decoding='async';
  image.src=url;
  try{
    if(typeof image.decode==='function')await image.decode();
    else await new Promise((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('MEDIA_DECODE_FAILED'))});
    const width=Number(image.naturalWidth||image.width||0),height=Number(image.naturalHeight||image.height||0);
    if(!(width>0&&height>0))throw new Error('MEDIA_DECODE_FAILED');
    return{source:image,width,height,close:()=>URL.revokeObjectURL(url),decoder:'image-element'};
  }catch(error){
    URL.revokeObjectURL(url);
    throw error;
  }
}

async function decodeImage(file){
  if(typeof createImageBitmap==='function'){
    try{
      const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
      const width=Number(bitmap.width||0),height=Number(bitmap.height||0);
      if(width>0&&height>0)return{source:bitmap,width,height,close:()=>bitmap.close?.(),decoder:'image-bitmap'};
      bitmap.close?.();
    }catch{}
  }
  try{return await decodeWithImageElement(file)}catch{throw new Error('MEDIA_DECODE_FAILED')}
}

function encodeWebp(canvas,quality){
  return new Promise(resolve=>{
    try{canvas.toBlob(blob=>resolve(blob&&blob.type==='image/webp'&&blob.size>0?blob:null),'image/webp',quality)}catch{resolve(null)}
  });
}

export async function normalizeArtifactImage(file,{maxEdge=BOARD_IMAGE_LONG_EDGE,quality=BOARD_IMAGE_WEBP_QUALITY}={}){
  if(!file||!ACCEPTED_IMAGE_TYPES.has(String(file.type||'').toLowerCase()))throw new Error('MEDIA_TYPE_INVALID');
  const decoded=await decodeImage(file);
  try{
    const originalWidth=decoded.width,originalHeight=decoded.height;
    const longest=Math.max(originalWidth,originalHeight);
    const scale=longest>maxEdge?maxEdge/longest:1;
    const targetWidth=Math.max(1,Math.round(originalWidth*scale));
    const targetHeight=Math.max(1,Math.round(originalHeight*scale));
    const canvas=document.createElement('canvas');
    canvas.width=targetWidth;canvas.height=targetHeight;
    const context=canvas.getContext('2d',{alpha:true});
    if(!context)throw new Error('MEDIA_CANVAS_UNAVAILABLE');
    context.drawImage(decoded.source,0,0,targetWidth,targetHeight);
    const encoded=await encodeWebp(canvas,quality);
    const useEncoded=Boolean(encoded&&encoded.size<file.size);
    const uploadFile=useEncoded?new File([encoded],webpName(file.name),{type:'image/webp',lastModified:file.lastModified||Date.now()}):file;
    return{
      file:uploadFile,
      uploadName:uploadFile.name||file.name,
      usedNormalized:useEncoded,
      decoder:decoded.decoder,
      original:{name:file.name,mime:file.type,bytes:file.size,width:originalWidth,height:originalHeight},
      normalized:{mime:uploadFile.type||file.type,bytes:uploadFile.size,width:useEncoded?targetWidth:originalWidth,height:useEncoded?targetHeight:originalHeight},
      attempted:{mime:'image/webp',bytes:encoded?.size||null,width:targetWidth,height:targetHeight,maxEdge,quality}
    };
  }finally{decoded.close?.()}
}
