"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("../build/routes");
const express_1 = __importDefault(require("express"));
const tsoa_1 = require("tsoa");
exports.app = (0, express_1.default)();
// Use body parser to read sent json payloads
exports.app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
exports.app.use(body_parser_1.default.json());
(0, routes_1.RegisterRoutes)(exports.app);
exports.app.use(function errorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err === null || err === void 0 ? void 0 : err.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next();
});
