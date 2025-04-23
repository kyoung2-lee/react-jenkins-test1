import React from "react";
import styled from "styled-components";

type Props = {
  time: string;
};

const ExcessTime: React.FC<Props> = (props) => (
  <Container>
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="13" viewBox="-0.471 -1.5 9.529 11.5">
      <path d="M5-8,9.526-.151H.469Z" transform="translate(-0.469 8.003)" fill="#e554a6" />
    </svg>
    <div>{props.time}</div>
  </Container>
);

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  color: #e554a6;

  svg {
    margin-right: 2px;
  }
`;

export default ExcessTime;
