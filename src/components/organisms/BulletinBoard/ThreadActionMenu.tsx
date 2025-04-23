import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { ServerConfig } from "../../../../config/config";
import { ActionMenu } from "./ActionMenu";
import { RootState } from "../../../store/storeType";
import { openBulletinBoardResponseModal } from "../../../reducers/bulletinBoardResponseEditorModal";
import { funcAuthCheck } from "../../../lib/commonUtil";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import SubmenuBbSvg from "../../../assets/images/menu/submenu-bb.svg";
import SubmenuMailSvg from "../../../assets/images/menu/submenu-mail.svg";

interface Props {
  bbId: number;
  postUserJobCd: string;
  onDelete: (bbId: number) => void;
  jobAuth: RootState["account"]["jobAuth"];
  editing: boolean;
  archiveFlg: boolean;
  handleCloseModal?: () => void;
  canEditOrShare: boolean;
  clearCommentStorage: () => void;
  toggleActionMenu: () => void;
}

const Component: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const bbShare = () => {
    const path = `/broadcast?from=bbShare&id=${props.bbId}&archive=${props.archiveFlg.toString()}`;
    if (storage.isPc) {
      window.open(`${ServerConfig.BASE_ROUTE}${path}`, "_blank");
    } else {
      history.push(path);
      closeModal();
    }
  };

  const emailShare = () => {
    const path = `/broadcast?from=emailShare&id=${props.bbId}&archive=${props.archiveFlg.toString()}`;
    if (storage.isPc) {
      window.open(`${ServerConfig.BASE_ROUTE}${path}`, "_blank");
    } else {
      history.push(path);
      closeModal();
    }
  };

  const openResponseEditor = () => {
    dispatch(openBulletinBoardResponseModal({ bbId: props.bbId }));
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

  const canBroadcastBbOpen = () => funcAuthCheck(Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth) && !storage.isIphone;

  const responsable = () => !props.archiveFlg && funcAuthCheck(Const.FUNC_ID.updateBulletinBoardRes, props.jobAuth.jobAuth);

  const editable = () =>
    props.canEditOrShare && !props.archiveFlg && props.postUserJobCd === props.jobAuth.user.jobCd && canBroadcastBbOpen();

  const deletable = () =>
    !props.archiveFlg &&
    props.postUserJobCd === props.jobAuth.user.jobCd &&
    funcAuthCheck(Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth);

  const bbShareable = () => props.canEditOrShare && canBroadcastBbOpen();

  const emailShareable = () => props.canEditOrShare && funcAuthCheck(Const.FUNC_ID.openBroadcastEmail, props.jobAuth.jobAuth);

  const actions = () => [
    ...(responsable() ? [{ title: "Response", onClick: openResponseEditor }] : []),
    ...(editable() ? [{ title: "Edit", onClick: edit }] : []),
    ...(deletable() ? [{ title: "Delete", onClick: deleteThread }] : []),
    ...(bbShareable() ? [{ icon: SubmenuBbSvg, title: "Share", onClick: bbShare }] : []),
    ...(emailShareable() ? [{ icon: SubmenuMailSvg, title: "Share", onClick: emailShare }] : []),
  ];

  return (
    <ActionMenu
      actions={actions()}
      editing={props.editing}
      clearCommentStorage={props.clearCommentStorage}
      toggleActionMenu={props.toggleActionMenu}
    />
  );
};

export const ThreadActionMenu = connect((state: RootState) => ({ jobAuth: state.account.jobAuth }))(Component);
