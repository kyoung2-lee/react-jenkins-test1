import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { reset } from "redux-form";
import { Link, useLocation } from "react-router-dom";
import ReactCrop from "react-image-crop";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { funcAuthCheck } from "../../../../lib/commonUtil";
import { Const } from "../../../../lib/commonConst";
import { storage } from "../../../../lib/storage";
import { updateProfilePicture } from "../../../../reducers/account";
import * as commonActions from "../../../../reducers/common";
import { reloadFlightSearch } from "../../../../reducers/flightSearch";
import { clearUserSetting, checkUserSettingFuncAuth } from "../../../../reducers/userSetting";
import PrimaryButton from "../../../atoms/PrimaryButton";
import MenuList from "../../../molecules/MenuList";
import ProfileImageCreator from "../../../../lib/ProfileImageCreator";

import profileSvg from "../../../../assets/images/account/profile.svg";
import iconUserSkeletonSvg from "../../../../assets/images/icon/icon-user-skeleton.svg";
import iconPlaneSkeletonSvg from "../../../../assets/images/icon/icon-plane-skeleton.svg";
import iconBellSkeletonSvg from "../../../../assets/images/icon/icon-bell-skeleton.svg";
import iconMenuSvg from "../../../../assets/images/icon/icon-menu.svg";
import iconBbSvg from "../../../../assets/images/icon/icon-bb.svg";

type Props = {
  onClickBb: () => void;
};

const SPCommonFooter: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const flightModals = useAppSelector((state) => state.flightModals);
  const oalFlightMovementModal = useAppSelector((state) => state.flightMovementModal);

  const [isMenuModalActive, setIsMenuModalActive] = useState(false);
  const [isProfileModalActive, setIsProfileModalActive] = useState(false);
  const [isEditImageModalActive, setIsEditImageModalActive] = useState(false);
  const [crop, setCrop] = useState<ReactCrop.Crop>({ x: 0, y: 0, width: undefined, height: undefined });
  const [pixelCrop, setPixelCrop] = useState<ReactCrop.PixelCrop | null>(null);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  // iOSから実行される関数を用意(通知メッセージの取得)
  window.iAddNotificationList = (messagesJson: string) => {
    void dispatch(commonActions.addNotificationMessages({ messagesJson }));
  };
  window.iSetBadgeNumber = (badgeNumber: number) => {
    dispatch(commonActions.setBadgeNumber(badgeNumber));
  };

  useEffect(() => {
    const apoCd = jobAuth.user.myApoCd;
    void dispatch(commonActions.getHeaderInfo({ apoCd }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMenuModal = () => {
    if (isMenuModalActive) {
      closeMenuModal();
    } else {
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

  const onClickLink = (linkPathName: string | null, _isNewTab: boolean) => {
    if (linkPathName === pathname) {
      if (linkPathName === Const.PATH_NAME.flightSearch) {
        // ポップアップが表示されていない場合のみリロードする
        if (!flightModals.modals.find((m) => m.opened) && !oalFlightMovementModal.isOpen) {
          void dispatch(reloadFlightSearch());
        }
      } else if (linkPathName === Const.PATH_NAME.userSetting) {
        // ユーザー設定 初期化 ヘッダー取得(画面側の処理でユーザー設定情報取得)
        dispatch(reset("userSetting"));
        dispatch(clearUserSetting());
        void dispatch(checkUserSettingFuncAuth({ jobAuth: jobAuth.jobAuth }));
        screenTransition(linkPathName);
      } else if (linkPathName === Const.PATH_NAME.bulletinBoard) {
        props.onClickBb();
      } else {
        // 何もしない
      }
    } else if (linkPathName) {
      screenTransition(linkPathName);
    }
    closeModals();
  };

  const onClickLinkNotification = () => {
    screenTransition(Const.PATH_NAME.notification);
    // ネイティブより通知一覧を取得する
    if (storage.terminalCat !== Const.TerminalCat.pc) {
      if (window.webkit) {
        window.webkit.messageHandlers.getNotificationList.postMessage("");
      }
    }
  };

  const screenTransition = (nextPathname: string) => {
    const apoCd = jobAuth.user.myApoCd;
    void dispatch(commonActions.getHeaderInfo({ apoCd }));
    void dispatch(commonActions.screenTransition({ from: pathname, to: nextPathname }));
  };

  const toggleProfileModal = () => {
    if (isProfileModalActive) {
      closeProfileModal();
    } else {
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

  const onImageLoaded = (pImageRef: HTMLImageElement) => {
    let newCrop: ReactCrop.Crop;
    if (pImageRef.naturalWidth < pImageRef.naturalHeight) {
      newCrop = { x: 0, y: 0, width: 100, height: undefined, aspect: 1 };
    } else {
      newCrop = { x: (100 - (100 * pImageRef.naturalHeight) / pImageRef.naturalWidth) / 2, y: 0, width: undefined, height: 100, aspect: 1 };
    }
    if (newCrop) {
      setCrop(newCrop);
    }
  };

  const onCropChange = (newCrop: ReactCrop.Crop) => {
    setCrop(newCrop);
  };

  const onCropComplete = (newCrop: ReactCrop.Crop, newPixelCrop: ReactCrop.PixelCrop) => {
    setCrop(newCrop);
    setPixelCrop(newPixelCrop);
  };

  const selectProfileImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.style.display = "none";
    input.addEventListener(
      "change",
      (ev: Event) => {
        const e = ev as HTMLInputEvent;
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
      },
      false
    );

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

  const closeModals = () => {
    closeProfileModal();
    closeMenuModal();
  };

  const isShowNotification = funcAuthCheck(Const.FUNC_ID.openNotificationList, jobAuth.jobAuth);
  // cropの保持する画像が、横いっぱいに広げた時に一定の高さを超える場合、つぶれないように修正しておく
  const reactCropMaxHeight = 500;
  const isVerticalPicture =
    imageRef && imageRef.naturalHeight != null && imageRef.naturalWidth != null
      ? imageRef.naturalHeight * (window.innerWidth / imageRef.naturalWidth) > reactCropMaxHeight
      : null;
  const isShowBb = funcAuthCheck(Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth);

  return (
    <Wrapper>
      <Row onClick={toggleProfileModal}>
        <UserIcon />
      </Row>
      <Row>
        <Link to={Const.PATH_NAME.flightSearch} onClick={() => onClickLink(Const.PATH_NAME.flightSearch, false)}>
          <PlaneIcon />
        </Link>
      </Row>
      {isShowBb ? (
        <Row>
          <Link to={Const.PATH_NAME.bulletinBoard} onClick={() => onClickLink(Const.PATH_NAME.bulletinBoard, false)}>
            <BBIcon />
          </Link>
        </Row>
      ) : null}

      {isShowNotification && (
        <Row>
          <Link to={Const.PATH_NAME.notification} onClick={onClickLinkNotification}>
            <BellIcon />
            {common.badgeNumber > 0 && <BellBadge isPc={storage.isPc}>{common.badgeNumber}</BellBadge>}
          </Link>
        </Row>
      )}
      <Row onClick={toggleMenuModal}>
        <MenuIcon />
      </Row>

      {/* メニューモーダル */}
      <ModalWithAnimation isOpen={isMenuModalActive} style={customStyles} onRequestClose={closeMenuModal}>
        <MenuModal isShowNotification={isShowNotification}>
          <MenuListContainer>
            <MenuList jobAuth={jobAuth.jobAuth} onClickLink={onClickLink} />
          </MenuListContainer>
        </MenuModal>
      </ModalWithAnimation>

      {/* プロフィールモーダル */}
      <ModalWithAnimation isOpen={isProfileModalActive} style={customStyles} onRequestClose={closeProfileModal}>
        <ProfileModal isShowNotification={isShowNotification}>
          <div className="profileArea">
            <Ver>Ver. {Const.SPA_VERSION}</Ver>
            <ProfileContainer>
              <ProfileImage>
                {jobAuth.user.profileImg ? (
                  <ProfileImageIcon src={`data:image/png;base64,${jobAuth.user.profileImg}`} />
                ) : (
                  <ProfileDefaultUserIcon />
                )}
              </ProfileImage>
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
      <ModalWithAnimation isOpen={isEditImageModalActive} style={customImageModalStyles} onRequestClose={returnToProfileModal}>
        <EditImageModal>
          {imageSrc && (
            <ReactCropCustom
              src={(imageSrc as string) || ""}
              onImageLoaded={onImageLoaded}
              onChange={onCropChange}
              onComplete={onCropComplete}
              crop={crop}
              style={{
                maxHeight: `${reactCropMaxHeight}px`,
                width: isVerticalPicture ? "auto" : "100%",
                height: isVerticalPicture ? "100%" : "auto",
              }}
              imageStyle={{
                width: isVerticalPicture ? "auto" : "100%",
                height: isVerticalPicture ? "100%" : "auto",
              }}
              keepSelection
            />
          )}
          <EditImageButtons>
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
    </Wrapper>
  );
};

const customStyles: Modal.Styles = {
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

const Wrapper = styled.div`
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

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  a {
    color: #346181;
  }
`;

const BellBadge = styled.div<{ isPc: boolean }>`
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

const ModalContainer = styled.div`
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

const MenuModal = styled(ModalContainer)<{ isShowNotification: boolean }>`
  &::before,
  &::after {
    right: ${(props) => (props.isShowNotification ? "38px" : "54px")};
  }
`;

const MenuListContainer = styled.div`
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

const ProfileModal = styled(ModalContainer)<{ isShowNotification: boolean }>`
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

const Ver = styled.div`
  text-align: end;
`;

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;
const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  min-width: 60px;
  margin-right: 12px;
  border-radius: 50%;
  border: 1px solid #c9d3d0;
  display: flex;
  justify-content: space-between;
`;
const ProfileImageIcon = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
const ProfileTable = styled.table`
  line-height: 20px;
  td:first-child {
    padding-right: 5px;
    font-size: 12px;
    color: #2fadbd;
    min-width: 80px;
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
const EditImageModal = styled(ModalContainer)`
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

const EditImageButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 26px auto;
  button {
    width: 100px;
  }
`;

const ProfileDefaultUserIcon = styled.img.attrs({ src: profileSvg })`
  height: 60px;
  width: 60px;
  margin-left: -1px;
  margin-top: -1px;
`;

const ReactCropCustom = styled(ReactCrop)`
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

const UserIcon = styled.img.attrs({ src: iconUserSkeletonSvg })`
  height: 28px;
  width: 28px;
  vertical-align: bottom;
`;
const PlaneIcon = styled.img.attrs({ src: iconPlaneSkeletonSvg })`
  height: 32px;
  width: 32px;
  vertical-align: bottom;
`;
const BellIcon = styled.img.attrs({ src: iconBellSkeletonSvg })`
  height: 32px;
  width: 32px;
  vertical-align: bottom;
`;
const MenuIcon = styled.img.attrs({ src: iconMenuSvg })`
  height: 36px;
  width: 36px;
  vertical-align: bottom;
`;

const BBIcon = styled.img.attrs({ src: iconBbSvg })`
  height: 36px;
  width: 36px;
  vertical-align: bottom;
`;

export default SPCommonFooter;
