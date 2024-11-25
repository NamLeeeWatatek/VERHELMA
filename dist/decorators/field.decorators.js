"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberField = NumberField;
exports.NumberFieldOptional = NumberFieldOptional;
exports.StringField = StringField;
exports.StringFieldOptional = StringFieldOptional;
exports.PasswordField = PasswordField;
exports.PasswordFieldOptional = PasswordFieldOptional;
exports.BooleanField = BooleanField;
exports.BooleanFieldOptional = BooleanFieldOptional;
exports.TranslationsField = TranslationsField;
exports.TranslationsFieldOptional = TranslationsFieldOptional;
exports.TmpKeyField = TmpKeyField;
exports.TmpKeyFieldOptional = TmpKeyFieldOptional;
exports.EnumField = EnumField;
exports.ClassField = ClassField;
exports.EnumFieldOptional = EnumFieldOptional;
exports.ClassFieldOptional = ClassFieldOptional;
exports.EmailField = EmailField;
exports.EmailFieldOptional = EmailFieldOptional;
exports.PhoneField = PhoneField;
exports.PhoneFieldOptional = PhoneFieldOptional;
exports.UUIDField = UUIDField;
exports.UUIDFieldOptional = UUIDFieldOptional;
exports.URLField = URLField;
exports.URLFieldOptional = URLFieldOptional;
exports.DateField = DateField;
exports.DateFieldOptional = DateFieldOptional;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
const property_decorators_1 = require("./property.decorators");
const transform_decorators_1 = require("./transform.decorators");
const validator_decorators_1 = require("./validator.decorators");
function NumberField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => Number)];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: Number, ...options }));
    }
    if (options.each) {
        decorators.push((0, transform_decorators_1.ToArray)());
    }
    if (options.int) {
        decorators.push((0, class_validator_1.IsInt)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.IsNumber)({}, { each: options.each }));
    }
    if (typeof options.min === 'number') {
        decorators.push((0, class_validator_1.Min)(options.min, { each: options.each }));
    }
    if (typeof options.max === 'number') {
        decorators.push((0, class_validator_1.Max)(options.max, { each: options.each }));
    }
    if (options.isPositive) {
        decorators.push((0, class_validator_1.IsPositive)({ each: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function NumberFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), NumberField({ required: false, ...options }));
}
function StringField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => String), (0, class_validator_1.IsString)({ each: options.each })];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options, isArray: options.each }));
    }
    const minLength = options.minLength || 1;
    decorators.push((0, class_validator_1.MinLength)(minLength, { each: options.each }));
    if (options.maxLength) {
        decorators.push((0, class_validator_1.MaxLength)(options.maxLength, { each: options.each }));
    }
    if (options.toLowerCase) {
        decorators.push((0, transform_decorators_1.ToLowerCase)());
    }
    if (options.toUpperCase) {
        decorators.push((0, transform_decorators_1.ToUpperCase)());
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function StringFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), StringField({ required: false, ...options }));
}
function PasswordField(options = {}) {
    const decorators = [StringField({ ...options, minLength: 6 }), (0, validator_decorators_1.IsPassword)()];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function PasswordFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), PasswordField({ required: false, ...options }));
}
function BooleanField(options = {}) {
    const decorators = [(0, transform_decorators_1.ToBoolean)(), (0, class_validator_1.IsBoolean)()];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: Boolean, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function BooleanFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), BooleanField({ required: false, ...options }));
}
function TranslationsField(options) {
    const decorators = [
        (0, class_validator_1.ArrayMinSize)(constants_1.supportedLanguageCount),
        (0, class_validator_1.ArrayMaxSize)(constants_1.supportedLanguageCount),
        (0, class_validator_1.ValidateNested)({
            each: true,
        }),
        (0, class_transformer_1.Type)(() => options.type),
    ];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ isArray: true, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function TranslationsFieldOptional(options) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), TranslationsField({ required: false, ...options }));
}
function TmpKeyField(options = {}) {
    const decorators = [
        StringField(options),
        (0, validator_decorators_1.IsTmpKey)({ each: options.each }),
    ];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options, isArray: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function TmpKeyFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), TmpKeyField({ required: false, ...options }));
}
function EnumField(getEnum, options = {}) {
    const enumValue = getEnum();
    const decorators = [(0, class_validator_1.IsEnum)(enumValue, { each: options.each })];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.each) {
        decorators.push((0, transform_decorators_1.ToArray)());
    }
    if (options.swagger !== false) {
        decorators.push((0, property_decorators_1.ApiEnumProperty)(getEnum, { ...options, isArray: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ClassField(getClass, options = {}) {
    const classValue = getClass();
    const decorators = [
        (0, class_transformer_1.Type)(() => classValue),
        (0, class_validator_1.ValidateNested)({ each: options.each }),
    ];
    if (options.required !== false) {
        decorators.push((0, class_validator_1.IsDefined)());
    }
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({
            type: () => classValue,
            ...options,
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function EnumFieldOptional(getEnum, options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), EnumField(getEnum, { required: false, ...options }));
}
function ClassFieldOptional(getClass, options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), ClassField(getClass, { required: false, ...options }));
}
function EmailField(options = {}) {
    const decorators = [
        (0, class_validator_1.IsEmail)(),
        StringField({ toLowerCase: true, ...options }),
    ];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function EmailFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), EmailField({ required: false, ...options }));
}
function PhoneField(options = {}) {
    const decorators = [(0, validator_decorators_1.IsPhoneNumber)(), (0, transform_decorators_1.PhoneNumberSerializer)()];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: String, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function PhoneFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), PhoneField({ required: false, ...options }));
}
function UUIDField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => String), (0, class_validator_1.IsUUID)('4', { each: options.each })];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, property_decorators_1.ApiUUIDProperty)(options));
    }
    if (options.each) {
        decorators.push((0, transform_decorators_1.ToArray)());
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function UUIDFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), UUIDField({ required: false, ...options }));
}
function URLField(options = {}) {
    const decorators = [StringField(options), (0, class_validator_1.IsUrl)({}, { each: true })];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)({ each: options.each }));
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null, { each: options.each }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function URLFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), URLField({ required: false, ...options }));
}
function DateField(options = {}) {
    const decorators = [(0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
    if (options.nullable) {
        decorators.push((0, validator_decorators_1.IsNullable)());
    }
    else {
        decorators.push((0, class_validator_1.NotEquals)(null));
    }
    if (options.swagger !== false) {
        decorators.push((0, swagger_1.ApiProperty)({ type: Date, ...options }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function DateFieldOptional(options = {}) {
    return (0, common_1.applyDecorators)((0, validator_decorators_1.IsUndefinable)(), DateField({ ...options, required: false }));
}
//# sourceMappingURL=field.decorators.js.map