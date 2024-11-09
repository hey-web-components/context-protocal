import { UnknownContext } from "./def";
import { consumeContext, createContext, provideContext } from "./impl";

const context1 = createContext("context-1");
const context2 = createContext("context-2");

const one = document.querySelector("#one") as HTMLElement;
const two = document.querySelector("#two") as HTMLElement;
const three = document.querySelector("#three") as HTMLElement;
const button1 = document.querySelector("#update-button-1") as HTMLButtonElement;
const button2 = document.querySelector("#update-button-2") as HTMLButtonElement;

let count = 0;

const [updateValue1] = provideContext(one, context1, new Date().toISOString());
const [updateValue2] = provideContext(one, context2, count);
const [] = provideContext(two, context2, "foo");

button1.addEventListener("click", () => updateValue1(new Date().toISOString()));
button2.addEventListener("click", () => updateValue2(++count));

const consume = (el: Element, context: UnknownContext) =>
  consumeContext(
    el,
    context,
    (value) => {
      const display = el.querySelector(`.${context}-display`);
      if (!display) {
        return;
      }
      display.innerHTML = `${context}: ${value}`;
    },
    true
  );

consume(one, context1);
consume(one, context2);
consume(two, context1);
consume(two, context2);
consume(three, context1);
consume(three, context2);
