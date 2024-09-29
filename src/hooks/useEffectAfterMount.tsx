import { useEffect, useRef, DependencyList, EffectCallback } from "react";

/**
 * Custom hook to trigger a callback function after the component has mounted.
 * @param callbackFn Callback function to trigger after the component has mounted
 * @param dependencies Dependencies to trigger the callback function
 */
export default function useEffectAfterMount(callbackFn: EffectCallback, dependencies: DependencyList) {
  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    if (hasMounted.current) {
      callbackFn();
    } else {
      hasMounted.current = true;
    }
  }, dependencies)
}