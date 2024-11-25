"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextProvider = void 0;
const nestjs_cls_1 = require("nestjs-cls");
class ContextProvider {
    static nameSpace = 'request';
    static authUserKey = 'user_key';
    static languageKey = 'language_key';
    static get(key) {
        const store = nestjs_cls_1.ClsServiceManager.getClsService();
        return store.get(ContextProvider.getKeyWithNamespace(key));
    }
    static set(key, value) {
        const store = nestjs_cls_1.ClsServiceManager.getClsService();
        store.set(ContextProvider.getKeyWithNamespace(key), value);
    }
    static getKeyWithNamespace(key) {
        return `${ContextProvider.nameSpace}.${key}`;
    }
    static setAuthUser(user) {
        ContextProvider.set(ContextProvider.authUserKey, user);
    }
    static setLanguage(language) {
        ContextProvider.set(ContextProvider.languageKey, language);
    }
    static getLanguage() {
        return ContextProvider.get(ContextProvider.languageKey);
    }
    static getAuthUser() {
        return ContextProvider.get(ContextProvider.authUserKey);
    }
}
exports.ContextProvider = ContextProvider;
//# sourceMappingURL=context.provider.js.map