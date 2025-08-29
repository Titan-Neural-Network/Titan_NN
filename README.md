# Titan Neural Network - Document Intelligence Platform

This is a Next.js application that uses AI to analyze documents and extract key information.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

## Running Locally in Visual Studio Code

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

First, clone the project repository to your local machine.

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### 2. Install Dependencies

Open the project in Visual Studio Code and install the necessary npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

The application requires an API key for the Google AI (Gemini) service to function.

1.  Create a new file named `.env` in the root of your project.
2.  Add your Gemini API key to this file:

    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

    You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the Development Servers

This project requires two separate processes to be running simultaneously:
- The Next.js frontend application.
- The Genkit AI backend.

The recommended way to manage this in VS Code is by using the built-in terminal and splitting it.

1.  **Open the Terminal:** Open a new terminal in VS Code (`View` > `Terminal` or `Ctrl+\` `).

2.  **Start the AI Backend (Genkit):** In the terminal, run the following command to start the Genkit server. It will watch for changes in your AI flows.

    ```bash
    npm run genkit:watch
    ```

3.  **Split the Terminal:** Click the "Split Terminal" icon (it looks like a split rectangle) in the terminal's title bar. This will open a second terminal pane next to the first one.

4.  **Start the Frontend (Next.js):** In the new terminal pane, run the following command to start the Next.js development server.

    ```bash
    npm run dev
    ```

### 5. Access the Application

Once both servers are running, you can access the application in your web browser at:

[http://localhost:9002](http://localhost:9002)

You are now all set up for local development! Changes you make to the frontend code will be hot-reloaded by the Next.js server, and changes to your AI flows will be automatically picked up by the Genkit server.
