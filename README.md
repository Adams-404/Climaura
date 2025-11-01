# 🌍 GaiaPrompt

An interactive climate education platform that provides AI-powered insights about climate change impacts across different continents. The application features a 3D globe interface where users can explore climate data and learn about environmental changes.

## ✨ Features

- **Interactive 3D Globe**: Visual representation of climate data across continents
- **AI-Powered Insights**: Get detailed information about climate change impacts using Google's Gemini AI
- **Educational Content**: Learn about climate change through interactive quizzes and facts
- **Real-time Data**: Up-to-date climate statistics and information
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google AI API Key (Get one from [Google AI Studio](https://ai.google.dev/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Adams-404/GaiaPrompt.git
   cd GaiaPrompt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Google AI API key:
   ```env
   GOOGLE_AI_API_KEY=your-api-key-here
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Three.js
- **Backend**: Node.js, Express
- **AI**: Google Gemini
- **Database**: PostgreSQL with Neon
- **Styling**: TailwindCSS with Radix UI components
- **Build Tools**: Vite, TypeScript, ESBuild

## 📂 Project Structure

```
├── client/           # Frontend React application
├── server/           # Backend server code
├── shared/           # Shared TypeScript types and schemas
├── .env              # Environment variables
├── package.json      # Project dependencies and scripts
└── README.md         # This file
```

## 🌟 Features in Detail

### 3D Globe Visualization
- Interactive 3D globe with country/continent highlighting
- Real-time climate data visualization
- Smooth animations and transitions

### AI-Powered Climate Education
- Natural language processing for climate-related queries
- Continent-specific climate information
- Interactive quizzes to test knowledge

### Responsive UI/UX
- Mobile-first design
- Dark/light mode support
- Accessible components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the powerful AI capabilities
- [Three.js](https://threejs.org/) for 3D globe visualization
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS

---

Made with ❤️ by [Your Name] | [GitHub](https://github.com/Adams-404)
