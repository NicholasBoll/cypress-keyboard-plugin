## Cypress Keyboard plugin

This plugin adds keyboard support for various elements by overloading `cy.type`. This allows some default actions to happen for buttons, anchors, checkboxes, and radio boxes.

### Why?

Cypress uses [synthetic events](https://github.com/cypress-io/cypress/issues/311) which are not [trusted events](https://www.w3.org/TR/uievents/#trusted-events).

The important blurb from the article:

> Most untrusted events will not trigger default actions, with the exception of the `click` event. This event always triggers the default action, even if the `isTrusted` attribute is false (this behavior is retained for backward-compatibility). All other untrusted events behave as if the `preventDefault()` method had been called on that event.

Cypress currently has a trick for unfocused elements that `type` is called on. If the element doesn't have focus, a `click` event is sent before typing:

```js
cy.get("button").type("{enter}"); // works
cy.get("button").focus().type("{enter}"); // doesn't work
```

This is due to the following code in the [`cy.type` action](https://github.com/cypress-io/cypress/blob/49db3a685d77655dde17fa39e2211dcacd7d0323/packages/driver/src/cy/commands/actions/type.js#L396-L417).

We could call `.click()` on an element and assume that the default action works, but the `enter` and `space bar` keys do _not_ work if `event.preventDefault()` is called on a `keydown` event on the element or any parent of the element. This means that Cypress cannot catch errors for keyboard events properly.

This plugin attempts to more accurately simulate clicks based on element type, keyboard key pressed, and condition of prevented default actions.

### Note

In order for this plugin to work properly, the element must be focused. If the element is not focused, Cypress will click on it regardless of what gets typed.

For example:

```js
cy.get("button").type("foobar"); // this will click the button and then type 'foobar'
```

Making sure the element has focus first will ensure a click happens only under more realistic situations.

### Installation

```
npm install cypress-keyboard-plugin
```

Add the following to your `commands.js` or `commands.ts` file:

```js
import "cypress-keyboard-plugin";
```

The plugin works by overriding the `type` command and triggering a `click` event manually if the tag is a button or an anchor element.
