# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

#### Internationalization

I18n is implemented using [Format.JS](https://formatjs.io/) and React-Intl. When possible, use the `<FormattedMessage />` or related component, or the imperative equivalents via the `useIntl()` hook.

##### Message `id`

Message `id`s should use camelCase and generally follow the format of `<feature>.<component>.<part>' or `<feature>.<component>.<subcomponent>.<part>'. Common `part` names include:

- `title` - the text used in the browser tab/window (that is, rendered in a `<title>` tag). In cases beyond that, prefer other terms (`heading`, `tooltip`, etc) to avoid confusion.
- `heading` - text that acts as a heading for other content. Typically rendered in a `<h1>`...`<h6>` element or `<Heading>` component).
- `label` - text that _labels_ another field. Typically the content of a `<label>` element. To avoid confusion do not use this term to refer to button/link content or things that are not a distinct label to another element - in those cases prefer something like `text`, `message`, or qualify the label type (i.e. `ariaLabel`).
- `text` - general purpose text content. Use this for things like button or link content. In some cases a more descriptive term may be a better choice (`message`, `helpText`, `details`)
- `ariaLabel` - the value of an `aria-label` attribute, which isn't typically shown in the UI but is used for accessibility purposes.
- `tooltip` - text shown in a tooltip. This could also be used as an id for text that is applied as a `title` _attribute_, which is displayed natively using tooltips.
- `placeholder` - text used as a placeholder for empty input elements.
- `columnHeading` - text shown in a table column header

Avoid non-standard terms or using these terms in inconsistent ways, as noted, including:

- `header` - Avoid using this to refer to specific heading text (prefer `heading` in those cases). This should instead be used to refer to a complete component or subcomponent.

##### Usage

```tsx
// Using <FormattedMessage>

import { FormattedMessage } from "react-intl";

const MyComponent = () => (
  <div>
    <FormattedMessage
      id="myFeature.MyComponent.message"
      defaultMessage="This is my message!"
    />
  </div>
);
```

```tsx
// Using `useIntl()`

import { useIntl } from "react-intl";

const MyComponent = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      {formatMessage({
        id: "myFeature.MyComponent.message",
        defaultMessage: "his is my message!",
      })}
    </div>
  );
};
```

##### Adding a new message

When adding new messages, be sure to:

1. Run the message extraction script to update the `client-web/translations/en.json` file:

   ```sh
   yarn workspace client-web run i18n:extract
   ```

2. Add all necessary translations to the other language files in `client-web/translations`
3. Run the message compilation script to update the compiled json message files in `packages/client-web/src/features/i18n/messages`:

   ```sh
   yarn workspace client-web run i18n:compile
   ```

##### Adding a new locale

To add a new locale:

1. Create a copy `packages/client-web/translations/en.json` named using the new locale (i.e. `fr.json`, `pt-BR.json`, `zh-Hans-HK.json`, etc.)
2. In the new file, update the messages to use the desired translations.
3. Run `yarn run i18n:compile` from the `client-web` directory (or `yarn workspace client-web run i18n:compile` from the project root)
4. Add the locale code to the `SUPPORTED_LOCALES` array in `packages/client-web/src/features/i18n/constants.ts`.
5. Update all `webpackInclude` magic comments in `packages/client-web/src/features/i18n/polyfills/loadLocalePolyfills.ts` function to include the new locale code.
6. Update all `webpackInclude` magic comments in `packages/client-web/src/features/i18n/messages/index.ts` function to include the new locale code.
