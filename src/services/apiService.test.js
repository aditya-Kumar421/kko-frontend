import { apiService } from "./apiService";

describe("apiService.getDocumentById", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("searches subsequent result pages for the requested document", async () => {
    jest
      .spyOn(apiService, "getDocuments")
      .mockResolvedValueOnce({
        data: [{ _id: "other-document" }],
        has_next: true,
      })
      .mockResolvedValueOnce({
        data: [{ _id: { $oid: "requested-document" } }],
        has_next: false,
      });

    await expect(
      apiService.getDocumentById("requested-document")
    ).resolves.toEqual({ _id: { $oid: "requested-document" } });
    expect(apiService.getDocuments).toHaveBeenCalledTimes(2);
    expect(apiService.getDocuments).toHaveBeenLastCalledWith(2, 50);
  });

  it("returns null when the document is not present", async () => {
    jest.spyOn(apiService, "getDocuments").mockResolvedValue({
      data: [],
      has_next: false,
    });

    await expect(apiService.getDocumentById("missing")).resolves.toBeNull();
  });
});
