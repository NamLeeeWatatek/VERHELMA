"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTranslationEntity = exports.AbstractEntity = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
class AbstractEntity {
    id;
    createdAt;
    updatedAt;
    translations;
    toDto(options) {
        const dtoClass = this.constructor.prototype.dtoClass;
        if (!dtoClass) {
            throw new Error(`You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`);
        }
        return new dtoClass(this, options);
    }
}
exports.AbstractEntity = AbstractEntity;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], AbstractEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
    }),
    tslib_1.__metadata("design:type", Date)
], AbstractEntity.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
    }),
    tslib_1.__metadata("design:type", Date)
], AbstractEntity.prototype, "updatedAt", void 0);
class AbstractTranslationEntity extends AbstractEntity {
    languageCode;
}
exports.AbstractTranslationEntity = AbstractTranslationEntity;
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.LanguageCode }),
    tslib_1.__metadata("design:type", String)
], AbstractTranslationEntity.prototype, "languageCode", void 0);
//# sourceMappingURL=abstract.entity.js.map