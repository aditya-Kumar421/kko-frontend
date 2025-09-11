import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Bot,
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  User
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

const translations = {
  en: {
    noDocument: 'No Document Selected',
    noDocumentMessage: 'Please upload a document first to start chatting with the AI assistant.',
    uploadDocument: 'Upload Document',
    aiAssistant: 'AI Assistant',
    askPlaceholder: 'Ask me about the document...',
    startConversation: 'Start a Conversation',
    conversationMessage: 'I m ready to help you understand and analyze your document. Ask me anything!',
    quickQuestionsTitle: 'Quick Questions',
    quickQuestions: [
      'What is the main topic of this document?',
      'What are the key action items mentioned?',
      'Which departments are involved?',
      'Are there any deadlines mentioned?',
      'What are the compliance requirements?',
      'Summarize the safety protocols'
    ],
    sendHint: 'Press Enter to send, Shift+Enter for new line',
  charCount: '{count}/1000',
  selectDocument: 'Select Document',
  noSavedDocs: 'No saved documents',
  changeDocument: 'Change Document'
  ,
  showQuickQuestions: 'Show Quick Questions',
  hideQuickQuestions: 'Hide Quick Questions'
  },
  ml: {
    noDocument: 'ഡോക്യുമെന്റ് തിരഞ്ഞെടുത്തിട്ടില്ല',
    noDocumentMessage: 'എഐ അസിസ്റ്റന്റുമായി ചാറ്റ് ആരംഭിക്കുന്നതിന് ആദ്യം ഒരു ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്യുക.',
    uploadDocument: 'ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്യുക',
    aiAssistant: 'എഐ അസിസ്റ്റന്റ്',
    askPlaceholder: 'ഡോക്യുമെന്റിനെക്കുറിച്ച് എന്നോട് ചോദിക്കൂ...',
    startConversation: 'സംഭാഷണം ആരംഭിക്കുക',
    conversationMessage: 'നിന്റെ ഡോക്യുമെന്റ് മനസ്സിലാക്കാനും വിശകലനം ചെയ്യാനും ഞാൻ തയ്യാറാണ്. എന്തും ചോദിക്കൂ!',
    quickQuestionsTitle: 'പെട്ടെന്നുള്ള ചോദ്യങ്ങൾ',
    quickQuestions: [
      'ഈ ഡോക്യുമെന്റിന്റെ പ്രധാന വിഷയം എന്താണ്?',
      'പ്രധാന പ്രവർത്തന ഇനങ്ങൾ ഏതൊക്കെയാണ്?',
      'ഏതൊക്കെ വകുപ്പുകൾ ഉൾപ്പെട്ടിരിക്കുന്നു?',
      'ഏതെങ്കിലും സമയപരിധികൾ പരാമർശിച്ചിട്ടുണ്ടോ?',
      'നിയന്ത്രണ ആവശ്യകതകൾ എന്താണ്?',
      'സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ സംഗ്രഹിക്കുക'
    ],
    sendHint: 'അയയ്ക്കാൻ എന്റർ അമർത്തുക, പുതിയ വരിക്ക് Shift+Enter',
  charCount: '{count}/1000',
  selectDocument: 'ഡോക്യുമെന്റ് തിരഞ്ഞെടുക്കുക',
  noSavedDocs: 'സംരക്ഷിച്ച ഡോക്യുമെന്റുകൾ ഇല്ല',
  changeDocument: 'ഡോക്യുമെന്റ് മാറ്റുക'
  ,
  showQuickQuestions: 'പെട്ടെന്നുള്ള ചോദ്യങ്ങൾ കാണിക്കുക',
  hideQuickQuestions: 'പെട്ടെന്നുള്ള ചോദ്യങ്ങൾ മറയ്ക്കുക'
  }
};

const MessageBubble = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-primary-600/20 border border-primary-600/30' 
              : 'bg-accent-600/20 border border-accent-600/30'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-primary-400" />
          ) : (
            <Bot className="w-5 h-5 text-accent-400" />
          )}
        </motion.div>
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`relative px-4 py-3 rounded-xl backdrop-blur-sm border ${
              isUser
                ? 'bg-primary-600/10 border-primary-600/30 text-primary-100'
                : message.type === 'error'
                ? 'bg-red-900/20 border-red-700/50 text-red-300'
                : 'bg-secondary-800/50 border-secondary-700/50 text-secondary-100'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            {!isUser && message.type !== 'error' && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 text-secondary-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              >
                {copied ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center mt-1 text-xs text-secondary-500">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ... rest of your ChatInterface code stays unchanged ...


const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex justify-start mb-6"
  >
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 rounded-xl bg-accent-600/20 border border-accent-600/30 flex items-center justify-center">
        <Bot className="w-5 h-5 text-accent-400" />
      </div>
      <div className="bg-secondary-800/50 border border-secondary-700/50 rounded-xl px-4 py-3">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-accent-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const QuickQuestions = ({ onQuestionSelect }) => {
  const { state } = useApp();
  const t = translations[state.language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h3 className="text-sm font-medium text-secondary-400 mb-3">{t.quickQuestionsTitle}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {t.quickQuestions.map((question, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 1 }}
            onClick={() => onQuestionSelect(question)}
            className="text-left p-3 bg-secondary-800/30 hover:bg-secondary-800/50 border border-secondary-700/50 hover:border-primary-600/50 rounded-lg text-sm text-secondary-300 hover:text-white transition-all duration-200"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const ChatInterface = () => {
  const { state, actions } = useApp();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const t = translations[state.language];
  const [showQuickQuestions, setShowQuickQuestions] = useState(() => {
    try {
      const v = localStorage.getItem('showQuickQuestions');
      return v === null ? true : JSON.parse(v);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('showQuickQuestions', JSON.stringify(showQuickQuestions));
    } catch {}
  }, [showQuickQuestions]);

  const availableDocs = useMemo(() => {
    if (state.documents && state.documents.length) return state.documents;
    try {
      const stored = JSON.parse(localStorage.getItem('documents') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }, [state.documents]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  const handleSend = async () => {
    if (!message.trim() || state.loading) return;

    const currentMessage = message;
    setMessage('');
    try {
      await actions.askQuestion(currentMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    if (state.loading) return;
    setMessage(question);
    inputRef.current?.focus();
  };

  const handleChooseFile = () => fileInputRef.current?.click();
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await actions.uploadDocument(file);
      actions.clearMessages();
      setMessage('');
    } catch (err) {
      // error handled via context
    } finally {
      e.target.value = '';
    }
  };

  const handleSelectDocument = (e) => {
    const id = e.target.value;
    const doc = availableDocs.find(d => (d.mongo_id || d._id) === id);
    if (doc) {
      actions.setCurrentDocument(doc);
      actions.clearMessages();
      setMessage('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col max-w-6xl mx-auto"
    >
      <motion.div
        variants={itemVariants}
        className="bg-secondary-800/50 border border-secondary-700/50 rounded-xl p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-600/20 border border-accent-600/30 rounded-lg">
              <Sparkles className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t.aiAssistant}</h1>
              <p className="text-secondary-300">
                {state.currentDocument
                  ? (
                    <>
                      {state.language === 'ml' ? 'നിന്റെ ചോദ്യങ്ങൾ ചോദിക്കൂ: ' : 'Ask questions about: '}
                      <span className="font-medium text-accent-300">{state.currentDocument.filename}</span>
                    </>
                  )
                  : t.noDocument}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-secondary-400">{state.language === 'ml' ? 'എഐ തയ്യാറാണ്' : 'AI Ready'}</span>
            <button
              onClick={() => setShowQuickQuestions((v) => !v)}
              className="ml-3 px-3 py-1 rounded-md border border-secondary-700 text-secondary-300 hover:text-white hover:border-primary-500"
            >
              {showQuickQuestions ? t.hideQuickQuestions : t.showQuickQuestions}
            </button>
          </div>
        </div>

        {/* Document controls */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            {availableDocs.length > 0 ? (
              <select
                onChange={handleSelectDocument}
                value={state.currentDocument?.mongo_id || state.currentDocument?._id || ''}
                className="px-3 py-2 rounded-lg bg-secondary-900 border border-secondary-700 text-sm text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">{t.selectDocument}</option>
                {availableDocs.map((doc) => (
                  <option key={doc.mongo_id || doc._id} value={doc.mongo_id || doc._id}>
                    {doc.filename}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-secondary-400 text-sm">{t.noSavedDocs}</span>
            )}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            <button
              onClick={handleChooseFile}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm"
            >
              {t.uploadDocument}
            </button>
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex-1 bg-secondary-900/30 border border-secondary-700/50 rounded-xl p-6 overflow-hidden flex flex-col"
      >
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {state.chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mb-8"
              >
                <MessageSquare className="w-16 h-16 text-secondary-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">{t.startConversation}</h3>
              <p className="text-secondary-400 mb-6 max-w-md">{t.conversationMessage}</p>
              {!state.currentDocument && (
                <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
                  {availableDocs.length > 0 && (
                    <select
                      onChange={handleSelectDocument}
                      value={''}
                      className="px-3 py-2 rounded-lg bg-secondary-900 border border-secondary-700 text-sm text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="">{t.selectDocument}</option>
                      {availableDocs.map((doc) => (
                        <option key={doc.mongo_id || doc._id} value={doc.mongo_id || doc._id}>
                          {doc.filename}
                        </option>
                      ))}
                    </select>
                  )}
                  <div>
                    <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    <button
                      onClick={handleChooseFile}
                      className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm"
                    >
                      {t.uploadDocument}
                    </button>
                  </div>
                </div>
              )}
              {showQuickQuestions && (
                <QuickQuestions onQuestionSelect={handleQuickQuestion} />
              )}
            </div>
          ) : (
            <>
              {state.chatMessages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg}
                  isUser={msg.type === 'user'}
                />
              ))}
              {state.loading && <TypingIndicator />}
              {/* Keep quick questions visible even after the first message (toggleable) */}
              {showQuickQuestions && (
                <QuickQuestions onQuestionSelect={handleQuickQuestion} />
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div className="border-t border-secondary-700/50 pt-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.askPlaceholder}
                className="w-full px-4 py-3 bg-secondary-800/50 border border-secondary-700/50 rounded-xl text-white placeholder-secondary-400 resize-none focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                rows={3}
                disabled={state.loading}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSend}
              disabled={!message.trim() || state.loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-xl text-white font-medium flex items-center space-x-2 min-h-[48px]"
            >
              {state.loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-secondary-500">
            <span>{t.sendHint}</span>
            <span>{t.charCount.replace('{count}', message.length)}</span>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 bg-red-900/20 border border-red-700/50 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-300">{state.language === 'ml' ? 'പിശക്' : 'Error'}</h4>
                <p className="text-red-400 text-sm">{state.error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatInterface;
