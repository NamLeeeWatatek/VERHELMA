"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = generateHash;
exports.validateHash = validateHash;
exports.getVariableName = getVariableName;
exports.applySorting = applySorting;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
function generateHash(password) {
    return bcrypt_1.default.hashSync(password, 10);
}
function validateHash(password, hash) {
    if (!password || !hash) {
        return Promise.resolve(false);
    }
    return bcrypt_1.default.compare(password, hash);
}
function getVariableName(getVar) {
    const m = /\(\)=>(.*)/.exec(getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''));
    if (!m) {
        throw new Error("The function does not contain a statement matching 'return variableName;'");
    }
    const fullMemberName = m[1];
    const memberParts = fullMemberName.split('.');
    return memberParts.at(-1);
}
function applySorting(queryBuilder, filterDto, alias, validColumns) {
    if (filterDto.orderBy) {
        if (!validColumns.includes(filterDto.orderBy)) {
            throw new common_1.BadRequestException(`Invalid orderBy field: ${filterDto.orderBy}`);
        }
        queryBuilder.orderBy(`${alias}.${filterDto.orderBy}`, filterDto.order);
    }
}
//# sourceMappingURL=utils.js.map