# Customization

In order to use this Macadam for a real project, fork it and make the following changes to customize it to your application:

- ☐ Replace all occurances of `macadam` with a more appropriate project identifier.
- ☐ Replace all occurances of "Macadam" with a the project name.
- ☐ Replace all occurances of `example.com` with the domain to be used.
- ☐ Update `/package.json`:
  - ☐ `name`
  - ☐ `repository`
  - ☐ `author`
  - ☐ `license`
- ☐ `/packages/client-web`:
  - ☐ Update `.env` values
  - ☐ Customize `src/app/Logo.svg`
  - ☐ Run `yarn run favicons` to generate icons/manifests from `src/app/Logo.svg`
  - ☐ Customize `PrivacyPolicy.tsx`, `TermsAndConditions.tsx`:
    - https://www.termsfeed.com/
    - https://termly.io/
    - https://www.iubenda.com
    - https://getterms.io/
  - Update/add social media links: `src/features/common/components/Footer/SocialMediaLinks.tsx`
- `/services/kratos/templates`
  - Replace all occurances of "Macadam"
  - Replace all occurances of "help@example.com"
  - Replace all occurances of "http://example.com" with the website address
