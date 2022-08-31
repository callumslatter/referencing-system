"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceSystemService = void 0;
class referenceSystemService {
    get() {
        return {
            body: "Here's a string really it is!",
            references: ["Here's string 1!"]
        };
    }
    post(inputText) {
        return {
            body: inputText,
            references: ["Here's string 1!"]
        };
    }
}
exports.referenceSystemService = referenceSystemService;
