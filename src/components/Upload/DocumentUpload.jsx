import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Loader2,
  MessageSquare,
  Upload,
  X
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { translations } from "../../locales/translations";

const DocumentUpload = () => {
  const { state, actions } = useApp();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const t = translations[state.language].upload;

  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isValidType = [
          "application/pdf",
          "image/png",
          "image/jpeg",
          "image/jpg"
        ].includes(file.type);
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
        if (!isValidType) {
          toast.error(
            t.invalidFileType
          );
          return false;
        }
        if (!isValidSize) {
          toast.error(
            t.fileSizeExceeded
          );
          return false;
        }
        return true;
      });
      setFiles((prev) => [...prev, ...validFiles]);
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"]
    },
    maxSize: 50 * 1024 * 1024
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error(
        t.selectFiles
      );
      return;
    }
    try {
      const uploadPromises = files.map((file) => actions.uploadDocument(file));
      await Promise.all(uploadPromises);
      toast.success(t.processingComplete);
      setFiles([]);
      navigate("/chat");
    } catch (error) {
      toast.error(
        t.uploadFailed
      );
    }
  };

  const handleViewDocument = (docId) => {
    navigate(`/documents/${docId}`);
  };

  const handleAskQuestions = () => {
    navigate("/chat");
  };

  const handleDownloadReport = () => {
    const report = new Blob(
      [JSON.stringify(state.currentDocument, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(report);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.currentDocument?.filename || "report"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Upload Header */}
      <div className="bg-secondary-800/50 border border-secondary-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-600/20 border border-primary-600/30 rounded-lg">
            <Upload className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t.uploadTitle}</h1>
            <p className="text-secondary-300">{t.uploadDescription}</p>
          </div>
        </div>
      </div>

      {/* Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-secondary-800/50 border border-secondary-700/50 rounded-xl p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragActive
                ? "border-primary-500 bg-primary-600/10"
                : "border-secondary-700/50"
            }`}
          >
            <input {...getInputProps()} />
            <FileText className="w-12 h-12 mx-auto text-secondary-400 mb-4" />
            <p className="text-white font-medium">
              {isDragActive ? t.dropFiles : t.uploadPrompt}
            </p>
            <p className="text-secondary-400 text-sm mt-2">{t.supportedFormats}</p>
            <p className="text-secondary-400 text-sm">{t.maxSize}</p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t.selectedFiles}
              </h3>
              <div className="space-y-4">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-secondary-900/30 p-4 rounded-lg border border-secondary-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-primary-400" />
                      <div>
                        <p className="text-white font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-secondary-400 text-sm">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={state.loading}
                className="mt-6 w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-xl text-white font-medium flex items-center justify-center space-x-2"
              >
                {state.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>
                  {state.loading ? t.processing : t.processDocument}
                </span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Right Side - Document Preview + How it Works */}
        <div className="space-y-6">
          {/* Processed Document Info */}
          {state.currentDocument && (
            <div className="bg-secondary-800/50 border border-secondary-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t.processingComplete}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-secondary-400 font-medium">{t.summary}</h4>
                  <p className="text-white text-sm">
                    {state.currentDocument.summary}
                  </p>
                </div>
                <div>
                  <h4 className="text-secondary-400 font-medium">
                    {t.departments}
                  </h4>
                  <ul className="text-white text-sm list-disc list-inside">
                    {state.currentDocument.departments.map((dept, index) => (
                      <li key={index}>
                        {Object.keys(dept)[0]}: {Object.values(dept)[0]}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleViewDocument(
                        state.currentDocument.mongo_id ||
                          state.currentDocument._id?.$oid ||
                          state.currentDocument._id
                      )
                    }
                    className="px-4 py-2 bg-metro-blue hover:bg-metro-blue/80 rounded-lg text-white font-medium flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{t.view}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAskQuestions}
                    className="px-4 py-2 bg-accent-600 hover:bg-accent-700 rounded-lg text-white font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.askQuestions}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadReport}
                    className="px-4 py-2 bg-metro-green hover:bg-metro-green/80 rounded-lg text-white font-medium flex items-center justify-center space-x-2 col-span-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.downloadReport}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* How it Works */}
          <div className="bg-secondary-800/50 border border-secondary-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t.howItWorks}
            </h3>
            <div className="space-y-4">
              {[
                { icon: Upload, title: t.step1, desc: t.step1Desc, color: "primary" },
                { icon: Loader2, title: t.step2, desc: t.step2Desc, color: "accent" },
                { icon: MessageSquare, title: t.step3, desc: t.step3Desc, color: "metro-green" }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-3"
                >
                  <div
                    className={`p-2 bg-${step.color}-600/20 border border-${step.color}-600/30 rounded-lg`}
                  >
                    <step.icon className={`w-5 h-5 text-${step.color}-400`} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{step.title}</h4>
                    <p className="text-secondary-400 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-900/20 border border-red-700/50 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-300">
                  {t.error}
                </h4>
                <p className="text-red-400 text-sm">{state.error}</p>
              </div>
            </div>
          </motion.div>
        )}
        {state.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-900/20 border border-green-700/50 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-300">
                  {t.success}
                </h4>
                <p className="text-green-400 text-sm">{state.success}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DocumentUpload;
