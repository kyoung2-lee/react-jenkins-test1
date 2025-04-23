import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

interface Props {
  value: string;
  className?: string;
  jstFlg: boolean;
}

export const MessagePostedAt: React.FC<Props> = ({ value, className, jstFlg }) => (
  <Time className={className}>
    {dayjs(value).format("YYYY/MM/DD HH:mm")}
    {jstFlg ? "" : "L"}
  </Time>
);

const Time = styled.time`
  display: block;
  margin-right: 20px;
  font-size: 13px;
`;
