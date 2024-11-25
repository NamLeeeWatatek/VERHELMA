"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DYNAMIC_TRANSLATION_DECORATOR_KEY = exports.STATIC_TRANSLATION_DECORATOR_KEY = void 0;
exports.StaticTranslate = StaticTranslate;
exports.DynamicTranslate = DynamicTranslate;
exports.STATIC_TRANSLATION_DECORATOR_KEY = 'custom:static-translate';
exports.DYNAMIC_TRANSLATION_DECORATOR_KEY = 'custom:dynamic-translate';
function StaticTranslate(data = {}) {
    return (target, key) => {
        Reflect.defineMetadata(exports.STATIC_TRANSLATION_DECORATOR_KEY, data, target, key);
    };
}
function DynamicTranslate() {
    return (target, key) => {
        Reflect.defineMetadata(exports.DYNAMIC_TRANSLATION_DECORATOR_KEY, {}, target, key);
    };
}
//# sourceMappingURL=translate.decorator.js.map