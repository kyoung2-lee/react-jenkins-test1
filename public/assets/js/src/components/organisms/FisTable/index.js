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
const fisExports = __importStar(require("../../../reducers/fis"));
const fisFilterModalExports = __importStar(require("../../../reducers/fisFilterModal"));
const FisTable_1 = __importDefault(require("./FisTable"));
const selector_1 = __importDefault(require("./selector"));
const mapStateToProps = (state) => ({
    headerInfo: state.common.headerInfo,
    fis: state.fis,
    jobAuth: state.account.jobAuth,
    master: state.account.master,
    zoomFis: state.account.zoomFis,
    isAutoReload: state.fis.headerSettings.isAutoReload,
    isSelfScroll: state.fis.headerSettings.isSelfScroll,
    filteredFisRows: (0, selector_1.default)(state),
    fisFilterModal: state.fisFilterModal,
    fisFilterModalFormValues: (0, redux_form_1.getFormValues)("fisFilterModal")(state),
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisDefault, slice: _fisSlice, doQueueFunctionAll: _doQueueFunctionAll, ...fisActions } = fisExports;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisFilterModalDefault, slice: _fisFilterModalSlice, ...fisFilterModalActions } = fisFilterModalExports;
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    ...(0, redux_1.bindActionCreators)({
        ...fisActions,
        ...fisFilterModalActions,
        resetOthreForm: redux_form_1.reset,
        changeOthreForm: redux_form_1.change,
    }, dispatch),
});
const enhancer = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps);
exports.default = enhancer(FisTable_1.default);
//# sourceMappingURL=index.js.map