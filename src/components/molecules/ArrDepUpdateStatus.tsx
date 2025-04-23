import React from "react";
import styled from "styled-components";
import UpdateStatusLabel, { Status } from "../atoms/UpdateStatusLabel";

interface Props {
  arrStatus: Status;
  depStatus: Status;
}

const ArrDepUpdateStatus = (props: Props) => {
  const { arrStatus, depStatus } = props;
  return (
    <Wrapper>
      {arrStatus ? (
        <StatusBox>
          <span>ARR:</span>
          <UpdateStatusLabel status={arrStatus} />
        </StatusBox>
      ) : (
        <StatusBox />
      )}
      {depStatus ? (
        <StatusBox>
          <span>DEP:</span>
          <UpdateStatusLabel status={depStatus} />
        </StatusBox>
      ) : (
        <StatusBox />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 34px;
  padding-top: 10px;
  display: flex;
  justify-content: center;
`;

const StatusBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 116px;
  > span {
    vertical-align: middle;
    font-size: 12px;
    color: #8ea6b7;
    padding-right: 2px;
  }
`;

export default ArrDepUpdateStatus;
