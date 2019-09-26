import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';
import * as ts from 'typescript';
import * as process from 'process';

const TSMap: Map<string, any> = new Map();

module.exports = (fileName: string = process.cwd()) => function requireTS(id: string, ENCODE: string = 'utf8') {
    const filename = path.join(path.dirname(fileName), id);

    if (id.slice(-3) !== '.ts') return require(filename);
    if (TSMap.has(filename)) return TSMap.get(filename);

    const TSModule = Reflect.construct(module.constructor, [filename, null]);
    TSModule.filename = fileName;
    const ParentModule = Reflect.construct(module.constructor, [fileName, null]);
    ParentModule.filename = module.filename;
    TSModule.parent = ParentModule;

    const { exports } = TSModule;
    const dirname = path.dirname(filename);
    const txt = fs.readFileSync(filename, ENCODE);
    const code = ts.transpileModule(txt, {
        fileName: filename,
        // transformers: ts.CustomTransformers,
        compilerOptions: {},
        reportDiagnostics: true,
    });

    const inspectorWrapper = vm.runInThisContext(`(function (exports, require, module, __filename, __dirname) { ${code.outputText} });`, {
        filename,
        timeout: 5e3,
    });

    inspectorWrapper.call(global, exports, requireTS, TSModule, filename, dirname);

    const result = TSModule.exports;

    TSMap.set(filename, result);

    return result;
};
