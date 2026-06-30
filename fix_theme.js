const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src');

const replacements = {
  'bg-[#121212]': 'bg-secondary',
  'bg-[#1a1a1a]': 'bg-secondary',
  'bg-[#0f0f0f]': 'bg-primary',
  'bg-[#111]': 'bg-primary',
  'bg-gray-900': 'bg-secondary',
  'text-gray-200': 'text-text-main',
  'text-gray-100': 'text-text-main',
  'text-[#f0f0f0]': 'text-text-main',
  'border-[#333]': 'border-border-light',
  'border-white/5': 'border-border-light',
  'bg-black/5': 'bg-black/5' // Just to make sure we don't double replace
};

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const [search, replace] of Object.entries(replacements)) {
         content = content.split(search).join(replace);
      }
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Fix theme replacement complete.');
