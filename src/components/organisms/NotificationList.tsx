import dayjs from "dayjs";
import React, { Fragment } from "react";
import styled from "styled-components";
import { reset } from "redux-form";
import queryString from "query-string";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { funcAuthCheck } from "../../lib/commonUtil";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";
import { SoalaMessage } from "../../lib/soalaMessages";
import { PushNotificationMessage, fetchHeaderInfoClear, getHeaderInfo, closeAllDraggableModals } from "../../reducers/common";
import { openFlightModal } from "../../reducers/flightModals";
import { fetchFlightDetail } from "../../reducers/flightContentsFlightDetail";
import { fetchFlightThreadsAll } from "../../reducers/flightContentsBulletinBoard";
import { fetchStationOperationTask } from "../../reducers/flightContentsStationOperationTask";
import media from "../../styles/media";
import defaultIconPng from "../../assets/images/status/fis-status-default.png";

const FLIGHT_MODAL_POSITION_RIGHT = true;

const NotificationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const ntfInfo = useAppSelector((state) => state.account.master.ntfInfo);
  const allForm = useAppSelector((state) => state.form);

  const handleClickMessage = (message: PushNotificationMessage) => {
    if (message.legKey) {
      const flightKey = {
        myApoCd: jobAuth.user.myApoCd,
        orgDateLcl: message.legKey.orgDateLcl,
        alCd: message.legKey.alCd,
        fltNo: message.legKey.fltNo,
        casFltNo: message.legKey.casFltNo,
        skdDepApoCd: message.legKey.skdDepApoCd,
        skdArrApoCd: message.legKey.skdArrApoCd,
        skdLegSno: message.legKey.skdLegSno,
        oalTblFlg: !!(message.legKey.legInfoCd === "OA2"),
      };
      switch (message.type) {
        case "flt":
          if (message.soalaEventCode?.startsWith("SAL.WST.")) {
            if (funcAuthCheck(Const.FUNC_ID.openOperationTask, jobAuth.jobAuth)) {
              void dispatch(
                openFlightModal({
                  flightKey,
                  posRight: FLIGHT_MODAL_POSITION_RIGHT,
                  tabName: "Task",
                })
              );
              void dispatch(fetchStationOperationTask({ flightKey, isReload: false }));
            }
          } else if (funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth)) {
            void dispatch(
              openFlightModal({
                flightKey,
                posRight: FLIGHT_MODAL_POSITION_RIGHT,
                tabName: "Detail",
              })
            );
            void dispatch(fetchFlightDetail({ flightKey, isReload: false, messages: { 404: SoalaMessage.M30003C() } }));
          }
          break;
        case "bb":
          if (funcAuthCheck(Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth) && message.bbKey && message.bbKey.id) {
            void dispatch(
              openFlightModal({
                flightKey,
                posRight: FLIGHT_MODAL_POSITION_RIGHT,
                tabName: "B.B.",
              })
            );
            void dispatch(fetchFlightThreadsAll({ flightKey, bbId: message.bbKey.id, messages: { 404: SoalaMessage.M30003C() } }));
          }
          break;
        default:
          break;
      }
    } else {
      switch (message.type) {
        case "bb":
          if (funcAuthCheck(Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth) && message.bbKey && message.bbKey.id) {
            const query = queryString.stringify({ bbId: message.bbKey.id });
            onClickLink(`${Const.PATH_NAME.bulletinBoard}?${query}`);
          }
          break;
        default:
          break;
      }
    }
  };

  const clickable = (message: PushNotificationMessage) =>
    (!!message.legKey &&
      message.type === "flt" &&
      (message.soalaEventCode?.startsWith("SAL.WST.")
        ? funcAuthCheck(Const.FUNC_ID.openOperationTask, jobAuth.jobAuth)
        : funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth))) ||
    (message.type === "bb" && funcAuthCheck(Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth));

  const onClickLink = (path: string) => {
    Object.keys(allForm).forEach((formKey) => dispatch(reset(formKey)));
    dispatch(fetchHeaderInfoClear());
    void dispatch(getHeaderInfo({ apoCd: jobAuth.user.myApoCd }));
    history.push(path);
    void dispatch(closeAllDraggableModals());
  };

  const messages = common.pushNotificationMessages.slice().sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
  // //テスト用
  // const char200 = "ＡＢＣＤＥＦＧぁあぃいぅうぇえぉおかがきぎ、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈〉《》「」『』【ικλμνξοπρστυφⅠⅡⅢⅣⅤⅥⅦⅨⅩ㍉㌔①②③④⑤⑥⑦ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㍉㌔㌢㍍㌘㌧㎜㎝㎞㎎㎏㏄㎡㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪опрстъ─│┌┐┘└├┬┤┴┼┃｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴ";

  // const messages = [
  //   {
  //     seq: 1,
  //     title: char200,
  //     body: char200 + char200 + char200,
  //     date: "2018-01-29 15:55:01",
  //     soalaEventCode: "SWW.CD3",
  //     type: "apo"
  //   },
  //   {
  //     seq: 2,
  //     title: "JL283/DLY SET",
  //     body: "JL283/31JANがDLY SETされました。",
  //     date: "2018-01-29 15:56:45",
  //     soalaEventCode: "SSP.ON",
  //     type: "apo"
  //   },
  //   {
  //     seq: 3,
  //     title: "HND/De-Icing",
  //     body: "HNDでDe-Icing Conditionが発令されました。",
  //     date: "2018-01-29 15:57:25",
  //     soalaEventCode: "cccc",
  //     type: "apo"
  //   },
  //   {
  //     seq: 4,
  //     title: "DIV",
  //     body: "JIL1234\nDivert to HND",
  //     date: "2018-12-13 15:57:25",
  //     soalaEventCode: "DIV",
  //     type: "flt",
  //     legKey: {
  //       legInfoCd: "JAL",
  //       orgDateLcl: "2019-04-09",
  //       alCd: "JL",
  //       fltNo: "3101",
  //       casFltNo: "",
  //       skdDepApoCd: "SIN",
  //       skdArrApoCd: "HND",
  //       skdLegSno: 31,
  //     }
  //   },
  //   {
  //     seq: 5,
  //     title: "Bulletin Board Updated",
  //     body: "お客様遺失物情報 保安検査場C付近 from HNDPT",
  //     date: "2018-12-13 15:57:25",
  //     soalaEventCode: "SAL.BB",
  //     type: "bb",
  //     legKey: {
  //       legInfoCd: "JAL",
  //       orgDateLcl: "2019-04-09",
  //       alCd: "JL",
  //       fltNo: "3101",
  //       casFltNo: "",
  //       skdDepApoCd: "SIN",
  //       skdArrApoCd: "HND",
  //       skdLegSno: 31,
  //     },
  //     bbKey: {
  //       id: 1234,
  //     }
  //   },
  //   {
  //     seq: 6,
  //     title: "Bulletin Board Updated",
  //     body: "掲示板 テスト",
  //     date: "2018-12-13 15:57:25",
  //     soalaEventCode: "SAL.BB",
  //     type: "bb",
  //     bbKey: {
  //       id: 1234,
  //     }
  //   },
  //   {
  //     seq: 7,
  //     title: "Deplaning",
  //     body: "Finish",
  //     date: "2018-12-13 15:57:25",
  //     soalaEventCode: "SAL.WST.DPFS",
  //     type: "flt",
  //     legKey: {
  //       legInfoCd: "JAL",
  //       orgDateLcl: "2019-04-09",
  //       alCd: "JL",
  //       fltNo: "3101",
  //       casFltNo: "",
  //       skdDepApoCd: "SIN",
  //       skdArrApoCd: "HND",
  //       skdLegSno: 31,
  //     },
  //   },
  //   {
  //     seq: 8,
  //     title: "My Schedule Changed by Lily",
  //     body: "Schedule: 11SEP@NRT",
  //     date: "2018-12-13 15:57:25",
  //     soalaEventCode: "SAL.FTX.MYSKDL",
  //     type: "ftx",
  //   },
  // ];

  return (
    <Wrapper>
      <Heading isIphone={storage.isIphone}>{jobAuth.user.jobCd}</Heading>
      <Messages isPc={storage.isPc} hasApo={!!jobAuth.user.myApoCd}>
        {messages.map((message) => {
          let event: MasterApi.SoalaEvt | undefined;
          if (message.soalaEventCode) {
            event = ntfInfo.soalaEvt.find((evt) => evt.eventCd === message.soalaEventCode);
          }

          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
            <li key={message.seq} onClick={() => handleClickMessage(message)}>
              <MessageContent>
                {event && event.ntfIcon ? <MessageIcon src={event ? event.ntfIcon : ""} /> : <DefaultIcon />}
                <MessageBody clickable={clickable(message)}>
                  <MessageTitle isPc={storage.isPc}>{message.title}</MessageTitle>
                  <MessageText>
                    {
                      // 改行をタグに置換して表示する
                      message.body.split(/\r?\n/g).map((m, index) => {
                        const key = `${message.seq}-${index}`;
                        if (index === 0) {
                          return <Fragment key={key}>{m}</Fragment>;
                        }
                        return (
                          <Fragment key={key}>
                            <br />
                            {m}
                          </Fragment>
                        );
                      })
                    }
                  </MessageText>
                </MessageBody>
              </MessageContent>
              <MessageDate>{dayjs(message.date).format("YYYY/MM/DD HH:mm")}</MessageDate>
            </li>
          );
        })}
      </Messages>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Heading = styled.div<{ isIphone: boolean }>`
  padding: 0 60px;
  font-size: 20px;
  height: ${({ isIphone }) => (isIphone ? "36px" : "48px")};
  display: flex;
  align-items: center;
  background: #e4f2f7;

  ${media.lessThan("mobile")`
    padding: 0 20px;
  `};
`;

const Messages = styled.ul<{ isPc: boolean; hasApo: boolean }>`
  padding: 0;
  margin: 0;
  list-style: none;
  height: ${({ isPc, theme }) => `calc(100vh - 48px - ${isPc ? theme.layout.header.default : theme.layout.header.tablet})`};

  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }

  li {
    padding: 10px 60px;

    &:nth-child(odd) {
      background: #fff;
    }

    &:nth-child(even) {
      background: #f6f6f6;
    }

    ${media.lessThan("mobile")`
      padding: 10px 20px;
    `};
  }

  ${({ hasApo, theme }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    media.lessThan("mobile")` height: ${`calc(100vh - 36px - ${
      hasApo
        ? `${theme.layout.header.mobile} - ${theme.layout.footer.mobile}`
        : `${theme.layout.header.statusBar} - ${theme.layout.footer.mobile}`
    })`}; `};
`;

const MessageIcon = styled.img`
  width: 56px;
  height: 56px;
  margin-right: 12px;
`;

const DefaultIcon = styled.img.attrs({ src: defaultIconPng })`
  width: 56px;
  height: 56px;
  margin-right: 12px;
`;

const MessageBody = styled.div<{ clickable: boolean }>`
  flex: 1;
  ${(props) => (props.clickable ? `color:${props.theme.color.button.PRIMARY};` : "")}
`;

const MessageTitle = styled.h2<{ isPc: boolean }>`
  font-size: 17px;
  margin: 0 0 5px;
  ${({ isPc }) => (isPc ? "" : "font-weight: bold;")};
`;

const MessageText = styled.p`
  margin: 0;
`;

const MessageContent = styled.div`
  display: flex;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const MessageDate = styled.div`
  font-size: 12px;
  text-align: right;
`;

export default NotificationList;
