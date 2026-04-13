# 🎤 Sentinel-RTI — Automated Citizen Advocacy Agent

An AI-powered civic advocacy platform that transforms any citizen into an effective problem-solver by converting complaints into legally structured, evidence-backed submissions.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)

## 📖 Overview

In India, millions of citizens face daily civic issues—potholes, garbage, broken streetlights—but very few take formal action. Filing an RTI or complaint is complex, confusing, and often ignored.

**Sentinel-RTI** is an AI-powered accountability system that turns scattered citizen complaints into **structured, evidence-backed, legally accurate, and persistent actions**. Real change happens when complaints are proven, tracked, and enforced.

### The Problem
- Complex and confusing complaint filing process
- Lack of proper evidence and follow-up
- Citizens don't know the correct department to approach
- Struggle with legal language and formatting

### The Solution
Users can simply type their issue in plain Hindi or English—or upload an image. Our system converts it into a **legally structured, evidence-backed complaint** ready for submission.

## ✨ Features

- **AI Evidence Enhancer**: Detects issues from images, adds timestamp and geo-location, generates severity-based descriptions
- **Smart Complaint Generation**: Converts plain Hindi/English text or images into legally structured complaints
- **RAG Integration**: Retrieves real provisions from RTI Act and government guidelines for legal accuracy
- **Automation Engine**: Routes complaints to correct authorities, tracks deadlines, sends follow-ups
- **Evidence Management**: Uploads and organizes evidence for each complaint
- **Complaint Tracking**: Monitor submission status and authority responses
- **Multi-language Support**: Hindi and English language support
- **Human-in-the-loop Verification**: OTP and CAPTCHA verification for compliance

## 🛠️ Tech Stack

**Frontend:**
- React 18+ with Vite
- CSS3 for styling
- Component-based architecture
- ESLint for code quality

**Backend:**
- Node.js + Express
- MongoDB for data persistence
- RAG (Retrieval-Augmented Generation) for AI-powered legal accuracy

**AI/ML:**
- Image detection for civic issue identification
- Retrieval-Augmented Generation for legal compliance
- Automated complaint generation and optimization

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend services)
- Modern web browser

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ADITYA-CoDE101/Senitinal-RTI.git
cd Senitinal-RTI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Backend Setup (if applicable)

```bash
cd backend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the root directory and add necessary environment variables:

```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Getting Started

### Development Mode

```bash
npm run dev
```

The development server will start at `http://localhost:5173` with hot module reloading enabled.

### Build for Production

```bash
npm run build
```

Generates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

Checks code quality using ESLint configuration.

## 📁 Project Structure

```
.
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Icon.jsx        # Icon component
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── ...
│   ├── pages/              # Page-level components
│   │   ├── Home.jsx        # Landing page
│   │   ├── About.jsx       # About page
│   │   ├── Contact.jsx     # Contact page
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service calls
│   ├── utils/              # Utility functions
│   ├── assets/             # Images, fonts, etc.
│   ├── App.jsx             # Root component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── icons.svg
│   └── ...
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint rules
└── README.md               # This file
```

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Code Style

Follow the ESLint configuration in `eslint.config.js` for consistent code standards. Run `npm run lint` before committing.

### Component Development

- Create reusable components in `src/components/`
- Use functional components with hooks
- Keep components focused and single-responsibility

## 🤝 Contributing

Contributions are welcome! Follow these guidelines:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Before Contributing
- Ensure code passes linting: `npm run lint`
- Write clear commit messages
- Include relevant documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


---

## 🎯 Vision

Sentinel-RTI is not just a complaint tool—it's an **AI-powered accountability system**. We are turning scattered citizen complaints into **structured, evidence-backed, legally accurate, and persistent actions**.

Because real change doesn't happen when complaints are made—
**It happens when they are proven, tracked, and enforced.**
In India, millions of citizens face daily civic issues—potholes, garbage, broken streetlights—but very few take formal action.
Why? Because filing an RTI or complaint is complex, confusing, and often ignored.

People don’t know the correct department, struggle with legal language, and even when they complain, lack of proper evidence and follow-up leads to inaction.

---
