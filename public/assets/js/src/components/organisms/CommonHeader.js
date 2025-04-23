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
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_modal_1 = __importDefault(require("react-modal"));
const redux_form_1 = require("redux-form");
const react_router_dom_1 = require("react-router-dom");
const react_image_crop_1 = __importDefault(require("react-image-crop"));
const styled_components_1 = __importStar(require("styled-components"));
const react_scrollbar_size_1 = __importDefault(require("react-scrollbar-size"));
const hooks_1 = require("../../store/hooks");
const layoutStyle_1 = __importDefault(require("../../styles/layoutStyle"));
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const validates = __importStar(require("../../lib/validators"));
const commonActions = __importStar(require("../../reducers/common"));
const fis_1 = require("../../reducers/fis");
const account_1 = require("../../reducers/account");
const barChartSearch_1 = require("../../reducers/barChartSearch");
const spotNumber_1 = require("../../reducers/spotNumber");
const storageOfUser_1 = require("../../reducers/storageOfUser");
const RoundButtonReload_1 = __importDefault(require("../atoms/RoundButtonReload"));
const Toggle_1 = __importDefault(require("../atoms/Toggle"));
const RadioButton_1 = require("../atoms/RadioButton");
const MenuList_1 = __importDefault(require("../molecules/MenuList"));
const bell_svg_1 = __importDefault(require("../../assets/images/icon/bell.svg"));
const menu_svg_1 = __importDefault(require("../../assets/images/icon/menu.svg"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const SelectBox_1 = __importDefault(require("../atoms/SelectBox"));
const SuggestSelectBox_1 = __importDefault(require("../atoms/SuggestSelectBox"));
const AirportIssueList_1 = __importDefault(require("../molecules/AirportIssueList"));
const UpdateRmksPopup_1 = __importDefault(require("../molecules/UpdateRmksPopup"));
const ProfileImageCreator_1 = __importDefault(require("../../lib/ProfileImageCreator"));
const MovableAirportIcons_1 = __importDefault(require("../molecules/MovableAirportIcons"));
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const mySchedule_1 = require("../../reducers/mySchedule");
const icon_fis_select_target_popup_svg_1 = __importDefault(require("../../assets/images/icon/icon-fis-select-target-popup.svg"));
const icon_fis_select_target_popup_dark_svg_1 = __importDefault(require("../../assets/images/icon/icon-fis-select-target-popup-dark.svg"));
const profile_svg_1 = __importDefault(require("../../assets/images/account/profile.svg"));
const icon_mode_light_svg_1 = __importDefault(require("../../assets/images/icon/icon-mode-light.svg"));
const icon_mode_dark_svg_1 = __importDefault(require("../../assets/images/icon/icon-mode-dark.svg"));
const CommonHeader = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { pathname } = (0, react_router_dom_1.useLocation)();
    const history = (0, react_router_dom_1.useHistory)();
    const refLeft = (0, react_1.useRef)(null);
    const refRight = (0, react_1.useRef)(null);
    const refAptRmks = (0, react_1.useRef)(null);
    const scrollbarWidth = (0, react_scrollbar_size_1.default)().width;
    const isSelectApoMode = pathname === commonConst_1.Const.PATH_NAME.fis || pathname === commonConst_1.Const.PATH_NAME.barChart;
    const isFixedApoMode2 = pathname === commonConst_1.Const.PATH_NAME.mySchedule;
    // 表示アイコン数を取得する
    const getNumberOfDisplayIcons = () => {
        let numberOfDisplayIcons = 3;
        if (storage_1.storage.isPc) {
            if (isSelectApoMode) {
                numberOfDisplayIcons = 4;
            }
            else {
                numberOfDisplayIcons = 6;
            }
        }
        return numberOfDisplayIcons;
    };
    const { isDarkMode } = props;
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const zoomFis = (0, hooks_1.useAppSelector)((state) => state.account.zoomFis);
    const zoomBarChart = (0, hooks_1.useAppSelector)((state) => state.account.zoomBarChart);
    const fis = (0, hooks_1.useAppSelector)((state) => state.fis);
    const isFetching = (0, hooks_1.useAppSelector)((state) => state.fis.isFetching || state.flightSearch.isFetching || state.issueSecurity.isFetching || state.userSetting.isFetching);
    const allForm = (0, hooks_1.useAppSelector)((state) => state.form);
    const spotNumber = (0, hooks_1.useAppSelector)((state) => state.spotNumber);
    const barChart = (0, hooks_1.useAppSelector)((state) => state.barChart);
    const { isAutoReload, isSelfScroll } = fis.headerSettings;
    const [isAirportModalActive, setIsAirportModalActive] = (0, react_1.useState)(false);
    const [isIssueListActive, setIsIssueListActive] = (0, react_1.useState)(false);
    const [isProfileModalActive, setIsProfileModalActive] = (0, react_1.useState)(false);
    const [isEditImageModalActive, setIsEditImageModalActive] = (0, react_1.useState)(false);
    const [crop, setCrop] = (0, react_1.useState)({ x: 0, y: 0, width: undefined, height: undefined });
    const [pixelCrop, setPixelCrop] = (0, react_1.useState)(null);
    const [imageSrc, setImageSrc] = (0, react_1.useState)(null);
    const [imageRef, setImageRef] = (0, react_1.useState)(null);
    const [dateMonthOptions, setDateMonthOptions] = (0, react_1.useState)([]);
    const [numberOfDisplayIcons, setNumberOfDisplayIcons] = (0, react_1.useState)(getNumberOfDisplayIcons());
    const [rmksPopupIsOpen, setRmksPopupIsOpen] = (0, react_1.useState)(false);
    const [rmksPopupWidth, setRmksPopupWidth] = (0, react_1.useState)(0);
    const [rmksPopupHeight, setRmksPopupHeight] = (0, react_1.useState)(0);
    const [rmksPopupTop, setRmksPopupTop] = (0, react_1.useState)(0);
    const [rmksPopupLeft, setRmksPopupLeft] = (0, react_1.useState)(0);
    const [disabledApoCd, setDisabledApoCd] = (0, react_1.useState)(false);
    const fileInput = (0, react_1.useRef)(document.createElement("input")); // selectProfileImage()から抜けても保持できるようにここで宣言
    const isSearchedToday = (0, react_1.useRef)(true);
    const isTodaySearched = (0, react_1.useRef)(true);
    const timer = (0, react_1.useRef)(null);
    const windowSize = (0, hooks_1.useWindowSize)();
    // iOSから実行される関数を用意(通知メッセージの取得)
    window.iAddNotificationList = (messagesJson) => {
        void dispatch(commonActions.addNotificationMessages({ messagesJson }));
    };
    window.iSetBadgeNumber = (badgeNumber) => {
        dispatch(commonActions.setBadgeNumber(badgeNumber));
    };
    // ウィンドウの幅が変えられたら表示アイコンを変更する
    window.addEventListener("resize", () => {
        setNumberOfDisplayIcons(getNumberOfDisplayIcons());
    });
    (0, react_1.useEffect)(() => {
        void dispatch(commonActions.getHeaderInfo({ apoCd: jobAuth.user.myApoCd }));
    }, [dispatch, jobAuth.user.myApoCd]);
    (0, react_1.useEffect)(() => {
        if (common.isForceGoToError) {
            dispatch(commonActions.screenTransitionError());
            history.push(commonConst_1.Const.PATH_NAME.error);
        }
    }, [common.isForceGoToError, dispatch, history]);
    // 強制画面遷移
    (0, react_1.useEffect)(() => {
        if (common.forceGoToPath) {
            void dispatch(commonActions.screenTransition({ from: pathname, to: common.forceGoToPath }));
            history.push(common.forceGoToPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [common.forceGoToPath, dispatch, history]);
    (0, react_1.useEffect)(() => {
        if (isAutoReload) {
            // 自動更新開始
            if (timer && timer.current) {
                clearInterval(timer.current);
            }
            timer.current = setInterval(() => {
                // CNLアイコンを24時間だけ更新するための処理
                dispatch(commonActions.updateHeaderInfoTerminalUtcDate());
            }, 60000);
        }
        else if (timer && timer.current && !isAutoReload) {
            // 自動更新終了
            clearInterval(timer.current);
        }
    }, [dispatch, isAutoReload]);
    // 画面サイズが変わったときに空港リマークスの幅が再計算されるように
    (0, react_1.useEffect)(() => { }, [windowSize]);
    // バーチャートで空港が変更された場合、SPOTフィルタを設定する
    (0, react_1.useEffect)(() => {
        if (pathname === commonConst_1.Const.PATH_NAME.barChart) {
            dispatch((0, storageOfUser_1.getHiddenSpotNoList)({ apoCd: common.headerInfo.apoCd }));
        }
    }, [jobAuth.user.userId, common.headerInfo.apoCd, pathname, dispatch]);
    const isOpenAirportModal = () => {
        // SpotChangeModeの場合、ApoCdはDisabled
        if (barChart && barChart.isSpotChangeMode) {
            setDisabledApoCd(true);
        }
        else {
            setDisabledApoCd(false);
        }
        // Spot Change Modeでバーが選択されている場合
        // 地上作業バーチャートSpot Change Mode でバー選択済みの場合、Modalを開くかメッセージ表示
        if (spotNumber && spotNumber.spotNoRows.length > 0) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => {
                        dispatch((0, spotNumber_1.closeSpotNumberAll)());
                        openAirportModal();
                    },
                }),
            });
        }
        else {
            openAirportModal();
        }
    };
    const openAirportModal = () => {
        if (isSelectApoMode) {
            // 日付プルダウンのオプションを生成
            let start = (0, dayjs_1.default)().add(3, "days");
            const options = [
                { label: "Today", value: "" },
                { label: "---", value: "---", isDisabled: true },
            ];
            for (let i = 0; i < 10; i++) {
                options.push({ label: start.format("DDMMM").toUpperCase(), value: start.format("YYYY-MM-DD") });
                start = start.add(-1, "days");
            }
            // 日を跨いだ時など選択できる項目がない場合はTodayにする
            let isDayChanged = false;
            if (props.selectTargetDate) {
                if (!options.some((day) => day.value === (0, dayjs_1.default)(props.selectTargetDate).format("YYYY-MM-DD"))) {
                    isDayChanged = true;
                }
            }
            props.change("selectApoCd", common.headerInfo.apoCd);
            props.change("selectTargetDate", isSearchedToday.current || isDayChanged ? "" : common.headerInfo.targetDate);
            setIsAirportModalActive(true);
            setDateMonthOptions(options);
        }
    };
    const closeAirportModal = () => {
        void dispatch(commonActions.removeAllNotification());
        setIsAirportModalActive(false);
    };
    const handleAirport = (selectApoParams) => {
        const { selectApoCd, selectTargetDate } = selectApoParams;
        isSearchedToday.current = !selectTargetDate;
        const nowApoCd = common.headerInfo.apoCd; // 現在の空港コード
        const nowTargetDate = isTodaySearched.current ? "" : common.headerInfo.targetDate; // 現在の選択日付
        if (isAutoReload) {
            void dispatch((0, fis_1.getFisHeaderInfoAuto)({ apoCd: selectApoCd, isAddingAuto: false }));
        }
        else {
            void dispatch((0, fis_1.getFisHeaderInfo)({
                apoCd: selectApoCd,
                targetDate: selectTargetDate,
                isToday: isSearchedToday.current,
                beforeApoCd: nowApoCd,
                beforeTargetDate: nowTargetDate,
                isReload: false,
            }));
        }
        if (pathname === commonConst_1.Const.PATH_NAME.barChart) {
            dispatch((0, barChartSearch_1.clearSearchBarChart)()); // バーチャートの検索をクリアする
        }
        isTodaySearched.current = !selectTargetDate;
        setIsAirportModalActive(false);
    };
    const openIssueListModal = () => {
        setIsIssueListActive(true);
    };
    const closeIssueListModal = () => {
        setIsIssueListActive(false);
    };
    const onClickLink = (linkPathname, isNewTab) => {
        if (pathname === linkPathname) {
            // 何もしない
        }
        else if (linkPathname && !isNewTab) {
            Object.keys(allForm).forEach((formKey) => {
                dispatch((0, redux_form_1.reset)(formKey));
            });
            const apoCd = jobAuth.user.myApoCd;
            dispatch(commonActions.fetchHeaderInfoClear());
            void dispatch(commonActions.getHeaderInfo({ apoCd }));
            void dispatch(commonActions.screenTransition({ from: pathname, to: linkPathname }));
            // バーチャートが開かれた場合、所属空港で、SPOTフィルタを設定する
            if (linkPathname === commonConst_1.Const.PATH_NAME.barChart) {
                dispatch((0, storageOfUser_1.getHiddenSpotNoList)({ apoCd }));
            }
        }
        dispatch(commonActions.hideMenuModal());
    };
    const onClickLinkNotification = () => {
        Object.keys(allForm).forEach((formKey) => {
            dispatch((0, redux_form_1.reset)(formKey));
        });
        const apoCd = jobAuth.user.myApoCd;
        dispatch(commonActions.fetchHeaderInfoClear());
        void dispatch(commonActions.getHeaderInfo({ apoCd }));
        void dispatch(commonActions.screenTransition({ from: pathname, to: commonConst_1.Const.PATH_NAME.notification }));
        // ネイティブより通知一覧を取得する
        if (!storage_1.storage.isPc && window.webkit) {
            window.webkit.messageHandlers.getNotificationList.postMessage("");
        }
    };
    const openProfileModal = () => {
        setIsProfileModalActive(true);
    };
    const closeProfileModal = () => {
        setIsProfileModalActive(false);
        setPixelCrop(null);
        setImageSrc(null);
        setImageRef(null);
    };
    const onImageLoaded = (_imageRef) => {
        let newCrop;
        if (_imageRef.naturalWidth < _imageRef.naturalHeight) {
            newCrop = { x: 0, y: 0, width: 100, height: undefined, aspect: 1 };
        }
        else {
            newCrop = { x: (100 - (100 * _imageRef.naturalHeight) / _imageRef.naturalWidth) / 2, y: 0, width: undefined, height: 100, aspect: 1 };
        }
        if (newCrop) {
            setCrop(newCrop);
        }
        if (_imageRef.parentElement) {
            _imageRef.parentElement.addEventListener("contextmenu", (ev) => ev.preventDefault());
        }
    };
    const onCropChange = (newCrop) => {
        setCrop(newCrop);
    };
    const onCropComplete = (newCrop, newPixelCrop) => {
        setCrop(newCrop);
        setPixelCrop(newPixelCrop);
    };
    const fileInputChangeHandler = (0, react_1.useCallback)((ev) => {
        void (async () => {
            const e = ev;
            const isCroppableMimeType = (file) => ["image/jpeg", "image/png"].includes(file.type);
            if (e.target && e.target.files && e.target.files.length > 0) {
                const targetFile = e.target.files[0];
                if (isCroppableMimeType(targetFile) && !(await validates.isOkImageFileFormat(targetFile))) {
                    fileInput.current.value = "";
                    void dispatch(commonActions.showIllegalFileFormatError());
                    return;
                }
                // fileから以下の作り方でimageRefを作らないと、
                // orientationを含んだ画像を期待通りにcropできない。
                const img = new Image();
                img.src = URL.createObjectURL(targetFile);
                setImageRef(img);
                const reader = new FileReader();
                reader.onloadend = () => {
                    // 画像選択時には常にこの関数を呼び出せるよう、File Chooserの内容を削除
                    fileInput.current.value = "";
                    if (isCroppableMimeType(targetFile)) {
                        setIsProfileModalActive(false);
                        setIsEditImageModalActive(true);
                        setImageSrc(reader.result);
                    }
                };
                reader.readAsDataURL(targetFile);
            }
        })();
    }, [dispatch]);
    const selectProfileImage = () => {
        fileInput.current.type = "file";
        fileInput.current.accept = "image/jpeg,image/png";
        fileInput.current.removeEventListener("change", fileInputChangeHandler);
        fileInput.current.addEventListener("change", fileInputChangeHandler);
        fileInput.current.click();
    };
    const closeEditImageModal = () => {
        if (imageRef)
            URL.revokeObjectURL(imageRef.src);
        setIsEditImageModalActive(false);
    };
    const returnToProfileModal = () => {
        closeEditImageModal();
        openProfileModal();
    };
    const onImageUpdate = async () => {
        if (imageRef && pixelCrop && pixelCrop.width > 0 && pixelCrop.height > 0) {
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
    const showMenuModal = () => {
        dispatch(commonActions.showMenuModal());
    };
    const handleOpenRmksPopup = async () => {
        const { apoCd } = common.headerInfo;
        const openRmksPopup = () => {
            if (refAptRmks.current) {
                setRmksPopupIsOpen(true);
                setRmksPopupWidth(refAptRmks.current.clientWidth);
                setRmksPopupHeight(refAptRmks.current.clientHeight);
                setRmksPopupTop(refAptRmks.current.getBoundingClientRect().top);
                setRmksPopupLeft(refAptRmks.current.getBoundingClientRect().left);
            }
        };
        const closeRmksPopup = () => {
            setRmksPopupIsOpen(false);
        };
        await dispatch(commonActions.getHeaderInfo({ apoCd, openRmksPopup, closeRmksPopup }));
    };
    const isRmksEnabled = () => !!jobAuth.user.myApoCd &&
        jobAuth.user.myApoCd === common.headerInfo.apoCd &&
        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateAireportRemarks, jobAuth.jobAuth);
    const handlCloseRmksPopup = (rmksText) => {
        if (common.headerInfo.apoRmksInfo === rmksText) {
            setRmksPopupIsOpen(false);
        }
        else {
            void dispatch(commonActions.showConfirmation({ onClickYes: () => setRmksPopupIsOpen(false) }));
        }
    };
    const handleUpdateRmks = (text) => {
        if (text === common.headerInfo.apoRmksInfo) {
            void dispatch(commonActions.showNotificationAirportRmksNoChange());
        }
        else {
            void dispatch(commonActions.updateAirportRemarks({
                apoCd: jobAuth.user.myApoCd,
                apoRmksInfo: text,
                closeAirportRemarksPopup: () => setRmksPopupIsOpen(false),
            }));
        }
    };
    const handleReload = () => {
        const { apoCd, targetDate, isToday } = common.headerInfo;
        if (isSelectApoMode) {
            if (!isAutoReload) {
                void dispatch((0, fis_1.getFisHeaderInfo)({
                    apoCd,
                    targetDate,
                    isToday,
                    beforeApoCd: apoCd,
                    beforeTargetDate: targetDate,
                    isReload: true,
                }));
            }
            // // PUSHテスト用
            // const { getFisRowsFromPush, fis } = this.props;
            // getFisRowsFromPush(fis._getCount);
        }
        else if (pathname === commonConst_1.Const.PATH_NAME.mySchedule) {
            void dispatch((0, mySchedule_1.getMyScheduleInfo)());
        }
    };
    const handleDisplayModeChange = (checked) => {
        if (checked) {
            dispatch((0, account_1.setDisplayMode)({ displayMode: "darkMode" }));
        }
        else {
            dispatch((0, account_1.setDisplayMode)({ displayMode: "lightMode" }));
        }
    };
    const handleZoomChange = (e) => {
        const zoom = Number(e.target.value);
        if (pathname === commonConst_1.Const.PATH_NAME.fis) {
            dispatch((0, account_1.setZoomFis)({ zoom }));
        }
        else {
            dispatch((0, account_1.setZoomBarChart)({ zoom }));
        }
    };
    const { apoCd, usingRwy, issu, terminalUtcDate, curfewTimeStartLcl, curfewTimeEndLcl, apoRmksInfo } = common.headerInfo;
    const ldRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "LD").slice(0, 2) : [];
    const toRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "TO").slice(0, 2) : [];
    const { apoTimeLcl, apoTimeDiffUtc } = common.headerInfo;
    const { timeLcl, timeDiffUtc } = fis;
    const isShowNotification = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openNotificationList, jobAuth.jobAuth);
    const { isPc } = storage_1.storage;
    const hasAirport = !!apoCd;
    const hTimeLcl = apoTimeLcl < timeLcl ? timeLcl : apoTimeLcl;
    const hTimeDiffUtc = apoTimeLcl < timeLcl ? timeDiffUtc : apoTimeDiffUtc;
    const parsedTimeLcl = (0, commonUtil_1.parseTimeLcl)({ timeLcl: hTimeLcl, timeDiffUtc: hTimeDiffUtc, isLocal: hasAirport });
    const rmksStartPos = refLeft.current ? refLeft.current.offsetLeft + refLeft.current.clientWidth + 8 : null;
    const rmksEndPos = refRight.current ? refRight.current.offsetLeft : null;
    const leftWidth = refLeft.current ? refLeft.current.clientWidth : null;
    const rightWidth = refRight.current ? refRight.current.clientWidth : null;
    const isFis = pathname === commonConst_1.Const.PATH_NAME.fis;
    const zoomScale = isFis ? zoomFis : zoomBarChart;
    return (react_1.default.createElement(Wrapper, { isPc: isPc, scrollbarSize: scrollbarWidth, isSelectApoMode: isSelectApoMode, leftWidth: leftWidth, rightWidth: rightWidth },
        react_1.default.createElement(MainContent, { isPc: isPc },
            react_1.default.createElement(Left, { ref: refLeft, isPc: isPc },
                react_1.default.createElement(RowAirport, { isPc: isPc },
                    react_1.default.createElement(AirportSelect, { onClick: isOpenAirportModal, isPc: isPc }, apoCd),
                    isSelectApoMode && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(DateMonthSelect, { onClick: isOpenAirportModal }, !isAutoReload &&
                            (!isFetching || common.headerInfo.targetDate) &&
                            ((0, dayjs_1.default)(common.headerInfo.targetDate).isValid()
                                ? (0, dayjs_1.default)(common.headerInfo.targetDate).format("DDMMM").toUpperCase()
                                : (0, dayjs_1.default)().format("DDMMM").toUpperCase())),
                        isDarkMode ? react_1.default.createElement(SelectAirPortIconDark, { onClick: isOpenAirportModal }) : react_1.default.createElement(SelectAirPortIcon, { onClick: isOpenAirportModal }))),
                    hasAirport && (react_1.default.createElement(RowRwy, null,
                        react_1.default.createElement(Rwy, null,
                            react_1.default.createElement("div", null,
                                "L/D ",
                                react_1.default.createElement("span", null, "RWY")),
                            react_1.default.createElement(RwyNo, null, ldRwys.map((ldRwy) => (react_1.default.createElement("span", { key: ldRwy.rwyNo }, ldRwy.rwyNo))))),
                        react_1.default.createElement(Rwy, null,
                            react_1.default.createElement("div", null,
                                "T/O ",
                                react_1.default.createElement("span", null, "RWY")),
                            react_1.default.createElement(RwyNo, null, toRwys.map((toRwy) => (react_1.default.createElement("span", { key: toRwy.rwyNo }, toRwy.rwyNo))))),
                        !isFixedApoMode2 &&
                            (curfewTimeStartLcl && curfewTimeEndLcl ? (react_1.default.createElement(Rwy, null,
                                react_1.default.createElement("div", null,
                                    "Curfew ",
                                    react_1.default.createElement("span", null, "(L)")),
                                react_1.default.createElement(RwyNo, null,
                                    react_1.default.createElement("span", null, (curfewTimeStartLcl.match(/.{2}/g) || []).join(":")),
                                    react_1.default.createElement("span", null, "-"),
                                    react_1.default.createElement("span", null, (curfewTimeEndLcl.match(/.{2}/g) || []).join(":"))))) : null)))),
                hasAirport && (react_1.default.createElement(RowIssueIcons, { isPc: isPc },
                    react_1.default.createElement(MovableAirportIcons_1.default, { onClick: openIssueListModal, issus: issu, terminalUtcDate: common.headerInfo.terminalUtcDate, numberOfDisplay: numberOfDisplayIcons })))),
            isPc && (isSelectApoMode || isFixedApoMode2) && hasAirport && (react_1.default.createElement(AptRmks, { isEmpty: !apoRmksInfo, startPos: rmksStartPos, endPos: rmksEndPos },
                react_1.default.createElement(AptRmksContainer, { ref: refAptRmks, onClick: () => {
                        void handleOpenRmksPopup();
                    }, isEmpty: !apoRmksInfo },
                    react_1.default.createElement("div", null, apoRmksInfo || "Airport Remarks")))),
            react_1.default.createElement(Right, { ref: refRight, isPc: isPc },
                isPc && (isSelectApoMode || isFixedApoMode2) && hasAirport && (react_1.default.createElement(react_1.default.Fragment, null,
                    isSelectApoMode &&
                        (0, commonUtil_1.funcAuthCheck)(pathname === commonConst_1.Const.PATH_NAME.fis ? commonConst_1.Const.FUNC_ID.updateFisAuto : commonConst_1.Const.FUNC_ID.updateBarChartAuto, jobAuth.jobAuth) && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(ToggleSwitch, { isPc: storage_1.storage.isPc, disabled: false },
                            react_1.default.createElement("div", null, "Auto"),
                            react_1.default.createElement(Toggle_1.default, { tabIndex: -1, isDarkMode: isDarkMode, smallSize: true, checked: isAutoReload, onChange: (checked) => {
                                    if (checked) {
                                        void dispatch((0, fis_1.getFisHeaderInfoAuto)({ apoCd: common.headerInfo.apoCd, isAddingAuto: true }));
                                    }
                                    else {
                                        void dispatch((0, fis_1.mqttDisconnect)());
                                    }
                                } })),
                        react_1.default.createElement(ToggleSwitch, { isPc: storage_1.storage.isPc, disabled: !isAutoReload },
                            react_1.default.createElement("div", null, "Self Scroll"),
                            react_1.default.createElement(Toggle_1.default, { tabIndex: -1, isDarkMode: isDarkMode, smallSize: true, checked: isSelfScroll, disabled: !isAutoReload, onChange: (checked) => dispatch((0, fis_1.setSelfScroll)({ isSelfScroll: checked })) })))),
                    parsedTimeLcl.date && (react_1.default.createElement(TimeLcl, { isPc: storage_1.storage.isPc },
                        isSelectApoMode && react_1.default.createElement("span", null, apoCd),
                        react_1.default.createElement("span", null, parsedTimeLcl.date),
                        react_1.default.createElement("span", null, parsedTimeLcl.time))),
                    react_1.default.createElement(ModalReloadButtonContainer, { isPc: storage_1.storage.isPc },
                        react_1.default.createElement(RoundButtonReload_1.default, { tabIndex: 10, isFetching: false, disabled: isAutoReload, onClick: handleReload })))),
                react_1.default.createElement(MenuIconContainer, { isPc: isPc, onClick: showMenuModal },
                    react_1.default.createElement(MenuIcon, null)),
                isShowNotification && (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.notification, onClick: onClickLinkNotification },
                    react_1.default.createElement(BellIcon, null),
                    common.badgeNumber > 0 && react_1.default.createElement(BellBadge, { isPc: isPc }, common.badgeNumber))),
                react_1.default.createElement(ProfileImg, { onClick: openProfileModal, src: jobAuth.user.profileImg ? `data:image/png;base64,${jobAuth.user.profileImg}` : profile_svg_1.default, isPc: isPc }))),
        (pathname === commonConst_1.Const.PATH_NAME.home ||
            pathname === commonConst_1.Const.PATH_NAME.userSetting ||
            pathname === commonConst_1.Const.PATH_NAME.flightSearch ||
            pathname === commonConst_1.Const.PATH_NAME.help ||
            pathname === commonConst_1.Const.PATH_NAME.myPage ||
            pathname === commonConst_1.Const.PATH_NAME.notification ||
            pathname === commonConst_1.Const.PATH_NAME.issueSecurity ||
            pathname === commonConst_1.Const.PATH_NAME.oalFlightSchedule) && (react_1.default.createElement(UpdatedTime, null,
            react_1.default.createElement("span", null, parsedTimeLcl.date),
            react_1.default.createElement("span", null, parsedTimeLcl.time))),
        react_1.default.createElement(react_modal_1.default, { isOpen: isAirportModalActive, onRequestClose: closeAirportModal, style: customAirportModalStyles },
            react_1.default.createElement(AirportModalForm, { onSubmit: props.handleSubmit(handleAirport) },
                react_1.default.createElement(AirportModalFormLabel, null, "Airport"),
                react_1.default.createElement(AirportModalFormLabel, null, "Date"),
                react_1.default.createElement(redux_form_1.Field, { name: "selectApoCd", component: SuggestSelectBox_1.default, tabIndex: 0, placeholder: "APO", onSelect: () => props.change("selectTargetDate", ""), options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 115, maxLength: 3, maxMenuHeight: 408, validate: [validates.requiredApo, validates.halfWidthApoCd], autoFocus: !disabledApoCd, isShadowOnFocus: true, disabled: disabledApoCd }),
                react_1.default.createElement(redux_form_1.Field, { name: "selectTargetDate", component: SelectBox_1.default, tabIndex: 0, options: dateMonthOptions, disabled: isAutoReload, width: 115, maxMenuHeight: 408, autoFocus: disabledApoCd, isShadowOnFocus: true }),
                react_1.default.createElement("div", { className: "submitContainer" },
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 }))),
            isPc && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(AirportModalDivision, null),
                isFis && (react_1.default.createElement(AirportModalDisplay, null,
                    react_1.default.createElement("div", null, "Display mode"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(ModeLightIcon, null),
                        react_1.default.createElement(Toggle_1.default, { tabIndex: 0, isDarkMode: isDarkMode, smallSize: true, checked: isDarkMode, onChange: handleDisplayModeChange }),
                        react_1.default.createElement(ModeDarkIcon, null)))),
                react_1.default.createElement(AirportModalZoom, null,
                    react_1.default.createElement("div", null, "Zoom-out"),
                    react_1.default.createElement(AirportModalZoomRadio, null,
                        react_1.default.createElement("div", { className: "radioContainer" },
                            react_1.default.createElement(RadioButton_1.RadioButtonStyled, { isShadowOnFocus: true, name: "zoomScale", id: "zoomScale100", tabIndex: 0, type: "radio", value: "100", onChange: handleZoomChange, checked: zoomScale === 100 }),
                            react_1.default.createElement("label", { htmlFor: "zoomScale100" }, "100%")),
                        react_1.default.createElement("div", { className: "radioContainer" },
                            react_1.default.createElement(RadioButton_1.RadioButtonStyled, { isShadowOnFocus: true, name: "zoomScale", id: "zoomScale90", tabIndex: 0, type: "radio", value: "90", onChange: handleZoomChange, checked: zoomScale === 90 }),
                            react_1.default.createElement("label", { htmlFor: "zoomScale90" }, "90%")),
                        react_1.default.createElement("div", { className: "radioContainer" },
                            react_1.default.createElement(RadioButton_1.RadioButtonStyled, { isShadowOnFocus: true, name: "zoomScale", id: "zoomScale80", tabIndex: 0, type: "radio", value: "80", onChange: handleZoomChange, checked: zoomScale === 80 }),
                            react_1.default.createElement("label", { htmlFor: "zoomScale80" }, "80%"))))))),
        react_1.default.createElement(ModalWithAnimation, { isOpen: isIssueListActive, style: customStyles, onRequestClose: closeIssueListModal },
            react_1.default.createElement(AirportIssueList_1.default, { issus: issu, apoCd: apoCd, terminalUtcDate: terminalUtcDate })),
        react_1.default.createElement(ModalWithAnimation, { isOpen: common.isShowMenuModal, style: customStyles, onRequestClose: () => dispatch(commonActions.hideMenuModal()) },
            react_1.default.createElement(MenuModal, { isShowNotification: isShowNotification, isPc: isPc },
                react_1.default.createElement(MenuList_1.default, { jobAuth: jobAuth.jobAuth, onClickLink: onClickLink }))),
        react_1.default.createElement(ModalWithAnimation, { isOpen: isProfileModalActive, style: customStyles, onRequestClose: closeProfileModal },
            react_1.default.createElement(ProfileModal, { isPc: isPc },
                react_1.default.createElement("div", { className: "profileArea" },
                    react_1.default.createElement(Ver, null,
                        "Ver. ",
                        commonConst_1.Const.SPA_VERSION),
                    react_1.default.createElement(ProfileContainer, null,
                        react_1.default.createElement(ProfileModalImg, { src: jobAuth.user.profileImg ? `data:image/png;base64,${jobAuth.user.profileImg}` : profile_svg_1.default }),
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
        react_1.default.createElement(ModalWithAnimation, { isOpen: isEditImageModalActive, style: customStyles, onRequestClose: returnToProfileModal },
            react_1.default.createElement(EditImageModal, { isPc: isPc },
                imageSrc && (react_1.default.createElement(ReactCropCustom, { src: imageSrc, onImageLoaded: onImageLoaded, onChange: onCropChange, onComplete: onCropComplete, crop: crop, style: { margin: "20px 20px" }, imageStyle: { maxHeight: "500px", WebkitTouchCallout: "none", userSelect: "none" }, keepSelection: true })),
                react_1.default.createElement(EditImageButtons, { isPc: isPc },
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Update", onClick: () => {
                            void onImageUpdate();
                        } }),
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Cancel", onClick: returnToProfileModal })))),
        react_1.default.createElement(UpdateRmksPopup_1.default, { isOpen: rmksPopupIsOpen, width: rmksPopupWidth, height: rmksPopupHeight, top: rmksPopupTop, left: rmksPopupLeft, initialRmksText: apoRmksInfo, isSubmitable: isRmksEnabled(), placeholder: "Airport Remarks", onClose: handlCloseRmksPopup, update: handleUpdateRmks })));
};
const customAirportModalStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        position: "absolute",
        width: "280px",
        padding: "20px 0px",
        top: `calc(${storage_1.storage.isPc ? layoutStyle_1.default.header.default : layoutStyle_1.default.header.tablet} + 24px)`,
        left: "20px",
        right: "unset",
        bottom: "unset",
        margin: "auto",
        borderRadius: "10px",
        border: "1px solid rgb(204, 204, 204)",
        background: "#fff",
        overflow: "unset",
        outline: "none",
    },
};
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
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
// モバイルの場合は、ステータスバーの分だけヘッダーを厚くする
const Wrapper = styled_components_1.default.div `
  position: relative;
  padding: 0 ${(props) => (props.scrollbarSize ? `${props.scrollbarSize - 12}` : 0)}px 0 12px;
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
  color: ${(props) => props.theme.color.PRIMARY_BASE};
  background: ${(props) => props.theme.color.HEADER_GRADIENT};
  height: ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)};
  width: 100%;
  min-width: ${(props) => props.isPc && props.isSelectApoMode && props.leftWidth && props.rightWidth
    ? `${props.leftWidth + props.rightWidth + 60}px`
    : "0"}; /* 右の要素が割り込まないように */
  z-index: 10;
`;
const MainContent = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)};
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;
const Left = styled_components_1.default.div `
  display: flex;
`;
const RowAirport = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  padding-bottom: ${({ isPc }) => (isPc ? "4px" : "8px")}; /*Rwyの位置合わせ*/
`;
const AirportSelect = styled_components_1.default.div `
  cursor: pointer;
  font-size: ${({ isPc }) => (isPc ? "34px" : "40px")};
  line-height: 1;
  text-align: left;
  margin-top: ${({ isPc }) => (isPc ? "9px" : "27px")};
`;
const DateMonthSelect = styled_components_1.default.div `
  cursor: pointer;
  min-width: 75px;
  margin-left: 5px;
  font-size: 22px;
`;
const SelectAirPortIcon = styled_components_1.default.img.attrs({ src: icon_fis_select_target_popup_svg_1.default }) `
  cursor: pointer;
  margin-left: 5px;
  width: 19px;
  height: 13px;
`;
const SelectAirPortIconDark = styled_components_1.default.img.attrs({ src: icon_fis_select_target_popup_dark_svg_1.default }) `
  cursor: pointer;
  margin-left: 5px;
  width: 19px;
  height: 13px;
`;
const RowRwy = styled_components_1.default.div `
  display: flex;
  align-self: flex-end;
  margin-left: 15px;
  margin-right: 5px;
  padding-bottom: 3px;
  line-height: 1.15;
`;
const Rwy = styled_components_1.default.div `
  margin: 0 5px;
  font-size: 18px;
  text-align: center;
  div:first-child {
    margin-bottom: 1px;
    padding: 0 10px;
    border-bottom: 1px solid ${(props) => props.theme.color.PRIMARY_BASE};
    span {
      font-size: 14px;
    }
  }
`;
const RwyNo = styled_components_1.default.div `
  display: flex;
  justify-content: space-evenly;
  min-height: 20px;
  span {
    padding-right: 3px;
  }
`;
const RowIssueIcons = styled_components_1.default.div `
  display: flex;
  padding-bottom: ${({ isPc }) => (isPc ? "0px" : "0px")};
`;
// 右方向のmarginを、サブヘッダーの設定に合わせる
const Right = styled_components_1.default.div `
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: ${({ isPc }) => (isPc ? "0px" : "10px")};
  position: absolute;
  right: 15px;

  > a {
    margin-right: 40px;
    width: 40px;
    height: 40px;
    position: relative;
  }
`;
const ProfileImg = styled_components_1.default.img `
  ${({ isPc }) => isPc
    ? (0, styled_components_1.css) `
          width: 36px;
          height: 36px;
        `
    : (0, styled_components_1.css) `
          width: 45px;
          height: 45px;
        `};
  border-radius: 50%;
  cursor: pointer;
`;
const AptRmks = styled_components_1.default.div `
  position: absolute;
  height: 100%;
  cursor: pointer;
  ${({ startPos, endPos }) => startPos && endPos && startPos + 10 < endPos
    ? (0, styled_components_1.css) `
          display: flex;
          align-items: center;
          left: ${startPos}px;
          width: ${endPos - startPos}px;
        `
    : (0, styled_components_1.css) `
          display: none;
        `};
`;
const AptRmksContainer = styled_components_1.default.div `
  width: 100%;
  height: 47px;
  margin-left: 1px;
  margin-right: 16px;
  padding: 3px 7px 3px;
  line-height: 1.4;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${({ theme }) => theme.color.remarks.background};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-align: start;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.color.remarks.shadow};
  cursor: pointer;
`;
const ToggleSwitch = styled_components_1.default.div `
  margin: 4px 16px 0 0;

  > div {
    margin-bottom: 1px;
    font-size: 12px;
    text-align: center;
    opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  }
`;
const TimeLcl = styled_components_1.default.div `
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  font-size: ${({ isPc }) => (isPc ? "12px" : "14px")};
`;
const ModalReloadButtonContainer = styled_components_1.default.div `
  margin-right: 30px;
  > button {
    width: ${({ isPc }) => (isPc ? 36 : 45)}px;
    height: ${({ isPc }) => (isPc ? 36 : 45)}px;
    border-radius: 23px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;
const MenuIconContainer = styled_components_1.default.div `
  margin-right: ${({ isPc }) => (isPc ? "30px" : "40px")};
  cursor: pointer;
  img {
    vertical-align: bottom;
    ${({ isPc }) => isPc
    ? (0, styled_components_1.css) `
            width: 28px;
            height: 28px;
          `
    : (0, styled_components_1.css) `
            width: 35px;
            height: 35px;
          `};
  }
`;
const MenuIcon = styled_components_1.default.img.attrs({ src: menu_svg_1.default }) ``;
const BellIcon = styled_components_1.default.img.attrs({ src: bell_svg_1.default }) `
  width: 40px;
  height: 40px;
`;
const BellBadge = styled_components_1.default.div `
  position: absolute;
  top: -7px;
  right: -8px;
  background: #c80019;
  width: 27px;
  height: 27px;
  line-height: 28px;
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 13px;
  ${({ isPc }) => (isPc ? "" : "font-weight: bold;")};
`;
const UpdatedTime = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 10px;
  margin-right: 10px;
  font-size: 14px;
  color: #000;
  pointer-events: none;

  & > span {
    z-index: 2;
    pointer-events: auto;
  }
`;
const AirportModalForm = styled_components_1.default.form `
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .airportSelect,
  .dateSelect {
    position: relative;

    &:after {
      position: absolute;
      top: 17px;
      right: 14px;
      width: 0;
      height: 0;
      padding: 0;
      content: "";
      pointer-events: none;
      width: 7px;
      height: 7px;
      border-right: 2px solid #289ac6;
      border-bottom: 2px solid #289ac6;
      transform: rotate(45deg);
    }
    select {
      background: #fff;
      width: 110px;
      height: 44px;
      padding: 2px 28px 0 6px;
      margin: 0 5px 0 5px;
      border: 1px solid #346181;
      border-radius: 1px;
      appearance: none;
      position: relative;
      &:focus {
        border: 1px solid #2e85c8;
        box-shadow: 0px 0px 7px #60b7fa;
      }
    }
  }
  .submitContainer {
    display: flex;
    align-items: flex-end;
    margin-top: 20px;
    width: 120px;
  }
`;
const AirportModalFormLabel = styled_components_1.default.div `
  width: 110px;
`;
const AirportModalDivision = styled_components_1.default.div `
  margin: 30px 16px 25px;
  border-top: 1px solid #c9d3d0;
`;
const AirportModalDisplay = styled_components_1.default.div `
  margin: 18px 16px 5px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      margin: 0 5px;
    }
  }
`;
const AirportModalZoom = styled_components_1.default.div `
  margin: 18px 16px 5px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
`;
const AirportModalZoomRadio = styled_components_1.default.div `
  margin: 5px 0 0;
  display: flex;
  justify-content: center;
  .radioContainer {
    display: flex;
    align-items: center;
    margin-right: 8px;
    label {
      font-size: 15px;
      line-height: 25px;
    }
  }
`;
const ModeLightIcon = styled_components_1.default.img.attrs({ src: icon_mode_light_svg_1.default }) `
  height: 24px;
`;
const ModeDarkIcon = styled_components_1.default.img.attrs({ src: icon_mode_dark_svg_1.default }) `
  height: 24px;
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
  top: calc(${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 11px);
  right: 0;
  width: 375px;
  border-radius: 5px;
  background: ${({ theme }) => theme.color.WHITE};
  transform-style: preserve-3d;
  box-shadow: 0 0 10px 0 rgba(163, 163, 163, 0.5);
  pointer-events: auto;

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: -8px;
    transform: translateX(-50%) rotate(45deg) skew(10deg, 10deg) translateZ(-1px);
  }
  &::after {
    background: linear-gradient(135deg, #fff 51%, transparent 51%);
    transform: translateX(-50%) rotate(45deg) skew(10deg, 10deg) translateZ(1px);
  }
`;
const MenuModal = (0, styled_components_1.default)(ModalContainer) `
  &::before,
  &::after {
    right: ${({ isShowNotification, isPc }) => (isShowNotification ? (isPc ? "79px" : "182px") : isPc ? "79px" : "106px")};
  }
  max-height: calc(100vh - ${storage_1.storage.isPc ? layoutStyle_1.default.header.default : layoutStyle_1.default.header.tablet} + 11px - 2px);
`;
const ProfileModal = (0, styled_components_1.default)(ModalContainer) `
  &::before,
  &::after {
    right: 19px;
  }

  > div.profileArea {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 14px;
  }
`;
const Ver = styled_components_1.default.div `
  text-align: end;
`;
const ProfileContainer = styled_components_1.default.div `
  display: flex;
  margin: 10px 0px 10px 10px;
`;
const ProfileModalImg = styled_components_1.default.img `
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  top: 14px;
  min-width: 60px;
`;
const ProfileTable = styled_components_1.default.table `
  margin-top: 28px 0px 0px 6px;
  padding-left: 5px;
  line-height: 18px;
  td:first-child {
    padding-right: 20px;
    color: #2fadbd;
    font-size: 12px;
    min-width: 80px;
  }
  td:last-child {
    text-align: left;
    position: relative;
    left: -16px;
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
  text-align: center;
  width: ${({ isPc }) => (isPc ? "375px" : "600px")};
  &::before,
  &::after {
    right: 19px;
  }
`;
const EditImageButtons = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  width: ${({ isPc }) => (isPc ? "244px" : "370px")};
  margin: 26px auto;
  button {
    width: 100px;
  }
`;
const ReactCropCustom = (0, styled_components_1.default)(react_image_crop_1.default) `
  .ReactCrop__image {
    -webkit-user-drag: none;
  }
  .ReactCrop__drag-handle {
    height: 16px;
    width: 16px;
  }
  .ReactCrop__drag-handle.ord-nw {
    margin-top: -8px;
    margin-left: -8px;
  }
  .ReactCrop__drag-handle.ord-ne {
    margin-top: -8px;
    margin-right: -8px;
  }
  .ReactCrop__drag-handle.ord-sw {
    margin-bottom: -8px;
    margin-left: -8px;
  }
  .ReactCrop__drag-handle.ord-se {
    margin-bottom: -8px;
    margin-right: -8px;
  }
`;
const CommonHeaderWithForm = (0, redux_form_1.reduxForm)({
    form: "selectApo",
    shouldValidate: () => true,
})(CommonHeader);
const selector = (0, redux_form_1.formValueSelector)("selectApo");
const ConectedCommonHeader = (0, react_redux_1.connect)((state) => {
    const selectApoCd = selector(state, "selectApoCd");
    const selectTargetDate = selector(state, "selectTargetDate");
    const initialValues = {
        selectApoCd: state.account.jobAuth.user.myApoCd ? state.account.jobAuth.user.myApoCd : "",
        selectTargetDate: "",
    };
    return { selectApoCd, selectTargetDate, initialValues };
})(CommonHeaderWithForm);
exports.default = ConectedCommonHeader;
//# sourceMappingURL=CommonHeader.js.map