"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueValidator = void 0;
exports.Unique = Unique;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const typeorm_2 = require("typeorm");
let UniqueValidator = class UniqueValidator {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async validate(_value, args) {
        const [entityClass, findCondition] = args.constraints;
        return ((await this.dataSource.getRepository(entityClass).count({
            where: findCondition(args),
        })) <= 0);
    }
    defaultMessage(args) {
        const [entityClass] = args.constraints;
        const entity = entityClass.name || 'Entity';
        return `${entity} with the same ${args.property} already exists`;
    }
};
exports.UniqueValidator = UniqueValidator;
exports.UniqueValidator = UniqueValidator = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'unique', async: true }),
    tslib_1.__param(0, (0, typeorm_1.InjectDataSource)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.DataSource])
], UniqueValidator);
function Unique(constraints, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: UniqueValidator,
        });
    };
}
//# sourceMappingURL=unique.validator.js.map