import styled from "styled-components";

export const CsSign = styled.span`
  width: 8px;
  height: 8px;
  background: #f4f085;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 50%;
  display: inline-block;
`;
