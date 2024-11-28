import { consumeContext, provideContext } from "../../src";
import { context1, context2 } from "./context";

export class Demo extends HTMLElement {
  #providedContext1Value = 0;
  #providedContext2Value = 0;
  #consumedContext1Value?: number;
  #consumedContext2Value?: number;
  #updateContext1Value?: (value: number) => void;
  #updateContext2Value?: (value: number) => void;
  #stopProvideContext1?: () => void;
  #stopProvideContext2?: () => void;
  #unsubscibeContext1?: () => void;
  #unsubscibeContext2?: () => void;
  #context1Callback = (value, unsubscribe) => {
    this.#consumedContext1Value = value;
    this.#unsubscibeContext1 = unsubscribe;
    if (this.getAttribute("provide-context-1") != null) {
      this.#updateContext1Value?.(
        this.#providedContext1Value + (this.#consumedContext1Value ?? 0)
      );
    }
    this.render();
  };
  #context2Callback = (value, unsubscribe) => {
    this.#consumedContext2Value = value;
    this.#unsubscibeContext2 = unsubscribe;
    if (this.getAttribute("provide-context-2") != null) {
      this.#updateContext2Value?.(
        this.#providedContext2Value + (this.#consumedContext2Value ?? 0)
      );
    }
    this.render();
  };

  connectedCallback() {
    if (this.getAttribute("provide-context-1") != null) {
      [this.#updateContext1Value, this.#stopProvideContext1] = provideContext(
        this,
        context1,
        { initialValue: this.#providedContext1Value }
      );
    }
    if (this.getAttribute("provide-context-2") != null) {
      [this.#updateContext2Value, this.#stopProvideContext2] = provideContext(
        this,
        context2,
        { initialValue: this.#providedContext2Value }
      );
    }
    consumeContext(this, context1, {
      callback: this.#context1Callback,
      subscribe: true,
    });
    consumeContext(this, context2, {
      callback: this.#context2Callback,
      subscribe: true,
    });

    this.render();
  }

  disconnectedCallback() {
    this.#stopProvideContext1?.();
    this.#stopProvideContext2?.();
    this.#unsubscibeContext1?.();
    this.#unsubscibeContext2?.();
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.innerHTML = /* html */ `
        <style>
            :host {
                display: block;
                border: 1px solid;
                padding: 10px;
            }
        </style>
        <h1>${this.getAttribute("label")}</h1>
        <div>consumed context 1 value: ${this.#consumedContext1Value}</div>
        <div>consumed context 2 value: ${this.#consumedContext2Value}</div>
        ${
          this.getAttribute("provide-context-1") != null
            ? /* html */ `<button context-1>Update Context 1 Value</button>`
            : ""
        }
        ${
          this.getAttribute("provide-context-2") != null
            ? /* html */ `<button context-2>Update Context 2 Value</button>`
            : ""
        }
        <slot></slot>
    `;
    this.shadowRoot
      .querySelector("button[context-1]")
      ?.addEventListener("click", () =>
        this.#updateContext1Value?.(
          ++this.#providedContext1Value + (this.#consumedContext1Value ?? 0)
        )
      );
    this.shadowRoot
      .querySelector("button[context-2]")
      ?.addEventListener("click", () =>
        this.#updateContext2Value?.(
          ++this.#providedContext2Value + (this.#consumedContext2Value ?? 0)
        )
      );
  }
}

customElements.define("context-demo", Demo);
