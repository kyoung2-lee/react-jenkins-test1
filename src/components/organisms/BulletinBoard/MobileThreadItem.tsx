import React from "react";
import styled, { css } from "styled-components";
import { ThreadTag } from "./ThreadTag";
import { MessagePostedAt } from "./MessagePostedAt";

interface Props {
  active?: boolean;
  onClick?: (bbId: number) => void;
  bbId: number;
  updateTime: string;
  catCdList: string[];
  bbTitle: string;
  jobCd: string;
  jstFlg: boolean;
}

export const MobileThreadItem: React.FC<Props> = ({ active, onClick, ...thread }) => (
  <Container active={active} onClick={() => onClick && onClick(thread.bbId)}>
    <Header>
      <PostUserGroup>{thread.jobCd}</PostUserGroup>
      <PostedAt value={thread.updateTime} jstFlg={thread.jstFlg} />
    </Header>
    <Title>{thread.bbTitle}</Title>
    <TagContainer>
      {thread.catCdList.map((tag) => (
        <TagCol key={tag}>
          <ThreadTag text={tag} />
        </TagCol>
      ))}
    </TagContainer>
  </Container>
);

const Container = styled.div<{ active?: boolean }>`
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  padding: 10px;
  margin-bottom: 8px;
  margin-right: 3px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.22);
  ${(props) =>
    props.active &&
    css`
      border: 2px solid #eaa812;
      padding: 9px;
    `};
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const PostedAt = styled(MessagePostedAt)`
  flex: 1;
  text-align: right;
  margin: 0;
`;

const Title = styled.p`
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
`;

const PostUserGroup = styled.div`
  font-weight: bold;
  font-size: 15px;
`;

const TagContainer = styled.div`
  display: flex;
  margin: 0 -2px;
`;

const TagCol = styled.div`
  padding: 0 2px;
`;
