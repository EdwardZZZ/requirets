const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
require('ts-mocha');
const Mocha = require('mocha');
const mocha = new Mocha();

const ROOT = process.cwd();
const fullPath = (p) => path.resolve(ROOT, p);

/**
 * add *.spec.ts
 * Author by zhangzhihua
 * addFile eg: mocha.addFile('./test/tcp.spec.ts'));
 */
process.env.MOCHAMODE = 'multy';
fs.readdirSync(fullPath('test/spec')).forEach((name) => {
    if (name.slice(-7) === 'spec.ts') {
        mocha.addFile(fullPath(`test/spec/${name}`));
    }
});

function testV3(cb) {
    const m = child_process.spawn('mocha', [
        'test/index',
        'v3',
    ], {
        cwd: process.cwd(),
    });

    m.stdout.on('data', (data) => {
        const logV3 = data.toString().replace(/\n$/, '');
        console.log(logV3);
        if (logV3.indexOf('v3 err') > -1) {
            cb( new Error('v3 err'));
        }

        if (logV3.indexOf('v3 end') > -1) {
            cb();
        }
    });
}

function testV4(cb) {
    const m = child_process.spawn('mocha', [
        'test/index',
        'v4',
    ], {
        cwd: process.cwd(),
    });

    m.stdout.on('data', (data) => {
        const logV3 = data.toString().replace(/\n$/, '');
        console.log(logV3);
        if (logV3.indexOf('v4 err') > -1) {
            cb( new Error('v4 err'));
        }

        if (logV3.indexOf('v4 end') > -1) {
            cb();
        }
    });
}

if (process.argv.indexOf('v4') > -1) {
    mocha.run(async (err) => {
        console.log(err ? 'v4 err' : 'v4 end');
        process.exit();
    });
} else if (process.argv.indexOf('v3') > -1) {
    mocha.run(async (err) => {
        console.log(err ? 'v3 err' : 'v3 end');
        process.exit();
    });
} else if (process.argv.indexOf('all') > -1) {
    testV4((errV4) => {
        if (errV4) process.exit();

        testV3((errV3) => {
            if (errV3) process.exit();
    
            mocha.run(async () => {
                process.exit();
            });
        });
    });
} else {
    mocha.run(async () => {
        process.exit();
    });
}
