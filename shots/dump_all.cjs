const {spawn} = require('child_process');
const routes = [
  '/login', '/signup', '/', '/planner', '/profile', '/tools', '/courses',
  '/course?id=start-strong', '/lesson?course=start-strong&n=1', '/trainers',
  '/pricing', '/coach', '/trainers?chat=Maya%20Chen'
];

async function dump(route) {
  const safe = route.replace(/[?&/]/g, '_').replace(/^_+|_+$/g, '');
  return new Promise((resolve, reject) => {
    const p = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
      '--headless', '--disable-gpu', '--no-sandbox',
      '--virtual-time-budget=10000', '--dump-dom',
      'http://localhost:5180' + route
    ]);
    let data = '';
    p.stdout.on('data', d => data += d);
    p.stderr.on('data', d => {});
    p.on('close', () => {
      require('fs').writeFileSync(`shots/_dom_final_${safe}.html`, data);
      console.log(`${route} -> ${data.length} bytes`);
      resolve();
    });
    p.on('error', reject);
  });
}

async function main() {
  for (const route of routes) {
    await dump(route);
  }
  console.log('All done');
}
main().catch(console.error);