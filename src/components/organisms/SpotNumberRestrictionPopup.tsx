import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { storage } from "../../lib/storage";
import { closeSpotNumberRestrictionPopupSuccess, closeSpotNumberRestrictionPopup } from "../../reducers/spotNumberRestrictionPopup";

interface State {
  isActive: boolean; // ポップアップ開閉時のアニメーションに使用
}

const initialState: State = {
  isActive: false,
};

const SpotNumberRestrictionPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const spotNumberRestrictionPopup = useAppSelector((state) => state.spotNumberRestrictionPopup);
  const { isOpen, legInfo, onYesButton, onNoButton } = spotNumberRestrictionPopup;
  const [isActive, setIsActive] = useState(initialState.isActive);

  const onYes = () => {
    dispatch(closeSpotNumberRestrictionPopup());
    onYesButton();
  };

  const onNo = () => {
    dispatch(closeSpotNumberRestrictionPopup());
    onNoButton();
  };

  const onAfterOpen = () => {
    // オープンのアニメーションを開始させる
    setIsActive(true);
  };

  const onAfterClose = () => {
    // クローズのアニメーション完了後にStateを初期化する
    dispatch(closeSpotNumberRestrictionPopupSuccess());
  };

  useEffect(() => {
    if (!isOpen) {
      // ポップアップクローズ時にクローズのアニメーションを開始させる
      setIsActive(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      style={customStyles(isActive)}
      closeTimeoutMS={500}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
    >
      <CustomContainer>
        <CustomHeader>
          <FontAwesomeIcon
            icon={faWarning}
            style={{
              display: "inline-block",
              width: "24px",
              marginRight: "4px",
              color: "rgb(245, 170, 10)",
              fontSize: "20px",
              verticalAlign: "bottom",
            }}
          />
          Warning
        </CustomHeader>
        <CustomMessage>The following flights violate the restrictions. Do you want to continue updating?</CustomMessage>
        <CustomLegInfoList>
          {legInfo.map(({ arr, dep }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={index}>
              {arr ? (
                <CustomLegInfo>
                  {arr.alCd}
                  {arr.fltNo}/{dayjs(arr.orgDateLcl).format("DD")}&nbsp;
                  {arr.lstDepApoCd}-{arr.lstArrApoCd}
                  <br />
                  {arr.status === "2" ? (
                    <>
                      &nbsp;*** Check skipped ***&nbsp;&nbsp;&nbsp;Flight not found
                      <br />
                    </>
                  ) : (
                    ""
                  )}
                  {arr.status === "0" ? (
                    <>
                      {arr.spotRstShipTypeInfo != null ? (
                        <>
                          &nbsp;- SPOT PARKING[EQP]
                          <br />
                        </>
                      ) : (
                        ""
                      )}
                      {arr.spotRstTimeInfo != null && arr.spotRstTimeInfo.length > 0
                        ? arr.spotRstTimeInfo.map(({ rstRsnDispInfo }) => (
                            <React.Fragment key={rstRsnDispInfo}>
                              &nbsp;- SPOT PARKING[TIME] : {rstRsnDispInfo}
                              <br />
                            </React.Fragment>
                          ))
                        : ""}
                      {arr.spotCombRstShipTypeInfo != null && arr.spotCombRstShipTypeInfo.length > 0
                        ? arr.spotCombRstShipTypeInfo.map(({ rstSpotNo, rstShipTypeDiaCd }) => (
                            <React.Fragment key={rstSpotNo}>
                              &nbsp;- SPOT COMBINATION : SPOT/{rstSpotNo}&nbsp;&nbsp;&nbsp;EQP/{rstShipTypeDiaCd}
                              <br />
                            </React.Fragment>
                          ))
                        : ""}
                    </>
                  ) : (
                    ""
                  )}
                </CustomLegInfo>
              ) : (
                ""
              )}
              {dep ? (
                <CustomLegInfo>
                  {dep.alCd}
                  {dep.fltNo}/{dayjs(dep.orgDateLcl).format("DD")}&nbsp;
                  {dep.lstDepApoCd}-{dep.lstArrApoCd}
                  <br />
                  {dep.status === "2" ? (
                    <>
                      &nbsp;*** Check skipped ***&nbsp;&nbsp;&nbsp;Flight not found
                      <br />
                    </>
                  ) : (
                    ""
                  )}
                  {dep.status === "0" ? (
                    <>
                      {dep.spotRstShipTypeInfo != null ? (
                        <>
                          &nbsp;- SPOT PARKING[EQP]
                          <br />
                        </>
                      ) : (
                        ""
                      )}
                      {dep.spotRstTimeInfo != null && dep.spotRstTimeInfo.length > 0
                        ? dep.spotRstTimeInfo.map(({ rstRsnDispInfo }) => (
                            <React.Fragment key={rstRsnDispInfo}>
                              &nbsp;- SPOT PARKING[TIME] : {rstRsnDispInfo}
                              <br />
                            </React.Fragment>
                          ))
                        : ""}
                      {dep.spotCombRstShipTypeInfo != null && dep.spotCombRstShipTypeInfo.length > 0
                        ? dep.spotCombRstShipTypeInfo.map(({ rstSpotNo, rstShipTypeDiaCd }) => (
                            <React.Fragment key={rstSpotNo}>
                              &nbsp;- SPOT COMBINATION : SPOT/{rstSpotNo}&nbsp;&nbsp;&nbsp;EQP/{rstShipTypeDiaCd}
                              <br />
                            </React.Fragment>
                          ))
                        : ""}
                    </>
                  ) : (
                    ""
                  )}
                </CustomLegInfo>
              ) : (
                ""
              )}
            </React.Fragment>
          ))}
        </CustomLegInfoList>
      </CustomContainer>
      <ButtonContainer>
        <CustomButton isPc={storage.isPc} isLeft onClick={onYes}>
          YES
        </CustomButton>
        <CustomButton isPc={storage.isPc} isLeft={false} onClick={onNo}>
          NO
        </CustomButton>
      </ButtonContainer>
    </Modal>
  );
};

Modal.setAppElement("#content");

const customStyles = (isActive: boolean): Modal.Styles => ({
  overlay: {
    zIndex: 999999990 /* reapop(999999999)の下 */,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingBottom: "40px",
  },
  content: {
    position: "static",
    width: "500px",
    maxHeight: "500px",
    borderRadius: "8px",
    borderTop: "2px solid rgb(245, 170, 10)",
    padding: 0,
    overflowY: "hidden",
    transition: "opacity 500ms, transform 500ms",
    opacity: isActive ? 1 : 0,
    transform: isActive ? "translateY(0%)" : "translateY(70%)",
  },
});

const CustomContainer = styled.div`
  display: block;
  margin: 0px;
  padding: 0px 28px;
  max-height: 455px;
  overflow-y: auto;
  font-size: 16px;
  line-height: 18px;
`;

const CustomHeader = styled.div`
  display: block;
  margin: 21px 0px 0px 0px;
  text-align: center;
`;

const CustomMessage = styled.div`
  display: block;
  margin: 7px 0px 0px 0px;
`;

const CustomLegInfoList = styled.div`
  display: block;
  margin: 0px 0px 23px 0px;
`;

const CustomLegInfo = styled.div`
  display: block;
  margin: 10px 0px 0px 0px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: 0px;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
`;

const CustomButton = styled.button<{ isPc: typeof storage.isPc; isLeft: boolean | undefined }>`
  box-sizing: border-box;
  width: 50%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 9%);
  border-left: ${({ isLeft }) => (isLeft ? "0" : "1px solid rgba(0, 0, 0, 9%)")};
  border-right: 0;
  border-bottom: 0;
  background: transparent;
  font-size: 16px;
  ${({ isPc }) =>
    css`
      cursor: pointer;
      ${isPc
        ? css`
            &:hover {
              color: rgb(52, 158, 243);
            }
            &:active {
              color: rgb(34, 142, 229);
            }
          `
        : css`
            &:active {
              color: rgb(52, 158, 243);
            }
          `}
    `};
`;

export default SpotNumberRestrictionPopup;
