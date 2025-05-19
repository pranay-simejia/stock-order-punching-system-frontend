"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = void 0;
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};
exports.shuffleArray = shuffleArray;
