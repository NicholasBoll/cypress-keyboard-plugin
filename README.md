## Cypress Enter plugin

This plugin adds support for the `cy.type('{enter}')` to trigger the `click` event on button and anchor elements.

### Why?

Many accessibility specifications call out that the `enter` key should open or activate something. If a `button` element is used, the browser will trigger a click event automatically, but Cypress doesn't seem to do this. This is probably because dispatching keyboard events does not trigger this functionality. It would be nice to write a test like the following:

```js
cy.get(".some-selector").focus().type("{enter}");
```

But that doesn't work by default. Knowing how browsers work, we'd have to rewrite the tests like:

```js
cy.get(".some-selector").click(); // Cypress doesn't support forwarding the enter key as a click
```

You and I know that the enter key will trigger a `click` event on a `button` or `a` element, but what if we didn't use one of those elements for whatever reason? Wouldn't it be nice to write that test and ensure the functionality works regardless of the implementation?

### Installation

```
npm install cypress-enter-plugin
```

Add the following to your `commands.js` or `commands.ts` file:

```js
import "cypress-enter-plugin";
```

The plugin works by overriding the `type` command and triggering a `click` event manually if the tag is a button or an anchor element.
