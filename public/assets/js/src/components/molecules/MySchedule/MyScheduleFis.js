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
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const commonUtil_1 = require("../../../lib/commonUtil");
const FisRow_1 = __importDefault(require("../FisRow"));
var selectedColumnType;
(function (selectedColumnType) {
    selectedColumnType["Dep"] = "D";
    selectedColumnType["Arr"] = "A";
})(selectedColumnType || (selectedColumnType = {}));
class MyScheduleFis extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.HEADER_HEIGHT = storage_1.storage.isPc ? 24 : 30;
        this.setArrOrDep = () => {
            if (storage_1.storage.isPc)
                return;
            this.setState({
                isTwoColumnMode: true,
                isLongColumnArr: this.props.fis.depArrType === selectedColumnType.Arr,
                selectedColumn: this.props.fis.depArrType,
            });
        };
        this.handleTwoColumnMode = () => {
            if (storage_1.storage.isPc || this.state.selectedColumn === "")
                return;
            const isArr = this.state.selectedColumn === selectedColumnType.Arr;
            this.setState((prevState) => ({
                isTwoColumnMode: !prevState.isTwoColumnMode,
                isLongColumnArr: isArr,
            }));
        };
        this.handleArrSelected = () => {
            if (storage_1.storage.isPc || this.state.selectedColumn === selectedColumnType.Arr)
                return;
            this.setState({
                selectedColumn: selectedColumnType.Arr,
            });
        };
        this.handleDepSelected = () => {
            if (storage_1.storage.isPc || this.state.selectedColumn === selectedColumnType.Dep)
                return;
            this.setState({
                selectedColumn: selectedColumnType.Dep,
            });
        };
        this.state = {
            isTwoColumnMode: false,
            isLongColumnArr: false,
            selectedColumn: "",
            stationOperationTaskEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, this.props.jobAuth.jobAuth),
            flightMovementEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalFlightMovement, this.props.jobAuth.jobAuth),
            mvtMsgEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openMvtMsg, this.props.jobAuth.jobAuth),
            flightDetailEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, this.props.jobAuth.jobAuth),
            flightListEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openShipTransitList, this.props.jobAuth.jobAuth),
            flightRmksEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateFlightRemarks, this.props.jobAuth.jobAuth),
            oalAircraftEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalAircraft, this.props.jobAuth.jobAuth),
            oalPaxEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalPax, this.props.jobAuth.jobAuth),
            oalFuelEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalFuel, this.props.jobAuth.jobAuth),
            oalPaxStatusEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalPaxStatus, this.props.jobAuth.jobAuth),
            spotNoEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openSpotNo, this.props.jobAuth.jobAuth),
        };
        this.setArrOrDep = this.setArrOrDep.bind(this);
    }
    componentDidMount() {
        this.setArrOrDep();
    }
    componentDidUpdate(prevProps) {
        if (this.props.fis.fisRow !== prevProps.fis.fisRow) {
            this.setArrOrDep();
        }
    }
    render() {
        const { fis } = this.props;
        const { isTwoColumnMode, isLongColumnArr, selectedColumn } = this.state;
        const { isPc } = storage_1.storage;
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(FisHeader, { isPc: isPc, isLongColumnArr: isLongColumnArr, isTwoColumnMode: isTwoColumnMode, selectedColumn: selectedColumn },
                react_1.default.createElement("div", { className: isLongColumnArr && isTwoColumnMode ? "headerContentLong" : isTwoColumnMode ? "headerContentHide" : "headerContentArr", onClick: this.handleArrSelected, onKeyUp: () => { } },
                    react_1.default.createElement(TwoColumnSwitchBtn, { height: this.HEADER_HEIGHT, isLeft: true },
                        react_1.default.createElement("div", null),
                        react_1.default.createElement("div", null, "Arrival"),
                        react_1.default.createElement("div", null, !isPc && selectedColumn === selectedColumnType.Arr && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("div", { className: "UnderArrow" },
                                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown })),
                            react_1.default.createElement("div", { className: "FlightSign" }, "Flight")))))),
                react_1.default.createElement("div", { className: "centerContent", onClick: this.handleTwoColumnMode, onKeyUp: () => { } },
                    react_1.default.createElement(StationOperationHeader, { isPc: isPc, height: this.HEADER_HEIGHT }, "Station Operation")),
                react_1.default.createElement("div", { className: !isLongColumnArr && isTwoColumnMode ? "headerContentLong" : isTwoColumnMode ? "headerContentHide" : "headerContentDep", onClick: this.handleDepSelected, onKeyUp: () => { } },
                    react_1.default.createElement(TwoColumnSwitchBtn, { height: this.HEADER_HEIGHT, isLeft: false },
                        react_1.default.createElement("div", null),
                        react_1.default.createElement("div", null, "Departure"),
                        react_1.default.createElement("div", null, !isPc && selectedColumn === selectedColumnType.Dep && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("div", { className: "UnderArrow" },
                                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown })),
                            react_1.default.createElement("div", { className: "FlightSign" }, "Flight"))))))),
            fis.fisRow ? (react_1.default.createElement(FisRow_1.default, { isMySchedule: true, selectedApoCd: fis.apoCd, timeDiffUtc: null, fisRow: fis.fisRow, zoomFis: 100, dispRangeFromLcl: fis.dispRangeFromLcl, dispRangeToLcl: fis.dispRangeToLcl, stationOperationTaskEnabled: this.state.stationOperationTaskEnabled, flightMovementEnabled: this.state.flightMovementEnabled, multipleFlightMovementEnabled: false, mvtMsgEnabled: this.state.mvtMsgEnabled, flightDetailEnabled: this.state.flightDetailEnabled, flightListEnabled: this.state.flightListEnabled, flightRmksEnabled: this.props.jobAuth.user.myApoCd === this.props.headerInfo.apoCd && this.state.flightRmksEnabled, oalAircraftEnabled: this.state.oalAircraftEnabled, oalPaxEnabled: this.state.oalPaxEnabled, oalPaxStatusEnabled: this.state.oalPaxStatusEnabled, spotNoEnabled: this.state.spotNoEnabled, oalFuelEnabled: this.state.oalFuelEnabled, isSortArrival: isLongColumnArr, isSortTwoColumnMode: isTwoColumnMode, doAnimation: !isPc, isDarkMode: false, acarsStatus: fis.shipNoToAcarsSts[fis.fisRow.shipNo], presentTime: fis.timeLclDayjs })) : null));
    }
}
const Wrapper = styled_components_1.default.div `
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
`;
const hideHeaderContent = (0, styled_components_1.keyframes) `
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 0; max-width: 0; overflow: hidden; }
`;
const showHeaderContentFromHide = (0, styled_components_1.keyframes) `
  0%   { width: 0; max-width: 0; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;
const showHeaderContentFromLong = (0, styled_components_1.keyframes) `
  0%   { width: 66%; max-width: 100%; overflow: hidden;}
  100% { width: 33%; max-width: 100%; overflow: hidden;}
`;
const longHeaderContent = (0, styled_components_1.keyframes) `
  0%   { width: 33%; max-width: 100%; overflow: hidden;}
  100% { width: 66%; max-width: 100%; overflow: hidden;}
`;
const FisHeader = styled_components_1.default.div `
  display: flex;
  text-align: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.PRIMARY_BASE};
  .headerContentArr {
    background: ${({ isPc, selectedColumn, theme }) => !isPc && selectedColumn === selectedColumnType.Arr
    ? theme.color.fis.header.background.inactive
    : theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ isPc, isLongColumnArr }) => !isPc
    ? (0, styled_components_1.css) `
            animation: ${isLongColumnArr ? showHeaderContentFromLong : showHeaderContentFromHide} 0.3s;
          `
    : ""};
  }
  .headerContentDep {
    background: ${({ isPc, selectedColumn, theme }) => !isPc && selectedColumn === selectedColumnType.Dep
    ? theme.color.fis.header.background.inactive
    : theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ isPc, isLongColumnArr }) => !isPc
    ? (0, styled_components_1.css) `
            animation: ${!isLongColumnArr ? showHeaderContentFromLong : showHeaderContentFromHide} 0.3s;
          `
    : ""};
  }
  .headerContentLong {
    background: ${({ theme }) => theme.color.fis.header.background.inactive};
    width: 66%;
    animation: ${longHeaderContent} 0.3s;
  }
  .headerContentHide {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    max-width: 0;
    overflow: hidden;
    animation: ${hideHeaderContent} 0.3s;
  }
  .centerContent {
    ${({ isPc }) => (isPc ? "width: 352px;" : "flex: 4;")};
    ${({ isPc }) => (isPc ? "max-width: 352px;" : "")};
    background: ${({ isPc, theme }) => (isPc ? theme.color.fis.header.background.inactive : theme.color.fis.header.background.active)};
  }
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;
const TwoColumnSwitchBtn = styled_components_1.default.div `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => `${height}px`};
  border-top: 1px solid ${(props) => props.theme.color.fis.background};
  ${({ isLeft, theme }) => `${isLeft ? "border-left: " : "border-right: "}1px solid ${theme.color.fis.background}`};
  border-bottom: none;
  cursor: "inherit";
  > div:first-child {
    min-width: 80px;
  }
  > div:last-child {
    min-width: 80px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .UnderArrow {
    margin-left: 7px;
    min-width: 15px;
    display: flex;
    align-items: center;
    svg {
      width: 12px;
      height: 12px;
    }
  }
  .FlightSign {
    margin-left: 5px;
    margin-top: 1px;
    position: relative;
    font-size: 12px;
    line-height: 12px;
    /* width: 50px; */
    width: 44px;
    border: solid 1.2px ${(props) => props.theme.color.PRIMARY_BASE};
    border-radius: 5px;
    padding: 1px 2px 1px 2px;
    /* 斜線 */
    /* ::before {
      content: "";
      display: inline-block;
      position: absolute;
      height: 1.2px;
      width: 47.5px;
      top: 6.5px;
      left: 0.3px;
      background-color: #FFF;
      transform:rotate(-17deg) skew(40deg);
    } */
  }
`;
const StationOperationHeader = styled_components_1.default.div `
  width: auto;
  line-height: ${({ height }) => `${height}px`};
  border: 1px solid ${(props) => props.theme.color.fis.background};
  border-bottom: none;
  cursor: ${({ isPc }) => (isPc ? "inherit" : "pointer")};
`;
exports.default = MyScheduleFis;
//# sourceMappingURL=MyScheduleFis.js.map