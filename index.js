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
  /**@type KeyboardEvent Keep track of the keydown event that was called by cy.type */
  let keyDownEvent;
  /**@type MouseEvent Keep if a click event was called */
  let clickEvent;

  function keyDownHandler(event) {
    keyDownEvent = event;
  }
  function clickHandler(event) {
    clickEvent = event;
  }

  subject[0].addEventListener("keydown", keyDownHandler);
  subject[0].addEventListener("click", clickHandler);

  /** Additional data about the subject before `cy.type()` is called */
  const additionalData = {
    checked: subject.prop("checked"),
  };

  return originalFn(subject, text, options)
    .then((subject) => {
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
          if (keyDownEvent.defaultPrevented && options.force !== true) {
            // If we got here, the checked state did not flip and someone called
            // `event.preventDefault()` on our keydown handler which will prevent the space bar key
            // for a real user
            throw Error(createDefaultPreventedError(subject));
          } else {
            subject[0].click();
          }
        }
      }

      // buttons with enter or space bar key
      // anchors with enter key
      if (
        (tagName === "button" && (text === "{enter}" || text === " ")) ||
        (tagName === "a" && text === "{enter}")
      ) {
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

      return subject;
    })
    .finally(() => {
      subject[0].removeEventListener("keydown", keyDownHandler);
      subject[0].removeEventListener("click", clickHandler);
    });
}

Cypress.Commands.overwrite("type", overrideType);
