import { Context, ContextCallback, ContextRequestEvent } from "./context";

type ConsumeContextOptions<TValue> = {
  callback: ContextCallback<TValue>;
  subscribe: boolean;
};

export const consumeContext = <TKey, TValue>(
  el: Element,
  context: Context<TKey, TValue>,
  options: ConsumeContextOptions<TValue>
) => {
  el.dispatchEvent(
    new ContextRequestEvent(context, options.callback, options.subscribe)
  );
};
