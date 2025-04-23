import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { AdvanceSearch } from "../../molecules/AdvanceSearch";
import { ThreadItem } from "./ThreadItem";
import { RootState } from "../../../store/storeType";
import { ThreadCategoryTabView } from "./ThreadCategoryTabView";
import { storage } from "../../../lib/storage";

interface Props {
  searchStringParam: string;
  threads: RootState["bulletinBoard"]["threads"];
  filtering: boolean;
  currentThreadId?: number;
  onSelectThread: (bbId: number) => void;
  onOpenFilterModal: (stringParam: string) => void;
  onSubmitFilter: (stringParam: string, onSubmitCallback?: () => void) => void;
  onChangeFilterString: (filterString: string, onAccept: () => void) => void;
  editing: boolean;
  jstFlg: boolean;
}

const Component: React.FC<Props> = (props) => {
  const isActivedThread = (threadId: number) => threadId === props.currentThreadId;

  const { isPc } = storage;
  return (
    <Container isPc={isPc}>
      <Header isPc={isPc}>
        <AdvanceSearch
          placeholder="Search"
          filtering={props.filtering}
          onClickAdvanceSearchFormButton={props.onOpenFilterModal}
          searchStringParam={props.searchStringParam}
          onSubmit={props.onSubmitFilter}
          onChange={props.onChangeFilterString}
        />
      </Header>
      <ThreadCategoryTabView
        threads={props.threads}
        onRenderContent={(threads) =>
          threads.map((thread) => (
            <ThreadItem
              active={isActivedThread(thread.bbId)}
              key={`thread_${thread.bbId}`}
              onClick={props.onSelectThread}
              {...thread}
              jstFlg={props.jstFlg}
            />
          ))
        }
        editing={props.editing}
      />
    </Container>
  );
};

export const ThreadPane = connect()(Component);

const Container = styled.div<{ isPc: boolean }>`
  display: flex;
  flex-direction: column;
  flex-basis: 380px;
  width: 380px;
  padding: ${({ isPc }) => (isPc ? "0 5px 10px 10px" : "0 0 10px 10px")};
`;

const Header = styled.div<{ isPc: boolean }>`
  display: flex;
  height: 60px;
  padding-right: ${({ isPc }) => (isPc ? "0px" : "10px")};
  align-items: center;
`;
