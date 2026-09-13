const fs = require('fs');
let code = fs.readFileSync('src/components/CreateOrderWizard.tsx', 'utf8');

code = code.replace(
  '                      );\n                    })}\n                  </div>\n                </div>\n              )}',
  '                      );\n                    })}\n                    </div>\n                  </div>\n                </div>\n              )}'
);

fs.writeFileSync('src/components/CreateOrderWizard.tsx', code);
