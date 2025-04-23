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
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importStar(require("styled-components"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const hooks_1 = require("../../store/hooks");
const storage_1 = require("../../lib/storage");
const spotNumberRestrictionPopup_1 = require("../../reducers/spotNumberRestrictionPopup");
const initialState = {
    isActive: false,
};
const SpotNumberRestrictionPopup = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const spotNumberRestrictionPopup = (0, hooks_1.useAppSelector)((state) => state.spotNumberRestrictionPopup);
    const { isOpen, legInfo, onYesButton, onNoButton } = spotNumberRestrictionPopup;
    const [isActive, setIsActive] = (0, react_1.useState)(initialState.isActive);
    const onYes = () => {
        dispatch((0, spotNumberRestrictionPopup_1.closeSpotNumberRestrictionPopup)());
        onYesButton();
    };
    const onNo = () => {
        dispatch((0, spotNumberRestrictionPopup_1.closeSpotNumberRestrictionPopup)());
        onNoButton();
    };
    const onAfterOpen = () => {
        // オープンのアニメーションを開始させる
        setIsActive(true);
    };
    const onAfterClose = () => {
        // クローズのアニメーション完了後にStateを初期化する
        dispatch((0, spotNumberRestrictionPopup_1.closeSpotNumberRestrictionPopupSuccess)());
    };
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            // ポップアップクローズ時にクローズのアニメーションを開始させる
            setIsActive(false);
        }
    }, [isOpen]);
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, shouldCloseOnEsc: false, shouldCloseOnOverlayClick: false, style: customStyles(isActive), closeTimeoutMS: 500, onAfterOpen: onAfterOpen, onAfterClose: onAfterClose },
        react_1.default.createElement(CustomContainer, null,
            react_1.default.createElement(CustomHeader, null,
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faWarning, style: {
                        display: "inline-block",
                        width: "24px",
                        marginRight: "4px",
                        color: "rgb(245, 170, 10)",
                        fontSize: "20px",
                        verticalAlign: "bottom",
                    } }),
                "Warning"),
            react_1.default.createElement(CustomMessage, null, "The following flights violate the restrictions. Do you want to continue updating?"),
            react_1.default.createElement(CustomLegInfoList, null, legInfo.map(({ arr, dep }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            react_1.default.createElement(react_1.default.Fragment, { key: index },
                arr ? (react_1.default.createElement(CustomLegInfo, null,
                    arr.alCd,
                    arr.fltNo,
                    "/",
                    (0, dayjs_1.default)(arr.orgDateLcl).format("DD"),
                    "\u00A0",
                    arr.lstDepApoCd,
                    "-",
                    arr.lstArrApoCd,
                    react_1.default.createElement("br", null),
                    arr.status === "2" ? (react_1.default.createElement(react_1.default.Fragment, null,
                        "\u00A0*** Check skipped ***\u00A0\u00A0\u00A0Flight not found",
                        react_1.default.createElement("br", null))) : (""),
                    arr.status === "0" ? (react_1.default.createElement(react_1.default.Fragment, null,
                        arr.spotRstShipTypeInfo != null ? (react_1.default.createElement(react_1.default.Fragment, null,
                            "\u00A0- SPOT PARKING[EQP]",
                            react_1.default.createElement("br", null))) : (""),
                        arr.spotRstTimeInfo != null && arr.spotRstTimeInfo.length > 0
                            ? arr.spotRstTimeInfo.map(({ rstRsnDispInfo }) => (react_1.default.createElement(react_1.default.Fragment, { key: rstRsnDispInfo },
                                "\u00A0- SPOT PARKING[TIME] : ",
                                rstRsnDispInfo,
                                react_1.default.createElement("br", null))))
                            : "",
                        arr.spotCombRstShipTypeInfo != null && arr.spotCombRstShipTypeInfo.length > 0
                            ? arr.spotCombRstShipTypeInfo.map(({ rstSpotNo, rstShipTypeDiaCd }) => (react_1.default.createElement(react_1.default.Fragment, { key: rstSpotNo },
                                "\u00A0- SPOT COMBINATION : SPOT/",
                                rstSpotNo,
                                "\u00A0\u00A0\u00A0EQP/",
                                rstShipTypeDiaCd,
                                react_1.default.createElement("br", null))))
                            : "")) : (""))) : (""),
                dep ? (react_1.default.createElement(CustomLegInfo, null,
                    dep.alCd,
                    dep.fltNo,
                    "/",
                    (0, dayjs_1.default)(dep.orgDateLcl).format("DD"),
                    "\u00A0",
                    dep.lstDepApoCd,
                    "-",
                    dep.lstArrApoCd,
                    react_1.default.createElement("br", null),
                    dep.status === "2" ? (react_1.default.createElement(react_1.default.Fragment, null,
                        "\u00A0*** Check skipped ***\u00A0\u00A0\u00A0Flight not found",
                        react_1.default.createElement("br", null))) : (""),
                    dep.status === "0" ? (react_1.default.createElement(react_1.default.Fragment, null,
                        dep.spotRstShipTypeInfo != null ? (react_1.default.createElement(react_1.default.Fragment, null,
                            "\u00A0- SPOT PARKING[EQP]",
                            react_1.default.createElement("br", null))) : (""),
                        dep.spotRstTimeInfo != null && dep.spotRstTimeInfo.length > 0
                            ? dep.spotRstTimeInfo.map(({ rstRsnDispInfo }) => (react_1.default.createElement(react_1.default.Fragment, { key: rstRsnDispInfo },
                                "\u00A0- SPOT PARKING[TIME] : ",
                                rstRsnDispInfo,
                                react_1.default.createElement("br", null))))
                            : "",
                        dep.spotCombRstShipTypeInfo != null && dep.spotCombRstShipTypeInfo.length > 0
                            ? dep.spotCombRstShipTypeInfo.map(({ rstSpotNo, rstShipTypeDiaCd }) => (react_1.default.createElement(react_1.default.Fragment, { key: rstSpotNo },
                                "\u00A0- SPOT COMBINATION : SPOT/",
                                rstSpotNo,
                                "\u00A0\u00A0\u00A0EQP/",
                                rstShipTypeDiaCd,
                                react_1.default.createElement("br", null))))
                            : "")) : (""))) : ("")))))),
        react_1.default.createElement(ButtonContainer, null,
            react_1.default.createElement(CustomButton, { isPc: storage_1.storage.isPc, isLeft: true, onClick: onYes }, "YES"),
            react_1.default.createElement(CustomButton, { isPc: storage_1.storage.isPc, isLeft: false, onClick: onNo }, "NO"))));
};
react_modal_1.default.setAppElement("#content");
const customStyles = (isActive) => ({
    overlay: {
        zIndex: 999999990 /* reapop(999999999)の下 */,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        paddingBottom: "40px",
    },
    content: {
        position: "static",
        width: "500px",
        maxHeight: "500px",
        borderRadius: "8px",
        borderTop: "2px solid rgb(245, 170, 10)",
        padding: 0,
        overflowY: "hidden",
        transition: "opacity 500ms, transform 500ms",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0%)" : "translateY(70%)",
    },
});
const CustomContainer = styled_components_1.default.div `
  display: block;
  margin: 0px;
  padding: 0px 28px;
  max-height: 455px;
  overflow-y: auto;
  font-size: 16px;
  line-height: 18px;
`;
const CustomHeader = styled_components_1.default.div `
  display: block;
  margin: 21px 0px 0px 0px;
  text-align: center;
`;
const CustomMessage = styled_components_1.default.div `
  display: block;
  margin: 7px 0px 0px 0px;
`;
const CustomLegInfoList = styled_components_1.default.div `
  display: block;
  margin: 0px 0px 23px 0px;
`;
const CustomLegInfo = styled_components_1.default.div `
  display: block;
  margin: 10px 0px 0px 0px;
`;
const ButtonContainer = styled_components_1.default.div `
  display: flex;
  margin: 0px;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
`;
const CustomButton = styled_components_1.default.button `
  box-sizing: border-box;
  width: 50%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 9%);
  border-left: ${({ isLeft }) => (isLeft ? "0" : "1px solid rgba(0, 0, 0, 9%)")};
  border-right: 0;
  border-bottom: 0;
  background: transparent;
  font-size: 16px;
  ${({ isPc }) => (0, styled_components_1.css) `
      cursor: pointer;
      ${isPc
    ? (0, styled_components_1.css) `
            &:hover {
              color: rgb(52, 158, 243);
            }
            &:active {
              color: rgb(34, 142, 229);
            }
          `
    : (0, styled_components_1.css) `
            &:active {
              color: rgb(52, 158, 243);
            }
          `}
    `};
`;
exports.default = SpotNumberRestrictionPopup;
//# sourceMappingURL=SpotNumberRestrictionPopup.js.map