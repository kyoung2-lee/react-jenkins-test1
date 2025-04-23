"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadActionMenu = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../../store/hooks");
const config_1 = require("../../../../config/config");
const ActionMenu_1 = require("./ActionMenu");
const bulletinBoardResponseEditorModal_1 = require("../../../reducers/bulletinBoardResponseEditorModal");
const commonUtil_1 = require("../../../lib/commonUtil");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const submenu_bb_svg_1 = __importDefault(require("../../../assets/images/menu/submenu-bb.svg"));
const submenu_mail_svg_1 = __importDefault(require("../../../assets/images/menu/submenu-mail.svg"));
const Component = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const history = (0, react_router_dom_1.useHistory)();
    const bbShare = () => {
        const path = `/broadcast?from=bbShare&id=${props.bbId}&archive=${props.archiveFlg.toString()}`;
        if (storage_1.storage.isPc) {
            window.open(`${config_1.ServerConfig.BASE_ROUTE}${path}`, "_blank");
        }
        else {
            history.push(path);
            closeModal();
        }
    };
    const emailShare = () => {
        const path = `/broadcast?from=emailShare&id=${props.bbId}&archive=${props.archiveFlg.toString()}`;
        if (storage_1.storage.isPc) {
            window.open(`${config_1.ServerConfig.BASE_ROUTE}${path}`, "_blank");
        }
        else {
            history.push(path);
            closeModal();
        }
    };
    const openResponseEditor = () => {
        dispatch((0, bulletinBoardResponseEditorModal_1.openBulletinBoardResponseModal)({ bbId: props.bbId }));
    };
    const edit = () => {
        const path = `/broadcast?from=edit&id=${props.bbId}&archive=${props.archiveFlg.toString()}`;
        history.push(path);
        closeModal();
    };
    const closeModal = () => {
        if (props.handleCloseModal) {
            props.handleCloseModal();
        }
    };
    const deleteThread = () => {
        props.onDelete(props.bbId);
    };
    const canBroadcastBbOpen = () => (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth) && !storage_1.storage.isIphone;
    const responsable = () => !props.archiveFlg && (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoardRes, props.jobAuth.jobAuth);
    const editable = () => props.canEditOrShare && !props.archiveFlg && props.postUserJobCd === props.jobAuth.user.jobCd && canBroadcastBbOpen();
    const deletable = () => !props.archiveFlg &&
        props.postUserJobCd === props.jobAuth.user.jobCd &&
        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth);
    const bbShareable = () => props.canEditOrShare && canBroadcastBbOpen();
    const emailShareable = () => props.canEditOrShare && (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBroadcastEmail, props.jobAuth.jobAuth);
    const actions = () => [
        ...(responsable() ? [{ title: "Response", onClick: openResponseEditor }] : []),
        ...(editable() ? [{ title: "Edit", onClick: edit }] : []),
        ...(deletable() ? [{ title: "Delete", onClick: deleteThread }] : []),
        ...(bbShareable() ? [{ icon: submenu_bb_svg_1.default, title: "Share", onClick: bbShare }] : []),
        ...(emailShareable() ? [{ icon: submenu_mail_svg_1.default, title: "Share", onClick: emailShare }] : []),
    ];
    return (react_1.default.createElement(ActionMenu_1.ActionMenu, { actions: actions(), editing: props.editing, clearCommentStorage: props.clearCommentStorage, toggleActionMenu: props.toggleActionMenu }));
};
exports.ThreadActionMenu = (0, react_redux_1.connect)((state) => ({ jobAuth: state.account.jobAuth }))(Component);
//# sourceMappingURL=ThreadActionMenu.js.map