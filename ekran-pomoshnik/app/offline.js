'use strict';
// Собственный «ИИ» без ключей: чтение текста (Tesseract.js, всё считается на устройстве) + правила.
const OFF={
  w:null,wl:'',
  scam:/(заражен|вирус|взлом|код из (смс|sms)|cvv|cvc|срочно|немедленно|перевед|безопасн\w+ счёт|служб\w+ безопасности|выигр|приз|разблокир|гос.?услуг|send money|urgent|virus)/i,
  kinds:[[/cookie|куки/i,'Сайт спрашивает разрешение запоминать ваши посещения. Обычно можно спокойно принять.'],
    [/мастер|лицензион|соглашени|установ|setup|install/i,'Это установка программы. Обычно нужно нажимать «Далее» до конца.'],
    [/парол|логин|войти|вход|sign in|password/i,'Это окно входа: нужно ввести имя (логин) и пароль.'],
    [/ошибк|не удалось|сбой|error|failed/i,'Это сообщение об ошибке: что-то пошло не так.'],
    [/обновлени|update/i,'Это окно обновления программы или системы.'],
    [/разреш|allow|доступ/i,'Программа или сайт просит у вас разрешение.']],
  btns:[['принять|accept|согласен|agree','Принять'],['разрешить|allow','Разрешить'],['далее|next','Далее'],['продолжить|continue','Продолжить'],
    ['установить|install','Установить'],['сохранить|save','Сохранить'],['войти|sign in|log in','Войти'],['отправить|send','Отправить'],
    ['готово|finish|done','Готово'],['^ok$|^ок$','ОК'],['закрыть|close','Закрыть']],
  load(){return this.p||(this.p=new Promise((res,rej)=>{if(window.Tesseract)return res();const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=res;
    s.onerror=()=>{this.p=null;rej(new Error('Для первого запуска без-интернет режима нужен интернет: один раз скачивается модуль чтения текста, дальше он работает без сети.'))};document.head.appendChild(s)}))},
  async ocr(url){await this.load();const lg={ru:'rus+eng',uk:'ukr+eng',en:'eng'}[C.lang]||'rus+eng';
    if(!this.w||this.wl!==lg){if(this.w)await this.w.terminate();this.w=await Tesseract.createWorker(lg);this.wl=lg}
    return (await this.w.recognize(url)).data}
};
// Автоскрытие: номера карт и длинные числа, e-mail, телефоны, значения после «пароль / код / PIN / CVV / IBAN».
window.autoRedact=async function(url){
  const d=await OFF.ocr(url),im=await loadImg(url),c=document.createElement('canvas');c.width=im.width;c.height=im.height;
  const x=c.getContext('2d');x.drawImage(im,0,0);x.fillStyle='#000';let n=0;
  const box=b=>{x.fillRect(b.x0-4,b.y0-3,b.x1-b.x0+8,b.y1-b.y0+6);n++},kw=/(парол|password|\bpin\b|пин|cvv|cvc|iban|логин|login|код|code|токен|token)/i;
  for(const l of d.lines||[]){const ws=l.words||[];let hit=new Set();
    ws.forEach((w,i)=>{const t=w.text,dg=(t.match(/\d/g)||[]).length;
      if(dg>=5||t.includes('@')||/^\+\d/.test(t))hit.add(i);
      else if(/^\d{4}$/.test(t)&&((ws[i-1]&&/^\d{4}$/.test(ws[i-1].text))||(ws[i+1]&&/^\d{4}$/.test(ws[i+1].text))))hit.add(i);
      if(kw.test(t))for(let k=i+1;k<Math.min(ws.length,i+4);k++)hit.add(k)});
    hit.forEach(i=>ws[i]&&box(ws[i].bbox))}
  return{url:c.toDataURL('image/jpeg',.85),n}};
window.offlineExplain=async function(){
  const d=await OFF.ocr(S.img),im=await loadImg(S.img),W=im.width,H=im.height;
  const lines=(d.lines||[]).filter(l=>l.text.trim()&&l.confidence>45).map(l=>({t:l.text.trim().replace(/\s+/g,' '),
    box:[Math.max(0,(l.bbox.x0-8)/W),Math.max(0,(l.bbox.y0-6)/H),Math.min(1,(l.bbox.x1-l.bbox.x0+16)/W),Math.min(1,(l.bbox.y1-l.bbox.y0+12)/H)]}));
  const all=lines.map(l=>l.t).join('\n');
  if(all.length<8)return{summary:'Не удалось прочитать текст на снимке. Попробуйте снимок покрупнее и почётче.',warning:'',steps:[]};
  const kind=(OFF.kinds.find(k=>k[0].test(all))||[0,'Я прочитал текст на экране, но не уверен, что это за окно.'])[1];
  const found=[];for(const [re,name] of OFF.btns){const l=lines.find(l=>l.t.length<=28&&new RegExp(re,'i').test(l.t));if(l)found.push({name,box:l.box})}
  const steps=[],gw=(S.goal||'').toLowerCase().split(/[^а-яa-zіїє0-9]+/).filter(x=>x.length>3).map(x=>x.slice(0,Math.max(4,x.length-2)));
  const gl=gw.length&&lines.find(l=>gw.some(x=>l.t.toLowerCase().includes(x)));
  if(gl)steps.push({text:`Вот место, связанное с вашей целью: «${gl.t.slice(0,60)}». Нажмите на него.`,box:gl.box});
  if(/парол|password/i.test(all)&&!/ошибк/i.test(all))steps.push({text:'Введите логин и пароль в пустые поля. Пароль обычно виден точками — это нормально.',box:null});
  for(const b of found){if(steps.length>=3)break;steps.push({text:`Нажмите кнопку «${b.name}».`,box:b.box})}
  if(!steps.length)steps.push({text:'Прочитайте текст на экране. Если непонятно — не нажимайте ничего и спросите '+(C.helper||'близкого человека')+'.',box:null});
  const sc=OFF.scam.test(all);
  return{summary:kind+(found.length?' Кнопки на экране: '+found.map(b=>'«'+b.name+'»').join(', ')+'.':''),risk:sc?2:0,
    warning:sc?'На экране есть признаки обмана: срочность, коды, деньги или угрозы. Не нажимайте и ничего не вводите.':'',steps}};
