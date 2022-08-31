"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceSystemController = void 0;
const tsoa_1 = require("tsoa");
const referenceSystemService_1 = require("./referenceSystemService");
let referenceSystemController = class referenceSystemController extends tsoa_1.Controller {
    sayHello() {
        return __awaiter(this, void 0, void 0, function* () {
            return new referenceSystemService_1.referenceSystemService().get();
        });
    }
    formatText(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201);
            console.log("Literally anything!");
            return new referenceSystemService_1.referenceSystemService().post(requestBody);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], referenceSystemController.prototype, "sayHello", null);
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.SuccessResponse)("201", "Created"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], referenceSystemController.prototype, "formatText", null);
referenceSystemController = __decorate([
    (0, tsoa_1.Route)("references")
], referenceSystemController);
exports.referenceSystemController = referenceSystemController;
