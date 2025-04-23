import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _chunk from "lodash.chunk";
import dayjs from "dayjs";
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";

import { funcAuthCheck, formatFltNo, separateWithComma } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import Blade from "../../assets/images/icon/blade.svg";
import { FlightDetail as FlightDetailState, FlightKey } from "../../reducers/flightContents";
import { fetchFlightDetail, type showConfirmation } from "../../reducers/flightContentsFlightDetail";
import { JobAuth, Master } from "../../reducers/account";
import UpdateRmksPopup from "./UpdateRmksPopup";
import FlightStatusBoPng from "../../assets/images/flight_detail/1.BO_animated.png";
import FlightStatusBcPng from "../../assets/images/flight_detail/2.BC.png";
import FlightStatusDorPng from "../../assets/images/flight_detail/3.DOR.png";
import FlightStatusDepTaxiPng from "../../assets/images/flight_detail/4.DEP_TAXI.png";
import FlightStatusTakeOffPng from "../../assets/images/flight_detail/5.TakeOff.png";
import FlightStatusInFltPng from "../../assets/images/flight_detail/6.IN_FLT.png";
import FlightStatusAppPng from "../../assets/images/flight_detail/7.APP_animated.png";
import FlightStatusAppTaxiPng from "../../assets/images/flight_detail/8.ARR_TAXI.png";
import FlightStatusAtaPng from "../../assets/images/flight_detail/9.ATA.png";

interface Props {
  flightDetail: FlightDetailState;
  flightKey: FlightKey;
  jobAuth: JobAuth;
  master: Master;
  isUtc: boolean;
  connectDbCat?: ConnectDbCat;
  scrollContentRef?: React.RefObject<HTMLDivElement>;
  scrollContentOnClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  fetchFlightDetail: typeof fetchFlightDetail;
  updateFlightRmksDep: (rmksText: string, closePops: () => void) => void;
  updateFlightRmksArr: (rmksText: string, closePops: () => void) => void;
  showConfirmation: typeof showConfirmation;
}

const FlightDetail: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const flightDetailScrollRefDefault = useRef<HTMLDivElement>(null);
  const flightDetailScrollRef = props.scrollContentRef || flightDetailScrollRefDefault;
  const depRmksTextRef = useRef<HTMLDivElement>(null);
  const arrRmksTextRef = useRef<HTMLDivElement>(null);
  const [depRmksTextModalIsOpen, setDepRmksTextModalIsOpen] = useState(false);
  const [arrRmksTextModalIsOpen, setArrRmksTextModalIsOpen] = useState(false);
  const [rmksTextModalWidth, setRmksTextModalWidth] = useState(0);
  const [rmksTextModalHeight, setRmksTextModalHeight] = useState(0);
  const [rmksTextModalTop, setRmksTextModalTop] = useState(0);
  const [rmksTextModalLeft, setRmksTextModalLeft] = useState(0);
  const { isPc, isIpad } = storage;

  useEffect(() => {
    if (flightDetailScrollRef.current) {
      flightDetailScrollRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEta = (isUtc: boolean, flightDetail: FlightDetailState) => {
    if (isUtc) {
      if (flightDetail.arr.tentativeEstLdUtc) {
        return flightDetail.arr.tentativeEstLdUtc;
      }
      if (flightDetail.arr.estLdUtc) {
        return flightDetail.arr.estLdUtc;
      }
      if (flightDetail.arr.tentativeEtaUtc) {
        return flightDetail.arr.tentativeEtaUtc;
      }
      if (flightDetail.arr.etaUtc && flightDetail.arr.etaUtc === flightDetail.arr.staUtc) {
        return "SKD";
      }
      return flightDetail.arr.etaUtc;
    }
    if (flightDetail.arr.tentativeEstLdLcl) {
      return flightDetail.arr.tentativeEstLdLcl;
    }
    if (flightDetail.arr.estLdLcl) {
      return flightDetail.arr.estLdLcl;
    }
    if (flightDetail.arr.tentativeEtaLcl) {
      return flightDetail.arr.tentativeEtaLcl;
    }
    if (flightDetail.arr.etaLcl && flightDetail.arr.etaLcl === flightDetail.arr.staLcl) {
      return "SKD";
    }
    return flightDetail.arr.etaLcl;
  };

  const getTentativeEtaCd = (isUtc: boolean, flightDetail: FlightDetailState) => {
    if (isUtc) {
      if (flightDetail.arr.tentativeEstLdUtc) {
        return flightDetail.arr.tentativeEstLdCd;
      }
      if (!flightDetail.arr.estLdUtc && flightDetail.arr.tentativeEtaUtc) {
        return flightDetail.arr.tentativeEtaCd;
      }
      return "";
    }
    if (flightDetail.arr.tentativeEstLdLcl) {
      return flightDetail.arr.tentativeEstLdCd;
    }
    if (!flightDetail.arr.estLdLcl && flightDetail.arr.tentativeEtaLcl) {
      return flightDetail.arr.tentativeEtaCd;
    }
    return "";
  };

  const getCurrentWorkStepSeq = (standardWorkStep: FlightDetailApi.WorkStep[]) => {
    let currentWorkStepSeq = -1;
    for (let i = 0; i < standardWorkStep.length; i++) {
      if (standardWorkStep[i].workEndFlg) {
        currentWorkStepSeq = standardWorkStep[i].workStepSeq + 1;
      }
    }
    return currentWorkStepSeq;
  };

  const openDepRmksText = () => {
    if (isRmksEnabled(props.flightDetail.dep.lstDepApoCd)) {
      const { flightKey } = props;
      const openRmksPopup = () => {
        const nodeDepRmksText = depRmksTextRef.current;
        const nodeWrapper = flightDetailScrollRef.current;
        if (nodeDepRmksText && nodeWrapper) {
          const nodeDepRmksTextTop = nodeDepRmksText.getBoundingClientRect().top;
          const nodeWrapperTop = nodeWrapper.getBoundingClientRect().top;
          setDepRmksTextModalIsOpen(true);
          setRmksTextModalWidth(nodeDepRmksText.clientWidth);
          setRmksTextModalHeight(nodeDepRmksText.clientHeight);
          setRmksTextModalTop(nodeDepRmksTextTop < nodeWrapperTop || !isPc ? nodeWrapperTop : nodeDepRmksTextTop);
          setRmksTextModalLeft(nodeDepRmksText.getBoundingClientRect().left);
        }
      };
      const closeRmksPopup = () => {
        setDepRmksTextModalIsOpen(false);
      };
      void dispatch(props.fetchFlightDetail({ flightKey, isReload: true, openRmksPopup, closeRmksPopup }));
    }
  };

  const openArrRmksText = () => {
    if (isRmksEnabled(props.flightDetail.arr.lstArrApoCd)) {
      const { flightKey } = props;
      const openRmksPopup = () => {
        const nodeArrRmksText = arrRmksTextRef.current;
        const nodeWrapper = flightDetailScrollRef.current;
        if (nodeArrRmksText && nodeWrapper) {
          const nodeArrRmksTextTop = nodeArrRmksText.getBoundingClientRect().top;
          const nodeWrapperTop = nodeWrapper.getBoundingClientRect().top;
          setArrRmksTextModalIsOpen(true);
          setRmksTextModalWidth(nodeArrRmksText.clientWidth);
          setRmksTextModalHeight(nodeArrRmksText.clientHeight);
          setRmksTextModalTop(nodeArrRmksTextTop < nodeWrapperTop || !isPc ? nodeWrapperTop : nodeArrRmksTextTop);
          setRmksTextModalLeft(nodeArrRmksText.getBoundingClientRect().left);
        }
      };
      const closeRmksPopup = () => {
        setDepRmksTextModalIsOpen(false);
      };
      void dispatch(props.fetchFlightDetail({ flightKey, isReload: true, openRmksPopup, closeRmksPopup }));
    }
  };

  const closeDepRmksText = (rmksText: string) => {
    if (props.flightDetail.dep.depRmksText === rmksText) {
      setDepRmksTextModalIsOpen(false);
    } else {
      void dispatch(
        props.showConfirmation({
          onClickYes: () => {
            setDepRmksTextModalIsOpen(false);
          },
        })
      );
    }
  };

  const closeArrRmksText = (rmksText: string) => {
    if (props.flightDetail.arr.arrRmksText === rmksText) {
      setArrRmksTextModalIsOpen(false);
    } else {
      void dispatch(
        props.showConfirmation({
          onClickYes: () => {
            setArrRmksTextModalIsOpen(false);
          },
        })
      );
    }
  };

  const isRmksEnabled = (apoCd: string): boolean =>
    props.connectDbCat === "O" &&
    props.jobAuth.user.myApoCd === apoCd &&
    funcAuthCheck(Const.FUNC_ID.updateFlightRemarks, props.jobAuth.jobAuth);

  const { flightDetail, flightKey, master, isUtc, scrollContentOnClick } = props;

  if (!flightDetail) {
    return <Wrapper ref={flightDetailScrollRef} onClick={scrollContentOnClick} />;
  }

  let announceToPaxUrl = "";
  if (flightDetail && flightDetail.dep && flightDetail.flight) {
    // マスタデータから、際内区分とデバイス区分を基にして、遷移先のベースURLを取得します
    const intDom = flightDetail.flight.intDomCat === "D" ? "DOM" : "INT";
    const terminalCatCode = isPc ? "PC" : isIpad ? "IPAD" : "IPHONE";
    const targetCdCtrlDtl013 = master.cdCtrlDtls.find((e) => e.cdCls === "013" && e.cdCat1 === `${intDom}.${terminalCatCode}`);

    if (targetCdCtrlDtl013) {
      const { txt1, txt2, txt3, txt4, txt5 } = targetCdCtrlDtl013;
      const urlTemplate = (txt1 ?? "") + (txt2 ?? "") + (txt3 ?? "") + (txt4 ?? "") + (txt5 ?? "");
      // マスタデータから、ICAO航空会社コードを取得します
      const alCdCtrlDtl012 = master.cdCtrlDtls.find((e) => e.cdCls === "012" && e.cdCat1 === flightDetail.flight.alCd);

      // URLのパラメータを設定
      const icaoAirlineCode = alCdCtrlDtl012 ? alCdCtrlDtl012.cd1 : ""; // 航空会社コード（３レター）
      const airlineCode = flightDetail.flight.alCd; // 航空会社コード（２レター）
      const trCode = flightDetail.flight.trAlCd; // 運送会社コード（２レター）
      const flightNo = flightDetail.flight.fltNo; // 便番号
      const depDate = dayjs(flightDetail.dep.stdLcl, "YYYY-MM-DDTHH:mm:ss").isValid()
        ? dayjs(flightDetail.dep.stdLcl, "YYYY-MM-DDTHH:mm:ss").format("YYYYMMDD")
        : ""; // STD LOCAL（YYYYMMDD形式）

      const variables = { icaoAirlineCode, airlineCode, trCode, flightNo, depDate };

      announceToPaxUrl = urlTemplate.replace(/{(.*?)}/g, (_, key: string) => variables[key as keyof typeof variables] || `{${key}}`);
    }
  }

  // JAL便判定用
  const airline = master.airlines.find((al) => al.alCd === flightDetail.flight.alCd);
  const jalGrpFlg = airline ? airline.jalGrpFlg : false;

  const edctStatusSign = flightDetail.flight.actEdctUtc ? "Assign" : flightDetail.flight.estEdctUtc ? "Expect" : "";
  const edct = isUtc
    ? flightDetail.flight.actEdctUtc || flightDetail.flight.estEdctUtc
    : flightDetail.flight.actEdctLcl || flightDetail.flight.estEdctLcl;
  const eobt = isUtc
    ? flightDetail.flight.actEdctUtc && flightDetail.flight.actEobtUtc
      ? flightDetail.flight.actEobtUtc
      : ""
    : flightDetail.flight.actEdctLcl && flightDetail.flight.actEobtLcl
    ? flightDetail.flight.actEobtLcl
    : "";
  const edctAndEft = isUtc
    ? flightDetail.dep.sumActEdctUtcAndEftMin || flightDetail.dep.sumEstEdctUtcAndEftMin
    : flightDetail.dep.sumActEdctLclAndEftMin || flightDetail.dep.sumEstEdctLclAndEftMin;
  const std = isUtc ? flightDetail.dep.stdUtc : flightDetail.dep.stdLcl;
  const etd = isUtc
    ? flightDetail.dep.tentativeEtdUtc
      ? flightDetail.dep.tentativeEtdUtc
      : flightDetail.dep.etdUtc && flightDetail.dep.etdUtc === flightDetail.dep.stdUtc
      ? "SKD"
      : flightDetail.dep.etdUtc
    : flightDetail.dep.tentativeEtdLcl
    ? flightDetail.dep.tentativeEtdLcl
    : flightDetail.dep.etdLcl && flightDetail.dep.etdLcl === flightDetail.dep.stdLcl
    ? "SKD"
    : flightDetail.dep.etdLcl;
  // tentativeEtdをみてtentativeEtdCdが表示するべきか判定
  const tentativeEtdCd = isUtc
    ? flightDetail.dep.tentativeEtdUtc
      ? flightDetail.dep.tentativeEtdCd
      : ""
    : flightDetail.dep.tentativeEtdLcl
    ? flightDetail.dep.tentativeEtdCd
    : "";
  const tentativeEtaCd = getTentativeEtaCd(isUtc, flightDetail);
  const atd = isUtc ? flightDetail.dep.atdUtc : flightDetail.dep.atdLcl;
  const actTo = isUtc ? flightDetail.dep.actToUtc : flightDetail.dep.actToLcl;
  const sta = isUtc ? flightDetail.arr.staUtc : flightDetail.arr.staLcl;
  const eta = getEta(isUtc, flightDetail);

  const actLd = isUtc ? flightDetail.arr.actLdUtc : flightDetail.arr.actLdLcl;
  const ata = isUtc ? flightDetail.arr.ataUtc : flightDetail.arr.ataLcl;
  const currentWorkStepSeq = flightDetail.dep.workStep ? getCurrentWorkStepSeq(flightDetail.dep.workStep) : -1;
  // Announce to PAX 表示用
  const paramIsExist =
    flightDetail.flight.trAlCd != null &&
    flightDetail.flight.trAlCd.length > 0 &&
    flightDetail.flight.fltNo != null &&
    flightDetail.flight.fltNo.length > 0 &&
    (flightDetail.dep.atdLcl || flightDetail.dep.etdLcl || flightDetail.dep.stdLcl);
  const targetCdCtrlDtl = master.cdCtrlDtls.find((e) => e.cdCls === "012" && e.cdCat1 === flightDetail.flight.trAlCd);
  const depDlyRsnCd = flightDetail && flightDetail.dep && flightDetail.dep.depDlyRsnCd ? flightDetail.dep.depDlyRsnCd : [];
  const depDlyTime = flightDetail && flightDetail.dep && flightDetail.dep.depDlyTime ? flightDetail.dep.depDlyTime : [];
  const hasDepDly = !!(depDlyRsnCd.length && depDlyTime.length);
  const arrDlyRsnCd = flightDetail && flightDetail.arr && flightDetail.arr.arrDlyRsnCd ? flightDetail.arr.arrDlyRsnCd : [];
  const arrDlyTime = flightDetail && flightDetail.arr && flightDetail.arr.arrDlyTime ? flightDetail.arr.arrDlyTime : [];
  const hasArrDly = !!(arrDlyRsnCd.length && arrDlyTime.length);

  const FlightStatusImage = ata ? (
    <FlightStatusImageAta />
  ) : actLd && !ata ? (
    <FlightStatusImageAppTaxi />
  ) : actTo && !actLd && flightDetail.flight.fisFltSts === "APP" ? (
    <FlightStatusImageApp />
  ) : actTo && !actLd && flightDetail.flight.fisFltSts === "T/O" ? (
    <FlightStatusImageTakeOff />
  ) : actTo && !actLd ? (
    <FlightStatusImageInFlt />
  ) : atd && !actTo ? (
    <FlightStatusImageDepTaxi />
  ) : !atd && (flightDetail.flight.fisFltSts === "DOR" || flightDetail.flight.fisFltSts === "ENG") ? (
    <FlightStatusImageDor />
  ) : !atd && flightDetail.dep.boardingSts === "BC" ? (
    <FlightStatusImageBc />
  ) : !atd && flightDetail.dep.boardingSts === "BO" ? (
    <FlightStatusImageBo />
  ) : (
    ""
  );

  return (
    <>
      <Wrapper key="flightDetailContent" ref={flightDetailScrollRef} tabIndex={-1} onClick={scrollContentOnClick}>
        <Content1>
          <HeaderTable>
            <tbody>
              <tr>
                <th key={`FlightDetailThShipConfEqp_${Date.now()}`}>SHIP/CONF/EQP</th>
                <td className="text_center">{flightDetail.flight.shipNo}</td>
                <td className="text_center">{flightDetail.flight.seatConfCd}</td>
                <td className="text_center">
                  {flightDetail.flight.equipment}
                  {flightDetail.flight.wingletFlg && <BladeIcon />}
                </td>
              </tr>
              {(flightDetail.flight.mayrtnFlg || flightDetail.flight.maydivFlg) && (
                <tr>
                  <th>MDC/MRC</th>
                  <td colSpan={3}>
                    <div className="tdContent">
                      {flightDetail.flight.maydivFlg && (
                        <span className="label" style={{ marginRight: "2px" }}>
                          MDC
                        </span>
                      )}
                      {flightDetail.flight.maydivFlg && (
                        <span style={{ fontSize: "15px" }}>
                          {flightDetail.flight.maydivApoCd ? flightDetail.flight.maydivApoCd.join("/") : ""}
                        </span>
                      )}
                      {flightDetail.flight.mayrtnFlg && (
                        <span className="label" style={{ marginLeft: "7px" }}>
                          MRC
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {(flightDetail.flight.divFlg || flightDetail.flight.atbFlg || flightDetail.flight.gtbFlg) && (
                <tr>
                  <th>DIV/ATB/GTB</th>
                  <td colSpan={3}>
                    <div className="tdContent">
                      {flightDetail.flight.divFlg && (
                        <>
                          <span className="label">DIV▶{flightDetail.arr.lstArrApoCd}</span>
                        </>
                      )}
                      {flightDetail.flight.atbFlg && (
                        <>
                          <span className="label">ATB</span>
                        </>
                      )}
                      {flightDetail.flight.gtbFlg && (
                        <>
                          <span className="label">GTB</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </HeaderTable>
        </Content1>
        <Content2>
          <div className="taskMonitor">
            <div className="taskMonitorRow1">
              {!!flightDetail.dep.workStep &&
                flightDetail.dep.workStep
                  .filter((ws) => ws.fisDispFlg)
                  .map((step, index) => {
                    const complete = step.workEndFlg;
                    const current = currentWorkStepSeq === step.workStepSeq;

                    return (
                      <svg
                        width="60"
                        height="50"
                        viewBox={current ? "0 -4 67 47" : "0 -8 67 47"}
                        stroke={complete ? "#222222" : current ? "none" : "#2799c6"}
                        style={{ zIndex: flightDetail.dep.workStep && flightDetail.dep.workStep.length - index }}
                        key={step.workStepSeq}
                      >
                        <polygon
                          points={current ? "0,0 54,0 66,22 54,44 0,44" : "0,0 54,0 66,18 54,36 0,36"}
                          fill={complete ? "#c9d3d0" : current ? "#32bbe5" : "#ffffff"}
                        />
                        <text
                          x="28"
                          y={current ? 16 : 22}
                          fontSize="12"
                          fontFamily="Avenir"
                          fontWeight={current ? 500 : 300}
                          fill={complete ? "#222222" : current ? "#ffffff" : "#2799c6"}
                          stroke="none"
                          textAnchor="middle"
                        >
                          {step.workStepName.split("<br>").map((word, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <tspan x="30" y={current ? 19 + i * 15 : 16 + i * 13} key={i}>
                              {word}
                            </tspan>
                          ))}
                        </text>
                      </svg>
                    );
                  })}
            </div>
            <div className="taskMonitorRow2">
              <table>
                <tbody>
                  <tr>
                    <th>PLN</th>
                    {flightKey.oalTblFlg ? (
                      flightDetail.dep.workStep && flightDetail.dep.workStep.length ? (
                        flightDetail.dep.workStep
                          .filter((ws) => ws.fisDispFlg)
                          .map((step) => {
                            const plan = isUtc ? step.planWorkEndTimeUtc : step.planWorkEndTimeLcl;
                            return <td key={step.workStepSeq}>{plan ? dayjs(plan).format("HHmm") : ""}</td>;
                          })
                      ) : (
                        <>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </>
                      )
                    ) : (
                      <>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <th>ACT</th>
                    {flightDetail.dep.workStep && flightDetail.dep.workStep.length ? (
                      flightDetail.dep.workStep
                        .filter((ws) => ws.fisDispFlg)
                        .map((step) => {
                          const act = isUtc ? step.actWorkEndTimeUtc : step.actWorkEndTimeLcl;
                          return <td key={step.workStepSeq}>{act ? dayjs(act).format("HHmm") : step.workAutoEndFlg ? "-" : ""}</td>;
                        })
                    ) : (
                      <>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Content2>
        <Content3>
          <Table>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>Ck-in</th>
                <td className="text_center">{flightDetail.dep.acceptanceSts}</td>
                <th>Gate</th>
                <td className="text_center">{flightDetail.dep.boardingSts}</td>
                <th>WB</th>
                <td className="text_center">{flightDetail.dep.lsFlg && "WB"}</td>
              </tr>
              <tr>
                <th>Fuel</th>
                <td colSpan={5}>
                  <div className="tdContent">
                    {separateWithComma(flightDetail.dep.rampFuelLbsWt)}
                    {flightDetail.dep.fuelOrderFlg && <SquareS>S</SquareS>}
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </Content3>
        <ContentDivider />
        <FlightStatusContent marginBottom={FlightStatusImage ? 13 : 5}>{FlightStatusImage}</FlightStatusContent>
        <Content4 isPc={isPc}>
          <div className="title">
            <div className="apoCd">
              <small>DEP</small>
              {flightDetail.dep.lstDepApoCd}
            </div>
            <div>
              <small>Spot</small>
              {flightDetail.dep.depApoSpotNo}
            </div>

            <div>
              <small>Gate</small>
              {flightDetail.dep.depGateNo}
            </div>
            <div>
              <small>EFT</small>
              {flightDetail.dep.eftMin &&
                `00${Math.floor(flightDetail.dep.eftMin / 60)}`.slice(-2) + `00${flightDetail.dep.eftMin % 60}`.slice(-2)}
            </div>
          </div>
          <Table>
            <tbody>
              <tr>
                <th>STD</th>
                <th>ETD{tentativeEtdCd && <span className="tentativeCd">{tentativeEtdCd}</span>}</th>
                <th>ATD</th>
                <th>T/O</th>
              </tr>
              <tr>
                <td>{std && dayjs(std).format("DDHHmm")}</td>
                <td>
                  <div>{etd === "SKD" ? "SKD" : etd && dayjs(etd).format("DDHHmm")}</div>
                </td>
                <td>{atd && dayjs(atd).format("DDHHmm")}</td>
                <td>{actTo && dayjs(actTo).format("DDHHmm")}</td>
              </tr>
              {edctStatusSign && (
                <tr>
                  <th colSpan={4}>ATC Flow Control</th>
                </tr>
              )}
              {edctStatusSign && (
                <tr>
                  <td colSpan={4} className="left">
                    {edctStatusSign && <AtcStyledLabel>{edctStatusSign}</AtcStyledLabel>}
                    {eobt && (
                      <AtcColumn>
                        <label>EOBT</label>
                        {dayjs(eobt).format("HHmm")}
                      </AtcColumn>
                    )}
                    {edct && (
                      <AtcColumn>
                        <label>EDCT</label>
                        {dayjs(edct).format("HHmm")}
                      </AtcColumn>
                    )}
                    {edctAndEft && (
                      <AtcColumn>
                        <label>EDCT+EFT</label>
                        {dayjs(edctAndEft).format("HHmm")}
                      </AtcColumn>
                    )}
                  </td>
                </tr>
              )}
              {hasDepDly && (
                <tr>
                  <th colSpan={3}>DLY Time/Reason</th>
                </tr>
              )}
              {hasDepDly && (
                <tr>
                  {(() => {
                    const dlyList = [];
                    for (let i = 0; i < 3; i++) {
                      if (depDlyTime[i]) {
                        dlyList.push(
                          <td key={i}>
                            {`0000${depDlyTime[i]}`.slice(-4)}
                            {depDlyRsnCd[i] || ""}
                          </td>
                        );
                      } else {
                        dlyList.push(<td key={i} />);
                      }
                    }
                    return dlyList;
                  })()}
                </tr>
              )}
            </tbody>
          </Table>
          <RmksText enabled={isRmksEnabled(flightDetail.dep.lstDepApoCd)} ref={depRmksTextRef} onClick={openDepRmksText}>
            {flightDetail.dep.depRmksText ? flightDetail.dep.depRmksText : <PlaceHolder>DEP Flight Remarks</PlaceHolder>}
          </RmksText>
        </Content4>
        <Content5 isPc={isPc}>
          <div className="title">
            <div className="apoCd">
              <small>ARR</small>
              {flightDetail.arr.lstArrApoCd}
            </div>
            <div className="spot">
              <small>Spot</small>
              {flightDetail.arr.arrApoSpotNo}
            </div>
            {(flightDetail.flight.atbFlg || flightDetail.flight.divFlg) && (
              <div className="originalStation">
                <small>Original</small>
                <span>{flightDetail.arr.skdArrApoCd}</span>
                {sta && dayjs(sta).isValid() && dayjs(sta).format("HHmm")}
              </div>
            )}
          </div>
          <Table>
            <tbody>
              <tr>
                <th>STA</th>
                <th>ETA{tentativeEtaCd && <span className="tentativeCd">{tentativeEtaCd}</span>}</th>
                <th>L/D</th>
                <th>ATA</th>
              </tr>
              <tr>
                <td>{flightDetail.flight.atbFlg || flightDetail.flight.divFlg ? "" : sta && dayjs(sta).format("DDHHmm")}</td>
                <td>{eta === "SKD" ? "SKD" : eta && dayjs(eta).format("DDHHmm")}</td>
                <td>{actLd && dayjs(actLd).format("DDHHmm")}</td>
                <td>{ata && dayjs(ata).format("DDHHmm")}</td>
              </tr>
              {hasArrDly && (
                <tr>
                  <th colSpan={3}>DLY Time/Reason</th>
                </tr>
              )}
              {hasArrDly && (
                <tr>
                  {(() => {
                    const dlyList = [];
                    for (let i = 0; i < 3; i++) {
                      if (arrDlyTime[i]) {
                        dlyList.push(
                          <td key={i}>
                            {`0000${arrDlyTime[i]}`.slice(-4)}
                            {arrDlyRsnCd[i] || ""}
                          </td>
                        );
                      } else {
                        dlyList.push(<td key={i} />);
                      }
                    }
                    return dlyList;
                  })()}
                </tr>
              )}
            </tbody>
          </Table>
          <RmksText enabled={isRmksEnabled(flightDetail.arr.lstArrApoCd)} ref={arrRmksTextRef} onClick={openArrRmksText}>
            {flightDetail.arr.arrRmksText ? flightDetail.arr.arrRmksText : <PlaceHolder>ARR Flight Remarks</PlaceHolder>}
          </RmksText>
        </Content5>
        <ContentDivider />
        <Content6>
          <div className="title">Passenger Information</div>
          <Table>
            <tbody>
              <tr>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <th />
                <th>F</th>
                <th>C/J</th>
                <th>Y</th>
                <th>Total</th>
                <th>INFT</th>
              </tr>
              <tr>
                <td className="tdHead">Salable</td>
                <td>{flightDetail.pax.salable.fCls}</td>
                <td>
                  {flightDetail.pax.salable.cCls === null && flightDetail.pax.salable.jCls === null
                    ? ""
                    : flightDetail.pax.salable.cCls + flightDetail.pax.salable.jCls}
                </td>
                <td>{flightDetail.pax.salable.yCls}</td>
                <td>
                  {flightDetail.pax.salable.fCls === null &&
                  flightDetail.pax.salable.cCls === null &&
                  flightDetail.pax.salable.jCls === null &&
                  flightDetail.pax.salable.yCls === null
                    ? ""
                    : flightDetail.pax.salable.total}
                </td>
                <td>-</td>
              </tr>
              <tr>
                <td className="tdHead">Booked</td>
                <td>{flightDetail.pax.booked.fCls}</td>
                <td>
                  {flightDetail.pax.booked.cCls === null && flightDetail.pax.booked.jCls === null
                    ? ""
                    : flightDetail.pax.booked.cCls + flightDetail.pax.booked.jCls}
                </td>
                <td>{flightDetail.pax.booked.yCls}</td>
                <td>
                  {flightDetail.pax.booked.fCls === null &&
                  flightDetail.pax.booked.cCls === null &&
                  flightDetail.pax.booked.jCls === null &&
                  flightDetail.pax.booked.yCls === null
                    ? ""
                    : flightDetail.pax.booked.total}
                </td>
                <td>-</td>
              </tr>
              <tr>
                <td className="tdHead">Actual</td>
                <td>{flightDetail.pax.actual.fCls}</td>
                <td>
                  {flightDetail.pax.actual.cCls === null && flightDetail.pax.actual.jCls === null
                    ? ""
                    : flightDetail.pax.actual.cCls + flightDetail.pax.actual.jCls}
                </td>
                <td>{flightDetail.pax.actual.yCls}</td>
                <td>
                  {flightDetail.pax.actual.fCls === null &&
                  flightDetail.pax.actual.cCls === null &&
                  flightDetail.pax.actual.jCls === null &&
                  flightDetail.pax.actual.yCls === null
                    ? ""
                    : flightDetail.pax.actual.total}
                </td>
                <td>{flightDetail.pax.actual.inft && `+${flightDetail.pax.actual.inft}`}</td>
              </tr>
            </tbody>
          </Table>
          {paramIsExist &&
            flightDetail.flight.paxCgoCat === "PAX" &&
            jalGrpFlg === true &&
            (flightDetail.flight.svcTypeDiaCd === "OPEN" ||
              flightDetail.flight.svcTypeDiaCd === "CHTR" ||
              flightDetail.flight.svcTypeDiaCd === "PFRY") &&
            (flightDetail.flight.intDomCat !== "D" || targetCdCtrlDtl ? (
              isPc ? (
                <a
                  // eslint-disable-next-line no-script-url
                  href={announceToPaxUrl || "javascript:void(0)"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="announceToPax"
                >
                  Announce to PAX
                  <div>
                    <FontAwesomeIcon icon={faBullhorn} />
                  </div>
                </a>
              ) : (
                // iOSアプリのブラウザで開く
                <a
                  // eslint-disable-next-line no-script-url
                  href={announceToPaxUrl ? `app:${announceToPaxUrl}` : "javascript:void(0)"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="announceToPax"
                >
                  Announce to PAX
                  <div>
                    <FontAwesomeIcon icon={faBullhorn} />
                  </div>
                </a>
                // ポップアップで開く場合 ＊一応ソースを残した
                // <div className="announceToPax" onClick={() => this.props.openAnnounceToPax(announceToPaxUrl)}>
                //   Announce to PAX<div><FontAwesomeIcon icon={faBullhorn} /></div>
                // </div>
              )
            ) : (
              ""
            ))}
        </Content6>
        <ContentDivider />
        <Content7>
          <div className="title">Crew Information</div>
          <div className="heading">
            <div className="colorHeading">Cockpit Crew</div>
            <div>
              <small>Total</small>
              {flightDetail.crew.ccCnt === null && flightDetail.crew.asCrewTtlCnt === null
                ? ""
                : flightDetail.crew.ccCnt + flightDetail.crew.asCrewTtlCnt}
            </div>
            <div>
              <small>D/H</small>
              {flightDetail.crew.dhCcCnt}
            </div>
            <div>
              <small>CAT(FLT)</small>
              {flightDetail.crew.fltWqCd}
            </div>
          </div>
          <Table>
            <tbody>
              <tr>
                <th>PIC</th>
                <td colSpan={3}>
                  {flightDetail.crew.pic.familyName} {flightDetail.crew.pic.initialName}
                </td>
              </tr>
              <tr>
                <th>from</th>
                <td>
                  {flightDetail.crew.pic.crewfromFltNo /* null + null = 0  になるので気をつける */ &&
                    (flightDetail.crew.pic.crewfromAlCd || "") +
                      formatFltNo(flightDetail.crew.pic.crewfromFltNo) +
                      (flightDetail.crew.pic.crewfromOrgDateLcl ? `/${dayjs(flightDetail.crew.pic.crewfromOrgDateLcl).format("DD")}` : "")}
                </td>
                <th>to</th>
                <td>
                  {flightDetail.crew.pic.crewnextFltNo /* null + null = 0  になるので気をつける */ &&
                    (flightDetail.crew.pic.crewnextAlCd || "") +
                      formatFltNo(flightDetail.crew.pic.crewnextFltNo) +
                      (flightDetail.crew.pic.crewnextOrgDateLcl ? `/${dayjs(flightDetail.crew.pic.crewnextOrgDateLcl).format("DD")}` : "")}
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="heading">
            <div className="colorHeading">Cabin Crew</div>
            <div>
              <small>Total</small>
              {flightDetail.crew.caCnt}
            </div>
            <div>
              <small>D/H</small>
              {flightDetail.crew.dhCaCnt}
            </div>
          </div>
          <Table>
            <tbody>
              <tr>
                <th>CF</th>
                <td colSpan={3}>
                  {flightDetail.crew.cf.familyName} {flightDetail.crew.cf.initialName}
                </td>
              </tr>
              <tr>
                <th>from</th>
                <td>
                  {flightDetail.crew.cf.crewfromFltNo /* null + null = 0  になるので気をつける */ &&
                    (flightDetail.crew.cf.crewfromAlCd || "") +
                      formatFltNo(flightDetail.crew.cf.crewfromFltNo) +
                      (flightDetail.crew.cf.crewfromOrgDateLcl ? `/${dayjs(flightDetail.crew.cf.crewfromOrgDateLcl).format("DD")}` : "")}
                </td>
                <th>to</th>
                <td>
                  {flightDetail.crew.cf.crewnextFltNo /* null + null = 0  になるので気をつける */ &&
                    (flightDetail.crew.cf.crewnextAlCd || "") +
                      formatFltNo(flightDetail.crew.cf.crewnextFltNo) +
                      (flightDetail.crew.cf.crewnextOrgDateLcl ? `/${dayjs(flightDetail.crew.cf.crewnextOrgDateLcl).format("DD")}` : "")}
                </td>
              </tr>
            </tbody>
          </Table>
          {!!(flightDetail.crew && flightDetail.crew.other && flightDetail.crew.other.length) && [
            <div key="scheduleCrewOtherHeading" className="heading">
              <div className="colorHeading">Other</div>
            </div>,
            <Table key="scheduleCrewOtherTable">
              <tbody>
                {flightDetail.crew.other.map((oth, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={index}>
                    <tr>
                      <th>Code</th>
                      <td>
                        {oth.otherCrewCat === "P"
                          ? "As Pax"
                          : oth.otherCrewCat === "C"
                          ? "As Crew"
                          : oth.otherCrewCat === "N"
                          ? "None"
                          : ""}
                      </td>
                      <th>Total</th>
                      <td>{oth.otherCrewCnt}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text">
                        {oth.otherCrewInfo}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>,
          ]}
        </Content7>
        <ContentDivider />
        <Content8>
          <div className="title">Other Information</div>
          <Table>
            <tbody>
              <tr>
                <th>DOM/INT</th>
                <th>PAX/CGO</th>
                <th>SKD/NSK</th>
                <th>FlightSTS</th>
              </tr>
              <tr>
                <td>{flightDetail.flight.intDomCat === "D" ? "DOM" : flightDetail.flight.intDomCat === "I" ? "INT" : ""}</td>
                <td>
                  {flightDetail.flight.paxCgoCat === "PAX"
                    ? "PAX"
                    : flightDetail.flight.paxCgoCat === "CGO"
                    ? "CGO"
                    : flightDetail.flight.paxCgoCat === "OTR"
                    ? "OTR"
                    : ""}
                </td>
                <td>{flightDetail.flight.skdlNonskdlCat}</td>
                <td>{flightDetail.flight.svcTypeDiaCd}</td>
              </tr>
              <tr>
                <th>TR</th>
                <th>PI</th>
                <th>SU</th>
                <th>OM</th>
              </tr>
              <tr>
                <td>{flightDetail.flight.trAlCd}</td>
                <td>{flightDetail.flight.ccEmprAlCd}</td>
                <td>{flightDetail.flight.caEmprAlCd}</td>
                <td>{flightDetail.flight.omAlCd}</td>
              </tr>
            </tbody>
          </Table>
          <Table>
            <tbody>
              <tr>
                <th colSpan={4}>Code Share Flight</th>
              </tr>
              {(() => {
                const cs =
                  flightDetail.flight.cs && flightDetail.flight.cs.length > 0 ? flightDetail.flight.cs : [{ csAlCd: "", csFltNo: "" }]; // 少なくともダミーの空データ１件を入れる
                return _chunk(cs, 4)
                  .slice(0, 5)
                  .map(
                    (
                      codeShares,
                      i // 最大5行
                    ) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={i}>
                        {(() => {
                          const csList = [];
                          for (let j = 0; j < 4; j++) {
                            if (codeShares[j]) {
                              csList.push(
                                // eslint-disable-next-line react/no-array-index-key
                                <td key={`${i}-${j}`}>
                                  {codeShares[j].csAlCd}
                                  {formatFltNo(codeShares[j].csFltNo)}
                                </td>
                              );
                            } else {
                              // eslint-disable-next-line react/no-array-index-key
                              csList.push(<td key={`${i}-${j}`} />);
                            }
                          }
                          return csList;
                        })()}
                      </tr>
                    )
                  );
              })()}
            </tbody>
          </Table>
        </Content8>
        <BlankContent />
      </Wrapper>
      <UpdateRmksPopup
        key="flightDetailDepRmksPopup"
        isOpen={depRmksTextModalIsOpen}
        width={rmksTextModalWidth}
        height={rmksTextModalHeight}
        top={rmksTextModalTop}
        left={rmksTextModalLeft}
        initialRmksText={flightDetail.dep.depRmksText}
        isSubmitable={isRmksEnabled(flightDetail.dep.lstDepApoCd)}
        placeholder="DEP Flight Remarks"
        onClose={closeDepRmksText}
        update={(RmksText: string) => props.updateFlightRmksDep(RmksText, () => setDepRmksTextModalIsOpen(false))}
      />
      <UpdateRmksPopup
        key="flightDetailArrRmksPopup"
        isOpen={arrRmksTextModalIsOpen}
        width={rmksTextModalWidth}
        height={rmksTextModalHeight}
        top={rmksTextModalTop}
        left={rmksTextModalLeft}
        initialRmksText={flightDetail.arr.arrRmksText}
        isSubmitable={isRmksEnabled(flightDetail.arr.lstArrApoCd)}
        placeholder="ARR Flight Remarks"
        onClose={closeArrRmksText}
        update={(RmksText: string) => props.updateFlightRmksArr(RmksText, () => setArrRmksTextModalIsOpen(false))}
      />
    </>
  );
};

const Wrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Content = styled.div`
  padding: 0 10px;
`;

const Content1 = styled(Content)`
  margin-top: 12px;
  margin-bottom: 6px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    height: 24px;
  }

  th {
    width: 120px;
    padding: 5px;
    font-size: 12px;
    font-weight: normal;
    text-align: left;
    color: #fff;
    background: #2799c6;
    border: 1px solid #595857;
    white-space: nowrap;
  }

  td {
    width: 25%;
    padding: 5px;
    font-size: 17px;
    border: 1px solid #595857;

    .tdContent {
      display: flex;
      align-items: baseline;
    }

    .label {
      &:first-child {
        margin-left: 0;
      }
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: 2px 4px 0px 4px;
      background: #595857;
      color: #fff;
      font-size: 15px;
      border-radius: 3px;
    }

    span {
      margin-right: 4px;
    }
  }

  td.text_center {
    text-align: center;
  }
`;

const HeaderTable = styled(Table)`
  table-layout: fixed;
`;

const BladeIcon = styled.img.attrs({ src: Blade })`
  width: 11px;
  height: 9px;
`;

const Content2 = styled(Content)`
  margin-bottom: 6px;

  .title {
    color: #32bbe5;
  }

  .taskMonitor {
    border: 1px solid #595857;

    .taskMonitorRow1 {
      padding-left: 11px;
      height: 55px;
      display: flex;

      svg {
        margin-left: -4px;
        &:first-child {
          margin-left: 0;
        }
      }
    }

    .taskMonitorRow2 {
      table {
        width: 100%;
        border-collapse: collapse;
      }

      tr {
        height: 20px;
      }

      th {
        width: 15px;
        font-size: 11px;
        color: #222222;
        font-weight: normal;
      }

      td {
        width: 54px;
        text-align: center;
      }
    }
  }
`;

const Content3 = styled(Content)`
  margin-bottom: 10px;
  table {
    table-layout: fixed;
  }

  col {
    width: 55px;
  }

  th {
    text-align: center;
  }
`;

const SquareS = styled.div`
  display: inline-block;
  width: 15px;
  height: 16px;
  text-align: center;
  font-size: 14px;
  color: #000;
  border-radius: 4px;
  border: 1px solid #000;
  margin-left: 2px;
  align-self: center;
`;

const ContentDivider = styled.div`
  height: 6px;
  margin-bottom: 8px;
  background: #2fadbd;
`;

const FlightStatusContent = styled(Content)<{ marginBottom: number }>`
  padding-top: 2px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px; /* 直下文字フォントの上部スペースと合わせて16pxにする */
  img {
    width: 100%;
    border: 1px solid #595857;
    vertical-align: bottom;
  }
`;

const FlightStatusImageBo = styled.img.attrs({ src: FlightStatusBoPng })``;
const FlightStatusImageBc = styled.img.attrs({ src: FlightStatusBcPng })``;
const FlightStatusImageDor = styled.img.attrs({ src: FlightStatusDorPng })``;
const FlightStatusImageDepTaxi = styled.img.attrs({ src: FlightStatusDepTaxiPng })``;
const FlightStatusImageTakeOff = styled.img.attrs({ src: FlightStatusTakeOffPng })``;
const FlightStatusImageInFlt = styled.img.attrs({ src: FlightStatusInFltPng })``;
const FlightStatusImageApp = styled.img.attrs({ src: FlightStatusAppPng })``;
const FlightStatusImageAppTaxi = styled.img.attrs({ src: FlightStatusAppTaxiPng })``;
const FlightStatusImageAta = styled.img.attrs({ src: FlightStatusAtaPng })``;

const Content4 = styled(Content)<{ isPc: boolean }>`
  margin-bottom: 13px;

  .title {
    display: flex;
    align-items: baseline;
    line-height: 1;
    margin-bottom: ${({ isPc }) => (isPc ? 3 : 1)}px;

    small {
      font-size: 12px;
      margin-right: 4px;
    }

    .apoCd {
      color: #2fadbd;
      font-size: 24px;
    }

    > div {
      width: 25%;
      font-size: 17px;
      margin-right: 7px;
    }
  }

  table {
    margin-bottom: 10px;

    th,
    td {
      text-align: center;
      vertical-align: top;
    }

    td.left {
      text-align: left;
      padding-right: 0;
    }

    .tentativeCd {
      padding: 1px 2px 0;
      background: #595857;
      color: #fff;
      font-size: 11px;
      border-radius: 2px;
      margin-left: 2px;
    }
  }
`;

const RmksText = styled.div`
  padding: 7px 10px;
  border: 1px solid #346181;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0px 0px 2px 2px #ccc ${(props: { enabled: boolean }) => (props.enabled ? "inset" : "none")};
  cursor: ${(props: { enabled: boolean }) => (props.enabled ? "pointer" : "auto")};
`;

const PlaceHolder = styled.div`
  padding: 0px 10px;
  color: ${(props) => props.theme.color.PLACEHOLDER};
`;

const Content5 = styled(Content4)`
  margin-bottom: 16px;
  .title {
    .originalStation {
      width: 50%;
      span {
        margin-right: 3px;
      }
    }
  }
`;

const Content6 = styled(Content)`
  padding: 0;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;

  .title {
    padding: 0 10px;
    color: #2fadbd;
    font-size: 20px;
    margin-bottom: 3px; /* baselineから7px分 */
  }

  table {
    th {
      padding: 0 0px;
      border: none;
      text-align: center;
      min-width: 60px;
      &:last-child {
        min-width: 70px;
      }
    }
    td {
      padding: 5px;
      border: none;
      text-align: center;
      &:last-child {
        min-width: 70px;
        text-align: center;
      }
    }

    .tdHead {
      padding: 0 10px;
      font-size: 12px;
      text-align: left;
    }

    tr {
      height: 28px;
      border-bottom: 1px solid #595857;
      &:first-child {
        height: 22px;
        border: none;
      }
    }
  }

  .announceToPax {
    margin: 15px 10px 0;
    display: flex;
    font-size: 20px;
    color: ${(props) => props.theme.color.PRIMARY};
    align-self: center;
    text-decoration: underline;

    > div {
      margin-left: 10px;
    }
  }
`;

const Content7 = styled(Content)`
  .title {
    color: #2fadbd;
    font-size: 20px;
    margin-bottom: 7px;
  }

  th {
    text-align: center;
  }

  .heading {
    font-size: 18px;
    display: flex;
    margin-bottom: 4px;

    > div {
      margin-right: 7px;
    }

    .colorHeading {
      color: #32bbe5;
    }

    small {
      font-size: 12px;
      margin-right: 4px;
    }
  }

  table {
    margin-bottom: 12px;
    :last-child {
      margin-bottom: 14px;
    }

    th {
      width: 60px;
      height: 24px;
    }

    td {
      min-width: 119px;
      height: 24px;
    }

    td.text {
      padding: 5px;
      word-break: break-all;
    }
  }
`;

const Content8 = styled(Content)`
  .title {
    color: #2fadbd;
    font-size: 20px;
    margin-bottom: 3px; /* baselineから7px分 */
  }

  table {
    &:last-child {
      margin-bottom: 14px;
      th {
        border-top: none;
        width: 80px;
      }
      td {
        padding: 0 3px;
      }
    }

    th {
      padding: 0 4px;
      text-align: center;
    }
    td {
      width: 25%;
      padding: 0 2px;
      text-align: center;
    }
  }
`;

const BlankContent = styled(Content)`
  height: 220px;
  border-top: 1px solid #707070;
`;

const AtcStyledLabel = styled.div`
  display: inline-block;
  min-width: 40px;
  padding: 0.1em 0.25em 0.1em;
  font-size: 17px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: #595857;
  border-color: #595857;
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
`;

const AtcColumn = styled.div`
  display: inline-block;
  text-align: left;
  margin-left: 6px;
  label {
    font-size: 12px;
    margin-right: 2px;
  }
`;

export default FlightDetail;
