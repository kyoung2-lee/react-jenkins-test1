"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParamConverter = void 0;
const commonUtil_1 = require("../commonUtil");
class SearchParamConverter {
    constructor({ mapper }) {
        this.currentStringParam = "";
        this.currentFormParam = {};
        this.errorMessages = [];
        this.mapper = mapper;
    }
    getAllDefalutParam() {
        return (0, commonUtil_1.keys)(this.mapper).reduce((p, c) => ({ ...p, [c]: this.mapper[c].defalutValue }), {});
    }
    getStringParam() {
        // console.log("getStringParam:",JSON.stringify(this.currentStringParam));
        return this.currentStringParam;
    }
    getFormParam(allItems) {
        const defalutParam = allItems ? this.getAllDefalutParam() : {};
        const formParam = { ...defalutParam, ...this.currentFormParam };
        // console.log("getFormParam:",JSON.stringify(formParam));
        return formParam;
    }
    getRequestParam(allItems) {
        const defalutParam = allItems ? this.getAllDefalutParam() : {};
        const requestParam = (0, commonUtil_1.keys)(this.currentFormParam).reduce((p, c) => {
            const mapperField = this.mapper[c];
            if (this.currentFormParam[c]) {
                return {
                    ...p,
                    [c]: mapperField.formatToRequestValue ? mapperField.formatToRequestValue(this.currentFormParam[c]) : this.currentFormParam[c],
                };
            }
            return p;
        }, defalutParam);
        // console.log("getRequestParam:",JSON.stringify(requestParam));
        return requestParam;
    }
    applyStringParam(stringParam) {
        const currentFormParam = this.convertStringToFormParam(stringParam);
        if (!this.errorMessages.length) {
            this.currentFormParam = currentFormParam;
            this.currentStringParam = this.convertFormParamToString(this.currentFormParam);
        }
        else {
            this.currentStringParam = stringParam;
        }
        return this.errorMessages;
    }
    applyFormParam(formParam) {
        this.currentStringParam = this.convertFormParamToString(formParam);
        this.currentFormParam = this.convertStringToFormParam(this.currentStringParam);
    }
    convertStringToFormParam(stringParam) {
        this.errorMessages = [];
        // 複数キーワードまたは単一キーワードでマッチング regex = (key:)"value"|(key:)value)
        const regex = /(?:(?:(?:(?<searchKey1>\w+):)?(?<value1>"(?:\\.|[^"\\])*")(?:\s|$))|(?:(?:(?<searchKey2>\w+):)?(?<value2>\S+)))/g;
        const matches = [];
        for (;;) {
            const match = regex.exec(stringParam);
            if (match === null) {
                break;
            }
            matches.push(match);
        }
        // console.log("matches:",JSON.stringify(matches));
        if (matches.length) {
            const params = (0, commonUtil_1.keys)(this.mapper)
                .map((key) => {
                const mapperField = this.mapper[key];
                let keyMaching = null;
                let lastValue = null;
                if (mapperField.default) {
                    keyMaching = matches.filter((m) => {
                        if (m.length && m.groups) {
                            const { groups } = m;
                            // keyに一致するか、keyがなく、valueの最後が「:」以外の時
                            return (groups.searchKey1 === mapperField.searchKey ||
                                groups.searchKey2 === mapperField.searchKey ||
                                (!groups.searchKey1 && groups.value1 && !groups.value1.match(/:$/)) ||
                                (!groups.searchKey2 && groups.value2 && !groups.value2.match(/:$/)));
                        }
                        return false;
                    });
                    // console.log("keyMaching1:",JSON.stringify(keyMaching));
                    if (keyMaching.length) {
                        const lastMatche = keyMaching.slice(-1)[0].groups;
                        if (lastMatche) {
                            lastValue = lastMatche.value1 || lastMatche.value2;
                            if (lastValue) {
                                lastValue = lastValue.replace(/\s+/g, " ").replace(/(?:")(.*)(?:")/, "$1"); // 連続したスペース、両端のダブルクォーテーションを取り除く
                            }
                        }
                    }
                }
                else {
                    keyMaching = matches.filter((m) => {
                        if (m.length && m.groups) {
                            const { groups } = m;
                            return groups.searchKey1 === mapperField.searchKey || groups.searchKey2 === mapperField.searchKey;
                        }
                        return false;
                    });
                    // console.log("keyMaching2:",JSON.stringify(keyMaching));
                    if (keyMaching.length) {
                        const lastMatche = keyMaching.slice(-1)[0].groups;
                        if (lastMatche) {
                            lastValue = lastMatche.value1 || lastMatche.value2;
                        }
                    }
                }
                if (lastValue) {
                    // バリデーションを行いNGの場合は、SOALAメッセージを返す
                    if (mapperField.validate) {
                        for (let i = 0; i < mapperField.validate.length; i++) {
                            const messageFunction = mapperField.validate[i](lastValue);
                            if (messageFunction) {
                                this.errorMessages.push(messageFunction());
                            }
                        }
                    }
                    return { [key]: mapperField.restoreToFormValue ? mapperField.restoreToFormValue(lastValue) : lastValue };
                }
                return undefined;
            })
                .filter((v) => v)
                .reduce((p, c) => ({ ...p, ...c }), {}) || {};
            return params;
        }
        return {};
    }
    convertFormParamToString(formParam) {
        const stringParam = (0, commonUtil_1.keys)(this.mapper)
            .map((key) => {
            const mapperField = this.mapper[key];
            let value = mapperField.storeToStringValue ? mapperField.storeToStringValue(formParam[key]) : formParam[key];
            if (value === undefined || value === null || value === "") {
                return undefined;
            }
            if (mapperField.default && value.match(/\s/)) {
                value = value.replace(/\s+/g, " "); // 連続したスペースを取り除く
                return `${mapperField.searchKey}:"${value}"`;
            }
            return `${mapperField.searchKey}:${value}`;
        })
            .filter((v) => v)
            .join(" ");
        return stringParam;
    }
}
exports.SearchParamConverter = SearchParamConverter;
//# sourceMappingURL=SearchParamConverter.js.map