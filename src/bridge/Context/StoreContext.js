import { createContext, useContext } from "react";

// Argument was null but that failed TypeScript compilation. Change to no arg

const ReactReduxContext = createContext();
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "production") {
  ReactReduxContext.displayName = "ReactRedux";
}

export const useConstellationContext = () => useContext(ReactReduxContext);
export default ReactReduxContext;
