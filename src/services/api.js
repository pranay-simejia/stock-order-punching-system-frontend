"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomDestination = getRandomDestination;
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
async function getRandomDestination() {
    const res = await fetch(`${API_BASE}/destination/random`);
    return res.json();
}
