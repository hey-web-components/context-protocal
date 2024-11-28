# Context-Protocol

This is an implementation of [Context Community Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md), which is an open protocol for data passing between elements using DOM events.

It is designed to be used with web components but can also be used for other DOM elements.

_This implementation is highly inspired by [@lit/context](https://www.npmjs.com/package/@lit/context)._

## How to use

### Create a context

First of all, a context should be created before use.

```ts
import { createContext } from "@hey-web-components/context-protocol";
const myContext = createContext<number>("my-context");
```

The above code creates a context with identifier `"my-context"`, which should be unique, and the type of the context value is `number`.

### Attch to a context root

Then we should attach the context to a context root, which should be a DOM element. The context would not go above the context root element.

```ts
import { attachContextRoot } from "@hey-web-components/context-protocol";
attachContextRoot(myContext, document.body);
```

The above code attaches `myContext` to the document body.

### Provide a context

To provide a context, call the `provideContext` function. Any descendant elements can consume the provided context.

It takes three parameters:

- an DOM elment to be made to the context provider
- the context
- more options (optional to give an initial value)

It then returns an array of two callback functions:

- a callback for updating the context value
- a callback to stop providing the context.

```ts
import { provideContext } from "@hey-web-components/context-protocol";
const [updateValue, stopProviding] = provideContext(el, myContext, {
  initialValue: 0,
});
setTimeout(() => {
  updateValue(1);
}, 1000);
```

The above code makes `el` to be a context provider for `myContext` with the initial value of `0`. Then, in one secend, the context value is updated to `1`.

### Consume a context

To consume a context, call the `consumeContext` function. It allows an element to consume the context that provided by its nearest ancestor provider.

It takes three parameters:

- an DOM element to be made to the context consumer
- the context
- more options (the callback function and whether to subscribe)

The callback function should takes two parameters:

- the value
- an callback to unsubsribe (if subscribe is `true`)

```ts
import { consumeContext } from "@hey-web-components/context-protocol";
const callback = (value) => {
  console.log(value);
};
consumeContext(el, myContext, { callback, subscribe: true });
```

The above code makes `el` to be a context consumer and subscribed the updates. Since it subscribes the context, the callback function may be called multiple times when the context value is changed.

**Note: since this implementation uses `WeakMap` and `WeakRef`, the callback function needs to be hard-ref'ed. (If it is garbage collected, it would no longer be invoked.)** For example, if use inside a custom element, the callback should be assigned to a property of the class.

### Examples

Some example codes are available [here](./demos/).
