"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = IsPassword;
exports.IsPhoneNumber = IsPhoneNumber;
exports.IsTmpKey = IsTmpKey;
exports.IsUndefinable = IsUndefinable;
exports.IsNullable = IsNullable;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
function IsPassword(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            propertyName: propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value) {
                    return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
                },
            },
        });
    };
}
function IsPhoneNumber(validationOptions) {
    return (0, class_validator_1.IsPhoneNumber)(validationOptions?.region, {
        message: 'error.phoneNumber',
        ...validationOptions,
    });
}
function IsTmpKey(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            propertyName: propertyName,
            name: 'tmpKey',
            target: object.constructor,
            options: validationOptions,
            validator: {
                validate(value) {
                    return (0, lodash_1.isString)(value) && value.startsWith('tmp/');
                },
                defaultMessage() {
                    return 'error.invalidTmpKey';
                },
            },
        });
    };
}
function IsUndefinable(options) {
    return (0, class_validator_1.ValidateIf)((_obj, value) => value !== undefined, options);
}
function IsNullable(options) {
    return (0, class_validator_1.ValidateIf)((_obj, value) => value !== null, options);
}
//# sourceMappingURL=validator.decorators.js.map