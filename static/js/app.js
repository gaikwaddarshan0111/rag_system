// =================================
// DOM ELEMENTS
// =================================

const modeTabs =
    document.querySelectorAll(".mode-tab");

const trainMode =
    document.getElementById("trainMode");

const askMode =
    document.getElementById("askMode");

const fileInput =
    document.getElementById("fileInput");

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

        const mode =
            tab.dataset.mode;

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
// FILE SELECTION
// =================================

fileInput.addEventListener(
    "change",
    () => {

        const files =
            Array.from(fileInput.files);


        if (files.length === 0) {
            return;
        }


        // Clear empty state
        documentList.innerHTML = "";


        // Display selected files
        files.forEach(
            (file, index) => {

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


                        <div class="progress-container">

                            <div
                                class="progress-bar"
                                id="progress-${index}">
                            </div>

                        </div>

                    </div>


                    <span
                        class="status-badge"
                        id="status-${index}">

                        Ready

                    </span>

                `;


                documentList.appendChild(item);

            }
        );


        // Update document count
        documentCount.innerText =
            `${files.length} document${files.length > 1 ? "s" : ""}`;

    }
);


// =================================
// DOCUMENT UPLOAD
// =================================

function uploadDocument(
    file,
    progressBar,
    statusBadge
) {

    return new Promise(
        (resolve, reject) => {

            const xhr =
                new XMLHttpRequest();


            const formData =
                new FormData();


            formData.append(
                "file",
                file
            );


            xhr.open(
                "POST",
                "/train"
            );


            // =================================
            // UPLOAD PROGRESS
            // =================================

            xhr.upload.addEventListener(
                "progress",
                event => {

                    if (!event.lengthComputable) {
                        return;
                    }


                    const percent =
                        Math.round(
                            (event.loaded /
                                event.total) * 100
                        );


                    progressBar.style.width =
                        `${percent}%`;


                    statusBadge.innerText =
                        `Uploading ${percent}%`;

                }
            );


            // =================================
            // SERVER RESPONSE
            // =================================

            xhr.onload = () => {

                try {

                    const result =
                        JSON.parse(
                            xhr.responseText
                        );


                    console.log(
                        "TRAIN RESPONSE:",
                        result
                    );


                    if (
                        xhr.status >= 200 &&
                        xhr.status < 300 &&
                        result.status === "success"
                    ) {

                        // Upload completed
                        progressBar.style.width =
                            "100%";


                        // Green progress bar
                        progressBar.style.background =
                            "#19c37d";


                        // Indexed status
                        statusBadge.innerText =
                            "Indexed ✓";


                        statusBadge.style.color =
                            "#19c37d";


                        resolve(result);

                    } else {

                        statusBadge.innerText =
                            "Failed";


                        reject(
                            new Error(
                                result.message ||
                                "Indexing failed"
                            )
                        );

                    }

                } catch (error) {

                    statusBadge.innerText =
                        "Failed";


                    reject(error);

                }

            };


            // =================================
            // NETWORK ERROR
            // =================================

            xhr.onerror = () => {

                statusBadge.innerText =
                    "Failed";


                reject(
                    new Error(
                        "Network error during upload"
                    )
                );

            };


            // Send request
            xhr.send(formData);

        }
    );

}


// =================================
// BUILD KNOWLEDGE BASE
// =================================

trainButton.addEventListener(
    "click",
    async () => {

        const files =
            Array.from(fileInput.files);


        // No files selected
        if (files.length === 0) {

            alert(
                "Please select at least one document."
            );

            return;
        }


        // Disable button
        trainButton.disabled =
            true;


        trainButton.innerText =
            "Indexing...";


        try {

            // Process each file
            for (
                let index = 0;
                index < files.length;
                index++
            ) {

                const file =
                    files[index];


                // Get progress bar
                const progressBar =
                    document.getElementById(
                        `progress-${index}`
                    );


                // Get status
                const statusBadge =
                    document.getElementById(
                        `status-${index}`
                    );


                // Initial status
                statusBadge.innerText =
                    "Starting...";


                console.log(
                    "Uploading:",
                    file.name
                );


                // Upload + index
                const result =
                    await uploadDocument(
                        file,
                        progressBar,
                        statusBadge
                    );


                console.log(
                    "Indexing successful:",
                    result
                );

            }


            // All documents completed
            trainButton.innerText =
                "Indexed ✓";


        } catch (error) {

            console.error(
                "TRAIN ERROR:",
                error
            );


            trainButton.innerText =
                "Indexing Failed";


            alert(
                error.message
            );


        } finally {

            // Restore button after 2.5 seconds
            setTimeout(() => {

                trainButton.disabled =
                    false;


                trainButton.innerText =
                    "Build Knowledge Base";

            }, 2500);

        }

    }
);


// =================================
// CHAT UI
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

            ${text}

        </div>

    `;


    chatMessages.appendChild(
        message
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// =================================
// CHAT SEND
// =================================

chatSendButton.addEventListener(
    "click",
    () => {

        const question =
            chatInput.value.trim();


        if (!question) {
            return;
        }


        addUserMessage(
            question
        );


        chatInput.value = "";

    }
);


// =================================
// CHAT ENTER KEY
// =================================

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