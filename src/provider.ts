import {
  Context,
  ContextCallback,
  ContextProviderEvent,
  ContextRequestEvent,
  UnknownContext,
} from "./context";

export const provideContext = <TKey, TValue>(
  el: Element,
  context: Context<TKey, TValue>,
  initialValue?: TValue
) => {
  let value = initialValue;
  let subscriptions: {
    consumerRef: WeakRef<Element>;
    callbackRef: WeakRef<ContextCallback<unknown>>;
  }[] = [];

  const contextRequestHandler = (
    event: ContextRequestEvent<UnknownContext>
  ) => {
    if (event.context !== context) {
      return;
    }
    const consumer = event.composedPath()[0] as Element;
    if (consumer === el) {
      return;
    }
    event.stopPropagation();
    const callback = event.callback;
    const unsubscribe = () => {
      const subscription = subscriptions.find(
        ({ consumerRef, callbackRef }) =>
          consumerRef.deref() === consumer && callbackRef.deref() === callback
      );
      removeItem(subscriptions, subscription);
    };
    callback(value, unsubscribe);
    if (event.subscribe) {
      subscriptions.push({
        consumerRef: new WeakRef(consumer),
        callbackRef: new WeakRef(callback),
      });
    }
  };

  const contextProviderHandler = (
    event: ContextProviderEvent<UnknownContext>
  ) => {
    if (event.context !== context) {
      return;
    }
    const provider = event.composedPath()[0] as Element;
    if (provider === el) {
      return;
    }
    event.stopPropagation();
    const seen = new Set<unknown>();
    for (const { consumerRef, callbackRef } of subscriptions) {
      const consumer = consumerRef.deref();
      const callback = callbackRef.deref();
      if (!consumer || !callback) {
        return;
      }
      if (seen.has(callback)) {
        continue;
      }
      seen.add(callback);
      consumer.dispatchEvent(new ContextRequestEvent(context, callback, true));
    }
    subscriptions = [];
  };

  const updateValue = (v: TValue) => {
    value = v;
    for (const subscription of subscriptions) {
      subscription.callbackRef.deref()?.(v, () =>
        removeItem(subscriptions, subscription)
      );
    }
  };

  const stop = () => {
    el.removeEventListener("context-request", contextRequestHandler);
    el.removeEventListener("context-provider", contextProviderHandler);
    for (const { consumerRef, callbackRef } of subscriptions) {
      const consumer = consumerRef.deref();
      const callback = callbackRef.deref();
      if (!consumer || !callback) {
        continue;
      }
      consumer.dispatchEvent(new ContextRequestEvent(context, callback, true));
    }
    subscriptions = [];
  };

  el.addEventListener("context-request", contextRequestHandler);
  el.addEventListener("context-provider", contextProviderHandler);

  return [updateValue, stop] as [(value: TValue) => void, () => void];
};

const removeItem = <T>(list: T[], item: T) => {
  list.splice(
    list.findIndex((i) => i === item),
    1
  );
};
