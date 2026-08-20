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

const chatInput =
    document.getElementById("chatInput");

const chatSendButton =
    document.getElementById("chatSendButton");


// =================================
// TRAIN / ASK
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
// FILE UPLOAD UI
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
// CHAT UI
// =================================

function addUserMessage(text) {

    const chatMessages =
        document.getElementById("chatMessages");

    const message =
        document.createElement("div");

    message.className =
        "message";

    message.style.justifyContent =
        "flex-end";

    message.innerHTML = `
        <div class="message-bubble user-bubble">
            ${text}
        </div>
    `;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


chatSendButton.addEventListener(
    "click",
    () => {

        const question =
            chatInput.value.trim();

        if (!question) {
            return;
        }

        addUserMessage(question);

        chatInput.value = "";

    }
);


chatInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatSendButton.click();

        }

    }
);