"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinBoardAddressModal = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const redux_1 = require("redux");
const storage_1 = require("../../lib/storage");
const bulletinBoardAddressModal_1 = require("../../reducers/bulletinBoardAddressModal");
const icon_close_svg_1 = __importDefault(require("../../assets/images/icon/icon-close.svg"));
const Component = (props) => {
    const sortedJobCodes = () => props.jobCodes.slice().sort();
    const { isOpen, closeBulletinBoardAddressModal } = props;
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, onRequestClose: closeBulletinBoardAddressModal, style: customStyles },
        react_1.default.createElement(Container, null,
            react_1.default.createElement(CloseIcon, { onClick: closeBulletinBoardAddressModal }),
            react_1.default.createElement(Title, null, "B.B. Address Detail"),
            react_1.default.createElement(Content, null, sortedJobCodes().map((code) => (react_1.default.createElement(JobCodeCol, { key: code },
                react_1.default.createElement(JobCode, { isPc: storage_1.storage.isPc }, code))))))));
};
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  height: 100%;
`;
const Content = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
  align-content: flex-start;
`;
const JobCodeCol = styled_components_1.default.div `
  padding: 6px 8px;
`;
const JobCode = styled_components_1.default.div `
  padding: 8px;
  min-width: ${(props) => (props.isPc ? 120 : 124)}px;
  border: 1px solid #346181;
  background-color: #f6f6f6;
`;
const Title = styled_components_1.default.div `
  margin-bottom: 8px;
`;
const CloseIcon = styled_components_1.default.img.attrs({ src: icon_close_svg_1.default }) `
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: ponter;
`;
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: "static",
        width: storage_1.storage.isIphone ? "322px" : "605px",
        height: "calc(100vh - 80px)",
        left: "calc(50% - 315px)",
        padding: 20,
        overflow: "hidden",
    },
};
exports.BulletinBoardAddressModal = (0, react_redux_1.connect)(({ bulletinBoardAddressModal }) => ({
    isOpen: bulletinBoardAddressModal.isOpen,
    jobCodes: bulletinBoardAddressModal.jobCodes,
}), (dispatch) => (0, redux_1.bindActionCreators)({ closeBulletinBoardAddressModal: bulletinBoardAddressModal_1.closeBulletinBoardAddressModal }, dispatch))(Component);
//# sourceMappingURL=BulletinBoardAddressModal.js.map