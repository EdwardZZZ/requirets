const requireTS = require('../dist/index')(__filename);

const data = requireTS('./data.ts');

console.log(data);