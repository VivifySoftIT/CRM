const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Inline styles targeting dark theme text
      content = content.replace(/color:\s*'white'/g, "color: 'var(--text-primary)'");
      content = content.replace(/color="white"/g, "color=\"var(--text-primary)\"");
      
      // Target specific components with custom overrides
      content = content.replace(/color:\s*'var\(--text-primary\)',\s*background:\s*'var\(--danger\)'/g, "color: 'white', background: 'var(--danger)'");
      content = content.replace(/color:\s*'var\(--text-primary\)',\s*background:\s*'var\(--success\)'/g, "color: 'white', background: 'var(--success)'");
      
      // Glass backgrounds for dark theme: mostly rgba(255,255,255,0.05)
      // replace with rgba(0,0,0,0.03) for the light theme equivalent
      content = content.replace(/rgba\(255,\s*255,\s*255,/g, "rgba(0, 0, 0,");
      
      // Portal.jsx specific fixes
      content = content.replace(/background:\s*'var\(--bg-dark\)'/g, "background: 'white'");
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('Theme conversion completed!');
