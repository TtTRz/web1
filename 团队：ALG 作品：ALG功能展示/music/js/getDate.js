var fs=require('fs');
var milinghang=require('child_process');
var files=fs.readdirSync('../music/');
var infos=[];
var timeformat=function (str) {
  var fen=Math.floor(str/60);
  var miao=Math.round(str%60);
  if(miao<10){
    miao='0'+miao;
  }
  return fen+':'+miao;
}
files.forEach(function (v,i) {
  var info=JSON.parse(milinghang.execSync('ffprobe -v quiet -print_format json -show_format "../music/'+v+'"'));
  infos.push({
    src:info.format.filename,
    time:timeformat(info.format.duration),
    name:info.format.tags.title,
    singer:info.format.tags.artist,
    album:info.format.tags.album
  })
})
fs.writeFile('../js/data.json',JSON.stringify(infos,null,2))
