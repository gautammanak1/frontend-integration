# UAgent Chat Application

A modern Next.js chat application that interfaces with UAgent AI, styled similar to ChatGPT.

## Features

- 🎨 Modern, responsive UI with dark mode support
- 💬 Real-time chat interface
- 🤖 Integration with UAgent AI
- ⚡ Built with Next.js 14 and TypeScript
- 🎯 Tailwind CSS for styling

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

## UAgent Configuration

The application is configured to query the UAgent with address:
```
agent1q2g97humd4d6mgmcg783s2dsncu8hn37r3sgglu6eqa6es07wk3xqlmmy4v
```

To change the agent address, modify the `UAGENT_ADDRESS` constant in `app/api/chat/route.ts`.

## Project Structure

```
uagent-chat-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # API endpoint for UAgent queries
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main chat interface
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **uagent-client**: UAgent SDK for querying agents

## Usage

1. Type your message in the input field at the bottom
2. Press Enter or click the send button
3. The UAgent will process your query and respond
4. Continue the conversation naturally

## License

MIT

