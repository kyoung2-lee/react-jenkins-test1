import styled from "styled-components";
import ProfileSvg from "../../../assets/images/account/profile.svg";

export const UserAvatar = styled.div<{ src?: string | number }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 5px;
  background-image: url("${(props) => props.src || ProfileSvg}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
