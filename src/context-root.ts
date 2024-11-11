import {
  ContextCallback,
  ContextProviderEvent,
  ContextRequestEvent,
  UnknownContext,
} from "./context";

export const attachContextRoot = (
  context: UnknownContext,
  rootElement: Element = document.body
) => {
  let consumerCallbacksMap = new WeakMap<
    Element,
    WeakSet<ContextCallback<unknown>>
  >();
  let requests: {
    elementRef: WeakRef<Element>;
    callbackRef: WeakRef<ContextCallback<unknown>>;
  }[] = [];

  const contextRequestHandler = (
    event: ContextRequestEvent<UnknownContext>
  ) => {
    if (event.context !== context) {
      return;
    }
    if (!event.subscribe) {
      return;
    }
    const element = event.composedPath()[0] as Element;
    const callback = event.callback;

    let consumerCallbackSet = consumerCallbacksMap.get(element);
    if (!consumerCallbackSet) {
      consumerCallbacksMap.set(element, (consumerCallbackSet = new WeakSet()));
    }

    if (consumerCallbackSet.has(callback)) {
      return;
    }

    consumerCallbackSet.add(callback);
    requests.push({
      elementRef: new WeakRef(element),
      callbackRef: new WeakRef(callback),
    });

    event.stopPropagation();
  };

  const contextProviderHandler = (
    event: ContextProviderEvent<UnknownContext>
  ) => {
    if (event.context !== context) {
      return;
    }
    if (requests.length <= 0) {
      return;
    }

    const _requests = requests;
    consumerCallbacksMap = new WeakMap();
    requests = [];

    for (const { elementRef, callbackRef } of _requests) {
      const element = elementRef.deref();
      const callback = callbackRef.deref();

      if (!element || !callback) {
        continue;
      }
      element.dispatchEvent(
        new ContextRequestEvent(event.context, callback, true)
      );
    }

    event.stopPropagation();
  };

  rootElement.addEventListener("context-request", contextRequestHandler);
  rootElement.addEventListener("context-provider", contextProviderHandler);

  return () => {
    rootElement.removeEventListener("context-request", contextRequestHandler);
    rootElement.removeEventListener("context-provider", contextProviderHandler);
  };
};
