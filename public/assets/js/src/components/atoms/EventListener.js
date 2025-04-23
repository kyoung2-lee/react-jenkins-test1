"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const EventListener = (props) => {
    (0, react_1.useEffect)(() => {
        props.eventHandlers.forEach((e) => {
            e.target.addEventListener(e.type, e.listener, e.options);
        });
        return () => {
            props.eventHandlers.forEach((e) => {
                e.target.removeEventListener(e.type, e.listener, e.options);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};
exports.default = EventListener;
//# sourceMappingURL=EventListener.js.map