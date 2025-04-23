"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const lightbox_1 = require("../../reducers/lightbox");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const Component = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const isOpen = (0, hooks_1.useAppSelector)((state) => state.lightbox.isOpen);
    const handleClose = () => {
        dispatch((0, lightbox_1.closeLightbox)());
    };
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, onRequestClose: handleClose, style: customStyles },
        react_1.default.createElement(Container, null,
            react_1.default.createElement(Content, null,
                react_1.default.createElement(Media, null)),
            react_1.default.createElement(Footer, null,
                react_1.default.createElement(PrimaryButton_1.default, { text: "Close", onClick: handleClose })))));
};
const Media = () => {
    const media = (0, hooks_1.useAppSelector)((state) => state.lightbox.media);
    if (!media)
        return react_1.default.createElement(react_1.default.Fragment, null);
    switch (media.type) {
        case "image":
            return react_1.default.createElement(Image, { src: media.url });
        case "video":
            return react_1.default.createElement(Video, { src: media.url, controls: true });
        default:
            return react_1.default.createElement(react_1.default.Fragment, null);
    }
};
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
`;
const Content = styled_components_1.default.div `
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #555;
  margin-bottom: 10px;
`;
const Image = styled_components_1.default.img `
  max-width: 100%;
`;
const Video = styled_components_1.default.video `
  max-width: 100%;
`;
const Footer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
`;
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.8)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: "static",
        width: "600px",
        height: "auto",
    },
};
exports.default = Component;
//# sourceMappingURL=Lightbox.js.map