/// <reference types="cypress" />

/**
 * @param {JQuery} subject
 */
function createDefaultPreventedError(subject) {
  return (
    "`event.preventDefault()` was called on this element or a parent element and no additional functionality'" +
    " simulated default actions. This prevents keyboard accessibility on <" +
    subject[0].tagName.toLowerCase() +
    "> elements. Read more at https://github.com/cypress-io/cypress/issues/311. Use `{force: true}` to disable this check"
  );
}

/**
 * @param {*} originalFn
 * @param {JQuery} subject
 * @param {string} text
 * @param {Cypress.TypeOptions} [options]
 */
function overrideType(originalFn, subject, text, options) {
  /**@type MouseEvent Keep if a click event was called */
  let clickEvent;

  function clickHandler(event) {
    clickEvent = event;
  }

  /** Additional data about the subject before `cy.type()` is called */
  const additionalData = {
    checked: subject.prop("checked"),
  };

  /**
   * @param {KeyboardEvent} keyDownEvent
   */
  function keyDownHandler(keyDownEvent) {
    // `setTimeout` ensures this `keydown` handler is run after all other `keydown` listeners are run.
    // Cypress actions have 2 internal async loops
    // 1. Ensure no error was thrown - retry if there was an error
    // 2. Ensure upcoming assertions pass enter a retry loop until the assertion does pass
    // We have no way to hook into the retry loop of the original `cy.type`, so we'll do so via the
    // `keydown` event handler. This async handler allows checkboxes that _eventually_ get checked
    // after a click to work (like a React checkbox that shows checked after communicating to a server)
    setTimeout(function () {
      const tagName = subject[0].tagName.toLowerCase();
      options = Cypress._.defaults(options, {
        force: false,
      });

      // buttons or anchors with enter key
      if ((tagName === "button" || tagName === "a") && text === "{enter}") {
        if (!clickEvent) {
          // The click handler wasn't called. This is either because `cy.type()` was called on an
          // unfocused element which always causes a click, or not explicit handling of the enter
          // key is handled by the element
          if (keyDownEvent.defaultPrevented && options.force !== true) {
            // If we got here, a click didn't happen and a keydown event handler called
            // `event.preventDefault()` which prevents the element from being activated by a read
            // user
            throw Error(createDefaultPreventedError(subject));
          } else {
            subject[0].click();
          }
        }
      }
    }, 50); // 50ms is the default wait for all Cypress async processes
  }

  /**
   * @param {KeyboardEvent} keyUpEvent
   */
  function keyUpHandler(keyUpEvent) {
    // `setTimeout` ensures this `keyup` handler is run after all other `keyup` listeners are run.
    // Cypress actions have 2 internal async loops
    // 1. Ensure no error was thrown - retry if there was an error
    // 2. Ensure upcoming assertions pass enter a retry loop until the assertion does pass
    // We have no way to hook into the retry loop of the original `cy.type`, so we'll do so via the
    // `keyup` event handler. This async handler allows checkboxes that _eventually_ get checked
    // after a click to work (like a React checkbox that shows checked after communicating to a server)
    setTimeout(function () {
      const tagName = subject[0].tagName.toLowerCase();
      options = Cypress._.defaults(options, {
        force: false,
      });

      // check space bar key for `input[type=checkbox]` and `input[type=radio]`
      if (
        tagName === "input" &&
        (subject.attr("type") === "checkbox" ||
          subject.attr("type") === "radio") &&
        text === " "
      ) {
        if (subject.prop("checked") === additionalData["checked"]) {
          // The checked state did not flip. There are no key handlers to flip the state explicitly
          if (keyUpEvent.defaultPrevented && options.force !== true) {
            // If we got here, the checked state did not flip and someone called
            // `event.preventDefault()` on our keyup handler which will prevent the space bar key
            // for a real user
            throw Error(createDefaultPreventedError(subject));
          } else {
            subject[0].click();
          }
        }
      }

      // buttons with space bar
      if (tagName === "button" && text === " ") {
        if (!clickEvent) {
          // The click handler wasn't called. This is either because `cy.type()` was called on an
          // unfocused element which always causes a click, or not explicit handling of the enter
          // key is handled by the element
          if (keyUpEvent.defaultPrevented && options.force !== true) {
            // If we got here, a click didn't happen and a keyup event handler called
            // `event.preventDefault()` which prevents the element from being activated by a read
            // user
            throw Error(createDefaultPreventedError(subject));
          } else {
            subject[0].click();
          }
        }
      }

      subject[0].removeEventListener("keyup", keyUpHandler);
      subject[0].removeEventListener("click", clickHandler);
      subject[0].removeEventListener("keydown", keyDownHandler);
    }, 50); // 50ms is the default wait for all Cypress async processes
  }

  subject[0].addEventListener("keydown", keyDownHandler);
  subject[0].addEventListener("keyup", keyUpHandler);
  subject[0].addEventListener("click", clickHandler);

  return originalFn(subject, text, options);
}

Cypress.Commands.overwrite("type", overrideType);
