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
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const redux_form_1 = require("redux-form");
const react_router_dom_1 = require("react-router-dom");
const react_image_crop_1 = __importDefault(require("react-image-crop"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../../store/hooks");
const commonUtil_1 = require("../../../../lib/commonUtil");
const commonConst_1 = require("../../../../lib/commonConst");
const storage_1 = require("../../../../lib/storage");
const account_1 = require("../../../../reducers/account");
const commonActions = __importStar(require("../../../../reducers/common"));
const flightSearch_1 = require("../../../../reducers/flightSearch");
const userSetting_1 = require("../../../../reducers/userSetting");
const PrimaryButton_1 = __importDefault(require("../../../atoms/PrimaryButton"));
const MenuList_1 = __importDefault(require("../../../molecules/MenuList"));
const ProfileImageCreator_1 = __importDefault(require("../../../../lib/ProfileImageCreator"));
const profile_svg_1 = __importDefault(require("../../../../assets/images/account/profile.svg"));
const icon_user_skeleton_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-user-skeleton.svg"));
const icon_plane_skeleton_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-plane-skeleton.svg"));
const icon_bell_skeleton_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-bell-skeleton.svg"));
const icon_menu_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-menu.svg"));
const icon_bb_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-bb.svg"));
const SPCommonFooter = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { pathname } = (0, react_router_dom_1.useLocation)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const flightModals = (0, hooks_1.useAppSelector)((state) => state.flightModals);
    const oalFlightMovementModal = (0, hooks_1.useAppSelector)((state) => state.flightMovementModal);
    const [isMenuModalActive, setIsMenuModalActive] = (0, react_1.useState)(false);
    const [isProfileModalActive, setIsProfileModalActive] = (0, react_1.useState)(false);
    const [isEditImageModalActive, setIsEditImageModalActive] = (0, react_1.useState)(false);
    const [crop, setCrop] = (0, react_1.useState)({ x: 0, y: 0, width: undefined, height: undefined });
    const [pixelCrop, setPixelCrop] = (0, react_1.useState)(null);
    const [imageSrc, setImageSrc] = (0, react_1.useState)(null);
    const [imageRef, setImageRef] = (0, react_1.useState)(null);
    // iOSから実行される関数を用意(通知メッセージの取得)
    window.iAddNotificationList = (messagesJson) => {
        void dispatch(commonActions.addNotificationMessages({ messagesJson }));
    };
    window.iSetBadgeNumber = (badgeNumber) => {
        dispatch(commonActions.setBadgeNumber(badgeNumber));
    };
    (0, react_1.useEffect)(() => {
        const apoCd = jobAuth.user.myApoCd;
        void dispatch(commonActions.getHeaderInfo({ apoCd }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const toggleMenuModal = () => {
        if (isMenuModalActive) {
            closeMenuModal();
        }
        else {
            openMenuModal();
        }
    };
    const openMenuModal = () => {
        closeProfileModal();
        setIsMenuModalActive(true);
    };
    const closeMenuModal = () => {
        setIsMenuModalActive(false);
    };
    const onClickLink = (linkPathName, _isNewTab) => {
        if (linkPathName === pathname) {
            if (linkPathName === commonConst_1.Const.PATH_NAME.flightSearch) {
                // ポップアップが表示されていない場合のみリロードする
                if (!flightModals.modals.find((m) => m.opened) && !oalFlightMovementModal.isOpen) {
                    void dispatch((0, flightSearch_1.reloadFlightSearch)());
                }
            }
            else if (linkPathName === commonConst_1.Const.PATH_NAME.userSetting) {
                // ユーザー設定 初期化 ヘッダー取得(画面側の処理でユーザー設定情報取得)
                dispatch((0, redux_form_1.reset)("userSetting"));
                dispatch((0, userSetting_1.clearUserSetting)());
                void dispatch((0, userSetting_1.checkUserSettingFuncAuth)({ jobAuth: jobAuth.jobAuth }));
                screenTransition(linkPathName);
            }
            else if (linkPathName === commonConst_1.Const.PATH_NAME.bulletinBoard) {
                props.onClickBb();
            }
            else {
                // 何もしない
            }
        }
        else if (linkPathName) {
            screenTransition(linkPathName);
        }
        closeModals();
    };
    const onClickLinkNotification = () => {
        screenTransition(commonConst_1.Const.PATH_NAME.notification);
        // ネイティブより通知一覧を取得する
        if (storage_1.storage.terminalCat !== commonConst_1.Const.TerminalCat.pc) {
            if (window.webkit) {
                window.webkit.messageHandlers.getNotificationList.postMessage("");
            }
        }
    };
    const screenTransition = (nextPathname) => {
        const apoCd = jobAuth.user.myApoCd;
        void dispatch(commonActions.getHeaderInfo({ apoCd }));
        void dispatch(commonActions.screenTransition({ from: pathname, to: nextPathname }));
    };
    const toggleProfileModal = () => {
        if (isProfileModalActive) {
            closeProfileModal();
        }
        else {
            openProfileModal();
        }
    };
    const openProfileModal = () => {
        closeMenuModal();
        setIsProfileModalActive(true);
    };
    const closeProfileModal = () => {
        setIsProfileModalActive(false);
    };
    const onImageLoaded = (pImageRef) => {
        let newCrop;
        if (pImageRef.naturalWidth < pImageRef.naturalHeight) {
            newCrop = { x: 0, y: 0, width: 100, height: undefined, aspect: 1 };
        }
        else {
            newCrop = { x: (100 - (100 * pImageRef.naturalHeight) / pImageRef.naturalWidth) / 2, y: 0, width: undefined, height: 100, aspect: 1 };
        }
        if (newCrop) {
            setCrop(newCrop);
        }
    };
    const onCropChange = (newCrop) => {
        setCrop(newCrop);
    };
    const onCropComplete = (newCrop, newPixelCrop) => {
        setCrop(newCrop);
        setPixelCrop(newPixelCrop);
    };
    const selectProfileImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/jpeg,image/png";
        input.style.display = "none";
        input.addEventListener("change", (ev) => {
            const e = ev;
            if (e.target && e.target.files && e.target.files.length > 0) {
                // fileから以下の作り方でimageRefを作らないと、
                // orientationを含んだ画像を期待通りにcropできない。
                const img = new Image();
                img.src = URL.createObjectURL(e.target.files[0]);
                setImageRef(img);
                const mimeType = e.target.files[0].type;
                const reader = new FileReader();
                reader.onloadend = () => {
                    document.body.removeChild(input);
                    if (["image/jpeg", "image/png"].includes(mimeType)) {
                        setIsProfileModalActive(false);
                        setIsEditImageModalActive(true);
                        setImageSrc(reader.result);
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        }, false);
        document.body.appendChild(input);
        input.click();
    };
    const closeEditImageModal = () => {
        setIsEditImageModalActive(false);
    };
    const returnToProfileModal = () => {
        closeEditImageModal();
        openProfileModal();
    };
    const onImageUpdate = async () => {
        if (imageRef && pixelCrop) {
            const imageCreator = new ProfileImageCreator_1.default(imageRef, pixelCrop);
            const base64Image = await imageCreator.create(commonConst_1.Const.PROFILE_IMG_SIZE, commonConst_1.Const.PROFILE_IMG_SIZE);
            const base64ImageTmb = await imageCreator.create(commonConst_1.Const.PROFILE_TMB_IMG_SIZE, commonConst_1.Const.PROFILE_TMB_IMG_SIZE);
            const profile = {
                profile: base64Image,
                profileTmb: base64ImageTmb,
            };
            void dispatch((0, account_1.updateProfilePicture)({ profile, closeEditImageModal: returnToProfileModal }));
        }
    };
    const closeModals = () => {
        closeProfileModal();
        closeMenuModal();
    };
    const isShowNotification = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openNotificationList, jobAuth.jobAuth);
    // cropの保持する画像が、横いっぱいに広げた時に一定の高さを超える場合、つぶれないように修正しておく
    const reactCropMaxHeight = 500;
    const isVerticalPicture = imageRef && imageRef.naturalHeight != null && imageRef.naturalWidth != null
        ? imageRef.naturalHeight * (window.innerWidth / imageRef.naturalWidth) > reactCropMaxHeight
        : null;
    const isShowBb = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Row, { onClick: toggleProfileModal },
            react_1.default.createElement(UserIcon, null)),
        react_1.default.createElement(Row, null,
            react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.flightSearch, onClick: () => onClickLink(commonConst_1.Const.PATH_NAME.flightSearch, false) },
                react_1.default.createElement(PlaneIcon, null))),
        isShowBb ? (react_1.default.createElement(Row, null,
            react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.bulletinBoard, onClick: () => onClickLink(commonConst_1.Const.PATH_NAME.bulletinBoard, false) },
                react_1.default.createElement(BBIcon, null)))) : null,
        isShowNotification && (react_1.default.createElement(Row, null,
            react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.notification, onClick: onClickLinkNotification },
                react_1.default.createElement(BellIcon, null),
                common.badgeNumber > 0 && react_1.default.createElement(BellBadge, { isPc: storage_1.storage.isPc }, common.badgeNumber)))),
        react_1.default.createElement(Row, { onClick: toggleMenuModal },
            react_1.default.createElement(MenuIcon, null)),
        react_1.default.createElement(ModalWithAnimation, { isOpen: isMenuModalActive, style: customStyles, onRequestClose: closeMenuModal },
            react_1.default.createElement(MenuModal, { isShowNotification: isShowNotification },
                react_1.default.createElement(MenuListContainer, null,
                    react_1.default.createElement(MenuList_1.default, { jobAuth: jobAuth.jobAuth, onClickLink: onClickLink })))),
        react_1.default.createElement(ModalWithAnimation, { isOpen: isProfileModalActive, style: customStyles, onRequestClose: closeProfileModal },
            react_1.default.createElement(ProfileModal, { isShowNotification: isShowNotification },
                react_1.default.createElement("div", { className: "profileArea" },
                    react_1.default.createElement(Ver, null,
                        "Ver. ",
                        commonConst_1.Const.SPA_VERSION),
                    react_1.default.createElement(ProfileContainer, null,
                        react_1.default.createElement(ProfileImage, null, jobAuth.user.profileImg ? (react_1.default.createElement(ProfileImageIcon, { src: `data:image/png;base64,${jobAuth.user.profileImg}` })) : (react_1.default.createElement(ProfileDefaultUserIcon, null))),
                        react_1.default.createElement(ProfileTable, null,
                            react_1.default.createElement("tbody", null,
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("td", null, "Name"),
                                    react_1.default.createElement("td", null,
                                        jobAuth.user.firstName,
                                        "\u00A0",
                                        jobAuth.user.familyName)),
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("td", null, "User ID"),
                                    react_1.default.createElement("td", null, jobAuth.user.userId)),
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("td", null, "Group"),
                                    react_1.default.createElement("td", null, jobAuth.user.grpCd)),
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("td", null, "Job Code"),
                                    react_1.default.createElement("td", null, jobAuth.user.jobCd))))),
                    react_1.default.createElement(ProfileButtonsContainer, null,
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Change", onClick: selectProfileImage }),
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Logout", onClick: () => {
                                void dispatch(commonActions.logout());
                            } }))))),
        react_1.default.createElement(ModalWithAnimation, { isOpen: isEditImageModalActive, style: customImageModalStyles, onRequestClose: returnToProfileModal },
            react_1.default.createElement(EditImageModal, null,
                imageSrc && (react_1.default.createElement(ReactCropCustom, { src: imageSrc || "", onImageLoaded: onImageLoaded, onChange: onCropChange, onComplete: onCropComplete, crop: crop, style: {
                        maxHeight: `${reactCropMaxHeight}px`,
                        width: isVerticalPicture ? "auto" : "100%",
                        height: isVerticalPicture ? "100%" : "auto",
                    }, imageStyle: {
                        width: isVerticalPicture ? "auto" : "100%",
                        height: isVerticalPicture ? "100%" : "auto",
                    }, keepSelection: true })),
                react_1.default.createElement(EditImageButtons, null,
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Update", onClick: () => {
                            void onImageUpdate();
                        } }),
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Cancel", onClick: returnToProfileModal }))))));
};
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 960000000 /* reapopの3つ下、フッターの2つ下 */,
    },
    content: {
        padding: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        border: "none",
        pointerEvents: "none",
    },
};
const customImageModalStyles = {
    ...customStyles,
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
};
const Wrapper = styled_components_1.default.div `
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 14px;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.color.PRIMARY};
  background: ${(props) => props.theme.color.WHITE};
  height: ${(props) => props.theme.layout.footer.mobile};
  z-index: 970000000; /* reapop(999999999)の2つ下 */
`;
const Row = styled_components_1.default.div `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  a {
    color: #346181;
  }
`;
const BellBadge = styled_components_1.default.div `
  position: absolute;
  top: -12px;
  right: 19px;
  background: #c80019;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 13px;
  ${({ isPc }) => (isPc ? "" : "font-weight: bold;")}
`;
const ModalWithAnimation = (0, styled_components_1.default)(react_modal_1.default) `
  opacity: 0;
  position: absolute;
  top: -100px;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: 0;
    transition: all 300ms;
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    transition: opacity 300ms;
  }
`;
const ModalContainer = styled_components_1.default.div `
  position: absolute;
  bottom: 68px;
  left: 2px;
  width: 371px;
  border-radius: 10px;
  background: ${(props) => props.theme.color.WHITE};
  transform-style: preserve-3d;
  pointer-events: auto;
  -webkit-overflow-scrolling: touch;

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -8px;
    transform: translateX(-50%) rotate(45deg) skew(10deg, 10deg) translateZ(-1px);
  }
  &::after {
    background: linear-gradient(-45deg, #fff 51%, transparent 51%);
    transform: translateX(-50%) rotate(45deg) skew(10deg, 10deg) translateZ(1px);
  }
`;
const MenuModal = (0, styled_components_1.default)(ModalContainer) `
  &::before,
  &::after {
    right: ${(props) => (props.isShowNotification ? "38px" : "54px")};
  }
`;
const MenuListContainer = styled_components_1.default.div `
  height: 380px;
  padding: 15px;
  overflow: scroll;
  border-radius: 10px;
  ul:first-child {
    padding: 0 0 5px 6px;
    li {
      margin: 7px;
      &:nth-child(-n + 3) {
        margin-top: 0;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:nth-child(3n + 1),
      &:first-child {
        margin-left: 0;
      }

      a {
        width: 100px;
      }
    }
  }
  ul:last-child {
    padding: 5px 0 0 6px;
    background: #fff;
    li {
      margin: 7px;
      width: 100px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:nth-child(3n + 1),
      &:first-child {
        margin-left: 0;
      }
      a {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border-radius: 6px;
        > div:last-child {
          width: 100px;
        }
      }
    }
  }
`;
const ProfileModal = (0, styled_components_1.default)(ModalContainer) `
  &::before,
  &::after {
    left: ${(props) => (props.isShowNotification ? "56px" : "70px")};
  }

  > div.profileArea {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 18px 16px 21px 16px;
  }
`;
const Ver = styled_components_1.default.div `
  text-align: end;
`;
const ProfileContainer = styled_components_1.default.div `
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;
const ProfileImage = styled_components_1.default.div `
  width: 60px;
  height: 60px;
  min-width: 60px;
  margin-right: 12px;
  border-radius: 50%;
  border: 1px solid #c9d3d0;
  display: flex;
  justify-content: space-between;
`;
const ProfileImageIcon = styled_components_1.default.img `
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
const ProfileTable = styled_components_1.default.table `
  line-height: 20px;
  td:first-child {
    padding-right: 5px;
    font-size: 12px;
    color: #2fadbd;
    min-width: 80px;
  }
`;
const ProfileButtonsContainer = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  button {
    width: 103px;
    margin: 0px 0px 0px 50px;
  }
  button:last-child {
    margin: 0px 50px 0px 0px;
  }
`;
const EditImageModal = (0, styled_components_1.default)(ModalContainer) `
  top: ${(props) => props.theme.layout.header.statusBar};
  left: 0;
  border-radius: 0;
  width: 100%;
  height: calc(100% - ${(props) => props.theme.layout.header.statusBar});
  text-align: center;
  &::before,
  &::after {
    display: none;
  }
`;
const EditImageButtons = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 26px auto;
  button {
    width: 100px;
  }
`;
const ProfileDefaultUserIcon = styled_components_1.default.img.attrs({ src: profile_svg_1.default }) `
  height: 60px;
  width: 60px;
  margin-left: -1px;
  margin-top: -1px;
`;
const ReactCropCustom = (0, styled_components_1.default)(react_image_crop_1.default) `
  margin-top: 10px;
  .ReactCrop__drag-handle {
    height: 40px;
    width: 40px;
  }
  .ReactCrop__drag-handle.ord-nw {
    margin-top: -20px;
    margin-left: -20px;
  }
  .ReactCrop__drag-handle.ord-ne {
    margin-top: -20px;
    margin-right: -20px;
  }
  .ReactCrop__drag-handle.ord-sw {
    margin-bottom: -20px;
    margin-left: -20px;
  }
  .ReactCrop__drag-handle.ord-se {
    margin-bottom: -20px;
    margin-right: -20px;
  }
`;
const UserIcon = styled_components_1.default.img.attrs({ src: icon_user_skeleton_svg_1.default }) `
  height: 28px;
  width: 28px;
  vertical-align: bottom;
`;
const PlaneIcon = styled_components_1.default.img.attrs({ src: icon_plane_skeleton_svg_1.default }) `
  height: 32px;
  width: 32px;
  vertical-align: bottom;
`;
const BellIcon = styled_components_1.default.img.attrs({ src: icon_bell_skeleton_svg_1.default }) `
  height: 32px;
  width: 32px;
  vertical-align: bottom;
`;
const MenuIcon = styled_components_1.default.img.attrs({ src: icon_menu_svg_1.default }) `
  height: 36px;
  width: 36px;
  vertical-align: bottom;
`;
const BBIcon = styled_components_1.default.img.attrs({ src: icon_bb_svg_1.default }) `
  height: 36px;
  width: 36px;
  vertical-align: bottom;
`;
exports.default = SPCommonFooter;
//# sourceMappingURL=SPCommonFooter.js.map