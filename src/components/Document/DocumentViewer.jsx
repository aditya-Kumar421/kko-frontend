import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, useApp } from "../../context/AppContext";

// Translations
const translations = {
  en: {
    totalDocuments: "Total Documents",
    departmentsInvolved: "Departments Involved",
    emailsExtracted: "Emails Extracted",
    recentDocuments: "Recent Documents",
    recentlyUploaded: "Recently Uploaded",
    summary: "Summary",
    extractedText: "Extracted Text",
    departments: "Departments",
    emailData: "Email Data",
    timestamp: "Timestamp",
    chatButton: "Chat with this Document",
    noEmailData: "No email data available",
  },
  ml: {
    totalDocuments: "മൊത്തം ഡോക്യുമെന്റുകൾ",
    departmentsInvolved: "വകുപ്പുകൾ",
    emailsExtracted: "ഇമെയിലുകൾ എടുത്തത്",
    recentDocuments: "സമീപകാല ഡോക്യുമെന്റുകൾ",
    recentlyUploaded: "സമീപകാല അപ്‌ലോഡ്",
    summary: "സംഗ്രഹം",
    extractedText: "എക്സ്ട്രാക്ട് ചെയ്തത്",
    departments: "വകുപ്പുകൾ",
    emailData: "ഇമെയിൽ ഡാറ്റ",
    timestamp: "സമയമുദ്ര",
    chatButton: "ഈ ഡോക്യുമെന്റുമായി ചാറ്റ് ചെയ്യുക",
    noEmailData: "ഇമെയിൽ ഡാറ്റ ലഭ്യമല്ല",
  },
};

// Collapsible Section Component
const CollapsibleSection = ({ title, children, language, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 border border-secondary-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 bg-secondary-800 hover:bg-secondary-700 transition-all"
      >
        <span className="font-semibold text-white">{title}</span>
        {open ? <ChevronUp className="w-5 h-5 text-primary-400" /> : <ChevronDown className="w-5 h-5 text-primary-400" />}
      </button>
      {open && <div className="p-4 bg-secondary-900 text-text-secondary">{children}</div>}
    </div>
  );
};

const DocumentViewer = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // pagination and filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);

  const t = translations[state.language || "en"];

  const filteredDocs = useMemo(() => {
    const s = (search || "").toLowerCase();
    return (documents || []).filter((doc) => {
      const matchesDept = !department
        ? true
        : (doc.departments || []).some((d) => d.name === department);
      if (!matchesDept) return false;
      if (!s) return true;
      const haystacks = [
        doc.filename,
        doc.summary,
        doc.extracted_text,
        ...(doc.departments || []).map((d) => d.name),
      ]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      return haystacks.some((h) => h.includes(s));
    });
  }, [documents, search, department]);

  const totalDocs = filteredDocs.length;
  const totalDepartments = new Set(
    filteredDocs.flatMap((doc) => doc.departments?.map((d) => d.name) || [])
  ).size;
  const totalEmails = filteredDocs.reduce(
    (sum, doc) => sum + (doc.email_data?.length || 0),
    0
  );
  const recentDocs = documents
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // Debounce search input changes
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchText.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchText]);

  // Fetch documents when page/limit changes (filters are client-side)
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
    const res = await apiService.getDocuments(page, limit);
        if (ignore) return;
        const data = res.data || res.documents || [];
        setDocuments(data);
        setTotal(res.total ?? data.length ?? 0);
        setTotalPages(res.total_pages ?? Math.max(1, Math.ceil((res.total ?? data.length ?? 0) / limit)));
        setHasNext(Boolean(res.has_next));
        setHasPrev(Boolean(res.has_prev));
        // Build department options from current payload
        const depts = Array.from(
          new Set(
            data.flatMap((doc) => (doc.departments || []).map((d) => d.name).filter(Boolean))
          )
        ).sort();
        setDepartmentsList(depts);
      } catch (err) {
        console.error("❌ Error fetching documents:", err);
        setError("Failed to fetch documents");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [page, limit]);

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="spinner w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin" /></div>;
  if (error || !documents || documents.length === 0) return <div className="flex items-center justify-center h-screen"><div className="text-error text-xl">{error || "No documents found"}</div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="container mx-auto px-4 py-8">

      {/* Filters & Search */}
      <div className="glass p-4 rounded-xl shadow-metro-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={state.language === 'ml' ? 'തിരയുക (ഫയൽ/ടെക്സ്റ്റ്/സംഗ്രഹം)...' : 'Search (filename/text/summary)'}
            className="w-full px-3 py-2 rounded-lg bg-secondary-800 border border-secondary-700 text-white placeholder-secondary-400 focus:outline-none focus:border-primary-500"
          />
          <select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary-800 border border-secondary-700 text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">{state.language === 'ml' ? 'എല്ലാ വകുപ്പുകളും' : 'All Departments'}</option>
            {departmentsList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary-800 border border-secondary-700 text-white focus:outline-none focus:border-primary-500"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
          <div className="flex items-center justify-between md:justify-end gap-2">
            <button
              onClick={() => { setSearchText(""); setDepartment(""); setPage(1); }}
              className="px-4 py-2 rounded-lg border border-secondary-700 bg-secondary-800 hover:bg-secondary-700 text-white"
            >
              {state.language === 'ml' ? 'ക്ലിയർ' : 'Clear'}
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="text-4xl font-bold text-gradient">{totalDocs}</motion.h2>
          <p className="mt-2 text-text-secondary">{t.totalDocuments}</p>
        </div>
        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-bold text-gradient">{totalDepartments}</motion.h2>
          <p className="mt-2 text-text-secondary">{t.departmentsInvolved}</p>
        </div>
        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="text-4xl font-bold text-gradient">{totalEmails}</motion.h2>
          <p className="mt-2 text-text-secondary">{t.emailsExtracted}</p>
        </div>
        <div className="glass p-6 rounded-xl shadow-metro-lg text-center">
          <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="text-4xl font-bold text-gradient">{recentDocs.length}</motion.h2>
          <p className="mt-2 text-text-secondary">{t.recentDocuments}</p>
        </div>
      </motion.div>

      {/* Recent Docs */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t.recentlyUploaded}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentDocs.map((doc) => (
            <motion.div key={doc._id?.$oid || doc._id} whileHover={{ scale: 1.05 }} className="glass p-4 rounded-lg min-w-[200px] cursor-pointer" onClick={() => { actions.clearMessages();actions.setCurrentDocument(doc); navigate("/chat"); }}>
              <p className="font-medium">{doc.filename}</p>
              <p className="text-sm text-text-secondary">{new Date(doc.timestamp).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

  {/* All Documents */}
  <div className="grid gap-8">
        {filteredDocs.map((doc, index) => (
          <motion.div key={doc._id?.$oid || doc._id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="glass p-8 rounded-xl shadow-metro-lg">
            <h1 className="text-2xl font-bold mb-6 text-gradient">{doc.filename}</h1>

            <CollapsibleSection title={t.summary} language={state.language}>{doc.summary}</CollapsibleSection>
            <CollapsibleSection title={t.extractedText} language={state.language}><pre className="bg-surface p-4 rounded-lg overflow-auto max-h-64 whitespace-pre-wrap">{doc.extracted_text}</pre></CollapsibleSection>
            <CollapsibleSection title={t.departments} language={state.language}>
              <ul className="space-y-2">{doc.departments?.map((dept, i) => (
                <li key={i} className="card-hover p-2 rounded-lg flex justify-between"><span className="font-medium">{dept.name}</span><span className="text-text-secondary">{dept.email || "No email"}</span></li>
              ))}</ul>
            </CollapsibleSection>
            <CollapsibleSection title={t.emailData} language={state.language}>
              {doc.email_data?.length > 0 ? (
                <ul className="space-y-2">{doc.email_data.map((email, i) => (
                  <li key={i} className="card-hover p-2 rounded-lg">
                    <div className="mb-1"><span className="font-medium">Department: </span>{email.department}</div>
                    <div className="mb-1"><span className="font-medium">To: </span>{email.to}</div>
                    <div className="mb-1"><span className="font-medium">Subject: </span>{email.subject}</div>
                    <div><span className="font-medium">Summary: </span><p className="text-text-secondary">{email.summary}</p></div>
                  </li>
                ))}</ul>
              ) : (<p className="text-text-secondary">{t.noEmailData}</p>)}
            </CollapsibleSection>

            <div className="mb-2">
              <h2 className="text-xl font-semibold mb-2">{t.timestamp}</h2>
              <p>{new Date(doc.timestamp).toLocaleString()}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button className="btn-metro" onClick={() => { actions.setCurrentDocument(doc); navigate("/chat"); }}>{t.chatButton}</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-8">
        <div className="text-text-secondary">
          {state.language === 'ml'
            ? `ആകെ: ${total} | പേജ് ${page}/${totalPages}`
            : `Total: ${total} | Page ${page}/${totalPages}`}
        </div>
        <div className="flex gap-2">
          <button
            disabled={!hasPrev || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg border border-secondary-700 bg-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-700 text-white"
          >
            {state.language === 'ml' ? 'മുൻപ്' : 'Previous'}
          </button>
          <button
            disabled={!hasNext || page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed text-white"
          >
            {state.language === 'ml' ? 'അടുത്തത്' : 'Next'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentViewer;
