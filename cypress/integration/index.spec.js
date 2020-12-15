describe("plugin", () => {
  beforeEach(() => {
    cy.visit("/cypress/fixtures/index.html");
  });

  describe("buttons", () => {
    it("should trigger the click action when clicking the working button example", () => {
      cy.get("#working-button").click();
      cy.get("#working-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the enter key on the working button example", () => {
      cy.get("#working-button").focus().type("{enter}");
      cy.get("#working-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the working button example", () => {
      cy.get("#working-button").focus().type(" ");
      cy.get("#working-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the enter key on the modified button example", () => {
      cy.get("#modified-button").focus().type("{enter}");
      cy.get("#modified-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the modified button example", () => {
      cy.get("#modified-button").focus().type(" ");
      cy.get("#modified-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when clicking the broken button example", () => {
      cy.get("#broken-button").click();
      cy.get("#broken-button-output").should("contain", "Clicked!");
    });

    it("should not trigger the click action when using the enter key on the broken button example", (done) => {
      cy.on("fail", (err) => {
        expect(err.message).to.contain("`event.preventDefault()` was called");
        done();
      });

      cy.get("#broken-button").focus().type("{enter}");
      cy.get("#broken-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the enter key on the broken button example with force: true", () => {
      cy.get("#broken-button").focus().type("{enter}", { force: true });
      cy.get("#broken-button-output").should("contain", "Clicked!");
    });

    it("should not trigger the click action when using the space bar key on the broken button example", (done) => {
      cy.on("fail", (err) => {
        expect(err.message).to.contain("`event.preventDefault()` was called");
        done();
      });

      cy.get("#broken-button").focus().type(" ");
      cy.get("#broken-button-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the broken button example with force: true", () => {
      cy.get("#broken-button").focus().type(" ", { force: true });
      cy.get("#broken-button-output").should("contain", "Clicked!");
    });
  });

  describe("anchors", () => {
    it("should trigger the click action when clicking the working anchor example", () => {
      cy.get("#working-anchor").click();
      cy.get("#working-anchor-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the enter key on the working anchor example", () => {
      cy.get("#working-anchor").focus().type("{enter}");
      cy.get("#working-anchor-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the enter key on the modified anchor example", () => {
      cy.get("#modified-anchor").focus().type("{enter}");
      cy.get("#modified-anchor-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when clicking the broken anchor example", () => {
      cy.get("#broken-anchor").click();
      cy.get("#broken-anchor-output").should("contain", "Clicked!");
    });

    it("should not trigger the click action when using the enter key on the broken anchor example", (done) => {
      cy.on("fail", (err) => {
        expect(err.message).to.contain("`event.preventDefault()` was called");
        done();
      });

      cy.get("#broken-anchor").focus().type("{enter}");
      cy.get("#broken-anchor-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the enter key on the broken anchor example with force: true", () => {
      cy.get("#broken-anchor").focus().type("{enter}", { force: true });
      cy.get("#broken-anchor-output").should("contain", "Clicked!");
    });
  });

  describe("checkboxes", () => {
    it("should trigger the click action when clicking the working checkbox example", () => {
      cy.get("#working-checkbox").click().should("be.checked");
      cy.get("#working-checkbox-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the working checkbox example", () => {
      cy.get("#working-checkbox").focus().type(" ").should("be.checked");
      cy.get("#working-checkbox-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the modified checkbox example", () => {
      cy.get("#modified-checkbox").focus().type(" ").should("be.checked");
      cy.get("#modified-checkbox-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the eventually checkbox example", () => {
      cy.get("#eventually-checkbox").focus().type(" ").should("be.checked");
      cy.get("#eventually-checkbox-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when clicking the broken checkbox example", () => {
      cy.get("#broken-checkbox").click().should("be.checked");
      cy.get("#broken-checkbox-output").should("contain", "Clicked!");
    });

    it("should not trigger the click action when using the space bar key on the broken checkbox example", (done) => {
      cy.on("fail", (err) => {
        expect(err.message).to.contain("`event.preventDefault()` was called");
        done();
      });

      cy.get("#broken-checkbox").focus().type(" ").should("be.checked");
      cy.get("#broken-checkbox-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the broken checkbox example with force: true", () => {
      cy.get("#broken-checkbox")
        .focus()
        .type(" ", { force: true })
        .should("be.checked");
      cy.get("#broken-checkbox-output").should("contain", "Clicked!");
    });
  });

  describe("radios", () => {
    it("should trigger the click action when clicking the working radio example", () => {
      cy.get("#working-radio").click().should("be.checked");
      cy.get("#working-radio-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the working radio example", () => {
      cy.get("#working-radio").focus().type(" ").should("be.checked");
      cy.get("#working-radio-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the modified radio example", () => {
      cy.get("#modified-radio").focus().type(" ").should("be.checked");
      cy.get("#modified-radio-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when clicking the broken radio example", () => {
      cy.get("#broken-radio").click().should("be.checked");
      cy.get("#broken-radio-output").should("contain", "Clicked!");
    });

    it("should not trigger the click action when using the space bar key on the broken radio example", (done) => {
      cy.on("fail", (err) => {
        expect(err.message).to.contain("`event.preventDefault()` was called");
        done();
      });

      cy.get("#broken-radio").focus().type(" ").should("be.checked");
      cy.get("#broken-radio-output").should("contain", "Clicked!");
    });

    it("should trigger the click action when using the space bar key on the broken radio example with force: true", () => {
      cy.get("#broken-radio")
        .focus()
        .type(" ", { force: true })
        .should("be.checked");
      cy.get("#broken-radio-output").should("contain", "Clicked!");
    });
  });
});
