"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParamMapper = void 0;
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("../../components/organisms/Broadcast/Broadcast");
const commonUtil_1 = require("../commonUtil");
const commonConst_1 = require("../commonConst");
const validators_1 = require("../validators");
var SearchParamMapper;
(function (SearchParamMapper) {
    /**
     * 情報発信用
     */
    SearchParamMapper.getBroadcastMapper = () => {
        const getSendByObject = (value) => {
            if (!value)
                return null;
            const upperValue = (0, commonUtil_1.toUpperCase)(value);
            const sendBy = Broadcast_1.TEMPLATE_FILTER_SEND_BY.find((s) => (0, commonUtil_1.toUpperCase)(s.label) === upperValue || (0, commonUtil_1.toUpperCase)(s.value) === upperValue);
            return sendBy;
        };
        return {
            keyword: {
                default: true,
                searchKey: "key",
                defalutValue: "",
                validate: [validators_1.lengthKeyWord100],
            },
            sendBy: {
                default: false,
                searchKey: "by",
                defalutValue: "",
                storeToStringValue: (value) => {
                    const sendBy = getSendByObject(value);
                    return sendBy ? sendBy.label : "";
                },
                restoreToFormValue: (value) => {
                    const sendBy = getSendByObject(value);
                    return sendBy ? sendBy.value : "";
                },
                formatToRequestValue: (value) => {
                    const sendBy = getSendByObject(value);
                    return sendBy ? sendBy.value : "";
                },
            },
        };
    };
    /**
     * 掲示板用
     */
    SearchParamMapper.getBulletinBoardMapper = (cdCtrlDtls) => {
        const categories = cdCtrlDtls
            .filter((code) => code.cdCls === commonConst_1.Const.CodeClass.BULLETIN_BOARD_CATEGORY)
            .map((cat) => ({
            label: cat.txt1,
            value: cat.cdCat1,
        }));
        return {
            keyword: {
                default: true,
                searchKey: "key",
                defalutValue: "",
                validate: [validators_1.lengthKeyWord30],
            },
            from: {
                default: false,
                searchKey: "from",
                defalutValue: "",
                validate: [validators_1.lengthJobCd],
                storeToStringValue: (v) => (v && (0, validators_1.isOnlyHalfWidthSymbol)(v) ? v.toUpperCase() : ""),
                restoreToFormValue: (v) => (v && (0, validators_1.isOnlyHalfWidthSymbol)(v) ? v.toUpperCase() : ""),
                formatToRequestValue: (v) => (v && (0, validators_1.isOnlyHalfWidthSymbol)(v) ? v.toUpperCase() : ""),
            },
            to: {
                default: false,
                searchKey: "to",
                defalutValue: "",
                validate: [validators_1.lengthJobCd],
                storeToStringValue: (v) => (v && (0, validators_1.isOnlyHalfWidthSymbol)(v) ? v.toUpperCase() : ""),
                restoreToFormValue: (v) => (v && (0, validators_1.isOnlyHalfWidthSymbol)(v) ? v.toUpperCase() : ""),
                formatToRequestValue: (v) => (v && (0, validators_1.isOnlyHalfWidthSymbol)(v) ? v.toUpperCase() : ""),
            },
            catCdList: {
                default: false,
                searchKey: "cat",
                defalutValue: [],
                storeToStringValue: (a) => a
                    ? a
                        .map((v) => {
                        const category = categories.find((cat) => cat.value === v.value);
                        return category ? category.label.split(" ").join("") : null;
                    })
                        .filter((v) => v)
                        .join(",")
                    : "",
                restoreToFormValue: (value) => value
                    ? value
                        .split(",")
                        .map((mapValue) => {
                        if (!mapValue)
                            return null;
                        const category = categories.find((cat) => cat.label.split(" ").join("").toUpperCase() === mapValue.toUpperCase());
                        return category ? { value: category.value } : null;
                    })
                        .filter((v) => v)
                    : [],
                formatToRequestValue: (a) => (a ? a.map((v) => v.value) : null),
            },
            archiveDateLcl: {
                default: false,
                searchKey: "date",
                defalutValue: "",
                validate: [validators_1.isDateOrYYYYMMDD],
                storeToStringValue: (value) => (0, validators_1.getFormatFromDateInput)(value, "YYYY/MM/DD"),
                restoreToFormValue: (value) => (0, validators_1.getFormatFromDateInput)(value, "YYYY/MM/DD"),
                formatToRequestValue: (value) => (0, validators_1.getFormatFromDateInput)(value, "YYYY-MM-DD"),
            },
        };
    };
})(SearchParamMapper = exports.SearchParamMapper || (exports.SearchParamMapper = {}));
//# sourceMappingURL=SearchParamMapper.js.map