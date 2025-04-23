"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const FlightSearchResult_1 = __importDefault(require("./FlightSearchResult"));
const FlightListHeader_1 = __importDefault(require("../atoms/FlightListHeader"));
class FlightList extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.flightListScrollRef = this.props.scrollContentRef || react_1.default.createRef();
    }
    render() {
        const { eLegList, scrollContentOnClick, onFlightDetail, selectedFlightIdentifier, onStationOperationTask, stationOperationTaskEnabled, openOalFlightMovementModal, flightMovementEnabled, flightDetailEnabled, isModalComponent, mvtMsgEnabled, openMvtMsgModal, } = this.props;
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(ScrollContents, { tabIndex: -1, ref: this.flightListScrollRef, onClick: scrollContentOnClick },
                react_1.default.createElement(FlightListHeader_1.default, { totalNumber: eLegList.length }),
                react_1.default.createElement(FlightListTable, null,
                    react_1.default.createElement("tbody", null, eLegList.map((eLeg, i) => (react_1.default.createElement(FlightSearchResult_1.default
                    // eslint-disable-next-line react/no-array-index-key
                    , { 
                        // eslint-disable-next-line react/no-array-index-key
                        key: i, eLeg: eLeg, onFlightDetail: onFlightDetail, selectedFlightIdentifier: selectedFlightIdentifier, stationOperationTaskEnabled: stationOperationTaskEnabled, onStationOperationTask: onStationOperationTask, openOalFlightMovementModal: openOalFlightMovementModal, flightMovementEnabled: flightMovementEnabled, flightDetailEnabled: flightDetailEnabled, isModalComponent: isModalComponent, mvtMsgEnabled: mvtMsgEnabled, openMvtMsgModal: openMvtMsgModal }))))))));
    }
}
const Wrapper = styled_components_1.default.div `
  width: 100%;
  height: auto;
`;
const ScrollContents = styled_components_1.default.div `
  width: 100%;
  height: 100%;
`;
const FlightListTable = styled_components_1.default.table `
  width: calc(100% - 4px);
  margin-left: 2px;
  margin-top: -4px;
  border-spacing: 0 8px;
  tbody {
    vertical-align: top;
  }
  tbody > tr > td:nth-child(1) {
    width: 80px;
  }
  tbody > tr > td:nth-child(2) {
    width: 120px;
  }
  tbody > tr > td:nth-child(3) {
    width: 105px;
  }
`;
exports.default = FlightList;
//# sourceMappingURL=FlightList.js.map