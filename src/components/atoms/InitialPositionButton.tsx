import React from "react";
import styled from "styled-components";
import scrollTopIcon from "../../assets/images/icon/icon-scroll-top.svg";

interface Props {
  isDisplaying: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const InitialPositionButton: React.FC<Props> = (props: Props) => {
  const { isDisplaying, onClick } = props;
  return isDisplaying ? (
    <ScrollToTopIconContainer onClick={onClick}>
      <ScrollTopIcon />
    </ScrollToTopIconContainer>
  ) : (
    <DummyContainer />
  );
};

const ScrollToTopIconContainer = styled.div<{ isFiltered?: boolean }>`
  width: 60px;
  height: 60px;
  background: ${(props) => (props.isFiltered ? "#eda63c" : props.theme.color.PRIMARY)};
  border: 2px solid ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.isFiltered ? "#ED8E01" : props.theme.color.button.PRIMARY_HOVER)};
  }
  &:active {
    background: ${(props) => (props.isFiltered ? "#B57913" : props.theme.color.button.PRIMARY_ACTIVE)};
  }
`;

const ScrollTopIcon = styled.img.attrs({ src: scrollTopIcon })`
  width: 30px;
  height: 20.46px;
  margin-top: 5px;
  fill: ${(props) => props.theme.color.PRIMARY_BASE};
`;

const DummyContainer = styled.div`
  width: 60px;
  height: 60px;
  pointer-events: none;
`;

export default InitialPositionButton;
