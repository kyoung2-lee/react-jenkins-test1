import dayjs from "dayjs";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { Field, formValueSelector, InjectedFormProps, reduxForm, reset as resetOthreForm } from "redux-form";
import { Link, useLocation, useHistory } from "react-router-dom";
import ReactCrop from "react-image-crop";
import styled, { css } from "styled-components";
import useScrollbarSize from "react-scrollbar-size";

import { RootState } from "../../store/storeType";
import { useAppDispatch, useAppSelector, useWindowSize } from "../../store/hooks";
import layoutStyle from "../../styles/layoutStyle";
import { funcAuthCheck, parseTimeLcl } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import * as validates from "../../lib/validators";

import * as commonActions from "../../reducers/common";
import { getFisHeaderInfo, getFisHeaderInfoAuto, setSelfScroll, mqttDisconnect } from "../../reducers/fis";
import { updateProfilePicture, setDisplayMode, setZoomFis, setZoomBarChart } from "../../reducers/account";
import { clearSearchBarChart } from "../../reducers/barChartSearch";
import { closeSpotNumberAll } from "../../reducers/spotNumber";
import { getHiddenSpotNoList } from "../../reducers/storageOfUser";

import RoundButtonReload from "../atoms/RoundButtonReload";
import Toggle from "../atoms/Toggle";
import { RadioButtonStyled } from "../atoms/RadioButton";
import MenuList from "../molecules/MenuList";
import bellIconSvg from "../../assets/images/icon/bell.svg";
import menuIconSvg from "../../assets/images/icon/menu.svg";
import PrimaryButton from "../atoms/PrimaryButton";
import SelectBox, { OptionType } from "../atoms/SelectBox";
import SuggestSelectBox from "../atoms/SuggestSelectBox";
import AirportIssueListModal from "../molecules/AirportIssueList";
import UpdateRmksPopup from "../molecules/UpdateRmksPopup";
import ProfileImageCreator from "../../lib/ProfileImageCreator";
import MovableAirportIcons from "../molecules/MovableAirportIcons";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { getMyScheduleInfo } from "../../reducers/mySchedule";

import iconFisSelectTargetPopupSvg from "../../assets/images/icon/icon-fis-select-target-popup.svg";
import iconFisSelectTargetPopupDarkSvg from "../../assets/images/icon/icon-fis-select-target-popup-dark.svg";
import profileSvg from "../../assets/images/account/profile.svg";
import iconModeLightSvg from "../../assets/images/icon/icon-mode-light.svg";
import iconModeDarkSvg from "../../assets/images/icon/icon-mode-dark.svg";

type MyProps = SelectApoParams & {
  isDarkMode: boolean;
};

type Props = MyProps & InjectedFormProps<SelectApoParams, MyProps>;

const CommonHeader: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const refLeft = useRef<HTMLDivElement>(null);
  const refRight = useRef<HTMLDivElement>(null);
  const refAptRmks = useRef<HTMLDivElement>(null);
  const scrollbarWidth = useScrollbarSize().width;
  const isSelectApoMode = pathname === Const.PATH_NAME.fis || pathname === Const.PATH_NAME.barChart;
  const isFixedApoMode2 = pathname === Const.PATH_NAME.mySchedule;

  // 表示アイコン数を取得する
  const getNumberOfDisplayIcons = (): number => {
    let numberOfDisplayIcons = 3;
    if (storage.isPc) {
      if (isSelectApoMode) {
        numberOfDisplayIcons = 4;
      } else {
        numberOfDisplayIcons = 6;
      }
    }
    return numberOfDisplayIcons;
  };

  const { isDarkMode } = props;
  const common = useAppSelector((state) => state.common);
  const master = useAppSelector((state) => state.account.master);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const zoomFis = useAppSelector((state) => state.account.zoomFis);
  const zoomBarChart = useAppSelector((state) => state.account.zoomBarChart);
  const fis = useAppSelector((state) => state.fis);
  const isFetching = useAppSelector(
    (state) => state.fis.isFetching || state.flightSearch.isFetching || state.issueSecurity.isFetching || state.userSetting.isFetching
  );
  const allForm = useAppSelector((state) => state.form);
  const spotNumber = useAppSelector((state) => state.spotNumber);
  const barChart = useAppSelector((state) => state.barChart);
  const { isAutoReload, isSelfScroll } = fis.headerSettings;

  const [isAirportModalActive, setIsAirportModalActive] = useState(false);
  const [isIssueListActive, setIsIssueListActive] = useState(false);
  const [isProfileModalActive, setIsProfileModalActive] = useState(false);
  const [isEditImageModalActive, setIsEditImageModalActive] = useState(false);
  const [crop, setCrop] = useState<ReactCrop.Crop>({ x: 0, y: 0, width: undefined, height: undefined });
  const [pixelCrop, setPixelCrop] = useState<ReactCrop.PixelCrop | null>(null);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [dateMonthOptions, setDateMonthOptions] = useState<OptionType[]>([]);
  const [numberOfDisplayIcons, setNumberOfDisplayIcons] = useState(getNumberOfDisplayIcons());
  const [rmksPopupIsOpen, setRmksPopupIsOpen] = useState(false);
  const [rmksPopupWidth, setRmksPopupWidth] = useState(0);
  const [rmksPopupHeight, setRmksPopupHeight] = useState(0);
  const [rmksPopupTop, setRmksPopupTop] = useState(0);
  const [rmksPopupLeft, setRmksPopupLeft] = useState(0);
  const [disabledApoCd, setDisabledApoCd] = useState(false);

  const fileInput = useRef(document.createElement("input")); // selectProfileImage()から抜けても保持できるようにここで宣言
  const isSearchedToday = useRef(true);
  const isTodaySearched = useRef(true);
  const timer = useRef<number | null>(null);
  const windowSize = useWindowSize();

  // iOSから実行される関数を用意(通知メッセージの取得)
  window.iAddNotificationList = (messagesJson: string) => {
    void dispatch(commonActions.addNotificationMessages({ messagesJson }));
  };
  window.iSetBadgeNumber = (badgeNumber: number) => {
    dispatch(commonActions.setBadgeNumber(badgeNumber));
  };
  // ウィンドウの幅が変えられたら表示アイコンを変更する
  window.addEventListener("resize", () => {
    setNumberOfDisplayIcons(getNumberOfDisplayIcons());
  });

  useEffect(() => {
    void dispatch(commonActions.getHeaderInfo({ apoCd: jobAuth.user.myApoCd }));
  }, [dispatch, jobAuth.user.myApoCd]);

  useEffect(() => {
    if (common.isForceGoToError) {
      dispatch(commonActions.screenTransitionError());
      history.push(Const.PATH_NAME.error);
    }
  }, [common.isForceGoToError, dispatch, history]);

  // 強制画面遷移
  useEffect(() => {
    if (common.forceGoToPath) {
      void dispatch(commonActions.screenTransition({ from: pathname, to: common.forceGoToPath }));
      history.push(common.forceGoToPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [common.forceGoToPath, dispatch, history]);

  useEffect(() => {
    if (isAutoReload) {
      // 自動更新開始
      if (timer && timer.current) {
        window.clearInterval(timer.current);
      }
      timer.current = window.setInterval(() => {
        // CNLアイコンを24時間だけ更新するための処理
        dispatch(commonActions.updateHeaderInfoTerminalUtcDate());
      }, 60000);
    } else if (timer && timer.current && !isAutoReload) {
      // 自動更新終了
      window.clearInterval(timer.current);
    }
  }, [dispatch, isAutoReload]);

  // 画面サイズが変わったときに空港リマークスの幅が再計算されるように
  useEffect(() => {}, [windowSize]);

  // バーチャートで空港が変更された場合、SPOTフィルタを設定する
  useEffect(() => {
    if (pathname === Const.PATH_NAME.barChart) {
      dispatch(getHiddenSpotNoList({ apoCd: common.headerInfo.apoCd }));
    }
  }, [jobAuth.user.userId, common.headerInfo.apoCd, pathname, dispatch]);

  const isOpenAirportModal = () => {
    // SpotChangeModeの場合、ApoCdはDisabled
    if (barChart && barChart.isSpotChangeMode) {
      setDisabledApoCd(true);
    } else {
      setDisabledApoCd(false);
    }

    // Spot Change Modeでバーが選択されている場合
    // 地上作業バーチャートSpot Change Mode でバー選択済みの場合、Modalを開くかメッセージ表示
    if (spotNumber && spotNumber.spotNoRows.length > 0) {
      NotificationCreator.create({
        dispatch,
        message: SoalaMessage.M40012C({
          onYesButton: () => {
            dispatch(closeSpotNumberAll());
            openAirportModal();
          },
        }),
      });
    } else {
      openAirportModal();
    }
  };

  const openAirportModal = () => {
    if (isSelectApoMode) {
      // 日付プルダウンのオプションを生成
      let start = dayjs().add(3, "days");
      const options: OptionType[] = [
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
        if (!options.some((day) => day.value === dayjs(props.selectTargetDate).format("YYYY-MM-DD"))) {
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

  const handleAirport = (selectApoParams: SelectApoParams) => {
    const { selectApoCd, selectTargetDate } = selectApoParams;
    isSearchedToday.current = !selectTargetDate;
    const nowApoCd = common.headerInfo.apoCd; // 現在の空港コード
    const nowTargetDate = isTodaySearched.current ? "" : common.headerInfo.targetDate; // 現在の選択日付
    if (isAutoReload) {
      void dispatch(getFisHeaderInfoAuto({ apoCd: selectApoCd, isAddingAuto: false }));
    } else {
      void dispatch(
        getFisHeaderInfo({
          apoCd: selectApoCd,
          targetDate: selectTargetDate,
          isToday: isSearchedToday.current,
          beforeApoCd: nowApoCd,
          beforeTargetDate: nowTargetDate,
          isReload: false,
        })
      );
    }
    if (pathname === Const.PATH_NAME.barChart) {
      dispatch(clearSearchBarChart()); // バーチャートの検索をクリアする
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

  const onClickLink = (linkPathname: string | null, isNewTab: boolean) => {
    if (pathname === linkPathname) {
      // 何もしない
    } else if (linkPathname && !isNewTab) {
      Object.keys(allForm).forEach((formKey) => {
        dispatch(resetOthreForm(formKey));
      });
      const apoCd = jobAuth.user.myApoCd;
      dispatch(commonActions.fetchHeaderInfoClear());
      void dispatch(commonActions.getHeaderInfo({ apoCd }));
      void dispatch(commonActions.screenTransition({ from: pathname, to: linkPathname }));

      // バーチャートが開かれた場合、所属空港で、SPOTフィルタを設定する
      if (linkPathname === Const.PATH_NAME.barChart) {
        dispatch(getHiddenSpotNoList({ apoCd }));
      }
    }
    dispatch(commonActions.hideMenuModal());
  };

  const onClickLinkNotification = () => {
    Object.keys(allForm).forEach((formKey) => {
      dispatch(resetOthreForm(formKey));
    });
    const apoCd = jobAuth.user.myApoCd;
    dispatch(commonActions.fetchHeaderInfoClear());
    void dispatch(commonActions.getHeaderInfo({ apoCd }));
    void dispatch(commonActions.screenTransition({ from: pathname, to: Const.PATH_NAME.notification }));
    // ネイティブより通知一覧を取得する
    if (!storage.isPc && window.webkit) {
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

  const onImageLoaded = (_imageRef: HTMLImageElement) => {
    let newCrop: ReactCrop.Crop;
    if (_imageRef.naturalWidth < _imageRef.naturalHeight) {
      newCrop = { x: 0, y: 0, width: 100, height: undefined, aspect: 1 };
    } else {
      newCrop = { x: (100 - (100 * _imageRef.naturalHeight) / _imageRef.naturalWidth) / 2, y: 0, width: undefined, height: 100, aspect: 1 };
    }
    if (newCrop) {
      setCrop(newCrop);
    }

    if (_imageRef.parentElement) {
      _imageRef.parentElement.addEventListener("contextmenu", (ev: MouseEvent) => ev.preventDefault());
    }
  };

  const onCropChange = (newCrop: ReactCrop.Crop) => {
    setCrop(newCrop);
  };

  const onCropComplete = (newCrop: ReactCrop.Crop, newPixelCrop: ReactCrop.PixelCrop) => {
    setCrop(newCrop);
    setPixelCrop(newPixelCrop);
  };

  const fileInputChangeHandler = useCallback(
    (ev: Event) => {
      void (async () => {
        const e = ev as HTMLInputEvent;
        const isCroppableMimeType = (file: File) => ["image/jpeg", "image/png"].includes(file.type);
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
    },
    [dispatch]
  );

  const selectProfileImage = () => {
    fileInput.current.type = "file";
    fileInput.current.accept = "image/jpeg,image/png";
    fileInput.current.removeEventListener("change", fileInputChangeHandler);
    fileInput.current.addEventListener("change", fileInputChangeHandler);
    fileInput.current.click();
  };

  const closeEditImageModal = () => {
    if (imageRef) URL.revokeObjectURL(imageRef.src);
    setIsEditImageModalActive(false);
  };

  const returnToProfileModal = () => {
    closeEditImageModal();
    openProfileModal();
  };

  const onImageUpdate = async () => {
    if (imageRef && pixelCrop && pixelCrop.width > 0 && pixelCrop.height > 0) {
      const imageCreator = new ProfileImageCreator(imageRef, pixelCrop);
      const base64Image = await imageCreator.create(Const.PROFILE_IMG_SIZE, Const.PROFILE_IMG_SIZE);
      const base64ImageTmb = await imageCreator.create(Const.PROFILE_TMB_IMG_SIZE, Const.PROFILE_TMB_IMG_SIZE);
      const profile = {
        profile: base64Image,
        profileTmb: base64ImageTmb,
      };
      void dispatch(updateProfilePicture({ profile, closeEditImageModal: returnToProfileModal }));
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

  const isRmksEnabled = (): boolean =>
    !!jobAuth.user.myApoCd &&
    jobAuth.user.myApoCd === common.headerInfo.apoCd &&
    funcAuthCheck(Const.FUNC_ID.updateAireportRemarks, jobAuth.jobAuth);

  const handlCloseRmksPopup = (rmksText: string) => {
    if (common.headerInfo.apoRmksInfo === rmksText) {
      setRmksPopupIsOpen(false);
    } else {
      void dispatch(commonActions.showConfirmation({ onClickYes: () => setRmksPopupIsOpen(false) }));
    }
  };

  const handleUpdateRmks = (text: string) => {
    if (text === common.headerInfo.apoRmksInfo) {
      void dispatch(commonActions.showNotificationAirportRmksNoChange());
    } else {
      void dispatch(
        commonActions.updateAirportRemarks({
          apoCd: jobAuth.user.myApoCd,
          apoRmksInfo: text,
          closeAirportRemarksPopup: () => setRmksPopupIsOpen(false),
        })
      );
    }
  };

  const handleReload = () => {
    const { apoCd, targetDate, isToday } = common.headerInfo;
    if (isSelectApoMode) {
      if (!isAutoReload) {
        void dispatch(
          getFisHeaderInfo({
            apoCd,
            targetDate,
            isToday,
            beforeApoCd: apoCd,
            beforeTargetDate: targetDate,
            isReload: true,
          })
        );
      }
      // // PUSHテスト用
      // const { getFisRowsFromPush, fis } = this.props;
      // getFisRowsFromPush(fis._getCount);
    } else if (pathname === Const.PATH_NAME.mySchedule) {
      void dispatch(getMyScheduleInfo());
    }
  };

  const handleDisplayModeChange = (checked: boolean) => {
    if (checked) {
      dispatch(setDisplayMode({ displayMode: "darkMode" }));
    } else {
      dispatch(setDisplayMode({ displayMode: "lightMode" }));
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zoom = Number(e.target.value);
    if (pathname === Const.PATH_NAME.fis) {
      dispatch(setZoomFis({ zoom }));
    } else {
      dispatch(setZoomBarChart({ zoom }));
    }
  };

  const { apoCd, usingRwy, issu, terminalUtcDate, curfewTimeStartLcl, curfewTimeEndLcl, apoRmksInfo } = common.headerInfo;
  const ldRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "LD").slice(0, 2) : [];
  const toRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "TO").slice(0, 2) : [];
  const { apoTimeLcl, apoTimeDiffUtc } = common.headerInfo;
  const { timeLcl, timeDiffUtc } = fis;
  const isShowNotification = funcAuthCheck(Const.FUNC_ID.openNotificationList, jobAuth.jobAuth);
  const { isPc } = storage;
  const hasAirport = !!apoCd;
  const hTimeLcl = apoTimeLcl < timeLcl ? timeLcl : apoTimeLcl;
  const hTimeDiffUtc = apoTimeLcl < timeLcl ? timeDiffUtc : apoTimeDiffUtc;
  const parsedTimeLcl = parseTimeLcl({ timeLcl: hTimeLcl, timeDiffUtc: hTimeDiffUtc, isLocal: hasAirport });
  const rmksStartPos = refLeft.current ? refLeft.current.offsetLeft + refLeft.current.clientWidth + 8 : null;
  const rmksEndPos = refRight.current ? refRight.current.offsetLeft : null;
  const leftWidth = refLeft.current ? refLeft.current.clientWidth : null;
  const rightWidth = refRight.current ? refRight.current.clientWidth : null;
  const isFis = pathname === Const.PATH_NAME.fis;
  const zoomScale = isFis ? zoomFis : zoomBarChart;

  return (
    <Wrapper isPc={isPc} scrollbarSize={scrollbarWidth} isSelectApoMode={isSelectApoMode} leftWidth={leftWidth} rightWidth={rightWidth}>
      <MainContent isPc={isPc}>
        {/* 空港情報 */}
        <Left ref={refLeft} isPc={isPc}>
          <RowAirport isPc={isPc}>
            {/* 空港選択 */}
            <AirportSelect onClick={isOpenAirportModal} isPc={isPc}>
              {apoCd}
            </AirportSelect>
            {isSelectApoMode && (
              <>
                <DateMonthSelect onClick={isOpenAirportModal}>
                  {!isAutoReload &&
                    (!isFetching || common.headerInfo.targetDate) &&
                    (dayjs(common.headerInfo.targetDate).isValid()
                      ? dayjs(common.headerInfo.targetDate).format("DDMMM").toUpperCase()
                      : dayjs().format("DDMMM").toUpperCase())}
                </DateMonthSelect>
                {isDarkMode ? <SelectAirPortIconDark onClick={isOpenAirportModal} /> : <SelectAirPortIcon onClick={isOpenAirportModal} />}
              </>
            )}
            {/* Runway情報 */}
            {hasAirport && (
              <RowRwy>
                <Rwy>
                  <div>
                    L/D <span>RWY</span>
                  </div>
                  <RwyNo>
                    {ldRwys.map((ldRwy) => (
                      <span key={ldRwy.rwyNo}>{ldRwy.rwyNo}</span>
                    ))}
                  </RwyNo>
                </Rwy>
                <Rwy>
                  <div>
                    T/O <span>RWY</span>
                  </div>
                  <RwyNo>
                    {toRwys.map((toRwy) => (
                      <span key={toRwy.rwyNo}>{toRwy.rwyNo}</span>
                    ))}
                  </RwyNo>
                </Rwy>
                {!isFixedApoMode2 &&
                  (curfewTimeStartLcl && curfewTimeEndLcl ? (
                    <Rwy>
                      <div>
                        Curfew <span>(L)</span>
                      </div>
                      <RwyNo>
                        <span>{(curfewTimeStartLcl.match(/.{2}/g) || []).join(":")}</span>
                        <span>-</span>
                        <span>{(curfewTimeEndLcl.match(/.{2}/g) || []).join(":")}</span>
                      </RwyNo>
                    </Rwy>
                  ) : null)}
              </RowRwy>
            )}
          </RowAirport>
          {/* 空港発令アイコン */}
          {hasAirport && (
            <RowIssueIcons isPc={isPc}>
              <MovableAirportIcons
                onClick={openIssueListModal}
                issus={issu}
                terminalUtcDate={common.headerInfo.terminalUtcDate}
                numberOfDisplay={numberOfDisplayIcons}
              />
            </RowIssueIcons>
          )}
        </Left>
        {/* 空港リマークス */}
        {isPc && (isSelectApoMode || isFixedApoMode2) && hasAirport && (
          <AptRmks isEmpty={!apoRmksInfo} startPos={rmksStartPos} endPos={rmksEndPos}>
            <AptRmksContainer
              ref={refAptRmks}
              onClick={() => {
                void handleOpenRmksPopup();
              }}
              isEmpty={!apoRmksInfo}
            >
              <div>{apoRmksInfo || "Airport Remarks"}</div>
            </AptRmksContainer>
          </AptRmks>
        )}
        <Right ref={refRight} isPc={isPc}>
          {isPc && (isSelectApoMode || isFixedApoMode2) && hasAirport && (
            <>
              {/* トグルスイッチ */}
              {isSelectApoMode &&
                funcAuthCheck(
                  pathname === Const.PATH_NAME.fis ? Const.FUNC_ID.updateFisAuto : Const.FUNC_ID.updateBarChartAuto,
                  jobAuth.jobAuth
                ) && (
                  <>
                    <ToggleSwitch isPc={storage.isPc} disabled={false}>
                      <div>Auto</div>
                      <Toggle
                        tabIndex={-1}
                        isDarkMode={isDarkMode}
                        smallSize
                        checked={isAutoReload}
                        onChange={(checked) => {
                          if (checked) {
                            void dispatch(getFisHeaderInfoAuto({ apoCd: common.headerInfo.apoCd, isAddingAuto: true }));
                          } else {
                            void dispatch(mqttDisconnect());
                          }
                        }}
                      />
                    </ToggleSwitch>
                    <ToggleSwitch isPc={storage.isPc} disabled={!isAutoReload}>
                      <div>Self Scroll</div>
                      <Toggle
                        tabIndex={-1}
                        isDarkMode={isDarkMode}
                        smallSize
                        checked={isSelfScroll}
                        disabled={!isAutoReload}
                        onChange={(checked) => dispatch(setSelfScroll({ isSelfScroll: checked }))}
                      />
                    </ToggleSwitch>
                  </>
                )}
              {/* 更新日時 */}
              {parsedTimeLcl.date && (
                <TimeLcl isPc={storage.isPc}>
                  {isSelectApoMode && <span>{apoCd}</span>}
                  <span>{parsedTimeLcl.date}</span>
                  <span>{parsedTimeLcl.time}</span>
                </TimeLcl>
              )}
              {/* リロードボタン */}
              <ModalReloadButtonContainer isPc={storage.isPc}>
                <RoundButtonReload tabIndex={10} isFetching={false} disabled={isAutoReload} onClick={handleReload} />
              </ModalReloadButtonContainer>
            </>
          )}
          {/* メニューアイコン */}
          <MenuIconContainer isPc={isPc} onClick={showMenuModal}>
            <MenuIcon />
          </MenuIconContainer>

          {/* 通知アイコン */}
          {isShowNotification && (
            <Link to={Const.PATH_NAME.notification} onClick={onClickLinkNotification}>
              <BellIcon />
              {common.badgeNumber > 0 && <BellBadge isPc={isPc}>{common.badgeNumber}</BellBadge>}
            </Link>
          )}

          {/* プロフィールアイコン */}
          <ProfileImg
            onClick={openProfileModal}
            src={jobAuth.user.profileImg ? `data:image/png;base64,${jobAuth.user.profileImg}` : profileSvg}
            isPc={isPc}
          />
        </Right>
      </MainContent>

      {/* データ取得日時 */}
      {(pathname === Const.PATH_NAME.home ||
        pathname === Const.PATH_NAME.userSetting ||
        pathname === Const.PATH_NAME.flightSearch ||
        pathname === Const.PATH_NAME.help ||
        pathname === Const.PATH_NAME.myPage ||
        pathname === Const.PATH_NAME.notification ||
        pathname === Const.PATH_NAME.issueSecurity ||
        pathname === Const.PATH_NAME.oalFlightSchedule) && (
        <UpdatedTime>
          <span>{parsedTimeLcl.date}</span>
          <span>{parsedTimeLcl.time}</span>
        </UpdatedTime>
      )}
      {/* 空港選択モーダル */}
      <Modal isOpen={isAirportModalActive} onRequestClose={closeAirportModal} style={customAirportModalStyles}>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <AirportModalForm onSubmit={props.handleSubmit(handleAirport)}>
          <AirportModalFormLabel>Airport</AirportModalFormLabel>
          <AirportModalFormLabel>Date</AirportModalFormLabel>
          <Field
            name="selectApoCd"
            component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
            tabIndex={0}
            placeholder="APO"
            onSelect={() => props.change("selectTargetDate", "")}
            options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
            width={115}
            maxLength={3}
            maxMenuHeight={408}
            validate={[validates.requiredApo, validates.halfWidthApoCd]}
            autoFocus={!disabledApoCd}
            isShadowOnFocus
            disabled={disabledApoCd}
          />
          <Field
            name="selectTargetDate"
            component={SelectBox as "select" & typeof SelectBox}
            tabIndex={0}
            options={dateMonthOptions}
            disabled={isAutoReload}
            width={115}
            maxMenuHeight={408}
            autoFocus={disabledApoCd}
            isShadowOnFocus
          />
          <div className="submitContainer">
            <PrimaryButton text="Search" tabIndex={-1} />
          </div>
        </AirportModalForm>
        {isPc && (
          <>
            <AirportModalDivision />
            {isFis && (
              <AirportModalDisplay>
                <div>Display mode</div>
                <div>
                  <ModeLightIcon />
                  <Toggle tabIndex={0} isDarkMode={isDarkMode} smallSize checked={isDarkMode} onChange={handleDisplayModeChange} />
                  <ModeDarkIcon />
                </div>
              </AirportModalDisplay>
            )}
            <AirportModalZoom>
              <div>Zoom-out</div>
              <AirportModalZoomRadio>
                <div className="radioContainer">
                  <RadioButtonStyled
                    isShadowOnFocus
                    name="zoomScale"
                    id="zoomScale100"
                    tabIndex={0}
                    type="radio"
                    value="100"
                    onChange={handleZoomChange}
                    checked={zoomScale === 100}
                  />
                  <label htmlFor="zoomScale100">100%</label>
                </div>
                <div className="radioContainer">
                  <RadioButtonStyled
                    isShadowOnFocus
                    name="zoomScale"
                    id="zoomScale90"
                    tabIndex={0}
                    type="radio"
                    value="90"
                    onChange={handleZoomChange}
                    checked={zoomScale === 90}
                  />
                  <label htmlFor="zoomScale90">90%</label>
                </div>
                <div className="radioContainer">
                  <RadioButtonStyled
                    isShadowOnFocus
                    name="zoomScale"
                    id="zoomScale80"
                    tabIndex={0}
                    type="radio"
                    value="80"
                    onChange={handleZoomChange}
                    checked={zoomScale === 80}
                  />
                  <label htmlFor="zoomScale80">80%</label>
                </div>
              </AirportModalZoomRadio>
            </AirportModalZoom>
          </>
        )}
      </Modal>

      {/* 発令一覧モーダル */}
      <ModalWithAnimation isOpen={isIssueListActive} style={customStyles} onRequestClose={closeIssueListModal}>
        <AirportIssueListModal issus={issu} apoCd={apoCd} terminalUtcDate={terminalUtcDate} />
      </ModalWithAnimation>

      {/* メニューモーダル */}
      <ModalWithAnimation
        isOpen={common.isShowMenuModal}
        style={customStyles}
        onRequestClose={() => dispatch(commonActions.hideMenuModal())}
      >
        <MenuModal isShowNotification={isShowNotification} isPc={isPc}>
          <MenuList jobAuth={jobAuth.jobAuth} onClickLink={onClickLink} />
        </MenuModal>
      </ModalWithAnimation>

      {/* プロフィールモーダル */}
      <ModalWithAnimation isOpen={isProfileModalActive} style={customStyles} onRequestClose={closeProfileModal}>
        <ProfileModal isPc={isPc}>
          <div className="profileArea">
            <Ver>Ver. {Const.SPA_VERSION}</Ver>
            <ProfileContainer>
              <ProfileModalImg src={jobAuth.user.profileImg ? `data:image/png;base64,${jobAuth.user.profileImg}` : profileSvg} />
              <ProfileTable>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>
                      {jobAuth.user.firstName}&nbsp;{jobAuth.user.familyName}
                    </td>
                  </tr>
                  <tr>
                    <td>User ID</td>
                    <td>{jobAuth.user.userId}</td>
                  </tr>
                  <tr>
                    <td>Group</td>
                    <td>{jobAuth.user.grpCd}</td>
                  </tr>
                  <tr>
                    <td>Job Code</td>
                    <td>{jobAuth.user.jobCd}</td>
                  </tr>
                </tbody>
              </ProfileTable>
            </ProfileContainer>
            <ProfileButtonsContainer>
              <PrimaryButton text="Change" onClick={selectProfileImage} />
              <PrimaryButton
                text="Logout"
                onClick={() => {
                  void dispatch(commonActions.logout());
                }}
              />
            </ProfileButtonsContainer>
          </div>
        </ProfileModal>
      </ModalWithAnimation>

      {/* 写真編集モーダル */}
      <ModalWithAnimation isOpen={isEditImageModalActive} style={customStyles} onRequestClose={returnToProfileModal}>
        <EditImageModal isPc={isPc}>
          {imageSrc && (
            <ReactCropCustom
              src={imageSrc as string}
              onImageLoaded={onImageLoaded}
              onChange={onCropChange}
              onComplete={onCropComplete}
              crop={crop}
              style={{ margin: "20px 20px" }}
              imageStyle={{ maxHeight: "500px", WebkitTouchCallout: "none", userSelect: "none" }}
              keepSelection
            />
          )}
          <EditImageButtons isPc={isPc}>
            <PrimaryButton
              text="Update"
              onClick={() => {
                void onImageUpdate();
              }}
            />
            <PrimaryButton text="Cancel" onClick={returnToProfileModal} />
          </EditImageButtons>
        </EditImageModal>
      </ModalWithAnimation>

      <UpdateRmksPopup
        isOpen={rmksPopupIsOpen}
        width={rmksPopupWidth}
        height={rmksPopupHeight}
        top={rmksPopupTop}
        left={rmksPopupLeft}
        initialRmksText={apoRmksInfo}
        isSubmitable={isRmksEnabled()}
        placeholder="Airport Remarks"
        onClose={handlCloseRmksPopup}
        update={handleUpdateRmks}
      />
    </Wrapper>
  );
};

const customAirportModalStyles: Modal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    position: "absolute",
    width: "280px",
    padding: "20px 0px",
    top: `calc(${storage.isPc ? layoutStyle.header.default : layoutStyle.header.tablet} + 24px)`,
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

const customStyles: Modal.Styles = {
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
const Wrapper = styled.div<{
  isPc: boolean;
  scrollbarSize: number;
  isSelectApoMode: boolean;
  leftWidth: number | null;
  rightWidth: number | null;
}>`
  position: relative;
  padding: 0 ${(props) => (props.scrollbarSize ? `${props.scrollbarSize - 12}` : 0)}px 0 12px;
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
  color: ${(props) => props.theme.color.PRIMARY_BASE};
  background: ${(props) => props.theme.color.HEADER_GRADIENT};
  height: ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)};
  width: 100%;
  min-width: ${(props) =>
    props.isPc && props.isSelectApoMode && props.leftWidth && props.rightWidth
      ? `${props.leftWidth + props.rightWidth + 60}px`
      : "0"}; /* 右の要素が割り込まないように */
  z-index: 10;
`;

const MainContent = styled.div<{ isPc: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)};
  max-width: ${Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;

const Left = styled.div<{ isPc: boolean }>`
  display: flex;
`;

const RowAirport = styled.div<{ isPc: boolean }>`
  display: flex;
  align-items: baseline;
  padding-bottom: ${({ isPc }) => (isPc ? "4px" : "8px")}; /*Rwyの位置合わせ*/
`;

const AirportSelect = styled.div<{ isPc: boolean }>`
  cursor: pointer;
  font-size: ${({ isPc }) => (isPc ? "34px" : "40px")};
  line-height: 1;
  text-align: left;
  margin-top: ${({ isPc }) => (isPc ? "9px" : "27px")};
`;
const DateMonthSelect = styled.div`
  cursor: pointer;
  min-width: 75px;
  margin-left: 5px;
  font-size: 22px;
`;

const SelectAirPortIcon = styled.img.attrs({ src: iconFisSelectTargetPopupSvg })`
  cursor: pointer;
  margin-left: 5px;
  width: 19px;
  height: 13px;
`;

const SelectAirPortIconDark = styled.img.attrs({ src: iconFisSelectTargetPopupDarkSvg })`
  cursor: pointer;
  margin-left: 5px;
  width: 19px;
  height: 13px;
`;

const RowRwy = styled.div`
  display: flex;
  align-self: flex-end;
  margin-left: 15px;
  margin-right: 5px;
  padding-bottom: 3px;
  line-height: 1.15;
`;

const Rwy = styled.div`
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

const RwyNo = styled.div`
  display: flex;
  justify-content: space-evenly;
  min-height: 20px;
  span {
    padding-right: 3px;
  }
`;

const RowIssueIcons = styled.div<{ isPc: boolean }>`
  display: flex;
  padding-bottom: ${({ isPc }) => (isPc ? "0px" : "0px")};
`;

// 右方向のmarginを、サブヘッダーの設定に合わせる
const Right = styled.div<{ isPc: boolean }>`
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
const ProfileImg = styled.img<{ isPc: boolean }>`
  ${({ isPc }) =>
    isPc
      ? css`
          width: 36px;
          height: 36px;
        `
      : css`
          width: 45px;
          height: 45px;
        `};
  border-radius: 50%;
  cursor: pointer;
`;

const AptRmks = styled.div<{ isEmpty: boolean; startPos: number | null; endPos: number | null }>`
  position: absolute;
  height: 100%;
  cursor: pointer;
  ${({ startPos, endPos }) =>
    startPos && endPos && startPos + 10 < endPos
      ? css`
          display: flex;
          align-items: center;
          left: ${startPos}px;
          width: ${endPos - startPos}px;
        `
      : css`
          display: none;
        `};
`;

const AptRmksContainer = styled.div<{ isEmpty: boolean }>`
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

const ToggleSwitch = styled.div<{ isPc: boolean; disabled: boolean }>`
  margin: 4px 16px 0 0;

  > div {
    margin-bottom: 1px;
    font-size: 12px;
    text-align: center;
    opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  }
`;

const TimeLcl = styled.div<{ isPc: boolean }>`
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  font-size: ${({ isPc }) => (isPc ? "12px" : "14px")};
`;

const ModalReloadButtonContainer = styled.div<{ isPc: boolean }>`
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
const MenuIconContainer = styled.div<{ isPc: boolean }>`
  margin-right: ${({ isPc }) => (isPc ? "30px" : "40px")};
  cursor: pointer;
  img {
    vertical-align: bottom;
    ${({ isPc }) =>
      isPc
        ? css`
            width: 28px;
            height: 28px;
          `
        : css`
            width: 35px;
            height: 35px;
          `};
  }
`;

const MenuIcon = styled.img.attrs({ src: menuIconSvg })``;

const BellIcon = styled.img.attrs({ src: bellIconSvg })`
  width: 40px;
  height: 40px;
`;

const BellBadge = styled.div<{ isPc: boolean }>`
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

const UpdatedTime = styled.div`
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

const AirportModalForm = styled.form`
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

const AirportModalFormLabel = styled.div`
  width: 110px;
`;

const AirportModalDivision = styled.div`
  margin: 30px 16px 25px;
  border-top: 1px solid #c9d3d0;
`;

const AirportModalDisplay = styled.div`
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

const AirportModalZoom = styled.div`
  margin: 18px 16px 5px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
`;

const AirportModalZoomRadio = styled.div`
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

const ModeLightIcon = styled.img.attrs({ src: iconModeLightSvg })`
  height: 24px;
`;
const ModeDarkIcon = styled.img.attrs({ src: iconModeDarkSvg })`
  height: 24px;
`;

const ModalWithAnimation = styled(Modal)`
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

const ModalContainer = styled.div<{ isPc: boolean }>`
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

const MenuModal = styled(ModalContainer)<{ isShowNotification: boolean; isPc: boolean }>`
  &::before,
  &::after {
    right: ${({ isShowNotification, isPc }) => (isShowNotification ? (isPc ? "79px" : "182px") : isPc ? "79px" : "106px")};
  }
  max-height: calc(100vh - ${storage.isPc ? layoutStyle.header.default : layoutStyle.header.tablet} + 11px - 2px);
`;
const ProfileModal = styled(ModalContainer)`
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

const Ver = styled.div`
  text-align: end;
`;

const ProfileContainer = styled.div`
  display: flex;
  margin: 10px 0px 10px 10px;
`;

const ProfileModalImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  top: 14px;
  min-width: 60px;
`;

const ProfileTable = styled.table`
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

const ProfileButtonsContainer = styled.div`
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

const EditImageModal = styled(ModalContainer)<{ isPc: boolean }>`
  text-align: center;
  width: ${({ isPc }) => (isPc ? "375px" : "600px")};
  &::before,
  &::after {
    right: 19px;
  }
`;

const EditImageButtons = styled.div<{ isPc: boolean }>`
  display: flex;
  justify-content: space-between;
  width: ${({ isPc }) => (isPc ? "244px" : "370px")};
  margin: 26px auto;
  button {
    width: 100px;
  }
`;

const ReactCropCustom = styled(ReactCrop)`
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

export interface SelectApoParams {
  // eslint-disable-next-line react/no-unused-prop-types
  selectApoCd: string; // selectApoCdはとりあえず残した
  selectTargetDate: string;
}

const CommonHeaderWithForm = reduxForm<SelectApoParams, MyProps>({
  form: "selectApo",
  shouldValidate: () => true,
})(CommonHeader);

const selector = formValueSelector("selectApo");

const ConectedCommonHeader = connect((state: RootState) => {
  const selectApoCd = selector(state, "selectApoCd") as string;
  const selectTargetDate = selector(state, "selectTargetDate") as string;
  const initialValues = {
    selectApoCd: state.account.jobAuth.user.myApoCd ? state.account.jobAuth.user.myApoCd : "",
    selectTargetDate: "",
  };
  return { selectApoCd, selectTargetDate, initialValues };
})(CommonHeaderWithForm);

export default ConectedCommonHeader;
