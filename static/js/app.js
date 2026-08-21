const modeTabs = document.querySelectorAll(".mode-tab");

const trainMode = document.getElementById("trainMode");
const askMode = document.getElementById("askMode");

const fileInput = document.getElementById("fileInput");
const chooseFileButton =
    document.getElementById("chooseFileButton");

const addDocumentButton =
    document.getElementById("addDocumentButton");

const documentList =
    document.getElementById("documentList");

const documentCount =
    document.getElementById("documentCount");

const trainButton =
    document.getElementById("trainButton");


// =================================
// ASK ELEMENTS
// =================================

const questionInput =
    document.getElementById("questionInput");

const askButton =
    document.getElementById("askButton");

const answerContainer =
    document.getElementById("answerContainer");

const answerElement =
    document.getElementById("answer");

const sourcesElement =
    document.getElementById("sources");


// =================================
// TRAIN / ASK TABS
// =================================

modeTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        modeTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const mode = tab.dataset.mode;

        if (mode === "train") {

            trainMode.classList.add("active");
            askMode.classList.remove("active");

        } else {

            askMode.classList.add("active");
            trainMode.classList.remove("active");

        }

    });

});


// =================================
// FILE PICKER
// =================================

function openFilePicker() {
    fileInput.click();
}


chooseFileButton.addEventListener(
    "click",
    openFilePicker
);


addDocumentButton.addEventListener(
    "click",
    openFilePicker
);


// =================================
// FILE SELECTION UI
// =================================

fileInput.addEventListener(
    "change",
    () => {

        const files =
            Array.from(fileInput.files);

        if (files.length === 0) {
            return;
        }

        documentList.innerHTML = "";

        files.forEach(file => {

            const item =
                document.createElement("div");

            item.className =
                "document-item";

            item.innerHTML = `
                <div class="document-icon">
                    📄
                </div>

                <div class="document-info">

                    <div class="document-name">
                        ${file.name}
                    </div>

                    <div class="document-meta">
                        ${(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>

                </div>

                <span class="status-badge">
                    Ready
                </span>
            `;

            documentList.appendChild(item);

        });

        documentCount.innerText =
            `${files.length} document${files.length > 1 ? "s" : ""}`;

    }
);


// =================================
// UPLOAD DOCUMENT
// =================================

async function uploadDocument(file) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await fetch(
            "/train",
            {
                method: "POST",
                body: formData
            }
        );

    const result =
        await response.json();

    if (
        !response.ok ||
        result.status !== "success"
    ) {

        throw new Error(
            result.message ||
            "Upload failed"
        );

    }

    return result;
}


// =================================
// BUILD KNOWLEDGE BASE
// =================================

trainButton.addEventListener(
    "click",
    async () => {

        const files =
            Array.from(fileInput.files);

        if (files.length === 0) {

            alert(
                "Please select at least one document."
            );

            return;
        }

        trainButton.disabled = true;

        trainButton.innerText =
            "Processing...";

        try {

            for (const file of files) {

                console.log(
                    "Uploading:",
                    file.name
                );

                await uploadDocument(file);

                console.log(
                    "Upload successful:",
                    file.name
                );
            }

            trainButton.innerText =
                "Completed ✓";

        } catch (error) {

            console.error(
                "Upload failed:",
                error
            );

            trainButton.innerText =
                "Upload Failed";

            alert(
                error.message
            );

        } finally {

            setTimeout(() => {

                trainButton.disabled =
                    false;

                trainButton.innerText =
                    "Build Knowledge Base";

            }, 2000);

        }

    }
);


// =================================
// ADD USER MESSAGE
// =================================

function addUserMessage(text) {

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );

    const message =
        document.createElement("div");

    message.className =
        "message";

    message.style.justifyContent =
        "flex-end";

    message.innerHTML = `
        <div class="message-bubble user-bubble">
            ${escapeHtml(text)}
        </div>
    `;

    chatMessages.appendChild(
        message
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// =================================
// ADD AI MESSAGE
// =================================

function addAssistantMessage(
    text,
    sources = []
) {

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );

    const message =
        document.createElement("div");

    message.className =
        "message assistant-message";

    let sourcesHtml = "";

    if (sources.length > 0) {

        sourcesHtml = `
            <div class="chat-sources">
                <div class="chat-sources-title">
                    Sources
                </div>

                ${sources.map(source => `
                    <div class="chat-source">
                        📄 ${escapeHtml(source)}
                    </div>
                `).join("")}

            </div>
        `;
    }

    message.innerHTML = `
        <div class="message-avatar">
            ✦
        </div>

        <div>

            <div class="message-bubble">

                ${escapeHtml(text)}

                ${sourcesHtml}

            </div>

            <span class="message-time">
                Just now
            </span>

        </div>
    `;

    chatMessages.appendChild(
        message
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// =================================
// LOADING MESSAGE
// =================================

function addLoadingMessage() {

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );

    const message =
        document.createElement("div");

    message.className =
        "message assistant-message";

    message.id =
        "loadingMessage";

    message.innerHTML = `
        <div class="message-avatar">
            ✦
        </div>

        <div>

            <div class="message-bubble">

                <span class="thinking">
                    Thinking<span>.</span><span>.</span><span>.</span>
                </span>

            </div>

        </div>
    `;

    chatMessages.appendChild(
        message
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// =================================
// REMOVE LOADING MESSAGE
// =================================

function removeLoadingMessage() {

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );

    if (loadingMessage) {
        loadingMessage.remove();
    }
}


// =================================
// ASK RAG API
// =================================

async function askQuestion(question) {

    const response =
        await fetch(
            "/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );

    const result =
        await response.json();

    if (!response.ok) {

        throw new Error(
            result.detail ||
            "Unable to get an answer."
        );
    }

    return result;
}


// =================================
// ASK BUTTON
// =================================

async function handleAsk() {

    const question =
        questionInput.value.trim();

    if (!question) {
        return;
    }


    // Add user message

    addUserMessage(
        question
    );


    // Clear input

    questionInput.value = "";


    // Disable button

    askButton.disabled =
        true;


    // Show loading

    addLoadingMessage();


    try {

        console.log(
            "Sending question:",
            question
        );


        const result =
            await askQuestion(
                question
            );


        console.log(
            "RAG response:",
            result
        );


        removeLoadingMessage();


        addAssistantMessage(
            result.answer,
            result.sources || []
        );


    } catch (error) {

        console.error(
            "Ask error:",
            error
        );


        removeLoadingMessage();


        addAssistantMessage(
            "Sorry, I couldn't process your question. Please try again."
        );

    } finally {

        askButton.disabled =
            false;

        questionInput.focus();

    }

}


// =================================
// ASK BUTTON CLICK
// =================================

askButton.addEventListener(
    "click",
    handleAsk
);


// =================================
// ENTER TO ASK
// =================================

questionInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleAsk();

        }

    }
);


// =================================
// HTML ESCAPE
// =================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}