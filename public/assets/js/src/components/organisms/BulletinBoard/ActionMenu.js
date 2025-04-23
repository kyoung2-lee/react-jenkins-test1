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
exports.ActionMenu = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const notifications_1 = require("../../../lib/notifications");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const action_menu_svg_1 = __importDefault(require("../../../assets/images/icon/action_menu.svg"));
const ActionMenu = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const closingTimeoutRef = (0, react_1.useRef)(undefined);
    const overlayRef = (0, react_1.useRef)(null);
    const [visibled, setVisibled] = (0, react_1.useState)(false);
    const [closing, setClosing] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => () => {
        if (closingTimeoutRef.current) {
            clearTimeout(closingTimeoutRef.current);
        }
    }, []);
    const showMessage = (message) => notifications_1.NotificationCreator.create({ dispatch, message });
    const toggle = () => {
        const { editing = false } = props;
        if (visibled) {
            close();
        }
        else if (editing) {
            showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    props.clearCommentStorage();
                    openMenu();
                },
            }));
        }
        else {
            openMenu();
        }
    };
    const openMenu = () => {
        if (overlayRef && overlayRef.current) {
            overlayRef.current.addEventListener("touchend", parentClose, { once: true });
            overlayRef.current.addEventListener("click", parentClose, { once: true });
        }
        setVisibled(true);
        props.toggleActionMenu();
    };
    const close = () => {
        setVisibled(false);
        setClosing(true);
        props.toggleActionMenu();
        if (closingTimeoutRef.current)
            clearTimeout(closingTimeoutRef.current);
        closingTimeoutRef.current = setTimeout(() => {
            setClosing(false);
        }, 250);
        return false;
    };
    const parentClose = (e) => {
        e.stopPropagation();
        close();
        return true;
    };
    const handleClickMenuItem = (e, onClick) => {
        e.stopPropagation();
        close();
        onClick();
    };
    const classNames = [visibled && "is-open", closing && "is-close"];
    if (props.actions.length === 0) {
        return null;
    }
    return (react_1.default.createElement(ThreadActionMenu, null,
        react_1.default.createElement(MenuTrigger, { onClick: toggle },
            react_1.default.createElement(Icon, null)),
        react_1.default.createElement(MenuContainer, { className: classNames.join(" ") }, props.actions.map((action, i) => (
        // eslint-disable-next-line react/no-array-index-key
        react_1.default.createElement(MenuItem, { key: `action-${i}`, onClick: (e) => handleClickMenuItem(e, action.onClick) },
            action.icon && react_1.default.createElement(MenuIcon, { src: action.icon }),
            action.title)))),
        react_1.default.createElement(Overlay, { className: classNames.join(" "), ref: overlayRef })));
};
exports.ActionMenu = ActionMenu;
const MenuIcon = styled_components_1.default.img `
  width: 35px;
  height: 35px;
  margin-right: 4px;
  margin-top: -5px;
  margin-bottom: -5px;
`;
const ThreadActionMenu = styled_components_1.default.div `
  position: relative;
`;
const MenuTrigger = styled_components_1.default.div `
  cursor: pointer;
  user-select: none;
`;
const Icon = styled_components_1.default.img.attrs({ src: action_menu_svg_1.default }) `
  display: block;
  padding: 8px;
`;
const MenuContainer = styled_components_1.default.div `
  width: 200px;
  display: none;
  position: absolute;
  right: -8px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.3);
  z-index: 3;
  transition: opacity 0.25s;

  &.is-open {
    padding: 8px 16px;
    margin-top: 8px;
    height: auto;
    display: inline-block;
  }

  &.is-close {
    padding: 8px 16px;
    margin-top: 8px;
    height: auto;
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: -20px;
    right: 15px;
    border: 8px solid transparent;
    border-bottom: 15px solid #fff;
  }
`;
const Overlay = styled_components_1.default.div `
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2;
  width: 300vw;
  height: 300vh;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  visibility: hidden;

  &.is-open {
    display: inline-block;
    visibility: visible;
  }
`;
const MenuItem = styled_components_1.default.div `
  color: #346181;
  user-select: none;
  cursor: pointer;
  border-bottom: 2px solid #eee;
  padding: 8px 8px;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;
//# sourceMappingURL=ActionMenu.js.map