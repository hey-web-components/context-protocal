import { Context, ContextCallback, ContextRequestEvent } from "./context";

export const consumeContext = <TKey, TValue>(
  el: Element,
  context: Context<TKey, TValue>,
  callback: ContextCallback<TValue>,
  subscribe: boolean = false
) => {
  el.dispatchEvent(new ContextRequestEvent(context, callback, subscribe));
};
