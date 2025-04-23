"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const immutable_1 = require("immutable");
const AirportIssueIcon_1 = __importDefault(require("../atoms/AirportIssueIcon"));
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
class MovableAirportIcons extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.containerRef = react_1.default.createRef();
        this.state = {
            // eslint-disable-next-line react/no-unused-state
            overflow: false,
            issus: this.propsToIssuState(props.issus),
        };
    }
    componentDidMount() {
        this.scrollAnimationInterval = setInterval(() => {
            const { issus } = this.state;
            if (this.containerRef.current) {
                const parentNode = this.containerRef.current;
                const lastChild = parentNode.lastElementChild;
                if (!lastChild)
                    return;
                if (lastChild.getBoundingClientRect().right > parentNode.getBoundingClientRect().right) {
                    // Fixed level icon (first child). Move second icon to last icon.
                    const current = issus.skip(1).first();
                    if (current) {
                        const dequeued = issus.splice(1, 1);
                        this.setState({ issus: dequeued.push(current) });
                    }
                }
            }
        }, 1000);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // ヘッダー情報が更新されたらstateも作り直す
        this.setState({
            issus: this.propsToIssuState(nextProps.issus),
        });
    }
    componentWillUnmount() {
        if (this.scrollAnimationInterval) {
            clearTimeout(this.scrollAnimationInterval);
        }
    }
    propsToIssuState(issus) {
        return issus ? immutable_1.List.of(...issus) : immutable_1.List.of();
    }
    render() {
        const { onClick, terminalUtcDate, numberOfDisplay = 4 } = this.props;
        const { issus } = this.state;
        let sizeOfIcon = 44;
        let marginOfIcons = 10;
        let marginTop = 0;
        let marginLeft = 10;
        if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad) {
            sizeOfIcon = 61;
            marginOfIcons = 14;
            marginTop = 0;
            marginLeft = 10;
        }
        else if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
            sizeOfIcon = 39;
            marginOfIcons = 8;
            marginTop = 0;
            marginLeft = 0;
        }
        return (react_1.default.createElement(AirportIcons, { ref: this.containerRef, onClick: onClick, numberOfDisplay: numberOfDisplay, sizeOfIcon: sizeOfIcon, marginOfIcons: marginOfIcons, marginTop: marginTop, marginLeft: marginLeft }, issus && issus.map((issu) => (0, AirportIssueIcon_1.default)({ issu, key: issu.issuCd + issu.issuDtlCd, terminalUtcDate }))));
    }
}
const AirportIcons = styled_components_1.default.div `
  display: block; /* flexにすると初回の表示が崩れるので注意 */
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  height: ${({ sizeOfIcon }) => sizeOfIcon + 3 + 6}px;
  max-width: ${({ numberOfDisplay, sizeOfIcon, marginOfIcons }) => numberOfDisplay * (sizeOfIcon + marginOfIcons) - 2}px;
  margin-top: ${({ marginTop }) => marginTop}px;
  margin-left: ${({ marginLeft }) => marginLeft}px;
  padding-top: 3px; /* ドロップシャドウのための余白 */
  > img {
    margin-right: ${({ marginOfIcons }) => marginOfIcons}px;
    width: ${({ sizeOfIcon }) => sizeOfIcon}px;
    height: ${({ sizeOfIcon }) => sizeOfIcon + 6}px;
    padding-bottom: 6px;
    filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.7));
    :nth-of-type(n + ${({ numberOfDisplay }) => numberOfDisplay + 1}) {
      visibility: hidden; /* ドロップシャドーの見切れを完全に消すため見えないアイコンは非表示 */
    }
  }
`;
exports.default = MovableAirportIcons;
//# sourceMappingURL=MovableAirportIcons.js.map