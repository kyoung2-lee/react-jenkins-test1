import React from "react";
import { connect } from "react-redux";
import Modal, { Styles } from "react-modal";
import styled from "styled-components";
import { bindActionCreators } from "redux";
import { storage } from "../../lib/storage";
import { RootState, AppDispatch } from "../../store/storeType";
import { closeBulletinBoardAddressModal as closeBulletinBoardAddressModalAction } from "../../reducers/bulletinBoardAddressModal";
import closeIconSvg from "../../assets/images/icon/icon-close.svg";

interface Props {
  isOpen: boolean;
  jobCodes: RootState["bulletinBoardAddressModal"]["jobCodes"];
  closeBulletinBoardAddressModal: typeof closeBulletinBoardAddressModalAction;
}

const Component: React.FC<Props> = (props) => {
  const sortedJobCodes = () => props.jobCodes.slice().sort();

  const { isOpen, closeBulletinBoardAddressModal } = props;

  const handleClickClose = () => closeBulletinBoardAddressModal();
  return (
    <Modal isOpen={isOpen} onRequestClose={handleClickClose} style={customStyles}>
      <Container>
        <CloseIcon onClick={handleClickClose} />
        <Title>B.B. Address Detail</Title>
        <Content>
          {sortedJobCodes().map((code) => (
            <JobCodeCol key={code}>
              <JobCode isPc={storage.isPc}>{code}</JobCode>
            </JobCodeCol>
          ))}
        </Content>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  height: 100%;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
  align-content: flex-start;
`;

const JobCodeCol = styled.div`
  padding: 6px 8px;
`;

const JobCode = styled.div<{ isPc: boolean }>`
  padding: 8px;
  min-width: ${(props) => (props.isPc ? 120 : 124)}px;
  border: 1px solid #346181;
  background-color: #f6f6f6;
`;

const Title = styled.div`
  margin-bottom: 8px;
`;

const CloseIcon = styled.img.attrs({ src: closeIconSvg })`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: ponter;
`;

const customStyles: Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    position: "static",
    width: storage.isIphone ? "322px" : "605px",
    height: "calc(100vh - 80px)",
    left: "calc(50% - 315px)",
    padding: 20,
    overflow: "hidden",
  },
};

export const BulletinBoardAddressModal = connect(
  ({ bulletinBoardAddressModal }: RootState) => ({
    isOpen: bulletinBoardAddressModal.isOpen,
    jobCodes: bulletinBoardAddressModal.jobCodes,
  }),
  (dispatch: AppDispatch) => bindActionCreators({ closeBulletinBoardAddressModal: closeBulletinBoardAddressModalAction }, dispatch)
)(Component);
