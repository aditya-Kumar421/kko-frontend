import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, useApp } from "../../context/AppContext";

const DocumentViewer = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Derived analytics
  const totalDocs = documents.length;
  const totalDepartments = new Set(
    documents.flatMap((doc) => doc.departments?.map((d) => d.name) || [])
  ).size;
  const totalEmails = documents.reduce(
    (sum, doc) => sum + (doc.email_data?.length || 0),
    0
  );
  const recentDocs = documents
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        let docs = state.documents;

        if (!docs || docs.length === 0) {
          const result = await apiService.getDocuments(1, 100);
          docs = result.data || result.documents || result;
          actions.setDocuments({ data: docs });
        }

        setDocuments(docs);
      } catch (err) {
        console.error("❌ Error fetching documents:", err);
        setError("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [state.documents, actions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !documents || documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-error text-xl">{error || "No documents found"}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-8"
    >
      {/* ✅ Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gradient"
          >
            {totalDocs}
          </motion.h2>
          <p className="mt-2 text-text-secondary">Total Documents</p>
        </div>

        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gradient"
          >
            {totalDepartments}
          </motion.h2>
          <p className="mt-2 text-text-secondary">Departments Involved</p>
        </div>

        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gradient"
          >
            {totalEmails}
          </motion.h2>
          <p className="mt-2 text-text-secondary">Emails Extracted</p>
        </div>

        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-gradient"
          >
            {recentDocs.length}
          </motion.h2>
          <p className="mt-2 text-text-secondary">Recent Documents</p>
        </div>
      </motion.div>

      {/* ✅ Recent Documents quick list */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-4">Recently Uploaded</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentDocs.map((doc) => (
            <motion.div
              key={doc._id?.$oid || doc._id}
              whileHover={{ scale: 1.05 }}
              className="glass p-4 rounded-lg min-w-[200px] cursor-pointer"
              onClick={() => {
                actions.setCurrentDocument(doc);
                navigate("/chat");
              }}
            >
              <p className="font-medium">{doc.filename}</p>
              <p className="text-sm text-text-secondary">
                {new Date(doc.timestamp).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ✅ All Documents */}
      <div className="grid gap-8">
        {documents.map((document, index) => (
          <motion.div
            key={document._id?.$oid || document._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass p-8 rounded-xl shadow-metro-lg"
          >
            <h1 className="text-2xl font-bold mb-6 text-gradient">
              {document.filename}
            </h1>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p className="text-text-secondary whitespace-pre-wrap">
                {document.summary}
              </p>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
              <pre className="bg-surface p-4 rounded-lg overflow-auto max-h-64 whitespace-pre-wrap">
                {document.extracted_text}
              </pre>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Departments</h2>
              <ul className="space-y-2">
                {document.departments?.map((dept, index) => (
                  <li key={index} className="card-hover p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-text-secondary">
                        {dept.email || "No email"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Email Data</h2>
              {document.email_data?.length > 0 ? (
                <ul className="space-y-2">
                  {document.email_data.map((email, index) => (
                    <li key={index} className="card-hover p-2 rounded-lg">
                      <div className="mb-1">
                        <span className="font-medium">Department: </span>
                        {email.department}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">To: </span>
                        {email.to}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Subject: </span>
                        {email.subject}
                      </div>
                      <div>
                        <span className="font-medium">Summary: </span>
                        <p className="text-text-secondary">{email.summary}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-secondary">No email data available</p>
              )}
            </div>

            <div className="mb-2">
              <h2 className="text-xl font-semibold mb-2">Timestamp</h2>
              <p>{new Date(document.timestamp).toLocaleString()}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="btn-metro"
                onClick={() => {
                  actions.setCurrentDocument(document);
                  navigate("/chat");
                }}
              >
                Chat with this Document
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DocumentViewer;
