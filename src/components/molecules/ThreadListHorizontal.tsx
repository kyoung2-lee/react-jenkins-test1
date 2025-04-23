import React from "react";
import styled from "styled-components";
import { VerticalScroller } from "./VerticalScroller";
import ProfileColor from "../../assets/images/account/profile.svg";

interface Props {
  currentThreadId?: number;
  threads: BulletinBoardThreadFlightApi.Response;
  onSelectThread: (bbId: number) => void;
}

const ThreadListHorizontal: React.FC<Props> = (props) => {
  const { threads, onSelectThread, currentThreadId } = props;

  return (
    <VerticalScroller>
      <ThreadListContent>
        {threads.threads.map((thread) => (
          <ThreadListCol key={`thread#${thread.bbId}`}>
            <ThreadListItem onClick={() => onSelectThread(thread.bbId)} active={currentThreadId === thread.bbId}>
              <ThreadListIcon src={thread.profileTmbImg && `data:image/png;base64,${thread.profileTmbImg}`} />
              <ThreadListTitle>{thread.bbTitle}</ThreadListTitle>
            </ThreadListItem>
          </ThreadListCol>
        ))}
      </ThreadListContent>
    </VerticalScroller>
  );
};

const ThreadListContent = styled.div`
  display: flex;
  height: 46px;
  align-items: center;
  padding: 5px 6px;
`;

const ThreadListCol = styled.div`
  padding: 0 4px;
`;

const ThreadListItem = styled.div<{ active: boolean }>`
  display: flex;
  width: 120px;
  height: 36px;
  padding: 0 6px;
  align-items: center;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  user-select: none;
  ${(props) => props.active && "border: 1px solid #EAA812"};
`;

const ThreadListTitle = styled.div`
  flex: 1;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ThreadListIcon = styled.div<{ src?: string }>`
  width: 28px;
  height: 28px;
  margin-right: 4px;
  border-radius: 14px;
  background-image: url("${(props) => props.src || ProfileColor}");
  background-size: cover;
  background-position: center;
`;

export default ThreadListHorizontal;
