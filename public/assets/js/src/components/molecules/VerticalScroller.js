"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalScroller = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
class VerticalScroller extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.currentX = 0;
        this.scrolling = false;
        this.startScroll = (e) => {
            this.currentX = e.clientX;
            this.scrolling = true;
        };
        this.scroll = (e) => {
            if (!this.scrolling)
                return;
            // eslint-disable-next-line no-param-reassign
            e.currentTarget.scrollLeft += this.currentX - e.clientX;
            this.currentX = e.clientX;
        };
        this.stopScroll = () => {
            this.scrolling = false;
        };
    }
    render() {
        const { children, className } = this.props;
        return (react_1.default.createElement(Container, { onMouseDown: this.startScroll, onMouseMove: this.scroll, onMouseUp: this.stopScroll, onMouseLeave: this.stopScroll, className: className }, children));
    }
}
exports.VerticalScroller = VerticalScroller;
const Container = styled_components_1.default.div `
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
//# sourceMappingURL=VerticalScroller.js.map