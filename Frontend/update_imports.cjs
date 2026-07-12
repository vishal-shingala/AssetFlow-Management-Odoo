const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('./src/features').filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/\.\.\/\.\.\/data\/(?!\.\.)/g, '../data/');
  content = content.replace(/\.\.\/\.\.\/services\//g, '../api/');
  content = content.replace(/\.\.\/\.\.\/components/g, '../../../components');
  content = content.replace(/\.\.\/\.\.\/context/g, '../../../context');
  content = content.replace(/\.\.\/\.\.\/constants/g, '../../../constants');
  content = content.replace(/\.\.\/\.\.\/lib/g, '../../../lib');
  
  fs.writeFileSync(file, content);
});

console.log("Updated imports in features pages.");
