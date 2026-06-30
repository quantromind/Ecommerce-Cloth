const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src');

const replacements = {
  'bg-black': 'bg-primary',
  'bg-[#0a0a0a]': 'bg-secondary',
  'text-white': 'text-text-main',
  'text-gray-400': 'text-text-muted',
  'text-gray-300': 'text-text-muted',
  'text-gray-500': 'text-text-muted',
  'border-white/10': 'border-border-light',
  'border-white/20': 'border-border-light',
  'bg-white/5': 'bg-black/5',
  'bg-white/10': 'bg-black/5',
  'text-[#D4AF37]': 'text-accent',
  'border-[#D4AF37]': 'border-accent',
  'via-[#D4AF37]': 'via-accent',
  'from-[#D4AF37]': 'from-accent',
  'to-[#D4AF37]': 'to-accent',
  'shadow-[#D4AF37]/20': 'shadow-accent/20',
  'bg-[#D4AF37]': 'bg-accent',
  'hover:text-white': 'hover:text-text-main',
  'hover:bg-white/10': 'hover:bg-black/10',
  'hover:bg-white/20': 'hover:bg-black/10',
  'placeholder-gray-500': 'placeholder-gray-400',
  'ring-white/20': 'ring-black/10',
  'focus:ring-white': 'focus:ring-accent',
  'focus:border-white': 'focus:border-accent',
  'from-white': 'from-text-main',
  'to-white': 'to-text-main',
  'to-gray-400': 'to-text-muted',
  'from-gray-900': 'from-primary',
  'via-black': 'via-primary',
  'to-black': 'to-primary'
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
console.log('Theme replacement complete.');
