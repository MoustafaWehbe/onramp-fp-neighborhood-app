import {
  VALID_STATUSES,
  isValidTransition,
  getNextStatus,
} from "../../src/services/issues.service";

describe("Status Pipeline — isValidTransition", () => {
  it("allows Reported → Acknowledged", () => {
    expect(isValidTransition("Reported", "Acknowledged")).toBe(true);
  });

  it("allows Acknowledged → In Progress", () => {
    expect(isValidTransition("Acknowledged", "In Progress")).toBe(true);
  });

  it("allows In Progress → Resolved", () => {
    expect(isValidTransition("In Progress", "Resolved")).toBe(true);
  });

  it("rejects skipping steps (Reported → In Progress)", () => {
    expect(isValidTransition("Reported", "In Progress")).toBe(false);
  });

  it("rejects skipping to the end (Reported → Resolved)", () => {
    expect(isValidTransition("Reported", "Resolved")).toBe(false);
  });

  it("rejects going backwards (In Progress → Reported)", () => {
    expect(isValidTransition("In Progress", "Reported")).toBe(false);
  });

  it("rejects an invalid status value", () => {
    expect(isValidTransition("Reported", "InvalidStatus")).toBe(false);
  });

  it("rejects updating a Resolved issue", () => {
    expect(isValidTransition("Resolved", "Reported")).toBe(false);
  });
});

describe("getNextStatus", () => {
  it("returns Acknowledged after Reported", () => {
    expect(getNextStatus("Reported")).toBe("Acknowledged");
  });

  it("returns null after Resolved (end of pipeline)", () => {
    expect(getNextStatus("Resolved")).toBeNull();
  });
});