# OmegaCode CLI

<p align="center">
  <img src="https://img.shields.io/badge/AI-Coding%20Assistant-blue?style=for-the-badge" alt="AI Coding Assistant">
  <img src="https://img.shields.io/badge/TypeScript-Node.js-green?style=for-the-badge&logo=node.js" alt="TypeScript Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License">
</p>

**OmegaCode CLI** is an uncensored AI-powered coding assistant that serves as a Claude Code alternative. It connects to the Omega AI API to provide intelligent code generation, file editing, and project assistance with no restrictions.

## 🎥 Video Tutorial

Watch the full setup and usage guide on YouTube:

**[![OmegaCode CLI Tutorial](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)**

*(Replace the video link above with your actual tutorial link)*

## ✨ Features

- 🤖 **Uncensored AI** - No restrictions on code generation
- 📝 **File Operations** - Create, edit, and manage files automatically
- 🏗️ **Project Context** - Understands your entire codebase
- 🔧 **Agent Mode** - Can execute commands and modify code
- 🌐 **API Integration** - Connects to Omega AI API
- 💻 **Interactive CLI** - Chat interface for coding tasks
- ⚡ **Fast Responses** - Optimized for quick code generation

## 📦 Installation

### From npm (Recommended)
```bash
npm install -g omegacode
```

### From Source
```bash
git clone https://github.com/YOUR_USERNAME/omegacode-cli.git
cd omegacode-cli
npm install
npm run build
npm link
```

## 🚀 Quick Start

### 1. Get API Key

Visit [https://omegai.me/cli](https://omegai.me/cli) to get your free API key.

### 2. Configure

On first run, the CLI will ask for your API key:
```bash
omegacode
```

### 3. Start Coding

Navigate to your project and run:
```bash
cd /path/to/your/project
omegacode
```

## 📖 Usage

### Interactive Mode
```bash
omegacode                    # Start in current directory
omegacode /path/to/project   # Start in specific project
```

### Available Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/exit` | Quit the CLI |
| `/reset` | Clear conversation history |
| `/context` | Reload project context |

### Example Prompts

```
Create a React component with TypeScript for a login form
```

```
Fix the bug in src/utils/api.ts - it's throwing a 404 error
```

```
Generate a Python script to download images from a URL
```

```
Refactor this code to use async/await instead of callbacks
```

## ⚙️ Configuration

Configuration is stored at `~/.omegacode/config.json`:

```json
{
  "apiKey": "your-api-key",
  "apiBase": "https://omegai.me/api/v1",
  "model": "omega-code",
  "maxTokens": 4096,
  "temperature": 0.7
}
```

## 🛠️ Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Project Structure
```
.
├── dist/           # Compiled JavaScript
├── src/            # TypeScript source files
├── package.json    # Dependencies
└── README.md       # Documentation
```

## 🔑 API Reference

The CLI uses the Omega AI API:

**Base URL:** `https://omegai.me/api/v1`

**Endpoints:**
- `POST /chat/completions` - Send chat messages
- `GET /models` - List available models

## ⚠️ Disclaimer

This tool generates code without content restrictions. Users are responsible for:
- Reviewing all generated code before use
- Ensuring compliance with local laws and regulations
- Using the tool ethically and legally

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Support

- Website: [https://omegai.me](https://omegai.me)
- Telegram: [@omegaidark](https://t.me/omegaidark)
- Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/omegacode-cli/issues)

---

<p align="center">
  Made with 🔥 by Omega AI Team
</p>
