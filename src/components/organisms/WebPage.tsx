import React from "react";
import styled from "styled-components";
import { storage } from "../../lib/storage";
import { useAppSelector } from "../../store/hooks";

interface Props {
  url: string;
}

const WebPage: React.FC<Props> = (props) => {
  const jobAuth = useAppSelector((state) => state.account.jobAuth);

  return storage.isIpad || storage.isIphone ? (
    <ActualWrapper hasApo={!!jobAuth.user.myApoCd} isIpad={storage.isIpad}>
      <TransWrapper isIpad={storage.isIpad}>
        <Content src={props.url} scrolling="yes" />
      </TransWrapper>
    </ActualWrapper>
  ) : (
    <Wrapper>
      <Content src={props.url} scrolling="yes" />
    </Wrapper>
  );
};

// prettierに自動整形させた場合、改行位置の兼ね合いでエラーが出てしまうため、この場所では無効にする
// prettier-ignore
const ActualWrapper = styled.div<{ hasApo: boolean; isIpad: boolean; }>`
  width: 100vw;
  height: calc(100vh - ${({ theme: { layout: { header, footer } }, hasApo, isIpad }) => isIpad
    ? `${header.tablet}`
    : hasApo
      ? `${header.mobile} - ${footer.mobile}`
      : `${header.statusBar} - ${footer.mobile}`
  });
`;

const TransWrapper = styled.div<{ isIpad: boolean }>`
  width: 100%;
  /* ${({ isIpad }) =>
    isIpad
      ? `height: 125%;
  width: 125%;
  transform: scale(0.8);
  transform-origin: 0 0`
      : "height: 100%"}; */
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - ${({ theme }) => `${theme.layout.header.default}`});
  margin: 0 auto;
  overflow: hidden;
`;

const Content = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

export default WebPage;
