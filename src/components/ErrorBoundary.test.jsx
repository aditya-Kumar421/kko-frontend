import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const BrokenComponent = () => {
  throw new Error("Render failed");
};

describe("ErrorBoundary", () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("shows a recovery screen when a child throws during rendering", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
  });
});
