import { useEffect, useRef } from 'react';

export const useEffectOnce = (effect) => {
  const destroyFunc = useRef();
  const calledOnce = useRef(false);
  const renderAfterCalled = useRef(false);

  if (calledOnce.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    const asyncEffect = async () => {
      if (calledOnce.current) {
        return;
      }

      calledOnce.current = true;
      destroyFunc.current = await effect();

      return () => {
        if (!renderAfterCalled.current) {
          return;
        }

        if (destroyFunc.current) {
          destroyFunc.current();
        }
      };
    };

    asyncEffect();
  }, []);
};
