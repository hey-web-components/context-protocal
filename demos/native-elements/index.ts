import {
  attachContextRoot,
  consumeContext,
  createContext,
  provideContext,
  UnknownContext,
} from "../../src/index";

const context1 = createContext<number>("context-1");
const context2 = createContext<number>("context-2");

attachContextRoot(context1, document.body);
attachContextRoot(context2, document.body);

const one = document.querySelector("#one") as HTMLElement;
const two = document.querySelector("#two") as HTMLElement;
const three = document.querySelector("#three") as HTMLElement;
const button1 = document.querySelector("#update-button-1") as HTMLButtonElement;
const button2 = document.querySelector("#update-button-2") as HTMLButtonElement;
const button3 = document.querySelector("#update-button-3") as HTMLButtonElement;

let value1 = 0;
let value2 = 0;
let value3 = 0;

const [updateValue1] = provideContext(one, context1, { initialValue: value1 });
const [updateValue2] = provideContext(one, context2, { initialValue: value2 });
const [updateValue3] = provideContext(two, context2, { initialValue: value3 });

button1.addEventListener("click", () => updateValue1(++value1));
button2.addEventListener("click", () => updateValue2(++value2));
button3.addEventListener("click", () => updateValue3(++value3));

const callbacks: ((value: number) => void)[] = []; // hard ref the callbacks

const consume = (el: Element, context: UnknownContext) => {
  const callback = (value) => {
    const display = el.querySelector(`.${context}-display`);
    if (!display) {
      return;
    }
    display.innerHTML = `${context}: ${value}`;
  };
  callbacks.push(callback);
  consumeContext(el, context, { callback, subscribe: true });
};

consume(one, context1);
consume(one, context2);
consume(two, context1);
consume(two, context2);
consume(three, context1);
consume(three, context2);
