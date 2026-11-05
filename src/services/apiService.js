const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getDocumentId = (document) => {
  const id = document.mongo_id || document._id;
  return String(id?.$oid || id || "");
};

export const apiService = {
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    return response.json();
  },

  async chatWithDocument(mongoId, question) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mongo_id: mongoId, question }),
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.statusText}`);
    }
    return response.json();
  },

  async getDocuments(page = 1, limit = 10, options = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (options.search) params.set("search", options.search);
    if (options.department) params.set("department", options.department);

    const response = await fetch(`${API_BASE_URL}/all?${params.toString()}`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Fetch documents failed: ${response.statusText}`);
    }
    return response.json();
  },

  async getDocumentById(id) {
    let page = 1;

    while (true) {
      const result = await this.getDocuments(page, 50);
      const documents = result.data || result.documents || [];
      const document = documents.find((item) => getDocumentId(item) === id);
      if (document) return document;

      const totalPages = Number(result.total_pages);
      const hasMorePages = Number.isFinite(totalPages)
        ? page < totalPages
        : Boolean(result.has_next);
      if (!hasMorePages || documents.length === 0) return null;
      page += 1;
    }
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.text();
  },
};
