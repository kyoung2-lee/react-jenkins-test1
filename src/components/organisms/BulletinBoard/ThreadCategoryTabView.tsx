import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import intersection from "lodash.intersection";
import PlusIcon from "../../../assets/images/icon/plus.svg?component";
import { funcAuthCheck } from "../../../lib/commonUtil";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { Master } from "../../../reducers/account";
import { useAppDispatch } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import { showMessage } from "../../../reducers/bulletinBoard";
import EventListener from "../../atoms/EventListener";

interface Props {
  cdCtrlDtls: Master["cdCtrlDtls"];
  onRenderContent: (threads: BulletinBoardThreadsApi.Thread[]) => React.ReactNode;
  threads: RootState["bulletinBoard"]["threads"];
  editing: boolean;
  jobAuth: RootState["account"]["jobAuth"];
}

enum TabName {
  Star = "★",
  Private = "Private",
  Public = "Public",
  Flight = "Flight",
}

type TabNameType = keyof typeof TabName;

const Component: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [activeTab, setActiveTab] = useState<TabNameType>("Star");
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const categories: { [key: string]: string[] } = (() =>
    props.cdCtrlDtls
      .filter((c) => c.cdCls === Const.CodeClass.BULLETIN_BOARD_CATEGORY)
      .map((c) => ({
        value: c.cdCat1,
        group: c.cdCat2,
      }))
      .reduce((p, c) => ({ ...p, [c.group]: [...(p[c.group] || []), c.value] }), {} as { [key: string]: string[] }))();
  const categoriesStar: string[] = (() =>
    props.cdCtrlDtls.filter((c) => c.cdCls === Const.CodeClass.BULLETIN_BOARD_CATEGORY && c.num2 > 0).map((c) => c.cdCat1))();

  const changeTab = (tabName: TabNameType) => {
    setActiveTab(tabName);
    filteredThreads(tabName);
  };

  const filteredThreads = (tabName: TabNameType) => {
    if (!props.threads) return [];
    const { threadList } = props.threads;
    switch (tabName) {
      case "Star":
        // スターのカテゴリをもつスレッドを抽出
        return threadList.filter((item) => intersection(item.catCdList, categoriesStar).length > 0);
      case "Flight":
        // 同カテゴリをもつスレッドを抽出
        return threadList.filter((item) => intersection(item.catCdList, categories.FLIGHT).length > 0);
      case "Public":
        // 同カテゴリをもつスレッドを抽出
        return threadList.filter((item) => intersection(item.catCdList, categories.PUBLIC).length > 0);
      case "Private":
        // FLIGHTとPUBLICのカテゴリを持っていないスレッドを抽出
        return threadList.filter((item) => intersection(item.catCdList, [...categories.FLIGHT, ...categories.PUBLIC]).length === 0);
      default:
        return [];
    }
  };

  const renderContent = () => props.onRenderContent(filteredThreads(activeTab));

  const addBB = () => {
    if (!creatable()) return;
    if (props.editing) {
      void dispatch(
        showMessage({
          message: SoalaMessage.M40012C({
            onYesButton: () => openBb(),
          }),
        })
      );
    } else {
      openBb();
    }
  };

  const openBb = () => history.push("/broadcast?from=new");

  const creatable = () => funcAuthCheck(Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth) && !storage.isIphone;

  const { isPc } = storage;
  return (
    <Container>
      <Tab isPc={isPc}>
        <AddTabButton onClick={addBB} disabled={!creatable()}>
          <PlusIcon />
        </AddTabButton>
        {Object.entries(TabName).map(([key, value]) => (
          <TabItem key={key} active={activeTab === key} onClick={() => changeTab(key as TabNameType)}>
            {value}
          </TabItem>
        ))}
      </Tab>
      <ThreadList isPc={isPc} windowHeight={windowHeight}>
        {renderContent()}
      </ThreadList>
      <EventListener
        eventHandlers={[
          {
            target: window,
            type: "resize",
            listener: () => setWindowHeight(window.innerHeight),
          },
          {
            target: window,
            type: "orientationchange",
            listener: () => setWindowHeight(window.innerHeight),
          },
        ]}
      />
    </Container>
  );
};

export const ThreadCategoryTabView = connect((state: RootState) => ({
  cdCtrlDtls: state.account.master.cdCtrlDtls,
  jobAuth: state.account.jobAuth,
}))(Component);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Tab = styled.div<{ isPc: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-right: ${({ isPc }) => (isPc ? "0px" : "10px")};
`;

const TabItem = styled.div<{ active?: boolean }>`
  user-select: none;
  flex: 1;
  padding: 8px 0;
  text-align: center;
  color: ${(props) => props.theme.color.PRIMARY};
  cursor: pointer;
  ${(props) =>
    props.active &&
    `
    background-color: #fff;
    border-bottom: 2px solid ${props.theme.color.PRIMARY};
    color: ${props.theme.color.PRIMARY};
  `};
`;

const AddTabButton = styled.button<{ disabled: boolean }>`
  flex-basis: 40px;
  color: red;
  border: none;
  background-color: transparent;
  outline: none;
  svg {
    fill: ${(props) => (props.disabled ? "#aaa" : "#346181")};
    width: 20px;
    height: 20px;
  }

  ${(props) =>
    !props.disabled &&
    css`
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    `};
`;

const ThreadList = styled.div<{ isPc: boolean; windowHeight: number }>`
  max-height: ${(props) => props.windowHeight - (props.isPc ? 167 : 209)}px;
  flex: 1;
  flex-basis: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-right: ${({ isPc }) => (isPc ? "0px" : "7px")};
`;
