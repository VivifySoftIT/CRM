const fs = require('fs');
const path = require('path');

function replaceWords(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceWords(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/VivifyCRM/g, 'OmniCRM');
      content = content.replace(/VIVIFYCRM/g, 'OMNICRM');
      content = content.replace(/Vivify CRM/g, 'Omni CRM');
      content = content.replace(/VIVIFY CRM/g, 'OMNI CRM');
      content = content.replace(/VivifySoft/g, 'OmniSaaS');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceWords(path.join(__dirname, 'src'));
replaceWords(__dirname); // for index.html if needed
console.log('Rebranded successfully!');
