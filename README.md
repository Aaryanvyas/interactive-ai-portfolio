# Interactive AI Systems Portfolio

An ultra-premium, interactive portfolio designed to showcase production-grade AI engineering capabilities, with live visual playgrounds that explain critical concepts like **RAG semantic drift**, **autonomous ReAct agent loops**, and **continuous evaluation harnesses**.

This project demonstrates the core principle of AI systems engineering: **moving past simple wrappers to build robust, evaluated, and reliable systems**.

## Features & Visual Playgrounds

### 1. RAG (Retrieval-Augmented Generation) Visualizer
- **Interactive Retrieval Pipeline**: Runs a simulation matching search query embeddings to vector space document chunks.
- **Citations**: Highlights generating source references to demonstrate auditability.
- **Honest Failure Case (Semantic Drift)**: Demonstrates how standard vector search can fetch semantically close but contextually irrelevant information, leading to hallucinations.
- **Advanced Rerank Mode**: Demonstrates how a cross-encoder reranker solves the issue by re-evaluating retrieved chunk relevance.

### 2. Autonomous Task Agent Terminal
- **ReAct Execution Loop**: Prints the detailed `THOUGHT` -> `ACTION` -> `OBSERVATION` loop in real-time.
- **Tool Sandbox**: Simulates the agent utilizing tools like `stock_ticker`, `web_search`, and `fetch_webpage` to solve a task end-to-end.
- **Execution Speed**: Supports running the agent at 1x, 2x, or instant speed.

### 3. CI/CD Evaluation Harness Dashboard
- **LLM Benchmarking**: Compares accuracy (%), latency (ms), and cost (USD per 1M tokens) across multiple models.
- **Interactive Scatter Plot**: Maps the trade-off between Accuracy and Cost dynamically.
- **Assertion Logs**: Demonstrates test assertions (like JSON schema conformity or prompt injection resistance) running against model outputs.

## Project Structure

```text
ai-portfolio/
├── index.html       # Portfolio structure & layout markup
├── styles.css       # Premium slate dark theme & animations
├── app.js           # Core UI controllers & tab managers
├── rag-demo.js      # RAG pipeline simulation & failure case handler
├── agent-demo.js    # Autonomous ReAct agent runner and shell
├── eval-demo.js     # Eval metrics tracker, plots, and logs
└── README.md        # Technical explanation documentation
```

## How to Run

### Method 1: Direct File Open
You can open `index.html` directly in any web browser:
1. Double-click [index.html](./index.html) or right-click and choose **Open in browser**.
2. All simulations run client-side (no server or API keys required).

### Method 2: Local HTTP Server (Recommended)
Running through an HTTP server ensures that assets and icon libraries load correctly across all environments.

If you have Python installed, run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

If you have Node.js / npm installed, run:
```bash
npx http-server -p 8000
```
Then open `http://localhost:8000` in your browser.
