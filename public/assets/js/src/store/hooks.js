"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLatest = exports.useDidUpdateEffect = exports.useWindowSize = exports.usePrevious = exports.useAppSelector = exports.useAppDispatch = void 0;
const react_redux_1 = require("react-redux");
const react_1 = require("react");
const useAppDispatch = () => (0, react_redux_1.useDispatch)();
exports.useAppDispatch = useAppDispatch;
exports.useAppSelector = react_redux_1.useSelector;
/**
 * previous propsを取得する
 */
function usePrevious(value) {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        ref.current = value;
    });
    return ref.current;
}
exports.usePrevious = usePrevious;
/**
 * 画面サイズを取得する
 */
function useWindowSize() {
    const [windowSize, setWindowSize] = (0, react_1.useState)({
        width: undefined,
        height: undefined,
    });
    (0, react_1.useLayoutEffect)(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}
exports.useWindowSize = useWindowSize;
/**
 * 初回の実行がスキップされるuseEffect
 */
function useDidUpdateEffect(fn, deps) {
    const didMountRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
        }
        else {
            fn();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
exports.useDidUpdateEffect = useDidUpdateEffect;
function useLatest(value) {
    const ref = (0, react_1.useRef)(value);
    ref.current = value;
    return ref;
}
exports.useLatest = useLatest;
//# sourceMappingURL=hooks.js.map