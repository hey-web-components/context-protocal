import {
  Context,
  ContextCallback,
  ContextRequestEvent,
  UnknownContext,
} from "./def";

export const createContext = <ValueType>(key: unknown) =>
  key as Context<typeof key, ValueType>;

export const provideContext = <TKey, TValue>(
  el: Element,
  context: Context<TKey, TValue>,
  initialValue: TValue
) => {
  let value = initialValue;
  // TODO handle node changes
  // TODO use WeakRefs
  let subscriberCallbacks: ContextCallback<TValue>[] = [];
  const handler = (event: ContextRequestEvent<UnknownContext>) => {
    const consumerHost = event.composedPath()[0] as Element;
    if (event.context !== context || consumerHost === el) {
      return;
    }
    event.stopPropagation();
    const unsubscribe = () => removeItem(subscriberCallbacks, event.callback);
    event.callback(value, unsubscribe);
    if (event.subscribe) {
      subscriberCallbacks.push(event.callback);
    }
  };
  const updateValue = (v: TValue) => {
    value = v;
    subscriberCallbacks.forEach((callback) => {
      callback(value, () => removeItem(subscriberCallbacks, callback));
    });
  };
  el.addEventListener("context-request", handler);
  return [
    updateValue,
    () => {
      el.removeEventListener("context-request", handler);
      subscriberCallbacks = [];
    },
  ];
};

export const consumeContext = <TKey, TValue>(
  el: Element,
  context: Context<TKey, TValue>,
  callback: ContextCallback<TValue>,
  subscribe: boolean = false
) => {
  el.dispatchEvent(new ContextRequestEvent(context, callback, subscribe));
};

const removeItem = <T>(list: T[], item: T) => {
  list.splice(
    list.findIndex((i) => i === item),
    1
  );
};
