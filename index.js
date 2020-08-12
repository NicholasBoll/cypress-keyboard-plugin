Cypress.Commands.overwrite("type", (originalFn, subject, text, options) => {
  return originalFn(subject, text, options).then((subject) => {
    const tagName = subject[0].tagName.toLowerCase();
    if (text.includes("{enter}") && (tagName === "button" || tagName === "a")) {
      subject.click();
    }

    return subject;
  });
});
