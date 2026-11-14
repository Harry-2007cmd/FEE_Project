const {spawn} = require('child_process');

(async()=>{
  const p = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
    '--headless','--disable-gpu','--no-sandbox',
    '--window-size=1920,2100','--virtual-time-budget=5000',
    '--evaluate',
    `(async()=>{
      await new Promise(r=>setTimeout(r,3000));
      return document.documentElement.outerHTML;
    })()`,
    'http://localhost:5180/'
  ]);
  let data = '';
  p.stdout.on('data', d => data += d);
  p.on('close', () => {
    require('fs').writeFileSync('shots/_rendered.html', data);
    console.log('dumped', data.length);
  });
})();