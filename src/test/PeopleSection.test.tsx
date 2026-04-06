import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeopleSection } from "../components/PeopleSection";

const useAppMock = vi.fn();

vi.mock("../context", () => ({
  useApp: () => useAppMock(),
}));

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      peopleList: "People",
      bulkInsert: "Bulk Insert",
      personNamePlaceholder: "Person name",
      tooltipPersonName: "Person name",
      tooltipAddPerson: "Add person",
      add: "Add",
      duplicatePerson: "Duplicate person",
      noPeopleAdded: "No people added",
      searchPeoplePlaceholder: "Search people",
      noSearchResults: "No results",
      tooltipRemovePerson: "Remove person",
    },
    persons: [],
    newPersonName: "",
    setNewPersonName: vi.fn(),
    duplicatePersonError: false,
    setDuplicatePersonError: vi.fn(),
    personSearch: "",
    setPersonSearch: vi.fn(),
    showPersonSuggestions: false,
    setShowPersonSuggestions: vi.fn(),
    setShowBulkInsert: vi.fn(),
    setBulkInsertText: vi.fn(),
    addPerson: vi.fn(),
    removePerson: vi.fn(),
    ...overrides,
  };
}

describe("PeopleSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when there are no people", () => {
    useAppMock.mockReturnValue(createContext());

    render(<PeopleSection />);

    expect(screen.getByText("No people added")).toBeInTheDocument();
  });

  it("calls addPerson when add button is clicked", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<PeopleSection />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(ctx.addPerson).toHaveBeenCalledTimes(1);
  });

  it("opens bulk insert modal and resets text", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<PeopleSection />);
    await userEvent.click(screen.getByRole("button", { name: "Bulk Insert" }));

    expect(ctx.setBulkInsertText).toHaveBeenCalledWith("");
    expect(ctx.setShowBulkInsert).toHaveBeenCalledWith(true);
  });

  it("filters people list based on personSearch", () => {
    useAppMock.mockReturnValue(
      createContext({
        persons: ["Alice", "Bob"],
        personSearch: "ali",
      }),
    );

    render(<PeopleSection />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("calls removePerson for selected row", async () => {
    const ctx = createContext({ persons: ["Alice"] });
    useAppMock.mockReturnValue(ctx);

    render(<PeopleSection />);
    await userEvent.click(screen.getByTitle("Remove person"));

    expect(ctx.removePerson).toHaveBeenCalledWith("Alice");
  });
});
