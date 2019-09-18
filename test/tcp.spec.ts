// import * as chai from 'chai';

// import Server from '../src/tcp/Server';
// import Client from '../src/tcp/Client';

// const { expect } = chai;

// const server = new Server();
// server.listen(8058);

// const client = new Client({
//     host: '127.0.0.1',
//     port: 8058,
// });

// function testReciveServer(str: string) {
//     return new Promise((resolve) => {
//         server.on('data', (data, conn) => {
//             resolve(data.toString());
//         });

//         client.send(str);
//     });
// }

// function testReciveClient(str: string, backStr: string) {
//     return new Promise((resolve) => {
//         server.removeAllListeners();
//         server.on('data', (data, conn) => {
//             conn.write(backStr);
//         });

//         client.on('data', (data) => {
//             resolve(data.toString());
//         });
//         client.send(str);
//     });
// }

// describe('tcp 消息', () => {
//     const clientSendStr = 'ClientMsg';
//     const serverSendStr = 'ServerMsg';

//     it(`server recive ${clientSendStr}`, async () => {
//         const result = await testReciveServer(clientSendStr);
//         expect(result).eq(clientSendStr);
//     });

//     it(`client recive ${serverSendStr}`, async () => {
//         const result = await testReciveClient(clientSendStr, serverSendStr);
//         expect(result).eq(serverSendStr);
//     });

//     before(() => {
//         console.log('===tcp 测试开始====');
//     });

//     after(() => {
//         console.log('===tcp 测试完成====');
//         server.close();
//         client.close();
//         if (!process.env.MOCHAMODE || process.env.MOCHAMODE !== 'multy') {
//             process.exit();
//         }
//     });
// });
