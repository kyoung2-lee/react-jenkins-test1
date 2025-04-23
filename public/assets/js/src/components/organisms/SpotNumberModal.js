"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORM_NAME = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
// eslint-disable-next-line import/no-cycle
const spotNumber_1 = require("../../reducers/spotNumber");
const spotNumberRestrictionPopup_1 = require("../../reducers/spotNumberRestrictionPopup");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const CommonPopupModal_1 = __importDefault(require("../molecules/CommonPopupModal"));
const SpotNumberForm_1 = __importDefault(require("../molecules/SpotNumberForm"));
const SpotNumberModal = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const isForceDirty = Object.values(props.dirtyForms).some(({ arr, dep }) => arr || dep);
    const handleRequestClose = () => {
        if (isForceDirty) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => dispatch((0, spotNumber_1.closeSpotNumberAll)()) }) });
        }
        else {
            dispatch((0, spotNumber_1.closeSpotNumberAll)());
        }
    };
    const handleClickTarget = (target) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        if (props.spotNoRow) {
            if (isForceDirty) {
                const onYesButton = () => {
                    props.reset();
                    if (props.spotNoRow == null)
                        return;
                    dispatch((0, spotNumber_1.targetSelected)({ givenId: props.spotNoRow.givenId, target }));
                    dispatch((0, spotNumber_1.setDirtyForm)({ givenId: props.spotNoRow.givenId, isArrDirty: false, isDepDirty: false }));
                };
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40012C({ onYesButton }) });
            }
            else {
                dispatch((0, spotNumber_1.targetSelected)({ givenId: props.spotNoRow.givenId, target }));
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
    if (!props.spotNoRow) {
        return null;
    }
    return (react_1.default.createElement(CommonPopupModal_1.default, { isOpen: props.isModal && props.isOpen, arr: getHeaderInfo({ spotNoRow: props.spotNoRow, isDep: false }), dep: getHeaderInfo({ spotNoRow: props.spotNoRow, isDep: true }), width: 375, height: 360, onRequestClose: handleRequestClose },
        react_1.default.createElement(SpotNumberForm, { onSubmit: props.handleSubmit },
            react_1.default.createElement(SpotNumberForm_1.default, { spotNoRow: props.spotNoRow, formIndex: getFormIndex(props.spotNoRow), onClickTarget: handleClickTarget, 
                // eslint-disable-next-line @typescript-eslint/unbound-method
                change: props.change, dirtyForms: props.dirtyForms, setDirtyForm: (payload) => dispatch((0, spotNumber_1.setDirtyForm)(payload)), removeDirtyForm: (payload) => dispatch((0, spotNumber_1.removeDirtyForm)(payload)) }),
            react_1.default.createElement(FooterContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "100px", disabled: !isForceDirty })))));
};
const SpotNumberForm = styled_components_1.default.form `
  height: 320px;
  text-align: center;
  background: #f6f6f6;
  font-size: 18px;
`;
const FooterContainer = styled_components_1.default.div `
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px -3px 3px #dfdfdf;
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
exports.FORM_NAME = "spotNumber";
const SpotNumberModalForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
})(SpotNumberModal);
const mapStateToProps = (state) => ({
    initialValues: state.spotNumber.initialFormValues,
    isModal: state.spotNumber.isModal,
    isOpen: state.spotNumber.isOpen,
    fetching: state.spotNumber.fetching,
    spotNoRow: state.spotNumber.spotNoRows.length > 0 ? state.spotNumber.spotNoRows[0] : null,
    dirtyForms: state.spotNumber.dirtyForms,
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(SpotNumberModalForm);
//# sourceMappingURL=SpotNumberModal.js.map