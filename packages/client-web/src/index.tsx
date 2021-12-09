// "react-app-polyfill" must be the first import! Be sure any auto-sorting
// import functionality (i.e. vscode `source.organizeImports`) does not
// reorder this!
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app/App";
import "./features/analytics";
import { ErrorBoundary } from "./features/errors/components/ErrorBoundary";
import { UnexpectedErrorPage } from "./features/errors/components/UnexpectedErrorPage/UnexpectedErrorPage";
import { BrowserRouter } from "./features/routing/components/BrowserRouter";
import { history } from "./features/routing/history";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallback={UnexpectedErrorPage}>
      <BrowserRouter history={history}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
