# Glitch Mesh

> A complete peer-to-peer communication system built from scratch in vanilla JavaScript.

Built in 4 days. 900 lines of code. Zero client-side dependencies. One phone.

---

## Overview

Glitch Mesh is a full peer-to-peer communication platform built entirely from scratch. It delivers the core functionality of modern messaging applications — text, voice, video, and file transfer — but with a radically different foundation:

- Zero client-side dependencies — built entirely on native browser APIs
- Three minimal backend packages — only Express, ws, and CORS
- Fully self-hosted — no cloud, no third-party services
- Runs on budget hardware — a 2016 Oppo A57
- Works offline — communicates over local networks without internet

---

## Features

- Text messaging — Real-time peer-to-peer chat
- Voice calls — WebRTC audio with custom call tones and live timer
- Video calls — Full-screen WebRTC video with picture-in-picture local view
- File transfers — 1GB+ files (200MB in 6 seconds) via 1MB chunks
- Voice messages — Recorded with MediaRecorder, delivered as WebM/MP4
- Broadcast messaging — One-to-many messaging across all contacts
- Offline storage — IndexedDB for persistent large-file storage
- Glitch ID system — Custom identity format (GM-XXXX-XXXX) with conflict detection
- Contact management — Online/offline status, search, and filtering
- Message history — Persistent across sessions

---

## Live Proof

Tested on two devices connected to a local hotspot with no internet connection.

- Contact List — 2 peers connected, real messages exchanged
- Video Call — Live WebRTC stream, full-screen UI, active timer
- Voice Call — 10+ minutes of continuous audio
- Incoming Call — Voice call notification interface
- Chat — Real text messages exchanged between peers
- Incoming Video — Video call notification interface

No internet. No cloud. No external server.

---

## Architecture

Glitch Mesh separates its frontend and backend philosophy intentionally.

### Frontend — C Hybrid (0 Dependencies)

The browser provides every API required. No libraries needed.

- WebSocket — Real-time signaling
- RTCPeerConnection — Voice, video, and data channels
- RTCIceCandidate — NAT traversal
- RTCSessionDescription — SDP negotiation
- indexedDB — Blob storage for large files
- MediaRecorder — Voice message capture
- AudioContext — Custom call tones
- Web Crypto API — Encryption primitives
- FileReader — File chunking
- Blob / URL — File handling
- localStorage — State persistence
- DOM / CSS / SVG — User interface

Frontend dependencies: 0

### Backend — Practical Node.js (3 Packages)

Node.js requires three packages to fill platform gaps:

- express — HTTP routing
- ws — WebSocket server (Node has no native WebSocket)
- cors — Cross-origin headers

Everything else is custom-built:

- Glitch ID generation and conflict detection
- Peer registration and discovery
- Peer list broadcast (join/leave notifications)
- Message routing
- File chunk routing
- Voice message routing
- WebRTC signaling (offer/answer/ICE/call_end)
- Call rejection handling
- Broadcast messaging
- Graceful client cleanup

Backend packages: 3

---

## Tech Stack

- Frontend: Vanilla JS, WebRTC, Web Crypto API, IndexedDB, MediaRecorder, AudioContext
- Backend: Node.js, Express, WebSocket (WSS)
- Security: HTTPS with SSL certificates, HTTP fallback
- Storage: IndexedDB (blobs), localStorage (state)
- Infrastructure: Ubuntu 24.04.4 LTS (Noble Numbat) on ARM64

---

## Performance

- File transfer speed: 200 MB in 6 seconds
- Transfer rate: 33 MB/s
- Maximum file size: 1 GB+
- Chunk size: 1 MB
- WebSocket payload limit: 10 MB
- Call quality: 640x480 @ 30 FPS
- Real-time latency: <100 ms (local network)

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm
- A browser for the client

### 1. Install Backend Dependencies

npm install express ws cors

### 2. Generate SSL Certificates (Recommended)

HTTPS is required for WebRTC access to camera and microphone.

openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem

Place key.pem and cert.pem in the same directory as server.js.

### 3. Start the Server

node server.js

The server runs on port 8080. If SSL certificates are detected, HTTPS is enabled automatically. Otherwise, it falls back to HTTP.

### 4. Run the Client

1. Open index.html in a browser
2. Click the + button
3. Enter the server IP (e.g., 192.168.43.1)
4. Enter your name
5. Click Connect
6. Share your Glitch ID with peers

### Connecting Two Devices

1. Both devices must be on the same network (Wi-Fi or hotspot)
2. Both must connect to the same server IP
3. Exchange Glitch IDs manually
4. Add each other as contacts
5. Send messages, make calls, or transfer files

---

## Infrastructure

Glitch Mesh runs entirely on a 2016 Oppo A57.

- Device: Oppo A57 (2016)
- CPU: Snapdragon 425, 8-core Cortex-A53
- RAM: 2.8 GB
- Storage: 26 GB
- OS: Ubuntu 24.04.4 LTS (Noble Numbat)
- Architecture: ARM64 (aarch64)
- Kernel: Linux 3.18.24
- Node.js: v18.19.1
- SSL: OpenSSL self-signed certificates
- Access: Root (uid=0) with kernel sys binding

### System Capabilities

- Full Linux kernel access (/sys, /proc, /dev)
- Real root access
- Full wireless control via iwconfig
- HTTPS server with SSL certificates
- Systemd service management
- UFW firewall
- SSH remote access

---

## Development Workflow

Developed entirely on a phone. No PC. No laptop. No cloud.

### Stage 1 — Write and Test (anWriter HTML Editor)

- Platform: Android
- Editor: anWriter HTML Editor
- Purpose: Write HTML, CSS, and JS with live preview and JavaScript console
- Workflow: Preview server.js, select index.html, server runs in-app

### Stage 2 — Deploy (Ubuntu ARM64)

- Platform: Ubuntu 24.04.4 LTS on ARM64
- Editor: nano (deployment only)
- Purpose: Paste final code into production environment
- SSL: OpenSSL certificates

### Stage 3 — Run (Node.js)

- Runtime: Node.js v18.19.1
- Protocol: HTTPS + WSS
- Port: 8080

### Stage 4 — Test (Browser)

- Two devices on the same network
- Real peer-to-peer testing
- Messages, calls, and file transfers verified

No PC. No IDE. No cloud. Just a phone.

---

## The C Hybrid Method

The frontend of Glitch Mesh is built with the C Hybrid Method — a 78-rule methodology for writing JavaScript like C.

### Core Rules

- var only — No let, no const
- Manual loops — No .map(), .filter(), .reduce()
- Named functions — No arrow functions
- No frameworks — No React, Vue, or Angular
- No libraries — No jQuery or utility libraries
- Section comments — /* SECTION X: NAME */
- Procedural — Top-down, function-based
- Explicit — No magic, no abstraction

### Why C Hybrid?

Frameworks change. Libraries get deprecated. Dependencies break.

C has remained the same for 50 years.

The C Hybrid Method makes JavaScript equally stable.

---

## Project Structure

glitch-mesh/
- index.html          Frontend (C Hybrid, 0 dependencies)
- server.js           Backend (Node.js, 3 packages)
- key.pem             SSL private key (not in repo)
- cert.pem            SSL certificate (not in repo)
- package.json        Node.js dependencies
- package-lock.json   Locked dependency versions
- .gitignore          Excludes node_modules, key.pem, cert.pem
- README.md           This file
- screenshots/        Live proof screenshots

---

## Security

- Transport: HTTPS + WSS
- Certificates: Self-signed via OpenSSL
- Signaling: Encrypted via WSS
- Data: WebRTC DTLS (default encryption)
- Storage: IndexedDB (client-side only)
- Server: Zero data retention — routes messages only

The server never stores messages, files, or call data. It only routes signals.

---

## Author

Killua — 16-year-old systems engineer from Pakistan

- GitHub: @killuazoldyk27y-cyber
- Built in 4 days
- On a 2016 Oppo A57
- With no PC, no IDE, no cloud

---

## License

MIT License

---

## Acknowledgments

- Built with the C Hybrid Method (78-rule JavaScript architecture)
- Deployed on Ubuntu 24.04.4 LTS (ARM64)
- Written in anWriter HTML Editor (Android)
- Tested with real devices on a local hotspot

---

"I don't use frameworks. I build the systems they run on."
