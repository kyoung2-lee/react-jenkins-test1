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
require("react-image-crop/dist/ReactCrop.css");
const react_1 = __importStar(require("react"));
const react_image_crop_1 = __importDefault(require("react-image-crop"));
const styled_components_1 = __importDefault(require("styled-components"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const sample_profile_jpg_1 = __importDefault(require("../../assets/images/sample_profile.jpg"));
const Profile = () => {
    const [crop, setCrop] = (0, react_1.useState)({ x: 20, y: 10, width: 30, height: 10 });
    const onChange = (newCrop) => {
        setCrop(newCrop);
    };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(react_image_crop_1.default, { src: sample_profile_jpg_1.default, onChange: onChange, crop: crop, style: { maxHeight: "500px" } }),
        react_1.default.createElement(Buttons, null,
            react_1.default.createElement(PrimaryButton_1.default, { text: "Update" }),
            react_1.default.createElement(PrimaryButton_1.default, { text: "Cancel" }))));
};
const Wrapper = styled_components_1.default.div `
  width: 300px;
  margin: 0 auto;
  text-align: center;
`;
const Buttons = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  width: 244px;
  margin: 26px auto;

  button {
    width: 100px;
  }
`;
exports.default = Profile;
//# sourceMappingURL=Profile.js.map