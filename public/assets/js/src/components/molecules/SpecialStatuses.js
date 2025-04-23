"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const immutable_1 = require("immutable");
const white = "#FFF";
const black = "#000";
class SpecialStatuses extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.containerRef = react_1.default.createRef();
        this.getLabelColor = ({ specialSts, isDarkMode, isSpcAccent, }) => {
            if (specialSts === "SPC") {
                if (isSpcAccent) {
                    if (isDarkMode) {
                        return {
                            color: black,
                            backgroundColor: "#EAA812", // dark yellow(dark)
                        };
                    }
                    return {
                        color: white,
                        backgroundColor: "#E67112", // dark yellow
                    };
                }
            }
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "#B5BDC3", // dark gray(dark)
                };
            }
            /* 特別ステータスのデフォルトと同じ色にする */
            return {
                color: black,
                backgroundColor: "rgb(197,197,197)", // light gray
            };
        };
        this.state = {
            orderedSpecialStatuses: this.propsToSpecialStatusesState(props.specialStses),
        };
    }
    componentDidMount() {
        this.scrollAnimationInterval = setInterval(() => {
            const { orderedSpecialStatuses } = this.state;
            if (this.containerRef.current) {
                const parentNode = this.containerRef.current;
                const lastChild = parentNode.lastElementChild;
                if (!lastChild)
                    return;
                if (lastChild.getBoundingClientRect().right > parentNode.getBoundingClientRect().right) {
                    const current = orderedSpecialStatuses.first();
                    if (current) {
                        const dequeued = orderedSpecialStatuses.shift();
                        this.setState({ orderedSpecialStatuses: dequeued.push(current) });
                    }
                }
            }
        }, 1000);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // 特別ステータスが更新されたらstateも作り直す
        this.setState({
            orderedSpecialStatuses: this.propsToSpecialStatusesState(nextProps.specialStses),
        });
    }
    componentWillUnmount() {
        if (this.scrollAnimationInterval) {
            clearInterval(this.scrollAnimationInterval);
        }
    }
    propsToSpecialStatusesState(specialStses) {
        let specialStsList = specialStses.specialSts.filter((s) => !s.ntfArrDepCd || !this.props.arrDepCd || s.ntfArrDepCd === this.props.arrDepCd);
        const arrDly = specialStsList.find((s) => s.ntfArrDepCd === "ARR" && s.level === "-1");
        const depDly = specialStsList.find((s) => s.ntfArrDepCd === "DEP" && s.level === "-1");
        if (arrDly && depDly) {
            // 出発便・到着便両方に日跨りDLYが存在する場合、到着便のもののみ表示とする。
            specialStsList = specialStsList.filter((s) => s.ntfArrDepCd !== "DEP" || s.level !== "-1");
        }
        const statuses = specialStsList.map((s) => s.status);
        return immutable_1.List.of(...new Set(statuses)); // 重複を削除してセット
    }
    render() {
        const { isPc, isDarkMode, isSpcAccent } = this.props;
        const { orderedSpecialStatuses } = this.state;
        return (react_1.default.createElement(SpecialSts, { ref: this.containerRef, width: this.props.width }, orderedSpecialStatuses.map((specialSts, index) => (
        // eslint-disable-next-line react/no-array-index-key
        react_1.default.createElement(StyledLabel, { key: index, labelColor: this.getLabelColor({ specialSts, isDarkMode, isSpcAccent }), isPc: isPc }, specialSts)))));
    }
}
const SpecialSts = styled_components_1.default.div `
  display: flex;
  max-width: ${({ width }) => width};
  overflow: hidden;
  padding-top: 2px;
  min-height: 22px;
`;
const StyledLabel = styled_components_1.default.div `
  margin-right: 2px;
  display: inline;
  padding: 0.2em 0.3em 0em;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  ${({ isPc, labelColor }) => (isPc && labelColor.color === black ? "-webkit-text-stroke: 1px;" : "")}
  color: ${({ labelColor }) => labelColor.color};
  background-color: ${({ labelColor }) => labelColor.backgroundColor};
  border-radius: 4px;
  box-sizing: border-box;
`;
exports.default = SpecialStatuses;
//# sourceMappingURL=SpecialStatuses.js.map