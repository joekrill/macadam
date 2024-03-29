import "react-app-polyfill/stable";

// "react-app-polyfill" must be the first import! Be sure any auto-sorting
// import functionality (i.e. vscode `source.organizeImports`) does not
// reorder this!

import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./features/analytics";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
