import { UnknownContext } from "./def";
import { consumeContext, createContext, provideContext } from "./impl";

const context1 = createContext("context1");
const context2 = createContext("context2");

const one = document.querySelector("#one") as HTMLElement;
const two = document.querySelector("#two") as HTMLElement;
const three = document.querySelector("#three") as HTMLElement;

let count = 0;

const [updateValue1] = provideContext(one, context1, new Date().toISOString());
const [updateValue2] = provideContext(one, context2, count);
const [] = provideContext(two, context2, "foo");

const consume = (el: Element, context: UnknownContext) =>
  consumeContext(
    el,
    context,
    (value) => console.log(el.id, context, value),
    true
  );

consume(one, context1);
consume(one, context2);
consume(two, context1);
consume(two, context2);
consume(three, context1);
consume(three, context2);

setInterval(() => updateValue1(new Date().toISOString()), 5000);
setInterval(() => updateValue2(++count), 5000);
