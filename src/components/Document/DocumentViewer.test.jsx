import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { apiService } from "../../services/apiService";
import DocumentViewer from "./DocumentViewer";

jest.mock("../../context/AppContext", () => ({
  useApp: jest.fn(),
}));

jest.mock("../../services/apiService", () => ({
  apiService: {
    getDocumentById: jest.fn(),
    getDocuments: jest.fn(),
  },
}));

describe("DocumentViewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useApp.mockReturnValue({
      state: { language: "en" },
      actions: { setCurrentDocument: jest.fn() },
    });
    apiService.getDocumentById.mockResolvedValue({
      _id: "specific-document",
      filename: "Specific document",
      summary: "Document summary",
      extracted_text: "Document text",
      departments: [],
      email_data: [],
      timestamp: "2024-01-01T00:00:00.000Z",
    });
  });

  it("loads and displays the document named by the route parameter", async () => {
    render(
      <MemoryRouter initialEntries={["/documents/specific-document"]}>
        <Routes>
          <Route path="/documents/:id" element={<DocumentViewer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: "Specific document" })
    ).toBeInTheDocument();
    expect(apiService.getDocumentById).toHaveBeenCalledWith(
      "specific-document"
    );
    expect(apiService.getDocuments).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText("Search (filename/text/summary)")).not.toBeInTheDocument();
  });
});
