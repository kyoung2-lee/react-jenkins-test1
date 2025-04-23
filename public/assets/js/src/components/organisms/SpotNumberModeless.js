"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_transition_group_1 = require("react-transition-group");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../lib/storage");
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const hooks_1 = require("../../store/hooks");
const spotNumber_1 = require("../../reducers/spotNumber");
const spotNumberRestrictionPopup_1 = require("../../reducers/spotNumberRestrictionPopup");
const PopupCommonHeader_1 = __importDefault(require("../atoms/PopupCommonHeader"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const SecondaryButton_1 = __importDefault(require("../atoms/SecondaryButton"));
const DraggableModal_1 = __importDefault(require("../molecules/DraggableModal"));
const SpotNumberForm_1 = __importDefault(require("../molecules/SpotNumberForm"));
// eslint-disable-next-line import/no-cycle
const SpotNumberModal_1 = require("./SpotNumberModal");
const SpotNumberModeless = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const isForceDirty = Object.values(props.dirtyForms).some(({ arr, dep }) => arr || dep);
    const handleClose = (spotNoRow) => {
        void dispatch((0, spotNumber_1.closeSpotNumberChild)({ givenId: spotNoRow.givenId }));
    };
    const handleClickClose = () => {
        if (isForceDirty) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => dispatch((0, spotNumber_1.closeSpotNumberAll)()) }) });
        }
        else {
            void dispatch((0, spotNumber_1.closeSpotNumberAll)());
        }
    };
    const handleClickTarget = (spotNoRow, target) => {
        if (spotNoRow) {
            const dirtyForm = props.dirtyForms[spotNoRow.givenId];
            const clickedRowHasDarty = dirtyForm != null && Object.values(dirtyForm).includes(true);
            if (clickedRowHasDarty) {
                const onYesButton = () => {
                    if (props.initialValues.rows) {
                        const formIndex = props.initialValues.rows.findIndex((r) => r.givenId === spotNoRow.givenId);
                        if (formIndex >= 0) {
                            props.change(`rows[${formIndex}].arr.spotNo`, props.initialValues.rows[formIndex].arr.spotNo);
                            props.change(`rows[${formIndex}].dep.spotNo`, props.initialValues.rows[formIndex].dep.spotNo);
                        }
                    }
                    dispatch((0, spotNumber_1.targetSelected)({ givenId: spotNoRow.givenId, target }));
                    dispatch((0, spotNumber_1.setDirtyForm)({ givenId: spotNoRow.givenId, isArrDirty: false, isDepDirty: false }));
                    dispatch((0, spotNumber_1.setFormValues)({
                        formValues: {
                            ...props.formValues,
                            rows: props.formValues.rows.map((row) => {
                                var _a, _b;
                                const initialRow = (_b = (_a = props.initialValues.rows) === null || _a === void 0 ? void 0 : _a.find(({ givenId }) => givenId === spotNoRow.givenId)) !== null && _b !== void 0 ? _b : row;
                                return row.givenId === spotNoRow.givenId ? initialRow : row;
                            }),
                        },
                    }));
                };
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40012C({ onYesButton }) });
            }
            else {
                dispatch((0, spotNumber_1.targetSelected)({ givenId: spotNoRow.givenId, target }));
            }
        }
    };
    const getHeaderInfo = ({ spotNoRow, isDep }) => {
        const legInfo = isDep ? spotNoRow.dep.legInfo : spotNoRow.arr.legInfo;
        if (!legInfo)
            return null;
        return {
            orgDateLcl: legInfo.orgDateLcl,
            alCd: legInfo.alCd,
            fltNo: legInfo.fltNo,
            casFltNo: legInfo.casFltNo,
            csFlg: legInfo.csFlg,
        };
    };
    const getFormIndex = (spotNoRow) => {
        if (props.initialValues.rows) {
            const index = props.initialValues.rows.findIndex((r) => r.givenId === spotNoRow.givenId);
            if (index >= 0) {
                return index;
            }
        }
        return null;
    };
    const renderHeader = () => (react_1.default.createElement(Header, null,
        react_1.default.createElement("div", null, "SPOT Change"),
        react_1.default.createElement("div", null,
            props.spotNoRows.length,
            react_1.default.createElement("span", null, "Bars"))));
    return (react_1.default.createElement(DraggableModal_1.default, { header: renderHeader(), isOpen: !props.isModal && props.isOpen, onFocus: () => { }, style: customStylesI, showCloseButton: false, posRight: true },
        react_1.default.createElement("form", { onSubmit: props.handleSubmit },
            react_1.default.createElement(ContentWrapper, { isPc: storage_1.storage.isPc },
                react_1.default.createElement(react_transition_group_1.TransitionGroup, null, props.spotNoRows.map((spotNoRow) => (react_1.default.createElement(react_transition_group_1.CSSTransition, { key: spotNoRow.seq, timeout: 200, classNames: "spot-no-row" },
                    react_1.default.createElement(ContentRow, null,
                        react_1.default.createElement(PopupCommonHeader_1.default, { onClose: () => handleClose(spotNoRow), arr: getHeaderInfo({ spotNoRow, isDep: false }), dep: getHeaderInfo({ spotNoRow, isDep: true }) }),
                        react_1.default.createElement(SpotNumberForm_1.default, { formValues: props.formValues, spotNoRow: spotNoRow, formIndex: getFormIndex(spotNoRow), onClickTarget: (target) => handleClickTarget(spotNoRow, target), 
                            // eslint-disable-next-line @typescript-eslint/unbound-method
                            change: props.change, dirtyForms: props.dirtyForms, setDirtyForm: (payload) => dispatch((0, spotNumber_1.setDirtyForm)(payload)), removeDirtyForm: (payload) => dispatch((0, spotNumber_1.removeDirtyForm)(payload)), setFormValues: (payload) => dispatch((0, spotNumber_1.setFormValues)(payload)), removeFormValue: (payload) => dispatch((0, spotNumber_1.removeFormValue)(payload)) }))))))),
            react_1.default.createElement(FooterContainer, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(SecondaryButton_1.default, { text: "Close", type: "button", onClick: handleClickClose })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "100px", disabled: !isForceDirty }))))));
};
const customStylesI = {
    overlay: {
        background: "transparent",
        pointerEvents: "none",
        zIndex: 960000000 /* reapop(999999999)の3つ下 */,
    },
    content: {
        width: "100%",
        height: "100%",
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        border: "none",
        pointerEvents: "none",
        padding: 0,
    },
};
const Header = styled_components_1.default.div `
  width: 100%;
  height: 40px;
  background: #346181;
  margin-top: -2px;
  display: flex;
  color: ${(props) => props.theme.color.WHITE};
  font-size: 20px;
  > div:first-child {
    margin-top: 10px;
    margin-left: 73px;
  }
  > div:last-child {
    margin-top: 10px;
    margin-left: 55px;
    span {
      margin-left: 4px;
      font-size: 12px;
    }
  }
`;
const ContentWrapper = styled_components_1.default.div `
  height: calc(100vh - ${({ isPc }) => (isPc ? "130px" : "150px")});
  overflow-y: scroll;
  background-color: #7f7f7f;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  .spot-no-row-enter {
    opacity: 0.01;
    transform: translate(-187px, 0);
  }
  .spot-no-row-enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: all 200ms ease-in;
  }
  .spot-no-row-exit {
    opacity: 1;
    transform: translate(0, 0);
  }
  .spot-no-row-exit-active {
    opacity: 0.01;
    transform: translate(187px, 0);
    transition: all 200ms ease-in;
  }
`;
const ContentRow = styled_components_1.default.div `
  width: 100%;
  height: 276px;
  background: #f6f6f6;
  transition: all 0.3s linear;
  border: 1px solid ${(props) => props.theme.color.WHITE};
`;
const FooterContainer = styled_components_1.default.div `
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: space-evenly;
  align-items: center;
  background: #ffffff;
  box-shadow: 2px 2px 4px #abb3bb;
  > div {
    width: 96px;
  }
`;
const handleSubmitForm = (formValues, dispatch, _props) => {
    notifications_1.NotificationCreator.create({
        dispatch,
        message: soalaMessages_1.SoalaMessage.M30010C({
            onYesButton: () => {
                void (async () => {
                    const response = await dispatch((0, spotNumber_1.checkSpotNumberRestriction)(formValues)).unwrap();
                    if (response && response.length > 0) {
                        void dispatch((0, spotNumberRestrictionPopup_1.openSpotNumberRestrictionPopup)({
                            legInfo: response,
                            onYesButton: () => {
                                void dispatch((0, spotNumber_1.updateSpotNumbers)(formValues));
                            },
                            onNoButton: () => { },
                        }));
                    }
                    else {
                        void dispatch((0, spotNumber_1.updateSpotNumbers)(formValues));
                    }
                })();
            },
        }),
    });
};
const SpotNumberModelessForm = (0, redux_form_1.reduxForm)({
    form: SpotNumberModal_1.FORM_NAME,
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
})(SpotNumberModeless);
const mapStateToProps = (state) => ({
    initialValues: state.spotNumber.initialFormValues,
    formValues: (0, redux_form_1.getFormValues)(SpotNumberModal_1.FORM_NAME)(state),
    isModal: state.spotNumber.isModal,
    isOpen: state.spotNumber.isOpen,
    fetching: state.spotNumber.fetching,
    spotNoRows: state.spotNumber.spotNoRows,
    dirtyForms: state.spotNumber.dirtyForms,
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(SpotNumberModelessForm);
//# sourceMappingURL=SpotNumberModeless.js.map