# GeminiChat

A chat interface built for Google's Gemini AI model. This application allows users to have conversations with Gemini's powerful language model through a clean, user-friendly interface.

## Features

- Chat with Google's Gemini 1.5 Pro model
- Conversation history storage
- Markdown and code block support
- Clean, responsive UI

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: In-memory storage (can be upgraded to PostgreSQL)
- **AI Integration**: Google Generative AI SDK

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
4. Run the development server with `npm run dev`

## Project Structure

- `/client` - React frontend
- `/server` - Express.js backend
- `/shared` - Shared TypeScript types and schema definitions

## API Key

To use this application, you need a Google API key with access to the Gemini API. You can obtain one through the [Google AI Studio](https://makersuite.google.com/).

## License

MIT
