import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { AdvanceSearch } from "../../molecules/AdvanceSearch";
import { MobileThreadItem } from "./MobileThreadItem";
import { RootState } from "../../../store/storeType";
import { ThreadCategoryTabView } from "./ThreadCategoryTabView";

interface Props {
  searchStringParam: string;
  onSelectThread: (bbId: number) => void;
  threads: RootState["bulletinBoard"]["threads"];
  filtering: boolean;
  currentThreadId?: number;
  onOpenFilterModal: (stringParam: string) => void;
  onSubmitFilter: (stringParam: string, onSubmitCallback?: () => void) => void;
  onChangeFilterString: (filterString: string, onAccept: () => void) => void;
  editing: boolean;
  jstFlg: boolean;
}

const Component: React.FC<Props> = (props) => {
  const isActivedThread = (threadId: number) => threadId === props.currentThreadId;

  return (
    <Container>
      <Header>
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
            <MobileThreadItem
              active={isActivedThread(thread.bbId)}
              key={`thread_${thread.bbId}`}
              onClick={props.onSelectThread}
              jstFlg={props.jstFlg}
              {...thread}
            />
          ))
        }
        editing={props.editing}
      />
    </Container>
  );
};

export const MobileThreadPane = connect()(Component);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 320px;
  width: 320px;
  padding: 0px 0px 10px 7px;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  height: 60px;
  align-items: center;
  padding-right: 10px;
`;
