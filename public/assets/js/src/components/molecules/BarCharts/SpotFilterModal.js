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
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../../lib/storage");
const hooks_1 = require("../../../store/hooks");
const spotFilterModal_1 = require("../../../reducers/spotFilterModal");
const storageOfUser_1 = require("../../../reducers/storageOfUser");
const layoutStyle_1 = __importDefault(require("../../../styles/layoutStyle"));
const CheckboxGroup_1 = __importDefault(require("../../atoms/CheckboxGroup"));
const CheckBoxInput_1 = __importDefault(require("../../atoms/CheckBoxInput"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SpotFilterModal = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const spotFilterModal = (0, hooks_1.useAppSelector)((state) => state.spotFilterModal);
    const storageOfUser = (0, hooks_1.useAppSelector)((state) => state.storageOfUser);
    const [indeterminate, setIndeterminate] = (0, react_1.useState)(false);
    const prevFormValues = (0, hooks_1.usePrevious)(props.formValues);
    (0, react_1.useEffect)(() => {
        updateSelectAll();
        if (spotFilterModal.isOpen) {
            dispatch((0, storageOfUser_1.getHiddenSpotNoList)({ apoCd: props.apoCd }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, spotFilterModal.isOpen]);
    (0, react_1.useEffect)(() => {
        const prevSpotNoList = prevFormValues && prevFormValues.spotNo ? prevFormValues.spotNo : [];
        const spotNoList = props.formValues && props.formValues.spotNo ? props.formValues.spotNo : [];
        if (prevSpotNoList.length !== spotNoList.length) {
            updateSelectAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.formValues]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectAll = (e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e.target.checked) {
            props.change("spotNo", spotFilterModal.spotNoList);
        }
        else {
            props.change("spotNo", []);
        }
        setIndeterminate(false);
    };
    const updateSelectAll = () => {
        const { formValues } = props;
        const selectedSpotNoList = spotFilterModal.spotNoList.filter((spotNo) => formValues && formValues.spotNo ? formValues.spotNo.includes(spotNo) : true);
        if (selectedSpotNoList.length > 0) {
            if (selectedSpotNoList.length === spotFilterModal.spotNoList.length) {
                props.change("selectAll", true);
                setIndeterminate(false);
            }
            else {
                props.change("selectAll", false);
                setIndeterminate(true);
            }
        }
        else {
            props.change("selectAll", false);
            setIndeterminate(false);
        }
    };
    const handleRequestClose = () => {
        const { formValues: { spotNo }, } = props;
        const { spotNoList } = spotFilterModal;
        const { hiddenSpotNoList } = storageOfUser;
        const latestHiddenSpotNoList = spotNoList.filter((v) => !(spotNo && spotNo.includes(v)));
        if (hiddenSpotNoList.length === latestHiddenSpotNoList.length && hiddenSpotNoList.every((v) => latestHiddenSpotNoList.includes(v))) {
            dispatch((0, spotFilterModal_1.closeSpotFilterModal)());
        }
        else {
            void dispatch((0, spotFilterModal_1.showConfirmation)({ onClickYes: spotFilterModal_1.closeSpotFilterModal }));
        }
    };
    const handleEnter = () => {
        const { userId, apoCd, formValues: { spotNo }, } = props;
        const { spotNoList } = spotFilterModal;
        if (userId && apoCd) {
            const hiddenSpotNo = spotNo ? spotNoList.filter((v) => !spotNo.includes(v)) : [];
            dispatch((0, storageOfUser_1.saveHiddenSpotNo)({ apoCd, hiddenSpotNo }));
        }
        dispatch((0, spotFilterModal_1.enterSpotFilterModal)());
    };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(react_modal_1.default, { isOpen: spotFilterModal.isOpen, style: customModalStyles, onRequestClose: handleRequestClose },
            react_1.default.createElement(Header, null, "SPOT Filter"),
            react_1.default.createElement(Body, null,
                react_1.default.createElement(SelectAllLabel, { htmlFor: "selectAll" },
                    react_1.default.createElement(redux_form_1.Field, { id: "selectAll", name: "selectAll", component: CheckBoxInput_1.default, type: "checkbox", onChange: handleSelectAll, className: indeterminate ? "indeterminate" : "" }),
                    "Select all"),
                react_1.default.createElement(SpotNoList, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "spotNo", options: spotFilterModal.spotNoList.map((spotNo) => ({ label: spotNo || "XXX", value: spotNo })), component: CheckboxGroup_1.default })),
                react_1.default.createElement(EnterButton, null,
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Enter", type: "button", width: "90px", height: "40px", onClick: handleEnter }))))));
};
const Wrapper = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
`;
const customModalStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        position: "absolute",
        width: "240px",
        padding: "0",
        top: `calc(52px + ${storage_1.storage.isPc ? layoutStyle_1.default.header.default : layoutStyle_1.default.header.tablet})`,
        left: "105px",
        right: "unset",
        bottom: "unset",
        margin: "auto",
        border: "none",
        background: "#fff",
        overflow: "auto",
        outline: "none",
    },
};
const Header = styled_components_1.default.div `
  color: #ffffff;
  background-color: #2799c6;
  text-align: center;
  font-size: 12px;
  width: 100%;
  height: 24px;
  line-height: 2;
`;
const Body = styled_components_1.default.div `
  label {
    display: flex;
    align-items: center;
  }

  input[type="checkbox"] {
    margin-right: 6px;
  }
`;
const SpotNoList = styled_components_1.default.div `
  background-color: #f6f6f6;
  border: 1px solid #222222;
  margin: 0 23px 0 23px;
  padding: 24px 0 0 43px;
  min-height: 291px;
  max-height: calc(100vh - 52px - ${storage_1.storage.isPc ? `${layoutStyle_1.default.header.default} - 250px` : `${layoutStyle_1.default.header.tablet} - 210px`});
  overflow-y: auto;

  label {
    margin-bottom: 23px;
  }
`;
const SelectAllLabel = styled_components_1.default.label `
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }

  margin: 24px 48px 21px 48px;
`;
const EnterButton = styled_components_1.default.div `
  padding: 32px 75px;
`;
const SpotFilterModalWithForm = (0, redux_form_1.reduxForm)({
    form: "spotFilterModal",
    enableReinitialize: true,
})(SpotFilterModal);
const mapStateToProps = (state) => {
    const { spotNoList } = state.spotFilterModal;
    const { hiddenSpotNoList } = state.storageOfUser;
    const selectedSpotNo = spotNoList.filter((spotNo) => !hiddenSpotNoList.includes(spotNo));
    return {
        userId: state.account.jobAuth.user.userId,
        apoCd: state.common.headerInfo.apoCd,
        formValues: (0, redux_form_1.getFormValues)("spotFilterModal")(state),
        initialValues: {
            spotNo: selectedSpotNo,
        },
    };
};
const mergeProps = (stateProps, onwProps) => ({
    ...stateProps,
    ...onwProps,
});
exports.default = (0, react_redux_1.connect)(mapStateToProps, null, mergeProps)(SpotFilterModalWithForm);
//# sourceMappingURL=SpotFilterModal.js.map