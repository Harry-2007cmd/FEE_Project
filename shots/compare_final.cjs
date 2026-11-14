const fs = require('fs');
const {spawn} = require('child_process');

const origFiles = {
  'home': 'main:index.html',
  'login': 'main:login.html',
  'signup': 'main:signup.html',
  'tools': 'main:tools.html',
  'courses': 'main:courses.html',
  'course': 'main:course.html',
  'planner': 'main:planner.html',
  'coach': 'main:coach.html',
  'pricing': 'main:pricing.html',
  'lesson': 'main:lesson.html',
  'trainers': 'main:trainers.html',
};

function getOrig(name) {
  return new Promise((resolve, reject) => {
    const p = spawn('git', ['show', origFiles[name]], { cwd: 'C:/Users/LENOVO/OneDrive/Desktop/FEE PROJECT' });
    let data = '';
    p.stdout.on('data', d => data += d);
    p.on('close', () => resolve(data));
    p.on('error', reject);
  });
}

function getReact(name) {
  const f = `shots/_dom_final_${name}.html`;
  return fs.readFileSync(f, 'utf8');
}

function extractClasses(html) {
  const classes = new Set();
  const re = /class="([^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    m[1].split(/\s+/).forEach(c => c && classes.add(c));
  }
  return classes;
}

async function main() {
  const names = ['home', 'login', 'signup', 'tools', 'courses', 'course', 'planner', 'coach', 'pricing', 'lesson', 'trainers'];
  for (const name of names) {
    try {
      const [o, r] = await Promise.all([getOrig(name), getReact(name)]);
      const oc = extractClasses(o), rc = extractClasses(r);
      const missing = new Set([...oc].filter(c => !rc.has(c)));
      const extra = new Set([...rc].filter(c => !oc.has(c)));
      if (missing.size || extra.size) {
        console.log(`\n=== ${name.toUpperCase()} ===`);
        if (missing.size) console.log('MISSING in React:', [...missing].sort().join(', '));
        if (extra.size) console.log('EXTRA in React:', [...extra].sort().join(', '));
      } else {
        console.log(`${name}: OK (${oc.size} classes)`);
      }
    } catch (e) {
      console.log(`${name}: ERROR - ${e.message}`);
    }
  }
}
main();