const fs = require('fs');
let code = fs.readFileSync('src/components/CreateOrderWizard.tsx', 'utf8');

const target = '<div className="bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3">\n                    {[';
const replace = '<div className="flex flex-col sm:flex-row gap-6 items-start">\n                    <div className="w-full sm:w-1/3 bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 flex flex-col items-center justify-center sticky top-0 shadow-sm">\n                      <MannequinVisualizer activeField={activeMesureField} />\n                      <p className="text-[10px] text-center text-[#0D1B2A]/50 mt-4 leading-tight">\n                        Survolez ou cliquez sur un champ pour voir où placer le mètre ruban.\n                      </p>\n                    </div>\n                    <div className="w-full sm:w-2/3 bg-white p-4 rounded-2xl border border-[#0D1B2A]/10 space-y-3 shadow-sm">\n                    {[';

code = code.replace(target, replace);
fs.writeFileSync('src/components/CreateOrderWizard.tsx', code);
