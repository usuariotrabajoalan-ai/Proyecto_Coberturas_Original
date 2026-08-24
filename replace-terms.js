const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /Limpiadora Asignada/g, to: "Personal Asignado" },
  { from: /Todas las limpiadoras \(General\)/g, to: "Todo el personal (General)" },
  { from: /Todas las limpiadoras/g, to: "Todo el personal" },
  { from: /las limpiadoras/g, to: "el personal" },
  { from: /Limpiadora/g, to: "Personal" },
  { from: /limpiadora/g, to: "personal" },
  { from: /Personal de Limpieza/g, to: "Personal de Cobertura" },
  { from: /Limpieza/g, to: "Cobertura" },
  { from: /Alta de Nueva Empleada/g, to: "Alta de Nuevo Personal" },
  { from: /Nueva Empleada/g, to: "Nuevo Personal" },
  { from: /Gestionar Empleada/g, to: "Gestionar Personal" },
  { from: /EMPLEADA/g, to: "PERSONAL" },
  { from: /Empleada/g, to: "Personal" },
  { from: /empleada/g, to: "personal" },
  { from: /Ej\. Teresa Rolón/g, to: "Ej. Juan Pérez o Teresa Rolón" }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
