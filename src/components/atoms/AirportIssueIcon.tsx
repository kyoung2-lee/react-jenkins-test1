import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import ApoIconSww0Svg from "../../assets/images/status/apo_sww_0.svg";
import ApoIconSww1Svg from "../../assets/images/status/apo_sww_1.svg";
import ApoIconSww2Svg from "../../assets/images/status/apo_sww_2.svg";
import ApoIconSww3Svg from "../../assets/images/status/apo_sww_3.svg";
import ApoIconSwwCnlSvg from "../../assets/images/status/apo_sww_cnl.svg";
import ApoIconTsw0Svg from "../../assets/images/status/apo_tsw_0.svg";
import ApoIconTsw1Svg from "../../assets/images/status/apo_tsw_1.svg";
import ApoIconTsw2Svg from "../../assets/images/status/apo_tsw_2.svg";
import ApoIconTswCnlSvg from "../../assets/images/status/apo_tsw_cnl.svg";
import ApoIconDicSvg from "../../assets/images/status/apo_dic.svg";
import ApoIconRclSvg from "../../assets/images/status/apo_rcl.svg";
import ApoIconSspSvg from "../../assets/images/status/apo_ssp.svg";
import ApoIconSec1Svg from "../../assets/images/status/apo_sec_1.svg";
import ApoIconSec2Svg from "../../assets/images/status/apo_sec_2.svg";
import ApoIconSec3Svg from "../../assets/images/status/apo_sec_3.svg";

// Nullを返却したいのでComponentではなくfunctionにした
function getIssueIcon({ issu, key, terminalUtcDate }: { issu: HeaderInfoApi.Issu; key: string; terminalUtcDate: dayjs.Dayjs | null }) {
  let utcDate = null;
  switch (issu.issuCd) {
    case "SEC":
      switch (issu.issuDtlCd) {
        case "LV1":
          return <ApoIconSec1 key={key} />;
        case "LV2":
          return <ApoIconSec2 key={key} />;
        case "LV3":
          return <ApoIconSec3 key={key} />;
        default:
          return "";
      }
    case "SWW":
      switch (issu.issuDtlCd) {
        case "WAR":
          return <ApoIconSww0 key={key} />;
        case "CD1":
          return <ApoIconSww1 key={key} />;
        case "CD2":
          return <ApoIconSww2 key={key} />;
        case "CD3":
          return <ApoIconSww3 key={key} />;
        case "CNL":
          // 24時間だけ表示する
          utcDate = dayjs.utc(issu.updateTime);
          if (terminalUtcDate && terminalUtcDate.diff(utcDate, "hour") >= 24) {
            return "";
          }
          return <ApoIconSwwCnl key={key} />;

        default:
          return "";
      }
    case "TSW":
      switch (issu.issuDtlCd) {
        case "WAR":
          return <ApoIconTsw0 key={key} />;
        case "CD1":
          return <ApoIconTsw1 key={key} />;
        case "CD2":
          return <ApoIconTsw2 key={key} />;
        case "CNL":
          // 24時間だけ表示する
          utcDate = dayjs.utc(issu.updateTime);
          if (terminalUtcDate && terminalUtcDate.diff(utcDate, "hour") >= 24) {
            return "";
          }
          return <ApoIconTswCnl key={key} />;

        default:
          return "";
      }
    case "DIC":
      switch (issu.issuDtlCd) {
        case "ON":
          return <ApoIconDic key={key} />;
        default:
          return "";
      }
    case "RCL":
      switch (issu.issuDtlCd) {
        case "ON":
          return <ApoIconRcl key={key} />;
        default:
          return "";
      }
    case "SSP":
      switch (issu.issuDtlCd) {
        case "ON":
          return <ApoIconSsp key={key} />;
        default:
          return "";
      }
    default:
      return "";
  }
}

const ApoIconSww0 = styled.img.attrs({ src: ApoIconSww0Svg })``;
const ApoIconSww1 = styled.img.attrs({ src: ApoIconSww1Svg })``;
const ApoIconSww2 = styled.img.attrs({ src: ApoIconSww2Svg })``;
const ApoIconSww3 = styled.img.attrs({ src: ApoIconSww3Svg })``;
const ApoIconSwwCnl = styled.img.attrs({ src: ApoIconSwwCnlSvg })``;
const ApoIconTsw0 = styled.img.attrs({ src: ApoIconTsw0Svg })``;
const ApoIconTsw1 = styled.img.attrs({ src: ApoIconTsw1Svg })``;
const ApoIconTsw2 = styled.img.attrs({ src: ApoIconTsw2Svg })``;
const ApoIconTswCnl = styled.img.attrs({ src: ApoIconTswCnlSvg })``;
const ApoIconDic = styled.img.attrs({ src: ApoIconDicSvg })``;
const ApoIconRcl = styled.img.attrs({ src: ApoIconRclSvg })``;
const ApoIconSsp = styled.img.attrs({ src: ApoIconSspSvg })``;
const ApoIconSec1 = styled.img.attrs({ src: ApoIconSec1Svg })``;
const ApoIconSec2 = styled.img.attrs({ src: ApoIconSec2Svg })``;
const ApoIconSec3 = styled.img.attrs({ src: ApoIconSec3Svg })``;

export default getIssueIcon;
