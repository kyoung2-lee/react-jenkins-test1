"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const CognitoAuth_1 = require("./CognitoAuth");
const mapStateToProps = (_state) => ({});
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    ...(0, redux_1.bindActionCreators)({}, dispatch),
});
const enhancer = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps);
exports.default = enhancer(CognitoAuth_1.CognitoAuth);
//# sourceMappingURL=index.js.map