import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Master } from "../../../reducers/account";
import { RootState } from "../../../store/storeType";
import { Const } from "../../../lib/commonConst";

interface Props {
  cdCtrlDtls: Master["cdCtrlDtls"];
  text: string; // コードクラスの掲示板カテゴリの「カテゴリ1」が設定される想定です。
}

export const Component: React.FC<Props> = ({ text, cdCtrlDtls }) => {
  const category = () => {
    const matches = cdCtrlDtls.filter((code) => code.cdCls === Const.CodeClass.BULLETIN_BOARD_CATEGORY && code.cdCat1 === text);
    if (matches.length > 0) {
      return { value: matches[0].txt1, color: matches[0].cd1 };
    }

    return { value: text, color: "#888" };
  };

  const cat = category();

  return <Tag themeColor={cat.color}>{cat.value}</Tag>;
};

export const ThreadTag = connect((state: RootState) => ({ cdCtrlDtls: state.account.master.cdCtrlDtls }))(Component);

const Tag = styled.span<{ themeColor: string }>`
  display: inline-flex;
  background-color: ${(props) => props.themeColor};
  color: #fff;
  font-size: 15px;
  padding: 2px 4px;
  border-radius: 4px;
`;
