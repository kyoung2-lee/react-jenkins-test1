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
exports.VideoAttachment = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const Component = (props) => {
    const [duration, setDuration] = (0, react_1.useState)(undefined);
    const handleLoaded = (e) => {
        const durationOfSeconds = Math.floor(e.currentTarget.duration);
        const minutes = Math.floor(durationOfSeconds / 60);
        const seconds = durationOfSeconds % 60;
        setDuration(`${`00${minutes}`.slice(-2)}:${`00${seconds}`.slice(-2)}`);
    };
    // private handleClick = () => {
    //   this.props.openLightbox({ url: this.props.url, type: "video" });
    // };
    return (react_1.default.createElement(Container, { onClick: props.onClick },
        react_1.default.createElement(Video, { src: props.url, onLoadedMetadata: handleLoaded }),
        duration && react_1.default.createElement(Duration, null, duration)));
};
exports.VideoAttachment = (0, react_redux_1.connect)(null)(Component);
const Container = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;
const Video = styled_components_1.default.video `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const Duration = styled_components_1.default.span `
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  position: absolute;
  bottom: 5px;
  right: 5px;
`;
//# sourceMappingURL=VideoAttachment.js.map