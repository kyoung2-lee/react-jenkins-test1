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
const hooks_1 = require("../../../store/hooks");
const Template_1 = __importDefault(require("./Template"));
var TemplatePosition;
(function (TemplatePosition) {
    TemplatePosition["center"] = "center";
    TemplatePosition["left"] = "left";
    TemplatePosition["right"] = "right";
})(TemplatePosition || (TemplatePosition = {}));
const TemplateList = (props) => {
    const Broadcast = (0, hooks_1.useAppSelector)((state) => state.broadcast.Broadcast);
    const userJobCd = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth.user.jobCd);
    const templateJobCd = (0, hooks_1.useAppSelector)((state) => { var _a; return (_a = state.form.broadcast.values) === null || _a === void 0 ? void 0 : _a.templateJobCd; });
    const [index, setIndex] = (0, react_1.useState)(0);
    const [deltaX, setDeltaX] = (0, react_1.useState)(0);
    const [position, setPosition] = (0, react_1.useState)(TemplatePosition.center);
    const [swiping, setSwiping] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIndex(0);
        setPosition(TemplatePosition.center);
        setDeltaX(0);
    }, [Broadcast.templates]);
    const handlePanStart = (i) => {
        setIndex(i);
        setPosition(index === i ? position : TemplatePosition.center);
        setDeltaX(index === i ? deltaX : 0);
        setSwiping(true);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePan = (e, i, disabled) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (e.srcEvent && e.srcEvent.type === "pointercancel") {
            setIndex(i);
            setDeltaX(getFirstDistance(i));
            setSwiping(false);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        let distance = e.deltaX;
        if (disabled && position === TemplatePosition.center && distance > 0) {
            distance = 0;
        }
        else if (disabled && position === TemplatePosition.left && distance > DEFAULT_SWIPED_DISTANCE) {
            distance = DEFAULT_SWIPED_DISTANCE;
        }
        else if (position === TemplatePosition.center) {
            if (distance >= DEFAULT_SWIPED_DISTANCE * 2) {
                distance = DEFAULT_SWIPED_DISTANCE * 2;
            }
            else if (distance <= -1 * DEFAULT_SWIPED_DISTANCE * 2) {
                distance = -1 * DEFAULT_SWIPED_DISTANCE * 2;
            }
        }
        else if (position === TemplatePosition.left) {
            if (distance >= DEFAULT_SWIPED_DISTANCE * 3) {
                distance = DEFAULT_SWIPED_DISTANCE * 3;
            }
            else if (distance <= -1 * DEFAULT_SWIPED_DISTANCE) {
                distance = -1 * DEFAULT_SWIPED_DISTANCE;
            }
        }
        else if (distance >= DEFAULT_SWIPED_DISTANCE) {
            distance = DEFAULT_SWIPED_DISTANCE;
        }
        else if (distance <= -1 * DEFAULT_SWIPED_DISTANCE * 3) {
            distance = -1 * DEFAULT_SWIPED_DISTANCE * 3;
        }
        setIndex(i);
        setDeltaX(getFirstDistance(i) + distance);
        setSwiping(true);
    };
    const getFirstDistance = (i) => {
        if (index === i) {
            if (position === TemplatePosition.center)
                return 0;
            if (position === TemplatePosition.left)
                return -1 * DEFAULT_SWIPED_DISTANCE;
            return DEFAULT_SWIPED_DISTANCE;
        }
        return 0;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePanEnd = (e, i, disabled) => {
        setTimeout(() => setSwiping(false), 200);
        const firstPosition = getFirstPosition(i);
        if (disabled) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (firstPosition === TemplatePosition.center && e.deltaX > 0) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (firstPosition === TemplatePosition.left && e.deltaX > DEFAULT_SWIPED_DISTANCE) {
                setIndex(i);
                setPosition(TemplatePosition.center);
                setDeltaX(0);
                return;
            }
        }
        if (firstPosition === TemplatePosition.left) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setLeftTemplateNextPositionState(i, e.deltaX, firstPosition);
        }
        else if (firstPosition === TemplatePosition.right) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setRightTemplateNextPositionState(i, e.deltaX, firstPosition);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            setCenterTemplateNextPositionState(i, e.deltaX, firstPosition);
        }
    };
    const setLeftTemplateNextPositionState = (i, delX, posi) => {
        if (delX >= DEFAULT_SWIPED_DISTANCE / 2 && delX <= DEFAULT_SWIPED_DISTANCE * 1.5) {
            setIndex(i);
            setPosition(TemplatePosition.center);
            setDeltaX(0);
            return;
        }
        if (delX > DEFAULT_SWIPED_DISTANCE * 1.5) {
            setIndex(i);
            setPosition(TemplatePosition.right);
            setDeltaX(DEFAULT_SWIPED_DISTANCE);
            return;
        }
        setIndex(i);
        setPosition(posi);
        setDeltaX(getFirstDistance(i));
    };
    const setRightTemplateNextPositionState = (i, delX, posi) => {
        if (delX <= (-1 * DEFAULT_SWIPED_DISTANCE) / 2 && delX >= -1 * DEFAULT_SWIPED_DISTANCE * 1.5) {
            setIndex(i);
            setPosition(TemplatePosition.center);
            setDeltaX(0);
            return;
        }
        if (delX < -1 * DEFAULT_SWIPED_DISTANCE * 1.5) {
            setIndex(i);
            setPosition(TemplatePosition.left);
            setDeltaX(-1 * DEFAULT_SWIPED_DISTANCE);
            return;
        }
        setIndex(i);
        setPosition(posi);
        setDeltaX(getFirstDistance(i));
    };
    const setCenterTemplateNextPositionState = (i, delX, posi) => {
        if (delX <= (-1 * DEFAULT_SWIPED_DISTANCE) / 2) {
            setIndex(i);
            setPosition(TemplatePosition.left);
            setDeltaX(-1 * DEFAULT_SWIPED_DISTANCE);
            return;
        }
        if (delX >= DEFAULT_SWIPED_DISTANCE / 2) {
            setIndex(i);
            setPosition(TemplatePosition.right);
            setDeltaX(DEFAULT_SWIPED_DISTANCE);
            return;
        }
        setIndex(i);
        setPosition(posi);
        setDeltaX(0);
    };
    const getFirstPosition = (i) => index === i ? position : TemplatePosition.center;
    const getDeltaX = (i) => (index === i ? deltaX : 0);
    const getTemplateDisabled = (type) => {
        const { canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification } = Broadcast;
        switch (type) {
            case "BB":
                return !canManageBb;
            case "MAIL":
                return !canManageEmail;
            case "TTY":
                return !canManageTty;
            case "AFTN":
                return !canManageAftn;
            case "ACARS":
                return !canManageAcars;
            case "NTF":
                return !canManageNotification;
            default:
                return true;
        }
    };
    const isOtherJobCdTemplate = templateJobCd !== userJobCd;
    const { id, onClickEdit, onClickDelete, onClickTemplate } = props;
    return (react_1.default.createElement(List, null, Broadcast.templates.map((template, i) => {
        const disabled = getTemplateDisabled(template.broadcastType);
        return (react_1.default.createElement(Wrapper, { key: template.templateId },
            react_1.default.createElement(Template_1.default, { id: template.templateId, name: template.templateName, type: template.broadcastType, onClickEdit: onClickEdit, disabled: disabled, isEditable: !(disabled || isOtherJobCdTemplate), isDeletable: !isOtherJobCdTemplate, onClickDelete: onClickDelete, onClickTemplate: (templateId, type) => !swiping && onClickTemplate(templateId, type), isActive: id === template.templateId, deltaX: getDeltaX(i), onPanStart: () => handlePanStart(i), onPan: (e) => handlePan(e, i, disabled), onPanEnd: (e) => handlePanEnd(e, i, disabled) })));
    })));
};
const DEFAULT_SWIPED_DISTANCE = 72;
const List = styled_components_1.default.div `
  overflow-y: scroll;
  overflow-x: hidden;
  width: 250px;
  margin: 7px 0;
  div:nth-child(1) {
    margin-top: 0;
  }
`;
const Wrapper = styled_components_1.default.div `
  overflow: hidden;
  margin-top: 5px;
`;
exports.default = TemplateList;
//# sourceMappingURL=TemplateList.js.map