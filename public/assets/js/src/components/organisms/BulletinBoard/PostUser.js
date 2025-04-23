"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostUser = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const UserAvatar_1 = require("./UserAvatar");
const address_svg_1 = __importDefault(require("../../../assets/images/icon/address.svg"));
const Component = ({ jobAuth, avatar, group, usernameWithNumber, userId, appleId, className, onAddressClick, actionMenu, }) => {
    const telable = () => !!appleId && jobAuth.user.userId !== userId;
    const openFacetime = () => {
        if (!telable())
            return;
        window.location.href = `facetime:${appleId || ""}`;
    };
    return (react_1.default.createElement(Container, { className: className },
        react_1.default.createElement(UserAvatar_1.UserAvatar, { src: avatar && `data:image/png;base64,${avatar}` }),
        react_1.default.createElement(PostUserInfo, null,
            react_1.default.createElement(PostUserGroupContainer, null,
                react_1.default.createElement(PostUserGroup, { hasActionMenu: !!actionMenu }, group),
                actionMenu && actionMenu(),
                onAddressClick && react_1.default.createElement(AddressButton, { onClick: onAddressClick })),
            react_1.default.createElement(PostUserName, { clickable: telable(), onClick: openFacetime }, usernameWithNumber))));
};
exports.PostUser = (0, react_redux_1.connect)((state) => ({ jobAuth: state.account.jobAuth }))(Component);
const Container = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
const PostUserInfo = styled_components_1.default.div `
  flex: 1;
`;
const PostUserGroupContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const PostUserGroup = styled_components_1.default.div `
  font-weight: bold;
  font-size: 15px;
  ${(props) => (props.hasActionMenu ? "margin: 0 auto 0 0;" : "")}
`;
const PostUserName = styled_components_1.default.div `
  font-size: 13px;
  ${(props) => props.clickable && "text-decoration: underline; color: blue; cursor: pointer; max-width: 85%;"};
`;
const AddressButton = styled_components_1.default.img.attrs({
    src: address_svg_1.default,
}) `
  cursor: pointer;
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;
//# sourceMappingURL=PostUser.js.map