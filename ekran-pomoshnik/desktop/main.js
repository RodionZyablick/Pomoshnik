const {app,BrowserWindow,session,desktopCapturer}=require('electron');const path=require('path');
app.whenReady().then(()=>{
  session.defaultSession.setDisplayMediaRequestHandler((req,cb)=>{
    desktopCapturer.getSources({types:['screen']}).then(s=>cb({video:s[0]}))});
  const w=new BrowserWindow({width:1000,height:800,autoHideMenuBar:true});
  w.loadFile(path.join(__dirname,'../app/index.html'));
});
app.on('window-all-closed',()=>app.quit());
