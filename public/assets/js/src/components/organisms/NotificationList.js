"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const redux_form_1 = require("redux-form");
const query_string_1 = __importDefault(require("query-string"));
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const soalaMessages_1 = require("../../lib/soalaMessages");
const common_1 = require("../../reducers/common");
const flightModals_1 = require("../../reducers/flightModals");
const flightContentsFlightDetail_1 = require("../../reducers/flightContentsFlightDetail");
const flightContentsBulletinBoard_1 = require("../../reducers/flightContentsBulletinBoard");
const flightContentsStationOperationTask_1 = require("../../reducers/flightContentsStationOperationTask");
const media_1 = __importDefault(require("../../styles/media"));
const fis_status_default_png_1 = __importDefault(require("../../assets/images/status/fis-status-default.png"));
const FLIGHT_MODAL_POSITION_RIGHT = true;
const NotificationList = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const history = (0, react_router_dom_1.useHistory)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const ntfInfo = (0, hooks_1.useAppSelector)((state) => state.account.master.ntfInfo);
    const allForm = (0, hooks_1.useAppSelector)((state) => state.form);
    const handleClickMessage = (message) => {
        var _a;
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
                    if ((_a = message.soalaEventCode) === null || _a === void 0 ? void 0 : _a.startsWith("SAL.WST.")) {
                        if ((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, jobAuth.jobAuth)) {
                            void dispatch((0, flightModals_1.openFlightModal)({
                                flightKey,
                                posRight: FLIGHT_MODAL_POSITION_RIGHT,
                                tabName: "Task",
                            }));
                            void dispatch((0, flightContentsStationOperationTask_1.fetchStationOperationTask)({ flightKey, isReload: false }));
                        }
                    }
                    else if ((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth)) {
                        void dispatch((0, flightModals_1.openFlightModal)({
                            flightKey,
                            posRight: FLIGHT_MODAL_POSITION_RIGHT,
                            tabName: "Detail",
                        }));
                        void dispatch((0, flightContentsFlightDetail_1.fetchFlightDetail)({ flightKey, isReload: false, messages: { 404: soalaMessages_1.SoalaMessage.M30003C() } }));
                    }
                    break;
                case "bb":
                    if ((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth) && message.bbKey && message.bbKey.id) {
                        void dispatch((0, flightModals_1.openFlightModal)({
                            flightKey,
                            posRight: FLIGHT_MODAL_POSITION_RIGHT,
                            tabName: "B.B.",
                        }));
                        void dispatch((0, flightContentsBulletinBoard_1.fetchFlightThreadsAll)({ flightKey, bbId: message.bbKey.id, messages: { 404: soalaMessages_1.SoalaMessage.M30003C() } }));
                    }
                    break;
                default:
                    break;
            }
        }
        else {
            switch (message.type) {
                case "bb":
                    if ((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth) && message.bbKey && message.bbKey.id) {
                        const query = query_string_1.default.stringify({ bbId: message.bbKey.id });
                        onClickLink(`${commonConst_1.Const.PATH_NAME.bulletinBoard}?${query}`);
                    }
                    break;
                default:
                    break;
            }
        }
    };
    const clickable = (message) => {
        var _a;
        return (!!message.legKey &&
            message.type === "flt" &&
            (((_a = message.soalaEventCode) === null || _a === void 0 ? void 0 : _a.startsWith("SAL.WST."))
                ? (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, jobAuth.jobAuth)
                : (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth))) ||
            (message.type === "bb" && (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBulletinBoard, jobAuth.jobAuth));
    };
    const onClickLink = (path) => {
        Object.keys(allForm).forEach((formKey) => dispatch((0, redux_form_1.reset)(formKey)));
        dispatch((0, common_1.fetchHeaderInfoClear)());
        void dispatch((0, common_1.getHeaderInfo)({ apoCd: jobAuth.user.myApoCd }));
        history.push(path);
        void dispatch((0, common_1.closeAllDraggableModals)());
    };
    const messages = common.pushNotificationMessages.slice().sort((a, b) => {
        if (a.date < b.date)
            return 1;
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
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Heading, { isIphone: storage_1.storage.isIphone }, jobAuth.user.jobCd),
        react_1.default.createElement(Messages, { isPc: storage_1.storage.isPc, hasApo: !!jobAuth.user.myApoCd }, messages.map((message) => {
            let event;
            if (message.soalaEventCode) {
                event = ntfInfo.soalaEvt.find((evt) => evt.eventCd === message.soalaEventCode);
            }
            return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
            react_1.default.createElement("li", { key: message.seq, onClick: () => handleClickMessage(message) },
                react_1.default.createElement(MessageContent, null,
                    event && event.ntfIcon ? react_1.default.createElement(MessageIcon, { src: event ? event.ntfIcon : "" }) : react_1.default.createElement(DefaultIcon, null),
                    react_1.default.createElement(MessageBody, { clickable: clickable(message) },
                        react_1.default.createElement(MessageTitle, { isPc: storage_1.storage.isPc }, message.title),
                        react_1.default.createElement(MessageText, null, 
                        // 改行をタグに置換して表示する
                        message.body.split(/\r?\n/g).map((m, index) => {
                            const key = `${message.seq}-${index}`;
                            if (index === 0) {
                                return react_1.default.createElement(react_1.Fragment, { key: key }, m);
                            }
                            return (react_1.default.createElement(react_1.Fragment, { key: key },
                                react_1.default.createElement("br", null),
                                m));
                        })))),
                react_1.default.createElement(MessageDate, null, (0, dayjs_1.default)(message.date).format("YYYY/MM/DD HH:mm"))));
        }))));
};
const Wrapper = styled_components_1.default.div ``;
const Heading = styled_components_1.default.div `
  padding: 0 60px;
  font-size: 20px;
  height: ${({ isIphone }) => (isIphone ? "36px" : "48px")};
  display: flex;
  align-items: center;
  background: #e4f2f7;

  ${media_1.default.lessThan("mobile") `
    padding: 0 20px;
  `};
`;
const Messages = styled_components_1.default.ul `
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

    ${media_1.default.lessThan("mobile") `
      padding: 10px 20px;
    `};
  }

  ${({ hasApo, theme }) => 
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
media_1.default.lessThan("mobile") ` height: ${`calc(100vh - 36px - ${hasApo
    ? `${theme.layout.header.mobile} - ${theme.layout.footer.mobile}`
    : `${theme.layout.header.statusBar} - ${theme.layout.footer.mobile}`})`}; `};
`;
const MessageIcon = styled_components_1.default.img `
  width: 56px;
  height: 56px;
  margin-right: 12px;
`;
const DefaultIcon = styled_components_1.default.img.attrs({ src: fis_status_default_png_1.default }) `
  width: 56px;
  height: 56px;
  margin-right: 12px;
`;
const MessageBody = styled_components_1.default.div `
  flex: 1;
  ${(props) => (props.clickable ? `color:${props.theme.color.button.PRIMARY};` : "")}
`;
const MessageTitle = styled_components_1.default.h2 `
  font-size: 17px;
  margin: 0 0 5px;
  ${({ isPc }) => (isPc ? "" : "font-weight: bold;")};
`;
const MessageText = styled_components_1.default.p `
  margin: 0;
`;
const MessageContent = styled_components_1.default.div `
  display: flex;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-word;
`;
const MessageDate = styled_components_1.default.div `
  font-size: 12px;
  text-align: right;
`;
exports.default = NotificationList;
//# sourceMappingURL=NotificationList.js.map