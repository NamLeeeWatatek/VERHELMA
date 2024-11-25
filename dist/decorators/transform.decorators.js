"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = Trim;
exports.ToBoolean = ToBoolean;
exports.ToInt = ToInt;
exports.ToArray = ToArray;
exports.ToLowerCase = ToLowerCase;
exports.ToUpperCase = ToUpperCase;
exports.S3UrlParser = S3UrlParser;
exports.PhoneNumberSerializer = PhoneNumberSerializer;
const class_transformer_1 = require("class-transformer");
const libphonenumber_js_1 = require("libphonenumber-js");
const lodash_1 = require("lodash");
const providers_1 = require("../providers");
function Trim() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if ((0, lodash_1.isArray)(value)) {
            return (0, lodash_1.map)(value, (v) => (0, lodash_1.trim)(v).replaceAll(/\s\s+/g, ' '));
        }
        if (typeof value === 'string') {
            return (0, lodash_1.trim)(value).replaceAll(/\s\s+/g, ' ');
        }
        return value;
    });
}
function ToBoolean() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return value;
    }, { toClassOnly: true });
}
function ToInt() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (typeof value === 'string') {
            return Number.parseInt(value, 10);
        }
        return value;
    }, { toClassOnly: true });
}
function ToArray() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (!value) {
            return value;
        }
        return (0, lodash_1.castArray)(value);
    }, { toClassOnly: true });
}
function ToLowerCase() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (!value) {
            return;
        }
        if (typeof value === 'string') {
            return value.toLowerCase();
        }
        return value.map((v) => v.toLowerCase());
    }, {
        toClassOnly: true,
    });
}
function ToUpperCase() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (!value) {
            return;
        }
        if (typeof value === 'string') {
            return value.toUpperCase();
        }
        return value.map((v) => v.toUpperCase());
    }, {
        toClassOnly: true,
    });
}
function S3UrlParser() {
    return (0, class_transformer_1.Transform)((params) => {
        const key = params.value;
        if (!key) {
            return key;
        }
        switch (params.type) {
            case class_transformer_1.TransformationType.CLASS_TO_PLAIN: {
                return providers_1.GeneratorProvider.getS3PublicUrl(key);
            }
            case class_transformer_1.TransformationType.PLAIN_TO_CLASS: {
                return providers_1.GeneratorProvider.getS3Key(key);
            }
            default: {
                return key;
            }
        }
    });
}
function PhoneNumberSerializer() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if (!value) {
            return value;
        }
        return (0, libphonenumber_js_1.parsePhoneNumber)(value).number;
    });
}
//# sourceMappingURL=transform.decorators.js.map