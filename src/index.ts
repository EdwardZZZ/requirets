import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';
import * as ts from 'typescript';
import * as process from 'process';

const TSMap: Map<string, any> = new Map();

module.exports = (dirName: string = process.cwd()) => function requireTS(id: string, ENCODE: string = 'utf8') {
    const fileName = path.join(dirName, id);

    if (id.slice(-3) !== '.ts') return require(fileName);

    const txt = fs.readFileSync(fileName, ENCODE);

    if (TSMap.has(fileName)) return TSMap.get(fileName);

    const TSModule = { id: fileName, exports: {} };
    const { exports } = TSModule;
    const dirname = path.dirname(fileName);
    const code = ts.transpileModule(txt, {
        fileName,
        // transformers: ts.CustomTransformers,
        compilerOptions: {},
        reportDiagnostics: true,
    });

    const inspectorWrapper = vm.runInThisContext(`(function (exports, require, module, __filename, __dirname) { ${code.outputText} });`, {
        filename: fileName,
        timeout: 5e3,
    });

    inspectorWrapper.call(global, exports, requireTS, TSModule, fileName, dirname);

    TSMap.set(fileName, TSModule.exports);

    return TSModule.exports;
};
