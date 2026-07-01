// Agent Terminal Simulator Logic

const AGENT_STEPS = {
    research: [
        {
            type: "thought",
            content: "Thought: I need to query the current financial metrics of TechCorp (TCRP) to check the stock price and volume. I'll execute the `stock_ticker` tool."
        },
        {
            type: "action",
            content: "Action: call_tool(stock_ticker, {symbol: 'TCRP'})"
        },
        {
            type: "observation",
            content: "Observation: { symbol: 'TCRP', company: 'TechCorp', price: 152.40, change: -3.73, changePercent: -2.40, volume: '4.2M', status: 'Active Trading' }"
        },
        {
            type: "thought",
            content: "Thought: The stock price is at $152.40 (down 2.4%). I now need to search for recent news articles mentioning 'TechCorp' or 'TCRP' to explain this downward pressure. I'll use the `web_search` tool."
        },
        {
            type: "action",
            content: "Action: call_tool(web_search, {query: 'TechCorp stock price drop news'})"
        },
        {
            type: "observation",
            content: "Observation: Found 2 highly relevant items:\n  1. [News] 'TechCorp CEO Sarah Jenkins resigns unexpectedly after board dispute' (3 hours ago - TechDaily)\n  2. [Blog] 'Tech sector faces macroeconomic headwind, NASDAQ down 0.8%' (5 hours ago - MarketFeed)"
        },
        {
            type: "thought",
            content: "Thought: The CEO resignation is clearly the primary driver of the stock dip. I should fetch the content of the article from TechDaily to verify details regarding the interim replacement. I will use the `fetch_webpage` tool."
        },
        {
            type: "action",
            content: "Action: call_tool(fetch_webpage, {url: 'https://techdaily.com/techcorp-ceo-resignation'})"
        },
        {
            type: "observation",
            content: "Observation: Content fetched successfully. Extracting key points:\n  - CEO Sarah Jenkins resigned after a disagreement regarding AI GPU infrastructure scaling budgets.\n  - Chief Operating Officer (COO) David Miller has been appointed interim CEO, effective immediately.\n  - The board of directors has formed a search committee to find a permanent replacement."
        },
        {
            type: "thought",
            content: "Thought: I now have the exact financial figures and the context of the CEO resignation. I will compile a concise 3-bullet summary and write it using `report_writer`."
        },
        {
            type: "action",
            content: "Action: call_tool(report_writer, {filename: 'techcorp_summary.md', format: 'markdown'})"
        },
        {
            type: "success",
            content: "SUCCESS: Report successfully written. Final Output summary:\n\n" +
                     "● Stock Status: TechCorp (TCRP) is down 2.4% today, trading at $152.40 on 4.2M volume.\n" +
                     "● CEO Resignation: Longtime CEO Sarah Jenkins resigned unexpectedly following internal board friction over AI/GPU data-center expansion budgets.\n" +
                     "● Transition Plan: COO David Miller is stepped up as interim CEO while a search committee looks for a permanent successor."
        }
    ],
    weather: [
        {
            type: "thought",
            content: "Thought: The user wants weather information for San Francisco for the upcoming weekend. I will use the `weather_api` tool to get the weekend forecast."
        },
        {
            type: "action",
            content: "Action: call_tool(weather_api, {city: 'San Francisco', forecast: 'weekend'})"
        },
        {
            type: "observation",
            content: "Observation: Forecast for SF (Saturday/Sunday):\n  - Sat: Mostly foggy in the morning, clearing by afternoon. High 64°F, Low 53°F. Wind W 15mph.\n  - Sun: Sunny and clear. High 68°F, Low 55°F. Wind W 10mph."
        },
        {
            type: "thought",
            content: "Thought: The weather looks standard for SF—foggy Saturday morning, nice Sunday. Now, I will look up top travel recommendations or popular outdoor weekend events in SF using the `web_search` tool."
        },
        {
            type: "action",
            content: "Action: call_tool(web_search, {query: 'San Francisco weekend outdoor events'})"
        },
        {
            type: "observation",
            content: "Observation: Found event listings:\n  - Golden Gate Park Band concert series (Sunday at 1 PM, free admission)\n  - Ferry Building Farmers Market (Saturday morning, 8 AM - 2 PM)"
        },
        {
            type: "thought",
            content: "Thought: I have the forecast and two highly recommended outdoor weekend activities. I'll synthesize a travel recommendation and write it."
        },
        {
            type: "action",
            content: "Action: call_tool(report_writer, {filename: 'sf_weekend_guide.md'})"
        },
        {
            type: "success",
            content: "SUCCESS: Guide drafted. Final travel recommendation:\n\n" +
                     "● Forecast: Foggy Sat morning (high 64°F), gorgeous sunny Sun afternoon (high 68°F).\n" +
                     "● Saturday Recommendation: Visit the Ferry Building Farmers Market in the morning (dress in layers for the fog), then head to indoor museums.\n" +
                     "● Sunday Recommendation: Take advantage of the sunny clear skies at the free Golden Gate Park Band Concert at 1 PM."
        }
    ],
    seo: [
        {
            type: "thought",
            content: "Thought: I need to analyze the current portfolio website structure for SEO problems, metadata, and link health. I'll start by calling the `web_search` or local auditor tool over index.html."
        },
        {
            type: "action",
            content: "Action: call_tool(site_auditor, {target: 'index.html'})"
        },
        {
            type: "observation",
            content: "Observation: Audited 1 file, found:\n  - Headings: 1x H1, 5x H2, 8x H3 (Correct hierarchy)\n  - Links: 15 external links, 0 broken, 1 redirect\n  - Meta Description: Missing metadata tags in HTML head."
        },
        {
            type: "thought",
            content: "Thought: The auditor shows that the HTML file is missing its SEO meta description tag. I need to write a descriptive tag matching the page content. I will draft options."
        },
        {
            type: "action",
            content: "Action: call_tool(meta_generator, {theme: 'AI Engineering Portfolio'})"
        },
        {
            type: "observation",
            content: "Observation: Generated tag:\n  <meta name=\"description\" content=\"Portfolio of an AI Systems Engineer showcasing interactive RAG pipelines, agentic execution loops, and LLM evaluation harnesses.\">"
        },
        {
            type: "thought",
            content: "Thought: The generated description is accurate and fits modern SEO criteria (length 134 chars). I will execute the modification."
        },
        {
            type: "action",
            content: "Action: call_tool(html_modifier, {file: 'index.html', insert_tag: 'meta_description'})"
        },
        {
            type: "success",
            content: "SUCCESS: Web audit complete. Fix applied.\n\n" +
                     "● Link Health: 100% active. Verified 15 links, zero dead endpoints detected.\n" +
                     "● Meta Tag Inserted: <meta name=\"description\" content=\"Portfolio of an AI Systems Engineer...\">\n" +
                     "● Structured Outline: Checked heading levels. H1 matches semantic best practices."
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const taskSelect = document.getElementById('agent-task-select');
    const speedButtons = document.querySelectorAll('.speed-btn');
    const runAgentBtn = document.getElementById('run-agent-btn');
    const resetAgentBtn = document.getElementById('reset-agent-btn');
    const terminalLogs = document.getElementById('agent-terminal-logs');

    // Status Panel values
    const stateVal = document.getElementById('agent-state-val');
    const stepsVal = document.getElementById('agent-steps-val');
    const toolsVal = document.getElementById('agent-tools-val');

    let executionSpeed = 1000; // ms per step
    let isRunning = false;
    let stepIndex = 0;
    let timer = null;
    let currentTask = 'research';

    // Speed controls
    speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            speedButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            executionSpeed = parseInt(btn.getAttribute('data-speed'), 10);
            
            // Adjust interval dynamic if running
            if (isRunning) {
                clearInterval(timer);
                startLoop();
            }
        });
    });

    // Run Agent
    runAgentBtn.addEventListener('click', () => {
        if (isRunning) return;
        
        isRunning = true;
        currentTask = taskSelect.value;
        stepIndex = 0;
        
        runAgentBtn.disabled = true;
        resetAgentBtn.disabled = true;
        taskSelect.disabled = true;

        stateVal.textContent = "RUNNING";
        stateVal.className = "state-running";
        toolsVal.textContent = "Initializing...";

        // Clear terminal
        terminalLogs.innerHTML = `<div class="terminal-line system-line">[Initialization] Launching autonomous agent loop for task: "${taskSelect.options[taskSelect.selectedIndex].text}"</div>`;

        startLoop();
    });

    // Reset Agent
    resetAgentBtn.addEventListener('click', () => {
        isRunning = false;
        stepIndex = 0;
        clearInterval(timer);
        
        runAgentBtn.disabled = false;
        resetAgentBtn.disabled = true;
        taskSelect.disabled = false;

        stateVal.textContent = "IDLE";
        stateVal.className = "state-idle";
        stepsVal.textContent = "0 / 4";
        toolsVal.textContent = "None";

        terminalLogs.innerHTML = `
            <div class="terminal-line system-line">Waiting for task execution initialization...</div>
            <div class="terminal-line system-line">Available tools: [web_search, fetch_webpage, stock_ticker, weather_api, report_writer]</div>
        `;
    });

    function startLoop() {
        timer = setInterval(executeStep, executionSpeed);
    }

    function executeStep() {
        const steps = AGENT_STEPS[currentTask];
        if (stepIndex >= steps.length) {
            // End of execution
            clearInterval(timer);
            isRunning = false;
            runAgentBtn.disabled = true;
            resetAgentBtn.disabled = false;

            stateVal.textContent = "SUCCESS";
            stateVal.className = "state-success";
            toolsVal.textContent = "Finished";
            return;
        }

        const step = steps[stepIndex];
        const line = document.createElement('div');
        
        // Style based on step type
        if (step.type === 'thought') {
            line.className = 'terminal-line thought-line';
            toolsVal.textContent = "Thinking...";
        } else if (step.type === 'action') {
            line.className = 'terminal-line action-line';
            
            // Extract tool name for status display
            const toolMatch = step.content.match(/call_tool\((\w+),/);
            if (toolMatch && toolMatch[1]) {
                toolsVal.textContent = `Using: ${toolMatch[1]}()`;
            }
        } else if (step.type === 'observation') {
            line.className = 'terminal-line observation-line';
            toolsVal.textContent = "Observing...";
        } else if (step.type === 'success') {
            line.className = 'terminal-line success-line';
        } else {
            line.className = 'terminal-line';
        }

        line.textContent = step.content;
        terminalLogs.appendChild(line);
        terminalLogs.scrollTop = terminalLogs.scrollHeight;

        // Update counts
        stepIndex++;
        // Count logical thoughts/action pairs as a step
        const totalSteps = Math.ceil(steps.length / 3);
        const currentStepCount = Math.min(totalSteps, Math.ceil(stepIndex / 3));
        stepsVal.textContent = `${currentStepCount} / ${totalSteps}`;
    }
});
