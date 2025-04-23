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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const BarChartSpotRemarksTooltip = (props) => {
    const [tooltipTop, setTooltipTop] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const { isActiveSpotTooltip, remarksLabelId, leftSideGridRef } = props;
        // 表示の場合は処理を行う
        // 高さ調整でstateが変更され、componentDidUpdateがループするためフラグ制御
        if (isActiveSpotTooltip) {
            // SPOT番号表示Grid 高さ取得
            let gridHeight = 0;
            if (leftSideGridRef.current) {
                gridHeight = leftSideGridRef.current.getBoundingClientRect().height;
            }
            // SPOTリマークスLabel TOP位置取得
            const remarksLabelElement = document.getElementById(remarksLabelId);
            const remarksTop = remarksLabelElement ? remarksLabelElement.getBoundingClientRect().top : 0;
            // render後にTooltipの高さ取得し、位置セット
            const tooltipElement = document.getElementById("remarksToolTip") ? document.getElementById("remarksToolTip") : null;
            const tooltipHeight = tooltipElement ? tooltipElement.clientHeight : 0;
            if (remarksTop <= gridHeight / 2 + tooltipHeight) {
                // Grid上部RemarksのTooltip位置
                setTooltipTop(remarksTop - 40 - 5);
            }
            else {
                // Grid下部RemarksのTooltip位置
                setTooltipTop(remarksTop - 40 + 10 - tooltipHeight);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isActiveSpotTooltip]);
    const { isActiveSpotTooltip, remarks } = props;
    return (react_1.default.createElement(RemarksToolTip, { id: "remarksToolTip", isActiveSpotTooltip: isActiveSpotTooltip, tooltipTop: tooltipTop }, remarks));
};
// transition-delayを有効にするため、opacity, visibilityで表示制御しています。
const RemarksToolTip = styled_components_1.default.div `
  ${({ isActiveSpotTooltip }) => isActiveSpotTooltip
    ? `
      opacity: 1;
      visibility: visible;
      transition-delay: 300ms;
    `
    : `
      opacity: 0;
      visibility: hidden;
  `};

  ${({ tooltipTop }) => (tooltipTop ? `top: ${tooltipTop}px;` : `top: ${tooltipTop}px;`)};

  position: absolute;
  overflow-wrap: break-word;
  left: 68px;
  width: 326px;
  z-index: 3;
  background: #fff;
  box-shadow: 2px 3px 9px rgba(0, 0, 0, 0.35);
  font-size: 14px;
  text-align: left;
  padding: 10px 5px 10px 10px;
  padding-right: 7px;
  display: inline-block;
  line-height: 1.3;
`;
exports.default = BarChartSpotRemarksTooltip;
//# sourceMappingURL=BarChartSpotRemarksTooltip.js.map