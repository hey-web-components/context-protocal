import { UnknownContext } from "./def";
import { consumeContext, createContext, provideContext } from "./index";

const context1 = createContext("context-1");
const context2 = createContext("context-2");

const one = document.querySelector("#one") as HTMLElement;
const two = document.querySelector("#two") as HTMLElement;
const three = document.querySelector("#three") as HTMLElement;
const button1 = document.querySelector("#update-button-1") as HTMLButtonElement;
const button2 = document.querySelector("#update-button-2") as HTMLButtonElement;
const button3 = document.querySelector("#update-button-3") as HTMLButtonElement;

let value1 = 0;
let value2 = 0;
let value3 = 0;

const [updateValue1] = provideContext(one, context1, value1);
const [updateValue2] = provideContext(one, context2, value2);
const [updateValue3] = provideContext(two, context2, value3);

button1.addEventListener("click", () => updateValue1(++value1));
button2.addEventListener("click", () => updateValue2(++value2));
button3.addEventListener("click", () => updateValue3(++value3));

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
