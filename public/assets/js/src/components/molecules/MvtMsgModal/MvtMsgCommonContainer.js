"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
// import styled from "styled-components";
const redux_form_1 = require("redux-form");
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const validators_1 = require("../../../lib/validators");
const mvtMsgValidator_1 = require("../../../lib/validators/mvtMsgValidator");
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const SuggestSelectInputBox_1 = require("../SuggestSelectInputBox");
const MultipleCreatableInput_1 = __importDefault(require("../../atoms/MultipleCreatableInput"));
// eslint-disable-next-line import/no-cycle
const MvtMsgModal_1 = require("../../organisms/MvtMsgModal");
const MvtMsgCommonContainer = (props) => {
    const { formName, formValues, change } = props;
    const cdCtrlDtls = (0, hooks_1.useAppSelector)((state) => state.account.master.cdCtrlDtls);
    const mvtMsgRmks = (0, hooks_1.useAppSelector)((state) => state.account.master.mvtMsgRmks);
    /** 入力項目の活性状態を制御する */
    const isMsgDisabled = (0, react_1.useMemo)(() => {
        const { mvtMsgRadioButton, depInfo: { cnlCheckBox: depCnlCheckbox }, arrInfo: { cnlCheckBox: arrCnlCheckbox }, gtbInfo: { cnlCheckBox: gtbCnlCheckbox }, } = formValues;
        return mvtMsgRadioButton === "" || depCnlCheckbox || arrCnlCheckbox || gtbCnlCheckbox;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues === null || formValues === void 0 ? void 0 : formValues.mvtMsgRadioButton, formValues === null || formValues === void 0 ? void 0 : formValues.depInfo.cnlCheckBox, formValues === null || formValues === void 0 ? void 0 : formValues.arrInfo.cnlCheckBox, formValues === null || formValues === void 0 ? void 0 : formValues.gtbInfo.cnlCheckBox]);
    const handleOnBlur = (e) => {
        if (e) {
            change(e.target.name, (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const handleOnBlurRemarks = (e) => {
        if (e) {
            change("msgInfo.remarks", (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const handleKeyDown = (e) => {
        if (e && e.key === "Enter") {
            const target = e.target;
            change(target.name, (0, commonUtil_1.toUpperCase)(target.value));
        }
    };
    const handleKeyPressRemarks = (e) => {
        if (e && e.key === "Enter") {
            const target = e.target;
            change("msgInfo.remarks", (0, commonUtil_1.toUpperCase)(target.value));
        }
    };
    const handleKeyPress = (values) => values.map((value) => (0, commonUtil_1.toUpperCase)(value));
    const filterTtyAddress = (value) => {
        const replaced = value.replace(/[^a-zA-Z0-9./()-]/g, "");
        return replaced.slice(0, 7);
    };
    const normalizeTime = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        return onlyNums;
    };
    const normalizeRemarks = (value) => {
        const onlyNums = value.replace(/[^a-zA-Z0-9\s./()-]/g, "");
        return onlyNums;
    };
    /**
     * remarks一覧を取得する
     */
    const getRemarks = (mvtMsgRmk) => {
        const sortedRmks = mvtMsgRmk.slice().sort((a, b) => a.dispSeq - b.dispSeq);
        const rmks = [];
        for (let i = 0; i < sortedRmks.length; i++) {
            rmks.push({ label: sortedRmks[i].mvtMsgRmks, value: sortedRmks[i].mvtMsgRmks });
        }
        return rmks;
    };
    return (react_1.default.createElement(MvtMsgModal_1.Content, { isMsg: true },
        react_1.default.createElement(MvtMsgModal_1.Row, { marginBottom: 4 },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 60 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: isMsgDisabled }, "Priority"),
                    react_1.default.createElement(redux_form_1.Field, { name: "msgInfo.priority", component: SelectBox_1.default, validate: [validators_1.required], options: (0, commonUtil_1.getPriorities)(cdCtrlDtls), width: 60, height: 40, hasBlank: true, fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace', fontWeight: "normal", fontSize: 18, disabled: isMsgDisabled })),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 85 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: isMsgDisabled }, "D.T.G.(Z)"),
                    react_1.default.createElement(redux_form_1.Field, { name: "msgInfo.dtg", component: TextInput_1.default, placeholder: "ddhhmm", width: 85, height: 40, maxLength: 6, type: "number", normalize: normalizeTime, validate: isMsgDisabled ? undefined : [validators_1.required, mvtMsgValidator_1.isDtg], fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace', fontWeight: "normal", fontSize: 18, disabled: isMsgDisabled, onChange: undefined })),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: isMsgDisabled }, "Originator"),
                    react_1.default.createElement(redux_form_1.Field, { name: "msgInfo.originator", component: TextInput_1.default, width: 96, height: 40, maxLength: 7, componentOnBlur: handleOnBlur, onKeyDown: handleKeyDown, validate: isMsgDisabled ? undefined : [mvtMsgValidator_1.isOkTtyAddress, validators_1.required], fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace', fontWeight: "normal", fontSize: 18, disabled: isMsgDisabled })),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 676 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: isMsgDisabled }, "Remarks"),
                    react_1.default.createElement(SuggestSelectInputBox_1.SuggestSelectInputBox, { fieldName: "msgInfo.remarks", fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace', fontSize: 18, fontWeight: "normal", formName: formName, height: 40, maxLength: 58, options: getRemarks(mvtMsgRmks), validate: isMsgDisabled ? undefined : [mvtMsgValidator_1.isOkTty], value: formValues.msgInfo.remarks, width: 676, disabled: isMsgDisabled, normalize: normalizeRemarks, componentOnBlur: handleOnBlurRemarks, onKeyPress: handleKeyPressRemarks })))),
        react_1.default.createElement(MvtMsgModal_1.Row, null,
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Col, null,
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: isMsgDisabled }, "TTY Address"),
                    react_1.default.createElement(redux_form_1.Field, { name: "msgInfo.ttyAddressList", component: MultipleCreatableInput_1.default, validate: isMsgDisabled ? undefined : [validators_1.isOkTtyAddresses], filterValue: filterTtyAddress, formatValues: handleKeyPress, maxHeight: 100, maxValLength: 80, fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace', fontWeight: "normal", fontSize: 17, disabled: isMsgDisabled }))))));
};
exports.default = MvtMsgCommonContainer;
//# sourceMappingURL=MvtMsgCommonContainer.js.map