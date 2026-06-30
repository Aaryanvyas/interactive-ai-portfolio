// RAG Interactive Visualizer Logic

const RAG_DATA = {
    travel: {
        standard: {
            chunks: [
                { id: 1, text: "Standard travel expenses include flight fares, train fares, and taxi fares incurred during business-related travel. All receipts must be submitted within 30 days.", score: 0.89, active: true },
                { id: 3, text: "All company employees are eligible for taxi reimbursements when working late past 9:00 PM at the headquarters office.", score: 0.71, active: true },
                { id: 2, text: "Personal trips taken in conjunction with business travel are permitted. However, any expenses incurred during personal days are not eligible for reimbursement.", score: 0.64, active: false }
            ],
            response: "Yes, you can claim reimbursement for taxi fares. Standard travel expenses include taxi fares, flight fares, and train fares. You must submit all receipts within 30 days.",
            citations: [
                { id: 1, source: "Corporate Travel Policy Page 2" },
                { id: 3, source: "HQ Commute Guidelines" }
            ],
            hasFailure: true,
            failureText: "Semantic search retrieved standard business-related taxi guidelines as the top match due to word overlapping ('taxi', 'fares', 'travel'). It failed to rank the personal exclusion clause (Chunk 2) high enough, resulting in the LLM falsely asserting that personal taxi fares are reimbursable."
        },
        advanced: {
            chunks: [
                { id: 2, text: "Personal trips taken in conjunction with business travel are permitted. However, any expenses incurred during personal days are not eligible for reimbursement.", score: 0.95, active: true },
                { id: 1, text: "Standard travel expenses include flight fares, train fares, and taxi fares incurred during business-related travel. All receipts must be submitted within 30 days.", score: 0.84, active: true },
                { id: 3, text: "All company employees are eligible for taxi reimbursements when working late past 9:00 PM at the headquarters office.", score: 0.42, active: false }
            ],
            response: "No, you cannot claim reimbursement for taxi fares incurred during personal weekend trips. According to the corporate travel guidelines, while personal trips combined with business travel are allowed, any expenses incurred during personal days are strictly not eligible for reimbursement.",
            citations: [
                { id: 2, source: "Corporate Travel Policy Page 4 (Addendum)" },
                { id: 1, source: "Corporate Travel Policy Page 2" }
            ],
            hasFailure: false
        }
    },
    equipment: {
        standard: {
            chunks: [
                { id: 4, text: "Employees are allocated a one-time budget of up to $500 for home office equipment, including monitors, chairs, and desks.", score: 0.92, active: true },
                { id: 5, text: "Office supply expense limits are capped at $50 per month for items like notebooks, pens, and stationary.", score: 0.78, active: true }
            ],
            response: "The company provides a one-time budget of up to $500 for home office equipment, which covers monitors, chairs, and desks. For ongoing small office supplies, there is a monthly cap of $50.",
            citations: [
                { id: 4, source: "Remote Work Setup Policy" },
                { id: 5, source: "Office Supplies Procurement Guide" }
            ],
            hasFailure: false
        },
        advanced: {
            chunks: [
                { id: 4, text: "Employees are allocated a one-time budget of up to $500 for home office equipment, including monitors, chairs, and desks.", score: 0.96, active: true },
                { id: 5, text: "Office supply expense limits are capped at $50 per month for items like notebooks, pens, and stationary.", score: 0.72, active: true }
            ],
            response: "The company provides a one-time budget of up to $500 for home office equipment (such as monitors, chairs, and desks). Additionally, ongoing small office supplies are covered up to $50 per month.",
            citations: [
                { id: 4, source: "Remote Work Setup Policy" },
                { id: 5, source: "Office Supplies Procurement Guide" }
            ],
            hasFailure: false
        }
    },
    security: {
        standard: {
            chunks: [
                { id: 6, text: "[DEPRECATED] Employees can connect to any public wireless network in cafes, libraries, hotels, or airports. Ensure browser and OS are updated.", score: 0.88, active: true },
                { id: 7, text: "[UPDATED POLICY] Working on public Wi-Fi networks is strictly prohibited unless connected through the corporate VPN client with Multi-Factor Authentication (MFA) enabled.", score: 0.74, active: false }
            ],
            response: "You are allowed to connect to public wireless networks in cafes, hotels, libraries, or airports, provided you keep your web browser and operating system updated.",
            citations: [
                { id: 6, source: "IT Handout v2 (2022)" }
            ],
            hasFailure: true,
            failureText: "Standard embedding similarity matched the wordy deprecated policy chunk because of keyword match. It failed to prioritize the updated policy (Chunk 7). This is a critical security vulnerability because the LLM instructs the employee to break security protocols."
        },
        advanced: {
            chunks: [
                { id: 7, text: "[UPDATED POLICY] Working on public Wi-Fi networks is strictly prohibited unless connected through the corporate VPN client with Multi-Factor Authentication (MFA) enabled.", score: 0.97, active: true },
                { id: 6, text: "[DEPRECATED] Employees can connect to any public wireless network in cafes, libraries, hotels, or airports. Ensure browser and OS are updated.", score: 0.35, active: false }
            ],
            response: "No, you cannot work directly from a public Wi-Fi network. According to the updated security policy, working on public Wi-Fi networks is strictly prohibited unless you connect through the corporate VPN client with Multi-Factor Authentication (MFA) enabled.",
            citations: [
                { id: 7, source: "IT Security Code of Conduct (2026)" }
            ],
            hasFailure: false
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const querySelect = document.getElementById('rag-query-select');
    const standardBtn = document.getElementById('rag-mode-standard');
    const advancedBtn = document.getElementById('rag-mode-advanced');
    const runBtn = document.getElementById('run-rag-btn');
    const modeDesc = document.getElementById('rag-mode-desc');

    const chunksList = document.getElementById('retrieved-chunks-list');
    const llmResponse = document.getElementById('rag-llm-response');
    const citationsContainer = document.getElementById('rag-citations-container');
    const citationsList = document.getElementById('rag-citations-list');
    const failureCase = document.getElementById('rag-failure-case');
    const failureText = document.getElementById('rag-failure-text');

    let currentMode = 'standard'; // or 'advanced'

    // Mode Toggle Logic
    standardBtn.addEventListener('click', () => {
        currentMode = 'standard';
        standardBtn.classList.add('active');
        advancedBtn.classList.remove('active');
        modeDesc.textContent = "Standard retrieves purely by embedding similarity.";
    });

    advancedBtn.addEventListener('click', () => {
        currentMode = 'advanced';
        advancedBtn.classList.add('active');
        standardBtn.classList.remove('active');
        modeDesc.textContent = "Advanced applies a cross-encoder reranker to the top retrieved chunks.";
    });

    // Run Pipeline Simulation
    runBtn.addEventListener('click', () => {
        const selectedQuery = querySelect.value;
        const data = RAG_DATA[selectedQuery][currentMode];

        runBtn.disabled = true;
        runBtn.innerHTML = `<span>Retrieving vectors...</span> <i data-lucide="refresh-cw" class="btn-icon spinning"></i>`;
        if (window.lucide) window.lucide.createIcons();

        // Simulate network/latency delay
        setTimeout(() => {
            renderRagResults(data);
            runBtn.disabled = false;
            runBtn.innerHTML = `<span>Run Retrieval Pipeline</span> <i data-lucide="refresh-cw" class="btn-icon"></i>`;
            if (window.lucide) window.lucide.createIcons();
        }, 800);
    });

    function renderRagResults(data) {
        // 1. Render Chunks
        chunksList.innerHTML = '';
        data.chunks.forEach(chunk => {
            const chunkDiv = document.createElement('div');
            chunkDiv.className = `chunk-card ${chunk.active ? 'active-match' : ''}`;
            chunkDiv.innerHTML = `
                <span class="chunk-score">cos: ${chunk.score.toFixed(2)}</span>
                <div>${chunk.text}</div>
            `;
            chunksList.appendChild(chunkDiv);
        });

        // 2. Render Response with terminal-like typing
        llmResponse.innerHTML = '';
        let responseText = data.response;
        // Highlight critical portions of text for visual citations
        if (selectedQuery() === 'travel') {
            if (currentMode === 'standard') {
                responseText = responseText.replace("Yes, you can claim reimbursement for taxi fares.", "<span class='highlight'>Yes, you can claim reimbursement for taxi fares.</span>");
            } else {
                responseText = responseText.replace("No, you cannot claim reimbursement for taxi fares incurred during personal weekend trips.", "<span class='highlight'>No, you cannot claim reimbursement for taxi fares incurred during personal weekend trips.</span>");
            }
        } else if (selectedQuery() === 'security') {
            if (currentMode === 'standard') {
                responseText = responseText.replace("You are allowed to connect to public wireless networks", "<span class='highlight'>You are allowed to connect to public wireless networks</span>");
            } else {
                responseText = responseText.replace("strictly prohibited unless you connect through the corporate VPN client", "<span class='highlight'>strictly prohibited unless you connect through the corporate VPN client</span>");
            }
        }

        llmResponse.innerHTML = responseText;

        // 3. Render Citations
        citationsList.innerHTML = '';
        data.citations.forEach((citation, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="citation-num">[${index + 1}]</span>${citation.source}`;
            citationsList.appendChild(li);
        });
        citationsContainer.style.display = 'block';

        // 4. Render Failure Case
        if (data.hasFailure) {
            failureText.textContent = data.failureText;
            failureCase.style.display = 'block';
        } else {
            failureCase.style.display = 'none';
        }
    }

    function selectedQuery() {
        return querySelect.value;
    }
});
