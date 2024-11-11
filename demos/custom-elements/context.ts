import { attachContextRoot, createContext } from "../../src";

export const context1 = createContext<number>("context-1");
export const context2 = createContext<number>("context-2");

attachContextRoot(context1, document.body);
attachContextRoot(context2, document.body);
