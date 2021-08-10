// "react-app-polyfill" must be the first import! Be sure any auto-sorting
// import functionality (i.e. vscode `source.organizeImports`) does not
// reorder this!
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import "react-app-polyfill/stable";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { App } from "./app/App";
import { store } from "./app/store";
import "./features/analytics";
import { ErrorBoundary } from "./features/errors/components/ErrorBoundary";
import { UnexpectedErrorPage } from "./features/errors/components/UnexpectedErrorPage/UnexpectedErrorPage";
import { BrowserRouter } from "./features/history/BrowserRouter";
import { theme } from "./features/theme";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallback={UnexpectedErrorPage}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
          <ReduxProvider store={store}>
            <App />
          </ReduxProvider>
        </BrowserRouter>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
