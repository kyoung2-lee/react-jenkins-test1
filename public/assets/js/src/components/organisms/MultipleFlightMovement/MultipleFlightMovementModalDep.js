"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formName = void 0;
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const MultipleFlightMovementModal_1 = require("./MultipleFlightMovementModal");
// コネクト
exports.formName = "multipleflightMovementDep";
const MultipleFlightMovementModalWithForm = (0, redux_form_1.reduxForm)({
    form: exports.formName,
    onSubmit: MultipleFlightMovementModal_1.onSubmit,
    enableReinitialize: false,
})(MultipleFlightMovementModal_1.MultipleFlightMovementModal);
exports.default = (0, react_redux_1.connect)((state) => ({
    isDep: true,
    modal: state.multipleFlightMovementModals.modalDep,
    rowStatusList: state.multipleFlightMovementModals.modalDep.rowStatusList,
    initialValues: state.multipleFlightMovementModals.modalDep.initialFormValues,
}))(MultipleFlightMovementModalWithForm);
//# sourceMappingURL=MultipleFlightMovementModalDep.js.map