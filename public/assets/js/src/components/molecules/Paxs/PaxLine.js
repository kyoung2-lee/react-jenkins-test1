"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaxLine = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const Pax_1 = require("../../../lib/Pax");
const ship_svg_1 = __importDefault(require("../../../assets/images/icon/ship.svg"));
class PaxLine extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.metaContainerRef = react_1.default.createRef();
        this.normalizedWidth = (width) => {
            const { directionTo, cellWidth } = this.props;
            const paxLineWidth = cellWidth * 4;
            if (width > paxLineWidth) {
                return paxLineWidth;
            }
            if (directionTo) {
                // paxToの処理
                if (width < Pax_1.PAX_FLIGHT_MINIMUM_TO) {
                    return Pax_1.PAX_FLIGHT_MINIMUM_TO;
                }
            }
            else if (width < Pax_1.PAX_FLIGHT_MINIMUM_FROM) {
                // paxFromの処理
                return Pax_1.PAX_FLIGHT_MINIMUM_FROM;
            }
            return width;
        };
        this.position = () => {
            const { startTime, minTime, endTime } = this.props;
            const startMinDuration = dayjs_1.default.duration(startTime.diff(minTime));
            const endStartDuration = dayjs_1.default.duration(endTime.diff(startTime));
            const left = startMinDuration.asHours() * this.props.cellWidth;
            const width = endStartDuration.asHours() * this.props.cellWidth;
            const normalizedLeft = left < 0 ? 0 : left > this.props.gridWidth - Pax_1.PAX_FLIGHT_MINIMUM_TO ? this.props.gridWidth - Pax_1.PAX_FLIGHT_MINIMUM_TO : left;
            const normalizedWidth = this.normalizedWidth(width);
            return { left: normalizedLeft, width: normalizedWidth };
        };
        this.isVisibledFlightScheduleDate = () => {
            const { startTime, endTime, directionTo, orgDateLcl } = this.props;
            const comparingOrgDateLcl = directionTo ? startTime : endTime;
            return orgDateLcl.format("YYYY-MM-DD") !== comparingOrgDateLcl.format("YYYY-MM-DD");
        };
    }
    componentDidMount() {
        const metaContainer = this.metaContainerRef.current;
        if (!metaContainer)
            return;
        const left = metaContainer.firstElementChild.offsetLeft;
        if (left < 0) {
            metaContainer.style.marginRight = `${left - 3}px`;
            return;
        }
        const container = metaContainer.parentElement;
        const containerWidth = container.getBoundingClientRect().width;
        const lastMetaElm = metaContainer.lastElementChild;
        const right = lastMetaElm.offsetLeft + lastMetaElm.offsetWidth;
        if (right > containerWidth) {
            metaContainer.style.marginLeft = `${containerWidth - right - 3}px`;
        }
    }
    render() {
        const { startTime, endTime, directionTo } = this.props;
        const { left, width } = this.position();
        return (react_1.default.createElement(Container, { left: left, width: width },
            react_1.default.createElement(LineContainer, { directionTo: directionTo },
                react_1.default.createElement(Line, null),
                react_1.default.createElement(Ship, { directionTo: directionTo })),
            react_1.default.createElement(MetaContainer, { directionTo: directionTo, ref: this.metaContainerRef },
                this.isVisibledFlightScheduleDate() && react_1.default.createElement(ShipTag, null, (directionTo ? startTime : endTime).format("DDMMM").toUpperCase()),
                react_1.default.createElement(EndTime, null, directionTo ? startTime.format("HH:mm") : endTime.format("HH:mm")))));
    }
}
exports.PaxLine = PaxLine;
const Container = styled_components_1.default.div `
  position: absolute;
  top: 0;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  padding: 8px 0 0;
`;
const LineContainer = styled_components_1.default.div `
  width: 100%;
  height: 20px;
  padding: ${(props) => (props.directionTo ? "0 0 0 10px" : "0 10px 0 0")};
  position: relative;
`;
const Line = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  background-color: rgba(126, 193, 207, 0.6);
`;
const Ship = styled_components_1.default.img.attrs({ src: ship_svg_1.default }) `
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  ${(props) => (props.directionTo ? "left: 0;" : "right: 0;")};
`;
const ShipTag = styled_components_1.default.span `
  background-color: #707070;
  padding: 2px 4px;
  color: #fff;
  font-size: 11px;
  border-radius: 2px;
  margin-right: 2px;
`;
const MetaContainer = styled_components_1.default.div `
  display: flex;
  justify-content: ${(props) => (props.directionTo ? "flex-start" : "flex-end")};
  align-items: center;
  padding-top: 2px;
`;
const EndTime = styled_components_1.default.div `
  font-size: 14px;
`;
//# sourceMappingURL=PaxLine.js.map