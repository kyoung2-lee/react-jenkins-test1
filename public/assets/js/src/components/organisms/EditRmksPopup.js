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
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const storage_1 = require("../../lib/storage");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const editRmksPopupActions = __importStar(require("../../reducers/editRmksPopup"));
const EditRmksPopup = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const editRmksPopup = (0, hooks_1.useAppSelector)((state) => state.editRmksPopup);
    const [rmksText, setRmksText] = (0, react_1.useState)(editRmksPopup.rmksText);
    const [initialRmksText, setInitialRmksText] = (0, react_1.useState)(editRmksPopup.rmksText);
    const rmksTextRef = react_1.default.useRef(null);
    const prevIsFetching = (0, hooks_1.usePrevious)(editRmksPopup.isFetching);
    (0, react_1.useEffect)(() => {
        if (!editRmksPopup.isFetching && prevIsFetching) {
            setRmksText(editRmksPopup.rmksText);
            setInitialRmksText(editRmksPopup.rmksText);
            const rmksTextLength = editRmksPopup.rmksText ? editRmksPopup.rmksText.length : 0;
            if (rmksTextRef.current) {
                rmksTextRef.current.value = editRmksPopup.rmksText;
                // リマークス欄クリック時に、textareaを一番下まで下げる
                if (editRmksPopup.isEnabled) {
                    rmksTextRef.current.setSelectionRange(rmksTextLength, rmksTextLength);
                    rmksTextRef.current.scrollTop = rmksTextRef.current.scrollHeight;
                    if (rmksTextRef.current) {
                        rmksTextRef.current.focus();
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editRmksPopup.isFetching]);
    const handleRmksText = (e) => {
        setRmksText((0, commonUtil_1.removePictograph)(e.target.value));
    };
    const onSubmit = () => {
        const { isEnabled, key, mode } = editRmksPopup;
        if (initialRmksText === rmksText) {
            void dispatch(editRmksPopupActions.showNotificationNoChange());
        }
        else if (isEnabled && key) {
            void dispatch(editRmksPopupActions.updateFlightRmks({
                orgDateLcl: key.orgDateLcl,
                alCd: key.alCd,
                fltNo: key.fltNo,
                casFltNo: key.casFltNo || "",
                skdDepApoCd: key.skdDepApoCd,
                skdArrApoCd: key.skdArrApoCd,
                skdLegSno: key.skdLegSno,
                oalTblFlg: key.oalTblFlg,
                rmksTypeCd: mode,
                rmksText,
            }));
        }
    };
    const { isOpen, position, isEnabled, isFetching, placeholder, alCd, fltNo, casFltNo, orgDateLcl, lstDepApoCd, lstArrApoCd } = editRmksPopup;
    const submitButtonHeight = 13 + 44 + 13;
    const textAreaHeight = 125;
    const height = 42 + textAreaHeight + submitButtonHeight + 2;
    const width = position.width || 500;
    const top = position.top || (window.innerHeight - height) / 2; // position.top=0の場合は中央にする。
    const left = position.left || (window.innerWidth - width) / 2; // position.left=0の場合は中央にする。
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, style: customStyles({ height, width, top, left }), onRequestClose: () => {
            if (initialRmksText === rmksText) {
                dispatch(editRmksPopupActions.closeEditRmksPopup());
                setRmksText("");
                setInitialRmksText("");
            }
            else {
                void dispatch(editRmksPopupActions.showConfirmation({
                    onClickYes: () => {
                        dispatch(editRmksPopupActions.closeEditRmksPopup());
                        setRmksText("");
                        setInitialRmksText("");
                    },
                }));
            }
        } },
        react_1.default.createElement(Content, { hidden: storage_1.storage.isPc ? isFetching : false },
            " ",
            react_1.default.createElement(Title, { casFltNo: casFltNo },
                react_1.default.createElement("div", { className: "fltNo" }, casFltNo ? (react_1.default.createElement("span", null, casFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("small", null, alCd),
                    (0, commonUtil_1.formatFltNo)(fltNo)))),
                react_1.default.createElement("div", { className: "date" }, orgDateLcl && `/${(0, dayjs_1.default)(orgDateLcl).format("DDMMM").toUpperCase()}`),
                react_1.default.createElement("div", { className: "apoCd" },
                    lstDepApoCd,
                    lstArrApoCd && `-${lstArrApoCd}`)),
            react_1.default.createElement(TextArea, { ref: rmksTextRef, autoFocus: true, maxLength: 2048, height: textAreaHeight, onChange: handleRmksText, readOnly: !isEnabled, placeholder: placeholder }),
            react_1.default.createElement(ButtonContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { text: "Update", onClick: onSubmit, disabled: !isEnabled || isFetching })))));
};
react_modal_1.default.setAppElement("#content");
const customStyles = ({ width, height, top, left }) => ({
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
        padding: 0,
        borderRadius: 0,
    },
});
const ButtonContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 0;
  background: #f6f6f6;
  button {
    width: 100px;
  }
`;
const Content = styled_components_1.default.div `
  background: #f6f6f6;
  padding: 0px 10px;
`;
const Title = styled_components_1.default.div `
  display: flex;
  padding: 8px;
  height: 42px;
  vertical-align: bottom;
  justify-content: center;
  align-items: flex-end;
  font-size: 22px;
  .fltNo {
    small {
      font-size: 16px;
    }
    span {
      ${({ casFltNo }) => (casFltNo ? (casFltNo.length > 6 ? "font-size: 15px;" : "font-size: 22px;") : "")}
    }
  }
  .date {
    margin-right: 2px;
  }
  .apoCd {
    margin-left: 14px;
    font-size: 20px;
  }
`;
const TextArea = styled_components_1.default.textarea `
  background: #fff;
  resize: none;
  width: 100%;
  height: ${(props) => `${props.height}px`};
  padding: 4px 6px;
  border: none;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 1px;
  display: block;
  word-wrap: break-word;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;
exports.default = EditRmksPopup;
//# sourceMappingURL=EditRmksPopup.js.map