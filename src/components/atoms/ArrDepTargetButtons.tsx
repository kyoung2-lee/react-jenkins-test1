import React from "react";
import styled from "styled-components";
import arrDepDifferIconSvg from "../../assets/images/icon/arr_dep_different.svg";
import arrDepSameIconSvg from "../../assets/images/icon/arr_dep_same.svg";
import arrIconSvg from "../../assets/images/icon/arr_only.svg";
import depIconSvg from "../../assets/images/icon/dep_only.svg";
import { storage } from "../../lib/storage";

export type Target = "ARR_DEP_SAME" | "ARR" | "DEP" | "ARR_DEP_DIFF" | null;

export interface Props {
  fixed?: boolean;
  selectedTarget: Target;
  onClickTarget: (target: Target) => void;
}

const ArrDepTargetButtons: React.FC<Props> = (props: Props) => {
  const { fixed, selectedTarget, onClickTarget } = props;
  return (
    <Container>
      <label>Target</label>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={() => onClickTarget("ARR_DEP_SAME")}
          disabled={fixed && selectedTarget !== "ARR_DEP_SAME"}
          isPc={storage.isPc}
          isActive={selectedTarget === "ARR_DEP_SAME"}
        >
          <ArrDepSameIcon />
        </Button>
        <Button
          type="button"
          onClick={() => onClickTarget("ARR")}
          disabled={fixed && selectedTarget !== "ARR"}
          isPc={storage.isPc}
          isActive={selectedTarget === "ARR"}
        >
          <ArrIcon />
        </Button>
        <Button
          type="button"
          onClick={() => onClickTarget("DEP")}
          disabled={fixed && selectedTarget !== "DEP"}
          isPc={storage.isPc}
          isActive={selectedTarget === "DEP"}
        >
          <DepIcon />
        </Button>
        <Button
          type="button"
          onClick={() => onClickTarget("ARR_DEP_DIFF")}
          disabled={fixed && selectedTarget !== "ARR_DEP_DIFF"}
          isPc={storage.isPc}
          isActive={selectedTarget === "ARR_DEP_DIFF"}
        >
          <ArrDepDifferIcon />
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: left;
  padding: 0 11px 10px;
  > label {
    color: #222222;
    font-size: 12px;
    margin: auto 8px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const ArrIcon = styled.img.attrs({ src: arrIconSvg })``;

const DepIcon = styled.img.attrs({ src: depIconSvg })``;

const ArrDepSameIcon = styled.img.attrs({ src: arrDepSameIconSvg })``;

const ArrDepDifferIcon = styled.img.attrs({ src: arrDepDifferIconSvg })``;

const Button = styled.button<{ isPc: typeof storage.isPc; isActive: boolean }>`
  width: 80px;
  background: ${({ isActive, theme }) => (isActive ? "#E6B422" : theme.color.button.SECONDARY)};
  height: 32px;
  color: ${(props) => props.theme.color.WHITE};
  border-radius: 4px;
  padding: 0;
  border: solid 1px ${(props) => props.theme.color.PRIMARY};
  font-size: 10px;
  margin: auto 4px;

  ${({ disabled, theme, isPc, isActive }) =>
    disabled
      ? "opacity: 0.6;"
      : `
      cursor: pointer;
      box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
      ${
        isPc
          ? `
        &:hover, &:focus {
          background: ${isActive ? "#E6B422" : theme.color.button.SECONDARY_HOVER};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
        &:active {
          background: ${isActive ? "#E6B422" : theme.color.button.SECONDARY_ACTIVE};
        }
      `
          : `
        &:active {
          background: ${isActive ? "#E6B422" : theme.color.button.SECONDARY_ACTIVE};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
      `
      }
  `};
  img {
    width: 64px;
    height: 20px;
    margin: 5px auto;
  }
`;

export default ArrDepTargetButtons;
