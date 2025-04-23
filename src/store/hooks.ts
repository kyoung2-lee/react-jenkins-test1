import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useRef, useEffect, useLayoutEffect, useState, EffectCallback, DependencyList } from "react";
import type { RootState, AppDispatch } from "./storeType";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * previous propsを取得する
 */
export function usePrevious<T>(value: T) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * 画面サイズを取得する
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({
    width: undefined,
    height: undefined,
  });
  useLayoutEffect(() => {
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

/**
 * 初回の実行がスキップされるuseEffect
 */
export function useDidUpdateEffect(fn: EffectCallback, deps: DependencyList) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
