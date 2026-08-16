import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  company,
  contacts,
  omittedClaims,
  supplierFacts,
  team,
  isPubliclyRenderable,
} from "../content/site";
import {
  absoluteLocalizedUrl,
  localePath,
  localizedPath,
} from "../lib/locale-url";

describe("content/site facts policy", () => {
  it("exposes verified company identifiers", () => {
    assert.equal(company.legalName, "A2M Tech AB");
    assert.equal(company.orgNumber, "559506-4915");
    assert.equal(company.registeredOffice, "Helsingborg");
  });

  it("marks company email as TODO_VERIFY and not publicly renderable", () => {
    assert.equal(contacts.companyEmail.status, "TODO_VERIFY");
    assert.equal(isPubliclyRenderable(contacts.companyEmail.status), false);
  });

  it("does not publish team emails", () => {
    for (const person of team) {
      assert.equal(person.publishEmail, false);
      assert.equal(person.email.status, "TODO_VERIFY");
    }
  });

  it("keeps certificates and frameworks omitted", () => {
    assert.equal(supplierFacts.certificates.status, "omitted");
    assert.equal(supplierFacts.frameworkAgreements.status, "omitted");
    assert.ok(omittedClaims.length > 0);
  });
});

describe("locale URL helpers", () => {
  it("always prefixes locale homes", () => {
    assert.equal(localePath("sv"), "/sv/");
    assert.equal(localePath("en"), "/en/");
  });

  it("maps Swedish localized pathnames", () => {
    assert.equal(localizedPath("sv", "/services"), "/sv/tjanster/");
    assert.equal(localizedPath("sv", "/about"), "/sv/om-oss/");
    assert.equal(localizedPath("sv", "/quality-security"), "/sv/kvalitet-sakerhet/");
    assert.equal(localizedPath("sv", "/partnership"), "/sv/partnerskap/");
    assert.equal(localizedPath("sv", "/insights"), "/sv/insikter/");
    assert.equal(localizedPath("en", "/services"), "/en/services/");
  });

  it("builds absolute localized URLs", () => {
    assert.equal(
      absoluteLocalizedUrl("sv", "/contact"),
      "https://a2m-tech.com/sv/kontakt/"
    );
  });
});
