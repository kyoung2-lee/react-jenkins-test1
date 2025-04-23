import React, { useState, useRef } from "react";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { funcAuthCheck } from "../../../../lib/commonUtil";
import { Const } from "../../../../lib/commonConst";
import { setAirportRemarks } from "../../../../reducers/common";
import UpdateRmksPopup from "../../../molecules/UpdateRmksPopup";

const SPCommonSubHeader: React.FC = () => {
  const dispatch = useAppDispatch();

  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);

  const [rmksPopupIsOpen, setRmksPopupIsOpen] = useState(false);
  const [rmksPopupWidth, setRmksPopupWidth] = useState(0);
  const [rmksPopupHeight, setRmksPopupHeight] = useState(0);
  const [rmksPopupTop, setRmksPopupTop] = useState(0);
  const [rmksPopupLeft, setRmksPopupLeft] = useState(0);

  const rmksTextRef = useRef<HTMLDivElement>(null);

  const isRmksEnabled = () =>
    !!jobAuth.user.myApoCd &&
    jobAuth.user.myApoCd === common.headerInfo.apoCd &&
    funcAuthCheck(Const.FUNC_ID.updateAireportRemarks, jobAuth.jobAuth);

  const openRmksPopup = () => {
    const node = rmksTextRef.current;
    if (node) {
      setRmksPopupIsOpen(true);
      setRmksPopupWidth(node.clientWidth);
      setRmksPopupHeight(node.clientHeight);
      setRmksPopupTop(node.getBoundingClientRect().top);
      setRmksPopupLeft(node.getBoundingClientRect().left);
    }
  };

  const closeRmksPopup = () => {
    setRmksPopupIsOpen(false);
  };

  const updateRmks = (text: string) => {
    if (text.length <= 2048) {
      dispatch(setAirportRemarks(text));
    }
  };

  const { apoRmksInfo } = common.headerInfo;

  return (
    <Wrapper>
      <AptRmksContainer ref={rmksTextRef} onClick={openRmksPopup} isEmpty={!apoRmksInfo}>
        <div>{apoRmksInfo || "Airport Remarks"}</div>
      </AptRmksContainer>

      <UpdateRmksPopup
        isOpen={rmksPopupIsOpen}
        width={rmksPopupWidth}
        height={rmksPopupHeight}
        top={rmksPopupTop}
        left={rmksPopupLeft}
        initialRmksText={apoRmksInfo}
        isSubmitable={isRmksEnabled()}
        placeholder="Airport Remarks"
        onClose={closeRmksPopup}
        update={updateRmks}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.color.HEADER_GRADIENT};
`;

const AptRmksContainer = styled.div<{ isEmpty: boolean }>`
  width: 100%;
  max-width: 700px;
  min-height: 56px;
  padding: 6px 10px 5px;
  line-height: 20px;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${(props) => props.theme.color.WHITE};
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 1px 1px #ccc inset;
  cursor: pointer;
`;

export default SPCommonSubHeader;
