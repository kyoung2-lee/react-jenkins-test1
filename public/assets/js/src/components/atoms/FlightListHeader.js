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
const FlightListHeader = (props) => {
    const flightListHeaderScrollRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // form上の初期フォーカス項目からフォーカスを外し、上下キーによるスクロールを可能にする
        if (flightListHeaderScrollRef.current) {
            flightListHeaderScrollRef.current.focus();
        }
        // これにより、便一覧画面Submit後のスクロール最上部の項目が、FlightListHeaderに設定される
        if (flightListHeaderScrollRef.current) {
            flightListHeaderScrollRef.current.scrollIntoView();
        }
    }, []);
    return (react_1.default.createElement(Wrapper
    // 便一覧画面の場合、tabIndexを与えないとfocusが効かないため、便一覧画面表示時にのみ有効にしている
    // 機材接続情報モードレスの場合、tabIndexを設定した場合、クリック時にもfocusが効かなくなるため外してある
    , { ...(props.isModalComponent ? {} : { tabIndex: -1, ref: flightListHeaderScrollRef }), style: props.style },
        react_1.default.createElement("table", null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Flight"),
                    react_1.default.createElement("th", null, "Departure"),
                    react_1.default.createElement("th", null, "Arrival"),
                    react_1.default.createElement("th", null,
                        "Total",
                        react_1.default.createElement("span", { className: "total" }, props.totalNumber)))))));
};
const Wrapper = styled_components_1.default.div `
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  table {
    width: 100%;
    padding: 0 5px;
    border-spacing: 0px;
    background: #119ac2;
  }
  thead {
    th {
      padding-top: 3px;
      font-size: 12px;
      line-height: 16px;
      text-align: left;
      font-weight: normal;
      color: #fff;
    }
  }
  thead > tr > th:nth-child(1) {
    width: 76px;
    padding-left: 5px;
  }
  thead > tr > th:nth-child(2) {
    width: 116px;
    padding-left: 3px;
  }
  thead > tr > th:nth-child(3) {
    width: 50px;
    padding-left: 2px;
  }
  thead > tr > th:nth-child(4) {
    text-align: right;
  }
  .total {
    margin-left: 8px;
    font-size: 18px;
  }
`;
exports.default = FlightListHeader;
//# sourceMappingURL=FlightListHeader.js.map