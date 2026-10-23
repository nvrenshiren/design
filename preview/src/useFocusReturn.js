import { useCallback, useEffect, useRef } from 'react';

// A drawer closed during its entrance can unmount before afterOpenChange(false).
// Watch the state edge as well as the normal animation-completion callback.
export function useFocusReturn(open, target) {
  const previous = useRef(open);
  const restore = useCallback(visible => {
    const element = target.current?.nativeElement || target.current;
    if (!visible && element?.isConnected) element.focus({ preventScroll: true });
  }, [target]);
  useEffect(() => {
    const justClosed = previous.current && !open;
    previous.current = open;
    if (!justClosed) return;
    const frame = requestAnimationFrame(() => restore(false));
    return () => cancelAnimationFrame(frame);
  }, [open, restore]);
  return restore;
}
