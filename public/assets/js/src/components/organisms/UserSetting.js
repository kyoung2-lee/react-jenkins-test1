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
exports.FORM_NAME = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const validates = __importStar(require("../../lib/validators"));
const myValidates = __importStar(require("../../lib/validators/userSettingValidator"));
const commonUtil_1 = require("../../lib/commonUtil");
const storage_1 = require("../../lib/storage");
const soalaMessages_1 = require("../../lib/soalaMessages");
const flightNumberInputPopupActions = __importStar(require("../../reducers/flightNumberInputPopup"));
// eslint-disable-next-line import/no-cycle
const userSettingActions = __importStar(require("../../reducers/userSetting"));
const SelectBox_1 = __importDefault(require("../atoms/SelectBox"));
const SuggestSelectBox_1 = __importDefault(require("../atoms/SuggestSelectBox"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const ToggleInput_1 = __importDefault(require("../atoms/ToggleInput"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const icon_close_svg_1 = __importDefault(require("../../assets/images/icon/icon-close.svg"));
const UserSetting = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const userSetting = (0, hooks_1.useAppSelector)((state) => state.userSetting);
    const { apoNtfFlg, fltNtfFlg, bbNtfFlg, typeValues, formValues, canNotifyBulletinBoard, canNotifyMySchedule } = props;
    (0, react_1.useEffect)(() => {
        void dispatch(userSettingActions.getUserSetting());
        void dispatch(userSettingActions.setCheckHasDifference(checkHasDifference));
        void dispatch(userSettingActions.checkUserSettingFuncAuth({ jobAuth: jobAuth.jobAuth }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (userSetting.isCleared) {
            void dispatch(userSettingActions.getUserSetting());
        }
    }, [dispatch, userSetting.isCleared]);
    const clearAirportField = (index) => {
        if (apoNtfFlg) {
            props.change(`apoNtfList[][${index}][apoCode]`, "");
            props.change(`apoNtfList[][${index}][eventCode]`, "");
        }
    };
    const clearFlightField = (index) => {
        if (fltNtfFlg) {
            props.change(`fltNtfList[][${index}][type]`, "");
            props.change(`fltNtfList[][${index}][trigger]`, "");
            props.change(`fltNtfList[][${index}][triggerDep]`, "");
            props.change(`fltNtfList[][${index}][triggerArr]`, "");
            props.change(`fltNtfList[][${index}][fltEventCode]`, "");
            props.change(`fltNtfList[][${index}][legEventCode]`, "");
        }
    };
    const handleFlightNumberInputPopup = (index) => {
        dispatch(flightNumberInputPopupActions.openFlightNumberInputPopup({
            formName: exports.FORM_NAME,
            fieldName: `fltNtfList[][${index}][trigger]`,
            currentFlightNumber: props.triggerValues[index],
            executeSubmit: false,
            onEnter: () => { },
            canOnlyAlCd: false,
        }));
    };
    const onChangebbNtfFlg = (checked) => {
        if (!checked) {
            props.change("cmtNtfFlg", false);
        }
    };
    const onChangeFltNtfListType = (index) => {
        props.change(`fltNtfList[][${index}][triggerDep]`, "");
        props.change(`fltNtfList[][${index}][triggerArr]`, "");
        props.change(`fltNtfList[][${index}][trigger]`, "");
        props.change(`fltNtfList[][${index}][legEventCode]`, "");
        props.change(`fltNtfList[][${index}][fltEventCode]`, "");
    };
    const confirmationSwich = (fieldName) => {
        const isApo = fieldName === "apoNtfFlg";
        const swichFlg = isApo ? apoNtfFlg : fltNtfFlg;
        const changeSwitch = () => {
            const { apoNtfList, fltNtfList } = userSetting;
            props.change(fieldName, !swichFlg);
            if (isApo) {
                if (apoNtfList && apoNtfList.length < 5) {
                    for (let i = 0; i < 5; i++) {
                        clearAirportField(i);
                    }
                }
                userSettingActions.setApoNtfFrom(apoNtfList, dispatch);
            }
            else {
                if (fltNtfList && fltNtfList.length < 5) {
                    for (let i = 0; i < 5; i++) {
                        clearFlightField(i);
                    }
                }
                userSettingActions.setFltNtfFrom(fltNtfList, dispatch);
            }
        };
        if (swichFlg) {
            // 差分確認
            const hasDifference = isApo ? checkHasDifferenceApoNtfList() : checkHasDifferenceFltNtfList();
            if (hasDifference) {
                void dispatch(userSettingActions.showMessage({
                    message: soalaMessages_1.SoalaMessage.M40006C({
                        onYesButton: changeSwitch,
                    }),
                }));
            }
            else {
                changeSwitch();
            }
        }
        else {
            changeSwitch();
        }
    };
    const checkHasDifference = () => {
        const wGrpNtfFlg = userSetting.grpNtfFlg === undefined ? true : userSetting.grpNtfFlg;
        const wFltNtfFlg = userSetting.fltNtfFlg === undefined ? true : userSetting.fltNtfFlg;
        const wApoNtfFlg = userSetting.apoNtfFlg === undefined ? true : userSetting.apoNtfFlg;
        const wBbNtfFlg = userSetting.bbNtfFlg === undefined ? true : userSetting.bbNtfFlg;
        const wCmtNtfFlg = userSetting.bbNtfFlg === undefined ? true : userSetting.cmtNtfFlg;
        const wMyskdlNtfFlg = userSetting.myskdlNtfFlg === undefined ? true : userSetting.myskdlNtfFlg;
        return (formValues.grpNtfFlg !== wGrpNtfFlg ||
            formValues.fltNtfFlg !== wFltNtfFlg ||
            formValues.apoNtfFlg !== wApoNtfFlg ||
            formValues.bbNtfFlg !== wBbNtfFlg ||
            formValues.cmtNtfFlg !== wCmtNtfFlg ||
            formValues.myskdlNtfFlg !== wMyskdlNtfFlg ||
            checkHasDifferenceApoNtfList() ||
            checkHasDifferenceFltNtfList());
    };
    const checkHasDifferenceApoNtfList = () => {
        const formApoNtfList = formValues.apoNtfList || [];
        const apoNtfList = userSetting.apoNtfList || [];
        let hasDifference = formApoNtfList.length !== apoNtfList.length;
        if (!hasDifference) {
            hasDifference = apoNtfList.some((apoNtf, index) => apoNtf.apoCode !== formApoNtfList[index].apoCode || apoNtf.eventCode !== formApoNtfList[index].eventCode);
        }
        return hasDifference;
    };
    const checkHasDifferenceFltNtfList = () => {
        const formFltNtfList = formValues.fltNtfList || [];
        const fltNtfList = userSetting.fltNtfList || [];
        let hasDifference = formFltNtfList.length !== fltNtfList.length;
        if (!hasDifference) {
            hasDifference = fltNtfList.some((fltNtf, index) => {
                if (fltNtf.type !== formFltNtfList[index].type)
                    return true;
                switch (fltNtf.type) {
                    case "LEG":
                        return (fltNtf.trigger !== `${formFltNtfList[index].triggerDep || ""}-${formFltNtfList[index].triggerArr || ""}` ||
                            fltNtf.eventCode !== formFltNtfList[index].legEventCode);
                    case "FLT":
                        return fltNtf.trigger !== formFltNtfList[index].trigger || fltNtf.eventCode !== formFltNtfList[index].fltEventCode;
                    default:
                        return fltNtf.trigger !== formFltNtfList[index].trigger || fltNtf.eventCode !== formFltNtfList[index].fltEventCode;
                }
            });
        }
        return hasDifference;
    };
    return (react_1.default.createElement(Wrapper, { isIphone: storage_1.storage.isIphone, hasApo: !!jobAuth.user.myApoCd },
        react_1.default.createElement(UserSettingInputForm, { isIphone: storage_1.storage.isIphone, onSubmit: props.handleSubmit },
            react_1.default.createElement(ScrollSection, { isIphone: storage_1.storage.isIphone, hasApo: !!jobAuth.user.myApoCd },
                react_1.default.createElement(ContentsArea, { isIphone: storage_1.storage.isIphone },
                    react_1.default.createElement(RadioWrapper, { isIphone: storage_1.storage.isIphone },
                        react_1.default.createElement("div", null, "Issue of My Airport Event"),
                        react_1.default.createElement(redux_form_1.Field, { name: "grpNtfFlg", disabled: true, component: ToggleInput_1.default })),
                    react_1.default.createElement(Description, null, "If an event occurs on your Airport, it will always be notified."),
                    storage_1.storage.isIpad && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Separater, { isIphone: storage_1.storage.isIphone }),
                        react_1.default.createElement(RadioWrapper, { isIphone: storage_1.storage.isIphone },
                            react_1.default.createElement("div", null, "Issue of Other Airport Event"),
                            react_1.default.createElement(redux_form_1.Field, { name: "apoNtfFlg", component: ToggleInput_1.default, confirmation: () => confirmationSwich("apoNtfFlg") })),
                        react_1.default.createElement(Description, null, "If an event occurs on your focused Airport, it will be notified. (Max 5)"),
                        react_1.default.createElement(SettingList, null, [0, 1, 2, 3, 4].map((index) => (react_1.default.createElement("div", { className: "row", key: `otherAirport-${index}` },
                            react_1.default.createElement("div", { className: "rowContent" },
                                react_1.default.createElement(redux_form_1.Field, { name: `apoNtfList[][${index}][apoCode]`, component: SuggestSelectBox_1.default, placeholder: "APO", maxLength: 3, options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 105, validate: [validates.halfWidthApoCd, myValidates.requiredSameRowApo, myValidates.duplicationValusSameRowApo], disabled: !apoNtfFlg }),
                                react_1.default.createElement(redux_form_1.Field, { name: `apoNtfList[][${index}][eventCode]`, component: SelectBox_1.default, options: master.ntfInfo.airportNtfList, placeholder: "Event", width: storage_1.storage.isIphone ? 216 : 235, validate: [myValidates.requiredSameRowApo, myValidates.duplicationValusSameRowApo], disabled: !apoNtfFlg, hasBlank: true })),
                            react_1.default.createElement(ClearRowButton, { className: "button", onClick: () => clearAirportField(index), disabled: !apoNtfFlg },
                                react_1.default.createElement(IconClose, null)))))))),
                    react_1.default.createElement(Separater, { isIphone: storage_1.storage.isIphone }),
                    react_1.default.createElement(RadioWrapper, { isIphone: storage_1.storage.isIphone },
                        react_1.default.createElement("div", null, "Issue of Flight Event"),
                        react_1.default.createElement(redux_form_1.Field, { name: "fltNtfFlg", component: ToggleInput_1.default, confirmation: () => confirmationSwich("fltNtfFlg") })),
                    react_1.default.createElement(Description, null, "If an event occurs on your focused Flight or LEG, it will be notified. (Max 5)"),
                    react_1.default.createElement(SettingList, null, [0, 1, 2, 3, 4].map((index) => (react_1.default.createElement("div", { className: "row", key: `flightNotify-${index}` },
                        react_1.default.createElement("div", { className: "rowContent" },
                            react_1.default.createElement(redux_form_1.Field, { name: `fltNtfList[][${index}][type]`, component: SelectBox_1.default, options: [
                                    { label: "FLT", value: "FLT" },
                                    { label: "LEG", value: "LEG" },
                                    { label: "Casual", value: "CAS" },
                                ], width: 60, menuWidth: 72, placeholder: "Type", validate: [myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt], disabled: !fltNtfFlg, onChange: () => onChangeFltNtfListType(index), hasBlank: true }),
                            props.typeValues[index] === "LEG" ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(redux_form_1.Field, { name: `fltNtfList[][${index}][triggerDep]`, component: SuggestSelectBox_1.default, placeholder: "DEP", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.halfWidthApoCd, myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt], disabled: !fltNtfFlg || !typeValues[index] }),
                                react_1.default.createElement(redux_form_1.Field, { name: `fltNtfList[][${index}][triggerArr]`, component: SuggestSelectBox_1.default, placeholder: "ARR", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.halfWidthApoCd, myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt], disabled: !fltNtfFlg || !typeValues[index] }))) : (react_1.default.createElement(redux_form_1.Field, { name: `fltNtfList[][${index}][trigger]`, component: TextInput_1.default, showKeyboard: typeValues[index] === "FLT" ? () => handleFlightNumberInputPopup(index) : undefined, width: 160, placeholder: typeValues[index] === "FLT" || typeValues[index] === "CAS" ? "FLT" : "Trigger", validate: typeValues[index] === "FLT"
                                    ? [myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt]
                                    : [myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt, validates.isOkCasualFlt], disabled: !fltNtfFlg || !typeValues[index], maxLength: typeValues[index] === "FLT" ? 6 : 10, componentOnBlur: typeValues[index] === "FLT"
                                    ? undefined
                                    : (e) => {
                                        if (e) {
                                            props.change(`fltNtfList[][${index}][trigger]`, (0, commonUtil_1.toUpperCase)(e.target.value));
                                        }
                                    }, onKeyPress: typeValues[index] === "FLT"
                                    ? undefined
                                    : (e) => {
                                        if (e.key === "Enter") {
                                            props.change(`fltNtfList[][${index}][trigger]`, (0, commonUtil_1.toUpperCase)(e.target.value));
                                        }
                                    } })),
                            react_1.default.createElement(redux_form_1.Field, { name: typeValues[index] === "LEG" ? `fltNtfList[][${index}][legEventCode]` : `fltNtfList[][${index}][fltEventCode]`, component: SelectBox_1.default, options: typeValues[index] === "LEG" ? [...master.ntfInfo.legNtfList] : [...master.ntfInfo.flightNoNtfList], width: storage_1.storage.isIphone ? 95 : 114, menuWidth: 200, menuLeft: storage_1.storage.isIphone ? 95 - 200 : 114 - 200, placeholder: "Event", validate: [myValidates.requiredSameRowFlt, myValidates.duplicationValusSameRowFlt], disabled: !fltNtfFlg || !typeValues[index], hasBlank: true })),
                        react_1.default.createElement(ClearRowButton, { className: "button", onClick: () => clearFlightField(index), disabled: !fltNtfFlg },
                            react_1.default.createElement(IconClose, null)))))),
                    canNotifyBulletinBoard ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Separater, { isIphone: storage_1.storage.isIphone }),
                        react_1.default.createElement(RadioWrapper, { isIphone: storage_1.storage.isIphone },
                            react_1.default.createElement("div", null, "Issue of Bulletin Board(update)"),
                            react_1.default.createElement(redux_form_1.Field, { name: "bbNtfFlg", component: ToggleInput_1.default, onChange: (_event, checked) => onChangebbNtfFlg(!!checked) })),
                        react_1.default.createElement(Description, null, "If there are any updates on the Bulletin Board, it will be notified."),
                        react_1.default.createElement(CheckBoxContainer, null,
                            react_1.default.createElement(CheckBoxLabel, { htmlFor: "cmtNtfFlg" },
                                react_1.default.createElement(redux_form_1.Field, { name: "cmtNtfFlg", id: "cmtNtfFlg", disabled: !bbNtfFlg, component: "input", tabIndex: 22, type: "checkbox" }),
                                "Comments")),
                        react_1.default.createElement(Description, null, "Please check mark if you want to be notified."))) : null,
                    canNotifyMySchedule && storage_1.storage.isIpad && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Separater, { isIphone: storage_1.storage.isIphone }),
                        react_1.default.createElement(RadioWrapper, { isIphone: storage_1.storage.isIphone },
                            react_1.default.createElement("div", null, "Issue of My Schedule(update)"),
                            react_1.default.createElement(redux_form_1.Field, { name: "myskdlNtfFlg", component: ToggleInput_1.default })),
                        react_1.default.createElement(Description, null, "If your Job Pattern has be changed by Lily, it will always be notified."))))),
            react_1.default.createElement(SubmitContainer, { isIphone: storage_1.storage.isIphone },
                react_1.default.createElement(PrimaryButton_1.default, { text: "Update", type: "submit" })))));
};
const updateAreaHeight = { iPhone: "74px", iPad: "94px" };
const Wrapper = styled_components_1.default.div `
  overflow: scroll;
  height: calc(
    100vh
      ${({ isIphone, theme: { layout: { header, footer }, }, hasApo, }) => isIphone ? (hasApo ? `- ${header.mobile} - ${footer.mobile}` : `- ${header.statusBar} - ${footer.mobile}`) : `- ${header.tablet}`}
  );
`;
const UserSettingInputForm = styled_components_1.default.form `
  height: 100%;
  width: ${({ isIphone }) => (isIphone ? "100%" : "464px")};
  padding-bottom: 20px;
  margin: 0 auto;
  background: #fff;
`;
const SubmitContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  height: ${({ isIphone }) => (isIphone ? updateAreaHeight.iPhone : updateAreaHeight.iPad)};
  width: 100%;
  background: #fff;
  button {
    width: 200px;
    margin: auto;
  }
`;
const ScrollSection = styled_components_1.default.div `
  overflow-y: auto;
  overflow-x: hidden;
  width: "100%";
  height: calc(
    100vh -
      ${({ isIphone, theme: { layout: { header, footer }, }, hasApo, }) => isIphone
    ? hasApo
        ? `${header.mobile} - ${footer.mobile} - ${updateAreaHeight.iPhone}`
        : `${header.statusBar} - ${footer.mobile} - ${updateAreaHeight.iPhone}`
    : `${header.tablet} - ${updateAreaHeight.iPad}`}
  );
  -webkit-overflow-scrolling: touch;
`;
const ContentsArea = styled_components_1.default.div `
  width: inherit;
  height: inherit;
  margin: 0 ${({ isIphone }) => (isIphone ? "0" : "34px")};
`;
const Separater = styled_components_1.default.div `
  width: auto;
  height: 0;
  margin-top: 20px;
  margin-bottom: 0;
  margin-right: ${({ isIphone }) => (isIphone ? "10px" : "0")};
  margin-left: ${({ isIphone }) => (isIphone ? "10px" : "0")};
  border-bottom: 1px solid #c9d3d0;
`;
const RadioWrapper = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  margin: 20px 20px 0 10px;
  > div {
    font-size: 20px;
    line-height: 27px;
  }
`;
const Description = styled_components_1.default.div `
  margin: 8px 20px 0 40px;
`;
const SettingList = styled_components_1.default.div `
  width: 100%;
  margin: 8px 0 0 0;
  padding: 12px 5px 12px 8px;
  background: #f6f6f6;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    :last-child {
      margin-bottom: 0;
    }
    .rowContent {
      display: flex;
      justify-content: right;
      > div {
        margin-right: 6px;
        :last-child {
          margin-right: 0;
        }
      }
    }
    .button {
    }
  }
`;
const ClearRowButton = styled_components_1.default.div `
  width: 32px;
  height: 32px;
  padding: 5px;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
`;
const IconClose = styled_components_1.default.img.attrs({ src: icon_close_svg_1.default }) `
  width: 100%;
`;
const CheckBoxContainer = styled_components_1.default.div `
  margin: 28px 20px 0 40px;
  align-self: flex-end;
`;
const CheckBoxLabel = styled_components_1.default.label `
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 44px;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  input[type="checkbox"] {
    margin-right: 6px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    background: #fff;
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
    }
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
      }
    }
  }
`;
exports.FORM_NAME = "userSetting";
const submit = (formParams, dispatch, _props) => {
    void dispatch(userSettingActions.updateUserSetting(formParams));
};
const UserSettingForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit: submit,
    enableReinitialize: true,
})(UserSetting);
const selector = (0, redux_form_1.formValueSelector)(exports.FORM_NAME);
exports.default = (0, react_redux_1.connect)((state) => {
    const apoNtfFlg = selector(state, "apoNtfFlg");
    const fltNtfFlg = selector(state, "fltNtfFlg");
    const bbNtfFlg = selector(state, "bbNtfFlg");
    const cmtNtfFlg = selector(state, "cmtNtfFlg");
    const myskdlNtfFlg = selector(state, "myskdlNtfFlg");
    const typeValues = [0, 1, 2, 3, 4].map((index) => selector(state, `fltNtfList[][${index}][type]`));
    const triggerValues = [0, 1, 2, 3, 4].map((_, index) => selector(state, `fltNtfList[][${index}][trigger]`));
    return {
        apoNtfFlg,
        fltNtfFlg,
        bbNtfFlg,
        cmtNtfFlg,
        myskdlNtfFlg,
        typeValues,
        triggerValues,
        canNotifyBulletinBoard: state.userSetting.canNotifyBulletinBoard,
        canNotifyMySchedule: state.userSetting.canNotifyMySchedule,
        initialValues: { grpNtfFlg: true, apoNtfFlg: true, fltNtfFlg: true, bbNtfFlg: false, cmtNtfFlg: false, myskdlNtfFlg: false },
        formValues: (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state),
    };
})(UserSettingForm);
//# sourceMappingURL=UserSetting.js.map