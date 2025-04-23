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
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const redux_1 = require("redux");
const flightNumberInputPopup_1 = require("../../../reducers/flightNumberInputPopup");
const common_1 = require("../../../reducers/common");
const fisFilterModalExports = __importStar(require("../../../reducers/fisFilterModal"));
const FisFilterModal_1 = __importDefault(require("./FisFilterModal"));
const mapStateToProps = (state) => ({
    fisFilterModal: state.fisFilterModal,
    master: state.account.master,
    formValues: (0, redux_form_1.getFormValues)("fisFilterModal")(state),
    formSyncErrors: (0, redux_form_1.getFormSyncErrors)("fisFilterModal")(state),
    fisFilterModalForm: state.form.fisFilterModal,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _default, slice, ...fisFilterModalActions } = fisFilterModalExports;
const mapDispatchToProps = (dispatch) => ({
    ...(0, redux_1.bindActionCreators)({
        ...fisFilterModalActions,
        openFlightNumberInputPopup: flightNumberInputPopup_1.openFlightNumberInputPopup,
        removeAllNotification: common_1.removeAllNotification,
    }, dispatch),
});
const enhancer = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps);
exports.default = enhancer(FisFilterModal_1.default);
//# sourceMappingURL=index.js.map