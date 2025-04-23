import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type Props = {
  totalNumber: number;
  isModalComponent?: boolean;
  style?: React.CSSProperties;
};

const FlightListHeader: React.FC<Props> = (props) => {
  const flightListHeaderScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // form上の初期フォーカス項目からフォーカスを外し、上下キーによるスクロールを可能にする
    if (flightListHeaderScrollRef.current) {
      flightListHeaderScrollRef.current.focus();
    }
    // これにより、便一覧画面Submit後のスクロール最上部の項目が、FlightListHeaderに設定される
    if (flightListHeaderScrollRef.current) {
      flightListHeaderScrollRef.current.scrollIntoView();
    }
  }, []);

  return (
    <Wrapper
      // 便一覧画面の場合、tabIndexを与えないとfocusが効かないため、便一覧画面表示時にのみ有効にしている
      // 機材接続情報モードレスの場合、tabIndexを設定した場合、クリック時にもfocusが効かなくなるため外してある
      {...(props.isModalComponent ? {} : { tabIndex: -1, ref: flightListHeaderScrollRef })}
      style={props.style}
    >
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>
              Total<span className="total">{props.totalNumber}</span>
            </th>
          </tr>
        </thead>
      </table>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  table {
    width: 100%;
    padding: 0 5px;
    border-spacing: 0px;
    background: #119ac2;
  }
  thead {
    th {
      padding-top: 3px;
      font-size: 12px;
      line-height: 16px;
      text-align: left;
      font-weight: normal;
      color: #fff;
    }
  }
  thead > tr > th:nth-child(1) {
    width: 76px;
    padding-left: 5px;
  }
  thead > tr > th:nth-child(2) {
    width: 116px;
    padding-left: 3px;
  }
  thead > tr > th:nth-child(3) {
    width: 50px;
    padding-left: 2px;
  }
  thead > tr > th:nth-child(4) {
    text-align: right;
  }
  .total {
    margin-left: 8px;
    font-size: 18px;
  }
`;

export default FlightListHeader;
