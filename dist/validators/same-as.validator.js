"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SameAs = SameAs;
const class_validator_1 = require("class-validator");
function SameAs(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'sameAs',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    return args.object[relatedPropertyName] === value;
                },
                defaultMessage() {
                    return '$property must match $constraint1';
                },
            },
        });
    };
}
//# sourceMappingURL=same-as.validator.js.map