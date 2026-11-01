# 🚇 KMRL Knowledge Orchestrator (SoochiRail Dashboard)

A sophisticated **intelligent document processing and knowledge management system** designed specifically for **Kochi Metro ## 📊 Analytics & M## 🌍 Internationalization

### **Supported Languages**
- **English** (default)
- **Malayalam** (മലയാളം)

### **Features**
- Dynamic language switching
- Localized UI text
- Cultural adaptations for Kerala region

## 🔒 Security Features

- **Input Validation**: Comprehensive form validation
- **File Type Restrictions**: Secure document upload
- **Error Boundaries**: Graceful error handling
- **HTTPS**: Secure API communications

## 🚀 Deployment

### **Production Build**
```bash
npm run build
```

### **Build Output**
- Optimized bundle size
- Code splitting
- Asset optimization
- Progressive web app capabilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is **private** and proprietary to **Kochi Metro Rail Limited (KMRL)**. All rights reserved.

## 🏢 About KMRL

**Kochi Metro Rail Limited** is a joint venture company of the Government of India and the Government of Kerala for implementing the Kochi Metro Rail project. This application supports KMRL's digital transformation initiatives to improve operational efficiency and knowledge management.

## 📞 Support

For technical support or queries:
- **Developer**: [prakharAKGa](https://github.com/prakharAKGa)
- **Backend API**: [kko-backend.adityakumar.live](https://kko-backend.adityakumar.live)

---

**Built with ❤️ for Kochi Metro Rail Limited**

*Empowering smart transit through intelligent document management*

### **Tracked Metrics**
- Total documents uploaded
- Questions asked to AI assistant
- Average processing time
- Department-wise usage
- Recent activity logs

### **Visualization Components**
- Area charts for weekly activity
- Pie charts for department usage
- Bar charts for processing time distribution
- Real-time stat cardsLimited (KMRL)** to address information latency and siloed awareness across departments. This React-based frontend provides an intuitive interface for document management, AI-powered chat interactions, and comprehensive analytics.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

## 🌟 Features

### 📊 **Comprehensive Dashboard**
- Real-time analytics and performance metrics
- Department-wise usage tracking
- Weekly activity monitoring
- Processing time distribution analysis
- Multi-language support (English & Malayalam)

### 📄 **Document Management**
- **PDF & Image Upload**: Support for various document formats
- **Intelligent Processing**: Automated text extraction and indexing
- **Document Viewer**: Built-in viewer with search capabilities
- **Metadata Management**: Automatic categorization and tagging

### 🤖 **AI-Powered Chat Interface**
- **Context-Aware Responses**: Chat with uploaded documents
- **Multilingual Support**: Communicate in English or Malayalam
- **Smart Search**: Retrieve specific information from documents
- **Conversation History**: Track and review past interactions

### 📈 **Advanced Analytics**
- **Usage Metrics**: Track document uploads and queries
- **Performance Monitoring**: Processing time analysis
- **Department Insights**: Usage patterns across departments
- **Activity Tracking**: Recent activity monitoring

### 🎨 **Modern UI/UX**
- **Metro-Themed Design**: Custom design inspired by Kochi Metro
- **Responsive Layout**: Optimized for desktop and mobile
- **Dark Mode**: Professional dark theme interface
- **Animated Elements**: Smooth transitions and micro-interactions
- **Background Video**: Dynamic Kochi Metro video background

## 🛠️ Technology Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **Framer Motion** - Advanced animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### **Data Visualization**
- **Recharts** - Responsive chart library
- **Custom Analytics** - Real-time data visualization

### **UI Components**
- **Headless UI** - Unstyled, accessible UI components
- **React Dropzone** - File upload functionality
- **React Hot Toast** - Elegant notifications
- **React Loading Skeleton** - Content loading states

### **Additional Libraries**
- **Axios** - HTTP client for API requests
- **Date-fns** - Modern date utility library
- **React Intersection Observer** - Viewport intersection detection

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/prakharAKGa/kmrl-knowledge-orchestrator.git
   cd kmrl-knowledge-orchestrator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Environment Setup**
Set `REACT_APP_API_BASE_URL` in the root `.env` file to configure the backend API URL. Copy `.env.example` to `.env` and update the value as needed. Restart the development server after changing environment variables.

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Analytics/       # Analytics dashboard
│   ├── Chat/           # AI chat interface
│   ├── Dashboard/      # Main dashboard
│   ├── Document/       # Document viewer
│   ├── Layout/         # Application layout
│   └── Upload/         # Document upload
├── context/            # React context providers
│   └── AppContext.jsx  # Global state management
├── App.jsx            # Main application component
├── index.js           # Application entry point
└── index.css          # Global styles
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue tones (#3b82f6) - Metro blue theme
- **Secondary**: Gray scale (#1e293b) - Professional backgrounds
- **Accent**: Purple tones (#dc55ee) - Interactive elements
- **Metro Colors**: 
  - Blue (#1e40af), Green (#059669)
  - Orange (#ea580c), Red (#dc2626)

### **Typography**
- **Font Family**: Inter, system-ui, sans-serif
- **Custom Font**: 'metro' for branding elements

### **Animations**
- **Framer Motion**: Page transitions and micro-interactions
- **Custom Keyframes**: Specialized animations for metro theme
- **Loading States**: Skeleton loaders and spinners

## 📱 Available Scripts

### **Development**
```bash
npm start          # Start development server (port 3000)
npm run dev        # Start with nodemon file watching
```

### **Production**
```bash
npm run build      # Create production build
npm test           # Run test suite
```

### **Maintenance**
```bash
npm run eject      # Eject from Create React App (irreversible)
```

## 🔧 Configuration

### **Tailwind CSS**
Custom configuration with:
- Extended color palette for metro theme
- Custom animations and keyframes
- Responsive breakpoints
- Dark mode support

### **PostCSS**
Configured with:
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## 🌐 API Integration

### **Backend Services**
- **Document Upload**: `/upload` - Process PDF/image files
- **Chat Interface**: `/chat` - AI-powered document queries
- **Document Management**: `/all` - Retrieve document listings
- **Health Check**: `/health` - Service status monitoring

### **State Management**
- **React Context**: Global state with useReducer
- **Local Storage**: Persistent user preferences
- **Error Handling**: Comprehensive error boundaries

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
