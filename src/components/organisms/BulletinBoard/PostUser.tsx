import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { UserAvatar } from "./UserAvatar";
import { RootState } from "../../../store/storeType";
import AddressSvg from "../../../assets/images/icon/address.svg";

interface Props {
  avatar?: string;
  group: string;
  usernameWithNumber: string;
  className?: string;
  onAddressClick?: () => void;
  appleId?: string;
  jobAuth: RootState["account"]["jobAuth"];
  userId: string;
  actionMenu?: () => React.ReactNode;
}

const Component: React.FC<Props> = ({
  jobAuth,
  avatar,
  group,
  usernameWithNumber,
  userId,
  appleId,
  className,
  onAddressClick,
  actionMenu,
}) => {
  const telable = () => !!appleId && jobAuth.user.userId !== userId;

  const openFacetime = () => {
    if (!telable()) return;
    window.location.href = `facetime:${appleId || ""}`;
  };

  return (
    <Container className={className}>
      <UserAvatar src={avatar && `data:image/png;base64,${avatar}`} />
      <PostUserInfo>
        <PostUserGroupContainer>
          <PostUserGroup hasActionMenu={!!actionMenu}>{group}</PostUserGroup>
          {actionMenu && actionMenu()}
          {onAddressClick && <AddressButton onClick={onAddressClick} />}
        </PostUserGroupContainer>
        <PostUserName clickable={telable()} onClick={openFacetime}>
          {usernameWithNumber}
        </PostUserName>
      </PostUserInfo>
    </Container>
  );
};

export const PostUser = connect((state: RootState) => ({ jobAuth: state.account.jobAuth }))(Component);

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const PostUserInfo = styled.div`
  flex: 1;
`;

const PostUserGroupContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PostUserGroup = styled.div<{ hasActionMenu: boolean }>`
  font-weight: bold;
  font-size: 15px;
  ${(props) => (props.hasActionMenu ? "margin: 0 auto 0 0;" : "")}
`;

const PostUserName = styled.div<{ clickable: boolean }>`
  font-size: 13px;
  ${(props) => props.clickable && "text-decoration: underline; color: blue; cursor: pointer; max-width: 85%;"};
`;

const AddressButton = styled.img.attrs({
  src: AddressSvg,
})`
  cursor: pointer;
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;
