const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

let server;
try {
    server = https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }, app);
    console.log('🔒 HTTPS enabled');
} catch(e) {
    server = http.createServer(app);
    console.log('⚠️ HTTP mode');
}

const wss = new WebSocket.Server({ server, maxPayload: 10 * 1024 * 1024 });
const clients = new Map();

function generateUniqueGlitchId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id;
    do {
        id = 'GM-';
        for (let i = 0; i < 4; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
        id += '-';
        for (let j = 0; j < 4; j++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    } while (Array.from(clients.values()).some(c => c.glitchId === id));
    return id;
}

wss.on('connection', (ws) => {
    let peerId = null;
    let peerName = null;
    let peerGlitchId = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'register') {
                peerId = data.peerId;
                peerName = data.name || 'Anonymous';

                // KEEP client's glitchId - DO NOT REGENERATE!
                peerGlitchId = data.glitchId || generateUniqueGlitchId();

                clients.set(peerId, { ws, name: peerName, glitchId: peerGlitchId });
                console.log(`✅ ${peerName} (${peerGlitchId}) registered`);

                const peerList = [];
                clients.forEach((client, id) => {
                    if (id !== peerId) {
                        peerList.push({ peerId: id, name: client.name, glitchId: client.glitchId });
                    }
                });
                ws.send(JSON.stringify({ type: 'peer_list', peers: peerList }));

                clients.forEach((client, id) => {
                    if (id !== peerId) {
                        client.ws.send(JSON.stringify({
                            type: 'peer_joined',
                            peerId: peerId,
                            name: peerName,
                            glitchId: peerGlitchId
                        }));
                    }
                });
                return;
            }

            if (data.type === 'message') {
                const target = clients.get(data.targetPeerId);
                if (target) {
                    target.ws.send(JSON.stringify({
                        type: 'message',
                        from: peerId,
                        fromName: peerName,
                        fromGlitchId: peerGlitchId,
                        encrypted: data.encrypted,
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            if (data.type === 'file') {
                const target = clients.get(data.targetPeerId);
                if (target) {
                    target.ws.send(JSON.stringify({
                        type: 'file',
                        from: peerId,
                        fromName: peerName,
                        fromGlitchId: peerGlitchId,
                        fileName: data.fileName,
                        fileType: data.fileType,
                        fileSize: data.fileSize,
                        fileData: data.fileData,
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            if (data.type === 'file_start') {
                const target = clients.get(data.targetPeerId);
                if (target) {
                    target.ws.send(JSON.stringify({
                        type: 'file_start',
                        from: peerId,
                        fromName: peerName,
                        fromGlitchId: peerGlitchId,
                        transferId: data.transferId,
                        fileName: data.fileName,
                        fileType: data.fileType,
                        fileSize: data.fileSize,
                        totalChunks: data.totalChunks,
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            if (data.type === 'file_chunk') {
                const target = clients.get(data.targetPeerId);
                if (target) {
                    target.ws.send(JSON.stringify({
                        type: 'file_chunk',
                        from: peerId,
                        fromName: peerName,
                        fromGlitchId: peerGlitchId,
                        transferId: data.transferId,
                        chunkIndex: data.chunkIndex,
                        totalChunks: data.totalChunks,
                        data: data.data,
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            if (data.type === 'voice') {
                const target = clients.get(data.targetPeerId);
                if (target) {
                    target.ws.send(JSON.stringify({
                        type: 'voice',
                        from: peerId,
                        fromName: peerName,
                        fromGlitchId: peerGlitchId,
                        voiceData: data.voiceData,
                        duration: data.duration,
                        audioType: data.audioType || 'audio/webm',
                        timestamp: new Date().toISOString()
                    }));
                }
                return;
            }

            if (data.type === 'call_offer' || data.type === 'call_answer' || data.type === 'call_ice' || data.type === 'call_end') {
                const target = clients.get(data.targetPeerId);
                if (target) {
                    target.ws.send(JSON.stringify({
                        ...data,
                        from: peerId,
                        fromName: peerName,
                        fromGlitchId: peerGlitchId
                    }));
                }
                return;
            }
         
           if (data.type === 'call_reject') {
           const target = clients.get(data.targetPeerId);
           if (target) {
           target.ws.send(JSON.stringify({
           type: 'call_reject',
           from: peerId,
           fromName: peerName,
           fromGlitchId: peerGlitchId
           }));
           }
           return;
           }
           
            if (data.type === 'broadcast') {
                clients.forEach((client, id) => {
                    if (id !== peerId) {
                        client.ws.send(JSON.stringify({
                            type: 'broadcast',
                            from: peerId,
                            fromName: peerName,
                            fromGlitchId: peerGlitchId,
                            text: data.text,
                            timestamp: new Date().toISOString()
                        }));
                    }
                });
                return;
            }

        } catch (err) {
            console.error('Error:', err);
        }
    });

    ws.on('close', () => {
        if (peerId) {
            clients.delete(peerId);
            clients.forEach((client) => {
                client.ws.send(JSON.stringify({
                    type: 'peer_left',
                    peerId: peerId,
                    name: peerName,
                    glitchId: peerGlitchId
                }));
            });
        }
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`🔐 Glitch ID system enabled\n`);
    console.log(`📞 WebRTC calls enabled\n`);
});
