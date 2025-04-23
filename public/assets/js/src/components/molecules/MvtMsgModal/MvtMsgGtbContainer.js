"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const redux_form_1 = require("redux-form");
const hooks_1 = require("../../../store/hooks");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const mvtMsgModal_1 = require("../../../reducers/mvtMsgModal");
const RadioButton_1 = __importDefault(require("../../atoms/RadioButton"));
// eslint-disable-next-line import/no-cycle
const MvtMsgModal_1 = require("../../organisms/MvtMsgModal");
const MvtMsgGtbContainer = (props) => {
    const { movementInfo, gtbDisabled, changeValue, onChangeRadioButton, checkHasDiffInMsgSetting, initializeMsgSetting } = props;
    const GTB = "GTB";
    const dispatch = (0, hooks_1.useAppDispatch)();
    /** ラジオボタンの活性状態を取得する */
    const radioButtonEnabled = () => isDepTaxiing() || isGtb();
    /** キャンセルチェックボックスの非活性状態を取得する */
    const cnlCheckBoxDisabled = () => {
        const { actLdUtc } = movementInfo;
        return GTB !== movementInfo.irrSts || !!actLdUtc || gtbDisabled;
    };
    /** 出発空港Taxiing中かどうかを判定する */
    const isDepTaxiing = () => {
        const { actLdUtc, actToUtc, atdUtc, irrSts } = movementInfo;
        return !actLdUtc && !actToUtc && !!atdUtc && !irrSts;
    };
    /** GTB中かどうかを判定する */
    const isGtb = () => {
        const { actLdUtc, irrSts } = movementInfo;
        return !actLdUtc && irrSts === "GTB";
    };
    /** キャンセルチェックボックス押下時の処理 */
    const onChangeCheckBox = (event) => {
        const { checked } = event.target;
        if (checked) {
            // 送信設定共通入力欄で変更があるか確認して分岐
            if (checkHasDiffInMsgSetting(GTB)) {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40012C({
                        onYesButton: () => {
                            initializeMsgSetting(GTB);
                        },
                        // キャンセルチェックボックスを元に戻す
                        onNoButton: () => changeValue("gtbInfo.cnlCheckBox")(false),
                    }),
                }));
            }
            else {
                initializeMsgSetting(GTB);
            }
        }
    };
    return (react_1.default.createElement(MvtMsgModal_1.IrregularContent, { width: 308, marginRight: true },
        react_1.default.createElement(MvtMsgModal_1.Row, { width: 178, marginBottom: 8 },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 24 }, GTB === movementInfo.irrSts && react_1.default.createElement(MvtMsgModal_1.MvtMsgFlgIconSvg, null)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 76 },
                    react_1.default.createElement(redux_form_1.Field, { name: "mvtMsgRadioButton", id: `${GTB}RadioButton`, tabIndex: 0, type: "radio", value: GTB, component: RadioButton_1.default, isShadowOnFocus: true, onChange: onChangeRadioButton, disabled: !radioButtonEnabled() }),
                    react_1.default.createElement(MvtMsgModal_1.ComponentLabel, { htmlFor: `${GTB}RadioButton`, disabled: !radioButtonEnabled() }, GTB)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 7 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 59 },
                    react_1.default.createElement(MvtMsgModal_1.CheckBoxLabel, { htmlFor: "gtbInfo.cnlCheckBox", disabled: gtbDisabled, checkBoxDisabled: cnlCheckBoxDisabled() },
                        "CNL",
                        react_1.default.createElement(redux_form_1.Field, { id: "gtbInfo.cnlCheckBox", name: "gtbInfo.cnlCheckBox", component: "input", tabIndex: 0, type: "checkbox", disabled: cnlCheckBoxDisabled(), onChange: onChangeCheckBox }))))),
        react_1.default.createElement(MvtMsgModal_1.Row, { width: 288, padding: "0px 20px 0px 36px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 100 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: gtbDisabled }, "From"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: gtbDisabled }, movementInfo.lstDepApoCd)),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 16 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 16 }),
                        react_1.default.createElement(MvtMsgModal_1.Flex, { width: 16, position: "center" },
                            react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: gtbDisabled }, "-"))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: gtbDisabled }, "To"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: gtbDisabled }, movementInfo.lstDepApoCd))),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 })))));
};
exports.default = MvtMsgGtbContainer;
//# sourceMappingURL=MvtMsgGtbContainer.js.map