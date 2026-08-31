// =========================================================
// RAG SYSTEM - APP.JS
// =========================================================


// =========================================================
// AUTHENTICATION / GLOBAL ELEMENTS
// =========================================================

const loginScreen =
    document.getElementById("loginScreen");

const app =
    document.getElementById("app");

const loginForm =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

const loggedInUsername =
    document.getElementById("loggedInUsername");

const loggedInRole =
    document.getElementById("loggedInRole");

const userAvatar =
    document.getElementById("userAvatar");

const logoutButton =
    document.getElementById("logoutButton");


// =========================================================
// ASK MAIN ELEMENTS
// =========================================================

const askResults =
    document.getElementById("askResults");

const clearAskButton =
    document.getElementById("clearAskButton");

const newConversationButton =
    document.getElementById("newConversationButton");

const askEmptyState =
    document.getElementById("askEmptyState");


// =========================================================
// ASSISTANT OVERVIEW
// =========================================================

const assistantDocumentCount =
    document.getElementById(
        "assistantDocumentCount"
    );

const assistantChunkCount =
    document.getElementById(
        "assistantChunkCount"
    );

const assistantLastUpdated =
    document.getElementById(
        "assistantLastUpdated"
    );

const assistantDomainList =
    document.getElementById(
        "assistantDomainList"
    );


// =========================================================
// SIDEBAR
// =========================================================

const homeNav =
    document.getElementById("homeNav");

const documentsNav =
    document.getElementById("documentsNav");

const teamsNav =
    document.getElementById("teamsNav");


// =========================================================
// MAIN APP ELEMENTS
// =========================================================

const modeTabs =
    document.querySelectorAll(".mode-tab");

const trainMode =
    document.getElementById("trainMode");

const askMode =
    document.getElementById("askMode");


// =========================================================
// TRAIN ELEMENTS
// =========================================================

const fileInput =
    document.getElementById("fileInput");

const documentCategory =
    document.getElementById(
        "documentCategory"
    );

const chooseFileButton =
    document.getElementById(
        "chooseFileButton"
    );

const selectedFilesSection =
    document.getElementById(
        "selectedFilesSection"
    );

const selectedFilesList =
    document.getElementById(
        "selectedFilesList"
    );

const selectedFilesCount =
    document.getElementById(
        "selectedFilesCount"
    );

const clearSelectedFilesButton =
    document.getElementById(
        "clearSelectedFilesButton"
    );

const addMoreFilesButton =
    document.getElementById(
        "addMoreFilesButton"
    );

const addDocumentButton =
    document.getElementById(
        "addDocumentButton"
    );

const documentList =
    document.getElementById(
        "documentList"
    );

const documentCount =
    document.getElementById(
        "documentCount"
    );

const trainButton =
    document.getElementById(
        "trainButton"
    );


// =========================================================
// PENDING FILE STATE
// =========================================================
//
// Files selected by the admin are kept here until
// "Build Knowledge Base" is clicked.
//

let pendingFiles = [];


// =========================================================
// CURRENT UPLOAD STATE
// =========================================================
//
// This contains ONLY the documents uploaded during
// the current upload session.
//
// IMPORTANT:
// This is intentionally separate from the complete
// document list returned by /documents.
//

let currentUploadedDocuments = [];


// =========================================================
// ASK ELEMENTS
// =========================================================

const questionInput =
    document.getElementById(
        "questionInput"
    );

const askButton =
    document.getElementById(
        "askButton"
    );

const answerContainer =
    document.getElementById(
        "answerContainer"
    );

const answerElement =
    document.getElementById(
        "answer"
    );

const sourcesElement =
    document.getElementById(
        "sources"
    );


// =========================================================
// GET SELECTED CATEGORY
// =========================================================

function getSelectedCategory() {

    if (!documentCategory) {

        return null;

    }

    return (
        documentCategory.value ||
        null
    );

}


// =========================================================
// AUTH HELPERS
// =========================================================

function getToken() {

    return localStorage.getItem(
        "access_token"
    );

}


function getRole() {

    return localStorage.getItem(
        "role"
    );

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text ?? "";

    return div.innerHTML;

}


// =========================================================
// FORMAT FILE SIZE
// =========================================================

function formatFileSize(bytes) {

    if (!bytes) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(2)
        )
        +
        " "
        +
        units[index]
    );

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString
        );


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


// =========================================================
// FORMAT TIME
// =========================================================

function formatTime(
    date = new Date()
) {

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// =========================================================
// FORMAT PENDING FILE SIZE
// =========================================================

function formatPendingFileSize(
    bytes
) {

    if (
        bytes < 1024 * 1024
    ) {

        return (
            (bytes / 1024)
                .toFixed(1)
            +
            " KB"
        );

    }


    return (
        (bytes / 1024 / 1024)
            .toFixed(2)
        +
        " MB"
    );

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    // ============================
    // CLEAR ASK CONVERSATION
    // ============================

    clearAskHistory();


    // ============================
    // CLEAR PENDING FILES
    // ============================

    pendingFiles = [];

    currentUploadedDocuments = [];

    syncFileInput();

    renderSelectedFiles();

    renderCurrentUploadedDocuments(
        []
    );


    // ============================
    // CLEAR AUTHENTICATION
    // ============================

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "role"
    );


    showLogin();

}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


// =========================================================
// SHOW LOGIN
// =========================================================

function showLogin() {

    if (loginScreen) {

        loginScreen.classList.remove(
            "hidden"
        );

    }


    if (app) {

        app.classList.add(
            "hidden"
        );

    }

}


// =========================================================
// SHOW APP
// =========================================================

function showApp() {

    if (loginScreen) {

        loginScreen.classList.add(
            "hidden"
        );

    }


    if (app) {

        app.classList.remove(
            "hidden"
        );

    }


    const username =
        localStorage.getItem(
            "username"
        ) || "User";


    const role =
        localStorage.getItem(
            "role"
        ) || "agent";


    if (loggedInUsername) {

        loggedInUsername.innerText =
            username;

    }


    if (loggedInRole) {

        loggedInRole.innerText =
            role === "admin"
                ? "Administrator"
                : "Agent";

    }


    if (userAvatar) {

        userAvatar.innerText =
            username
                .charAt(0)
                .toUpperCase();

    }


    // =====================================================
    // ADMIN-ONLY UI
    // =====================================================

    document
        .querySelectorAll(
            ".admin-only"
        )
        .forEach(
            element => {

                if (
                    role === "admin"
                ) {

                    element.classList.remove(
                        "hidden"
                    );

                } else {

                    element.classList.add(
                        "hidden"
                    );

                }

            }
        );


    // =====================================================
    // AGENT DEFAULT VIEW
    // =====================================================

    if (
        role !== "admin"
    ) {

        if (trainMode) {

            trainMode.classList.remove(
                "active"
            );

        }


        if (askMode) {

            askMode.classList.add(
                "active"
            );

        }


        modeTabs.forEach(
            tab => {

                if (
                    tab.dataset.mode ===
                    "ask"
                ) {

                    tab.classList.add(
                        "active"
                    );

                } else {

                    tab.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    loadAssistantOverview();

}


// =========================================================
// LOGIN
// =========================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;


            loginButton.disabled =
                true;


            loginButton.innerText =
                "Signing in...";


            if (loginError) {

                loginError.classList.add(
                    "hidden"
                );

            }


            try {

                const response =
                    await fetch(
                        "/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    username:
                                        username,

                                    password:
                                        password
                                })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.detail ||
                        "Invalid username or password."
                    );

                }


                localStorage.setItem(
                    "access_token",
                    result.access_token
                );


                localStorage.setItem(
                    "username",
                    result.username
                );


                localStorage.setItem(
                    "role",
                    result.role
                );


                showApp();


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (loginError) {

                    loginError.innerText =
                        error.message;

                    loginError.classList.remove(
                        "hidden"
                    );

                }


            } finally {

                loginButton.disabled =
                    false;

                loginButton.innerText =
                    "Sign In";

            }

        }
    );

}


// =========================================================
// TRAIN / ASK TABS
// =========================================================

modeTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                const mode =
                    tab.dataset.mode;


                // =========================================
                // ADMIN SECURITY CHECK
                // =========================================

                if (
                    mode === "train" &&
                    getRole() !== "admin"
                ) {

                    return;

                }


                modeTabs.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                if (
                    mode === "train"
                ) {

                    if (trainMode) {

                        trainMode.classList.add(
                            "active"
                        );

                    }


                    if (askMode) {

                        askMode.classList.remove(
                            "active"
                        );

                    }

                } else {

                    if (askMode) {

                        askMode.classList.add(
                            "active"
                        );

                    }


                    if (trainMode) {

                        trainMode.classList.remove(
                            "active"
                        );

                    }

                }

            }
        );

    }
);


// =========================================================
// FILE PICKER
// =========================================================

function openFilePicker() {

    if (
        getRole() !== "admin"
    ) {

        return;

    }


    if (fileInput) {

        fileInput.click();

    }

}


if (chooseFileButton) {

    chooseFileButton.addEventListener(
        "click",
        openFilePicker
    );

}


if (addDocumentButton) {

    addDocumentButton.addEventListener(
        "click",
        openFilePicker
    );

}


// =========================================================
// SYNC FILE INPUT
// =========================================================
//
// Keeps the hidden native file input synchronized
// with the pending file array.
//

function syncFileInput() {

    if (!fileInput) {

        return;

    }


    try {

        const dataTransfer =
            new DataTransfer();


        pendingFiles.forEach(
            file => {

                dataTransfer.items.add(
                    file
                );

            }
        );


        fileInput.files =
            dataTransfer.files;

    } catch (error) {

        console.warn(
            "Unable to synchronize file input:",
            error
        );

    }

}


// =========================================================
// FILE SELECTION / PREVIEW
// =========================================================

function handleFileSelection(
    selectedFiles
) {

    if (
        getRole() !== "admin"
    ) {

        return;

    }


    const files =
        Array.from(
            selectedFiles || []
        );


    if (
        files.length === 0
    ) {

        return;

    }


    const maxSize =
        10 * 1024 * 1024;


    // =====================================================
    // VALIDATE FILES
    // =====================================================

    files.forEach(
        file => {

            const isPdf =
                file.type ===
                    "application/pdf" ||
                file.name
                    .toLowerCase()
                    .endsWith(
                        ".pdf"
                    );


            if (!isPdf) {

                alert(
                    `"${file.name}" is not a PDF file.`
                );

                return;

            }


            if (
                file.size >
                maxSize
            ) {

                alert(
                    `"${file.name}" exceeds the 10MB limit.`
                );

                return;

            }


            // =============================================
            // PREVENT DUPLICATES
            // =============================================

            const alreadySelected =
                pendingFiles.some(
                    existing =>
                        existing.name ===
                            file.name &&
                        existing.size ===
                            file.size &&
                        existing.lastModified ===
                            file.lastModified
                );


            if (
                alreadySelected
            ) {

                return;

            }


            pendingFiles.push(
                file
            );

        }
    );


    syncFileInput();

    renderSelectedFiles();

}


// =========================================================
// FILE INPUT CHANGE
// =========================================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        () => {

            handleFileSelection(
                fileInput.files
            );

        }
    );

}


// =========================================================
// RENDER SELECTED FILES
// =========================================================

function renderSelectedFiles() {

    if (
        !selectedFilesList ||
        !selectedFilesSection
    ) {

        return;

    }


    selectedFilesList.innerHTML =
        "";


    // =====================================================
    // NO FILES
    // =====================================================

    if (
        pendingFiles.length === 0
    ) {

        selectedFilesSection.classList.add(
            "hidden"
        );


        if (trainButton) {

            trainButton.disabled =
                true;

        }


        if (selectedFilesCount) {

            selectedFilesCount.innerText =
                "0 files";

        }


        return;

    }


    // =====================================================
    // SHOW SECTION
    // =====================================================

    selectedFilesSection.classList.remove(
        "hidden"
    );


    // =====================================================
    // UPDATE COUNT
    // =====================================================

    if (selectedFilesCount) {

        selectedFilesCount.innerText =
            `${pendingFiles.length} file${
                pendingFiles.length === 1
                    ? ""
                    : "s"
            }`;

    }


    // =====================================================
    // CREATE FILE ITEMS
    // =====================================================

    pendingFiles.forEach(
        (
            file,
            index
        ) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "selected-file-item";


            item.innerHTML = `

                <div class="selected-file-icon">
                    📄
                </div>


                <div class="selected-file-info">

                    <div class="selected-file-name">

                        ${escapeHtml(
                            file.name
                        )}

                    </div>


                    <div class="selected-file-meta">

                        ${formatPendingFileSize(
                            file.size
                        )}

                    </div>

                </div>


                <button
                    type="button"
                    class="remove-selected-file"
                    data-index="${index}"
                    title="Remove file"
                    aria-label="Remove ${escapeHtml(
                        file.name
                    )}"
                >
                    ×
                </button>

            `;


            selectedFilesList.appendChild(
                item
            );

        }
    );


    // =====================================================
    // BUILD BUTTON STATE
    // =====================================================

    if (trainButton) {

        trainButton.disabled =
            !(
                pendingFiles.length >
                    0 &&
                documentCategory &&
                documentCategory.value
            );

    }

}


// =========================================================
// REMOVE SELECTED FILE
// =========================================================

if (
    selectedFilesList
) {

    selectedFilesList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".remove-selected-file"
                );


            if (!button) {

                return;

            }


            const index =
                Number(
                    button.dataset.index
                );


            if (
                Number.isNaN(index)
            ) {

                return;

            }


            pendingFiles.splice(
                index,
                1
            );


            syncFileInput();

            renderSelectedFiles();

        }
    );

}


// =========================================================
// CLEAR SELECTED FILES
// =========================================================

if (
    clearSelectedFilesButton
) {

    clearSelectedFilesButton.addEventListener(
        "click",
        () => {

            pendingFiles = [];


            syncFileInput();

            renderSelectedFiles();

        }
    );

}


// =========================================================
// ADD MORE FILES
// =========================================================

if (
    addMoreFilesButton
) {

    addMoreFilesButton.addEventListener(
        "click",
        () => {

            openFilePicker();

        }
    );

}


// =========================================================
// UPLOAD DOCUMENT
// =========================================================

async function uploadDocument(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "category",
        getSelectedCategory()
    );


    const response =
        await fetch(
            "/train",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${getToken()}`
                },

                body: formData
            }
        );


    const result =
        await response.json();


    if (
        response.status === 401
    ) {

        logout();

        throw new Error(
            "Your session has expired. Please login again."
        );

    }


    if (
        response.status === 403
    ) {

        throw new Error(
            "Admin access required."
        );

    }


    if (
        !response.ok ||
        result.status !== "success"
    ) {

        throw new Error(
            result.message ||
            result.detail ||
            "Upload failed."
        );

    }


    return result;

}


// =========================================================
// BUILD KNOWLEDGE BASE
// =========================================================

if (trainButton) {

    trainButton.addEventListener(
        "click",
        async () => {

            // ==========================================
            // ADMIN CHECK
            // ==========================================

            if (
                getRole() !== "admin"
            ) {

                alert(
                    "Admin access required."
                );

                return;

            }


            // ==========================================
            // CATEGORY CHECK
            // ==========================================

            const category =
                getSelectedCategory();


            if (!category) {

                alert(
                    "Please select a knowledge category."
                );

                return;

            }


            // ==========================================
            // PENDING FILES
            // ==========================================

            const files =
                [...pendingFiles];


            if (
                files.length === 0
            ) {

                alert(
                    "Please select at least one document."
                );

                return;

            }


            // ==========================================
            // DISABLE BUILD BUTTON
            // ==========================================

            trainButton.disabled =
                true;


            trainButton.innerText =
                "Processing...";


            try {

                // ======================================
                // RECORD UPLOAD START TIME
                // ======================================

                const uploadStartTime =
                    new Date();


                // ======================================
                // UPLOAD EACH FILE
                // ======================================

                for (
                    const file of files
                ) {

                    console.log(
                        "Uploading:",
                        file.name
                    );


                    await uploadDocument(
                        file
                    );


                    console.log(
                        "Upload successful:",
                        file.name
                    );

                }


                // ======================================
                // SUCCESS
                // ======================================

                trainButton.innerText =
                    "Uploaded ✓";


                // ======================================
                // CLEAR PENDING FILES
                // ======================================

                pendingFiles = [];


                syncFileInput();

                renderSelectedFiles();


                // ======================================
                // LOAD ONLY CURRENT UPLOAD
                // ======================================

                const uploadedFileNames =
                    files.map(
                        file => file.name
                    );


                await loadUploadedDocuments(
                    uploadedFileNames,
                    uploadStartTime
                );


                // ======================================
                // REFRESH ASSISTANT STATISTICS
                // ======================================

                await loadAssistantOverview();


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

                setTimeout(
                    () => {

                        trainButton.disabled =
                            !(
                                pendingFiles.length >
                                    0 &&
                                getSelectedCategory()
                            );


                        trainButton.innerText =
                            "Build Knowledge Base";

                    },
                    2000
                );

            }

        }
    );

}


// =========================================================
// CREATE DOCUMENT CARD
// =========================================================

function createDocumentCard(
    doc
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "document-card";


    const size =
        formatFileSize(
            doc.file_size
        );


    const createdDate =
        formatDate(
            doc.created_at
        );


    const statusClass =
        doc.status === "indexed" ||
        doc.status === "ready"
            ? "status-indexed"
            : doc.status === "failed"
                ? "status-failed"
                : "status-processing";


    const statusText =
        doc.status === "indexed" ||
        doc.status === "ready"
            ? "Ready"
            : doc.status === "failed"
                ? "Failed"
                : "Processing";


    card.innerHTML = `

        <div class="document-card-icon">
            📄
        </div>


        <div class="document-card-content">

            <div class="document-card-name">

                ${escapeHtml(
                    doc.filename
                )}

            </div>


            <div class="document-card-meta">

                <span>
                    ${size}
                </span>


                <span>
                    ${doc.chunk_count || 0}
                    chunks
                </span>


                <span>
                    ${escapeHtml(
                        doc.uploaded_by ||
                        "Unknown"
                    )}
                </span>


                <span>
                    ${createdDate}
                </span>

            </div>

        </div>


        <div class="document-card-status ${statusClass}">

            ${statusText}

        </div>

    `;


    return card;

}


// =========================================================
// LOAD ALL DOCUMENTS
// =========================================================
//
// IMPORTANT:
// This function is ONLY used by the Documents page,
// Teams page and statistics.
//
// It must NOT be used to populate the Home/Train
// current-upload list.
//

async function loadAllDocuments() {

    const token =
        getToken();


    if (!token) {

        return;

    }


    try {

        const response =
            await fetch(
                "/documents",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const documents =
            await response.json();


        if (
            response.status === 401
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                documents.detail ||
                "Unable to load documents."
            );

        }


        const documentArray =
            Array.isArray(
                documents
            )
                ? documents
                : [];


        renderAllDocuments(
            documentArray
        );


        updateAssistantOverview(
            documentArray
        );


    } catch (error) {

        console.error(
            "Failed to load documents:",
            error
        );


        const container =
            document.getElementById(
                "allDocumentsList"
            );


        if (container) {

            container.innerHTML = `

                <div class="empty-state">

                    <div>
                        ⚠️
                    </div>


                    <p>
                        Unable to load documents.
                    </p>


                    <span>
                        ${escapeHtml(
                            error.message
                        )}
                    </span>

                </div>

            `;

        }

    }

}


// =========================================================
// RENDER ALL DOCUMENTS
// =========================================================

function renderAllDocuments(
    documents
) {

    const container =
        document.getElementById(
            "allDocumentsList"
        ) ||
        documentList;


    const count =
        document.getElementById(
            "allDocumentsCount"
        ) ||
        documentCount;


    if (!container) {

        console.warn(
            "Document list container not found."
        );

        return;

    }


    // =====================================================
    // UPDATE DOCUMENT COUNT
    // =====================================================

    if (count) {

        count.innerText =
            `${documents.length} document${
                documents.length === 1
                    ? ""
                    : "s"
            }`;

    }


    // =====================================================
    // CLEAR CURRENT LIST
    // =====================================================

    container.innerHTML =
        "";


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (
        documents.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    📄
                </div>

                <p>
                    No documents yet
                </p>

                <span>
                    Upload a PDF above to build
                    your knowledge base.
                </span>

            </div>

        `;

        return;

    }


    // =====================================================
    // RENDER DOCUMENTS
    // =====================================================

    documents.forEach(
        doc => {

            container.appendChild(
                createDocumentCard(
                    doc
                )
            );

        }
    );

}


// =========================================================
// LOAD CURRENT UPLOADED DOCUMENTS
// =========================================================
//
// This is deliberately separate from loadAllDocuments().
//
// The Home / Train page should display ONLY documents
// uploaded during the current upload operation.
//
// We fetch the complete document list from the backend,
// then select the newest matching document for each
// uploaded filename.
//

async function loadUploadedDocuments(
    uploadedFileNames,
    uploadStartTime = null
) {

    const token =
        getToken();


    if (!token) {

        return;

    }


    if (
        !Array.isArray(
            uploadedFileNames
        ) ||
        uploadedFileNames.length === 0
    ) {

        renderCurrentUploadedDocuments(
            []
        );

        return;

    }


    try {

        console.log(
            "Loading current uploaded documents:",
            uploadedFileNames
        );


        const response =
            await fetch(
                "/documents",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const documents =
            await response.json();


        if (
            response.status === 401
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                documents.detail ||
                "Unable to load uploaded documents."
            );

        }


        const documentArray =
            Array.isArray(
                documents
            )
                ? documents
                : [];


        // =================================================
        // FIND CURRENT UPLOADS
        // =================================================
        //
        // For every uploaded filename:
        //
        // 1. Find documents with the same filename.
        // 2. Prefer documents created after this upload began.
        // 3. If timestamps aren't available, use the newest
        //    matching document.
        //
        // This prevents an older document with the same
        // filename from appearing on the Home page.
        //

        const currentDocuments = [];


        uploadedFileNames.forEach(
            fileName => {

                const matchingDocuments =
                    documentArray.filter(
                        doc =>
                            doc.filename ===
                            fileName
                    );


                if (
                    matchingDocuments.length === 0
                ) {

                    return;

                }


                let candidates =
                    matchingDocuments;


                // =========================================
                // PREFER DOCUMENTS CREATED DURING THIS UPLOAD
                // =========================================

                if (
                    uploadStartTime
                ) {

                    const recentDocuments =
                        matchingDocuments.filter(
                            doc => {

                                if (
                                    !doc.created_at
                                ) {

                                    return false;

                                }


                                const createdAt =
                                    new Date(
                                        doc.created_at
                                    );


                                return (
                                    !Number.isNaN(
                                        createdAt.getTime()
                                    ) &&
                                    createdAt >=
                                        uploadStartTime
                                );

                            }
                        );


                    if (
                        recentDocuments.length > 0
                    ) {

                        candidates =
                            recentDocuments;

                    }

                }


                // =========================================
                // SORT NEWEST FIRST
                // =========================================

                candidates.sort(
                    (
                        a,
                        b
                    ) => {

                        const dateA =
                            a.created_at
                                ? new Date(
                                    a.created_at
                                ).getTime()
                                : 0;


                        const dateB =
                            b.created_at
                                ? new Date(
                                    b.created_at
                                ).getTime()
                                : 0;


                        return dateB - dateA;

                    }
                );


                // =========================================
                // TAKE NEWEST MATCH
                // =========================================

                if (
                    candidates.length > 0
                ) {

                    currentDocuments.push(
                        candidates[0]
                    );

                }

            }
        );


        // =================================================
        // STORE CURRENT UPLOAD
        // =================================================

        currentUploadedDocuments =
            currentDocuments;


        console.log(
            "Current uploaded documents:",
            currentUploadedDocuments
        );


        // =================================================
        // RENDER ONLY CURRENT UPLOAD
        // =================================================

        renderCurrentUploadedDocuments(
            currentUploadedDocuments
        );


    } catch (error) {

        console.error(
            "Failed to load current uploaded documents:",
            error
        );


        renderCurrentUploadedDocuments(
            []
        );

    }

}


// =========================================================
// RENDER CURRENT UPLOADED DOCUMENTS
// =========================================================
//
// This list is used ONLY on the Home / Train page.
//

function renderCurrentUploadedDocuments(
    documents
) {

    const container =
        documentList;


    const count =
        documentCount;


    if (!container) {

        console.warn(
            "Current upload document list container not found."
        );

        return;

    }


    const documentArray =
        Array.isArray(
            documents
        )
            ? documents
            : [];


    // =====================================================
    // UPDATE COUNT
    // =====================================================

    if (count) {

        count.innerText =
            `${documentArray.length} document${
                documentArray.length === 1
                    ? ""
                    : "s"
            }`;

    }


    // =====================================================
    // CLEAR LIST
    // =====================================================

    container.innerHTML =
        "";


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (
        documentArray.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    📄
                </div>


                <p>
                    No documents uploaded yet
                </p>


                <span>
                    Upload a document to get started.
                </span>

            </div>

        `;

        return;

    }


    // =====================================================
    // RENDER CURRENT UPLOADS
    // =====================================================

    documentArray.forEach(
        doc => {

            container.appendChild(
                createDocumentCard(
                    doc
                )
            );

        }
    );

}


// =========================================================
// TEAM CONFIGURATION
// =========================================================

const teams = [

    {
        id: "salesforce",

        name: "Salesforce (SF)",

        icon: "☁️",

        description:
            "Salesforce knowledge and documentation"
    },


    {
        id: "non_sf",

        name: "Non-SF",

        icon: "📁",

        description:
            "Non-Salesforce knowledge and documentation"
    },


    {
        id: "telecom",

        name: "Telecom",

        icon: "📡",

        description:
            "Telecom knowledge and documentation"
    }

];


// =========================================================
// LOAD TEAMS
// =========================================================

async function loadTeams() {

    const token =
        getToken();


    if (!token) {

        return;

    }


    try {

        const response =
            await fetch(
                "/documents",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const documents =
            await response.json();


        if (
            response.status === 401
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                documents.detail ||
                "Unable to load teams."
            );

        }


        renderTeams(
            Array.isArray(
                documents
            )
                ? documents
                : []
        );


    } catch (error) {

        console.error(
            "Failed to load teams:",
            error
        );


        const teamsList =
            document.getElementById(
                "teamsList"
            );


        if (teamsList) {

            teamsList.innerHTML = `

                <div class="empty-state">

                    <div>
                        ⚠️
                    </div>


                    <p>
                        Unable to load teams.
                    </p>


                    <span>
                        ${escapeHtml(
                            error.message
                        )}
                    </span>

                </div>

            `;

        }

    }

}


// =========================================================
// RENDER TEAM FOLDERS
// =========================================================

function renderTeams(
    documents
) {

    const teamsList =
        document.getElementById(
            "teamsList"
        );


    if (!teamsList) {

        return;

    }


    teamsList.innerHTML =
        "";


    teams.forEach(
        team => {

            const teamDocuments =
                documents.filter(
                    doc =>
                        doc.category ===
                        team.id
                );


            const folder =
                document.createElement(
                    "div"
                );


            folder.className =
                "team-folder";


            folder.innerHTML = `

                <div class="team-folder-icon">

                    ${team.icon}

                </div>


                <div class="team-folder-content">

                    <div class="team-folder-name">

                        ${escapeHtml(
                            team.name
                        )}

                    </div>


                    <div class="team-folder-description">

                        ${escapeHtml(
                            team.description
                        )}

                    </div>


                    <div class="team-folder-meta">

                        ${teamDocuments.length}

                        document${
                            teamDocuments.length === 1
                                ? ""
                                : "s"
                        }

                    </div>

                </div>


                <div class="team-folder-arrow">

                    →

                </div>

            `;


            folder.addEventListener(
                "click",
                function () {

                    showTeamDocuments(
                        team,
                        teamDocuments
                    );

                }
            );


            teamsList.appendChild(
                folder
            );

        }
    );

}


// =========================================================
// PAGE TITLE
// =========================================================

function setPageTitle(
    title,
    subtitle
) {

    const titleElement =
        document.querySelector(
            ".topbar h1"
        );


    const subtitleElement =
        document.querySelector(
            ".topbar p"
        );


    if (titleElement) {

        titleElement.innerText =
            title;

    }


    if (subtitleElement) {

        subtitleElement.innerText =
            subtitle;

    }

}


// =========================================================
// NAVIGATION VIEW HELPERS
// =========================================================

function hideTrainAsk() {

    modeTabs.forEach(
        tab => {

            tab.style.display =
                "none";

        }
    );


    if (trainMode) {

        trainMode.classList.remove(
            "active"
        );

        trainMode.style.display =
            "none";

    }


    if (askMode) {

        askMode.classList.remove(
            "active"
        );

        askMode.style.display =
            "none";

    }

}


function showTrainAsk() {

    modeTabs.forEach(
        tab => {

            tab.style.display =
                "";

        }
    );


    if (trainMode) {

        trainMode.style.display =
            "";

    }


    if (askMode) {

        askMode.style.display =
            "";

    }

}


function hideNavigationViews() {

    const documentsView =
        document.getElementById(
            "documentsView"
        );


    const teamsView =
        document.getElementById(
            "teamsView"
        );


    if (documentsView) {

        documentsView.classList.add(
            "hidden"
        );

        documentsView.style.display =
            "none";

    }


    if (teamsView) {

        teamsView.classList.add(
            "hidden"
        );

        teamsView.style.display =
            "none";

    }

}


function getOrCreateNavigationView(
    id
) {

    let view =
        document.getElementById(
            id
        );


    if (view) {

        return view;

    }


    const mainContent =
        document.querySelector(
            ".main-content"
        );


    if (!mainContent) {

        console.error(
            "Main content container not found."
        );

        return null;

    }


    view =
        document.createElement(
            "section"
        );


    view.id =
        id;


    view.className =
        "navigation-view";


    mainContent.appendChild(
        view
    );


    return view;

}


// =========================================================
// ACTIVATE SIDEBAR NAV
// =========================================================

function activateNav(
    activeNav
) {

    if (homeNav) {

        homeNav.classList.toggle(
            "active",
            activeNav ===
                homeNav
        );

    }


    if (documentsNav) {

        documentsNav.classList.toggle(
            "active",
            activeNav ===
                documentsNav
        );

    }


    if (teamsNav) {

        teamsNav.classList.toggle(
            "active",
            activeNav ===
                teamsNav
        );

    }

}


// =========================================================
// SHOW HOME
// =========================================================

function showHomeView() {

    console.log(
        "Opening Home"
    );


    hideNavigationViews();

    showTrainAsk();


    setPageTitle(
        "Knowledge Base",
        "Upload documents and build your RAG knowledge base."
    );


    activateNav(
        homeNav
    );


    const role =
        getRole();


    modeTabs.forEach(
        tab => {

            tab.classList.remove(
                "active"
            );

        }
    );


    if (
        role === "admin"
    ) {

        const trainTab =
            document.querySelector(
                '.mode-tab[data-mode="train"]'
            );


        if (trainTab) {

            trainTab.classList.add(
                "active"
            );

        }


        if (trainMode) {

            trainMode.classList.add(
                "active"
            );

        }


        if (askMode) {

            askMode.classList.remove(
                "active"
            );

        }


        // =============================================
        // IMPORTANT
        // =============================================
        //
        // DO NOT call loadAllDocuments() here.
        //
        // Home page must show ONLY the current upload.
        //

        renderCurrentUploadedDocuments(
            currentUploadedDocuments
        );

    } else {

        const askTab =
            document.querySelector(
                '.mode-tab[data-mode="ask"]'
            );


        if (askTab) {

            askTab.classList.add(
                "active"
            );

        }


        if (askMode) {

            askMode.classList.add(
                "active"
            );

        }


        if (trainMode) {

            trainMode.classList.remove(
                "active"
            );

        }

    }

}


// =========================================================
// SHOW DOCUMENTS PAGE
// =========================================================

function showDocumentsView() {

    console.log(
        "Opening Documents"
    );


    hideTrainAsk();

    hideNavigationViews();


    setPageTitle(
        "Documents",
        "All documents in the knowledge base."
    );


    activateNav(
        documentsNav
    );


    let view =
        document.getElementById(
            "documentsView"
        );


    if (!view) {

        view =
            getOrCreateNavigationView(
                "documentsView"
            );

    }


    if (!view) {

        return;

    }


    view.classList.remove(
        "hidden"
    );


    view.style.display =
        "";


    view.innerHTML = `

        <div class="documents-header">

            <div>

                <span class="breadcrumb">
                    Knowledge
                </span>


                <span class="separator">
                    ›
                </span>


                <strong>
                    All Documents
                </strong>

            </div>


            <span id="allDocumentsCount">
                Loading...
            </span>

        </div>


        <div
            id="allDocumentsList"
            class="document-list"
        >

            <div class="empty-state">

                <div>
                    📄
                </div>


                <p>
                    Loading documents...
                </p>

            </div>

        </div>

    `;


    loadAllDocuments();

}


// =========================================================
// SHOW TEAM PAGE
// =========================================================

function showTeamsView() {

    console.log(
        "Opening Teams"
    );


    hideTrainAsk();

    hideNavigationViews();


    setPageTitle(
        "Teams",
        "Select a knowledge domain."
    );


    activateNav(
        teamsNav
    );


    let view =
        document.getElementById(
            "teamsView"
        );


    if (!view) {

        view =
            getOrCreateNavigationView(
                "teamsView"
            );

    }


    if (!view) {

        return;

    }


    view.classList.remove(
        "hidden"
    );


    view.style.display =
        "";


    view.innerHTML = `

        <div class="documents-header">

            <div>

                <span class="breadcrumb">
                    Workspace
                </span>


                <span class="separator">
                    ›
                </span>


                <strong>
                    Knowledge Domains
                </strong>

            </div>

        </div>


        <div
            id="teamsList"
            class="teams-grid"
        >

            <div class="empty-state">

                <div>
                    📚
                </div>


                <p>
                    Loading teams...
                </p>

            </div>

        </div>

    `;


    loadTeams();

}


// =========================================================
// HOME SIDEBAR
// =========================================================

if (homeNav) {

    homeNav.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showHomeView();

        }
    );

}


// =========================================================
// DOCUMENTS SIDEBAR
// =========================================================

if (documentsNav) {

    documentsNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showDocumentsView();

        }
    );

}


// =========================================================
// TEAM SIDEBAR
// =========================================================

if (teamsNav) {

    teamsNav.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showTeamsView();

        }
    );

}


// =========================================================
// SHOW TEAM DOCUMENTS
// =========================================================

function showTeamDocuments(
    team,
    documents
) {

    const view =
        document.getElementById(
            "teamsView"
        );


    if (!view) {

        return;

    }


    setPageTitle(
        team.name,
        "Documents in this knowledge domain."
    );


    view.innerHTML = `

        <div class="team-folder-page">


            <button
                type="button"
                class="back-button"
                id="backToTeams"
            >

                ← Back to Teams

            </button>


            <div class="folder-header">


                <div class="folder-large-icon">

                    ${team.icon}

                </div>


                <div>

                    <h2>

                        ${escapeHtml(
                            team.name
                        )}

                    </h2>


                    <p>

                        ${documents.length}

                        document${
                            documents.length === 1
                                ? ""
                                : "s"
                        }

                    </p>

                </div>


            </div>


            <div
                id="teamDocumentsList"
                class="folder-documents"
            ></div>


        </div>

    `;


    const container =
        document.getElementById(
            "teamDocumentsList"
        );


    if (
        !container
    ) {

        return;

    }


    if (
        documents.length === 0
    ) {

        container.innerHTML = `

            <div class="folder-empty">

                <div class="folder-empty-icon">
                    📂
                </div>


                <h3>
                    No documents
                </h3>


                <p>
                    This folder doesn't contain
                    any documents yet.
                </p>

            </div>

        `;

    } else {

        documents.forEach(
            doc => {

                container.appendChild(
                    createDocumentCard(
                        doc
                    )
                );

            }
        );

    }


    const backButton =
        document.getElementById(
            "backToTeams"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                showTeamsView();

            }
        );

    }

}


// =========================================================
// ASK - USER MESSAGE
// =========================================================

function addUserMessage(
    text
) {

    if (!askResults) {

        return;

    }


    hideAskEmptyState();


    const result =
        document.createElement(
            "div"
        );


    result.className =
        "ask-result user-result";


    result.innerHTML = `

        <div class="ask-message-meta">

            <span class="ask-message-author">
                You
            </span>


            <span class="ask-message-time">

                ${formatTime()}

            </span>

        </div>


        <div class="ask-user-bubble">

            ${escapeHtml(text)}

        </div>

    `;


    askResults.appendChild(
        result
    );


    scrollAskToBottom();

}


// =========================================================
// HIDE ASK EMPTY STATE
// =========================================================

function hideAskEmptyState() {

    if (!askEmptyState) {

        return;

    }


    askEmptyState.classList.add(
        "hidden"
    );

}


// =========================================================
// SHOW ASK EMPTY STATE
// =========================================================

function showAskEmptyState() {

    if (!askEmptyState) {

        return;

    }


    askEmptyState.classList.remove(
        "hidden"
    );

}


// =========================================================
// ASK - AI MESSAGE
// =========================================================

function addAssistantMessage(
    text,
    sources = []
) {

    if (!askResults) {

        return;

    }


    hideAskEmptyState();


    const result =
        document.createElement(
            "div"
        );


    result.className =
        "ask-result assistant-result";


    const sourceArray =
        normalizeSources(
            sources
        );


    result.innerHTML = `

        <div class="ask-message-meta">

            <span class="ask-message-author ai-author">

                <span class="ai-mini-icon">
                    ✦
                </span>

                AI Assistant

            </span>


            <span class="ask-message-time">

                ${formatTime()}

            </span>

        </div>


        <div class="ask-ai-card">


            <div class="ask-ai-answer">

                ${formatAnswer(text)}

            </div>


            ${
                sourceArray.length > 0
                    ? createSourcesHtml(
                        sourceArray
                    )
                    : ""
            }


        </div>

    `;


    askResults.appendChild(
        result
    );


    scrollAskToBottom();

}


// =========================================================
// FORMAT ANSWER
// =========================================================

function formatAnswer(
    text
) {

    if (!text) {

        return "";

    }


    const escaped =
        escapeHtml(
            text
        );


    return escaped
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )
        .replace(
            /\n\n/g,
            "</p><p>"
        )
        .replace(
            /\n/g,
            "<br>"
        );

}


// =========================================================
// NORMALIZE SOURCES
// =========================================================

function normalizeSources(
    sources
) {

    if (!Array.isArray(sources)) {

        return [];

    }


    return sources
        .map(
            source => {

                if (
                    typeof source ===
                    "string"
                ) {

                    return {

                        name:
                            source,

                        page:
                            null,

                        score:
                            null

                    };

                }


                if (
                    source &&
                    typeof source ===
                    "object"
                ) {

                    return {

                        name:
                            source.filename ||
                            source.file_name ||
                            source.source ||
                            source.name ||
                            source.title ||
                            "Document",

                        page:
                            source.page ||
                            source.page_number ||
                            null,

                        score:
                            source.score ??
                            source.similarity ??
                            null

                    };

                }


                return null;

            }
        )
        .filter(Boolean);

}


// =========================================================
// CREATE SOURCES HTML
// =========================================================

function createSourcesHtml(
    sources
) {

    return `

        <details class="ask-sources">

            <summary>

                <span class="sources-summary-left">

                    <span class="sources-icon">
                        ◈
                    </span>

                    Sources

                    <span class="sources-count">

                        ${sources.length}

                    </span>

                </span>


                <span class="sources-chevron">
                    ›
                </span>

            </summary>


            <div class="sources-list">

                ${sources.map(
                    source => `

                        <div class="source-item">

                            <div class="source-file-icon">
                                📄
                            </div>


                            <div class="source-content">

                                <div class="source-name">

                                    ${escapeHtml(
                                        source.name
                                    )}

                                </div>


                                ${
                                    source.page
                                        ? `

                                            <div class="source-page">

                                                Page
                                                ${escapeHtml(
                                                    source.page
                                                )}

                                            </div>

                                        `
                                        : ""
                                }


                            </div>


                            ${
                                source.score !== null
                                    ? `

                                        <span class="source-score">

                                            ${(
                                                Number(
                                                    source.score
                                                ) * 100
                                            ).toFixed(0)}%

                                        </span>

                                    `
                                    : ""
                            }

                        </div>

                    `
                ).join("")}

            </div>

        </details>

    `;

}


// =========================================================
// ASK - LOADING MESSAGE
// =========================================================

function addLoadingMessage() {

    if (!askResults) {

        return;

    }


    hideAskEmptyState();


    removeLoadingMessage();


    const loading =
        document.createElement(
            "div"
        );


    loading.id =
        "askLoadingMessage";


    loading.className =
        "ask-result assistant-result ask-loading-result";


    loading.innerHTML = `

        <div class="ask-message-meta">

            <span class="ask-message-author ai-author">

                <span class="ai-mini-icon">
                    ✦
                </span>

                AI Assistant

            </span>

        </div>


        <div class="ask-ai-card ask-loading-card">

            <div class="loading-row">

                <span class="loading-orb">
                    ✦
                </span>


                <div>

                    <div class="loading-title">
                        Thinking...
                    </div>


                    <div class="loading-subtitle">

                        Searching your knowledge base

                    </div>

                </div>


                <div class="loading-dots">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>

    `;


    askResults.appendChild(
        loading
    );


    scrollAskToBottom();

}


// =========================================================
// REMOVE LOADING MESSAGE
// =========================================================

function removeLoadingMessage() {

    const loading =
        document.getElementById(
            "askLoadingMessage"
        );


    if (loading) {

        loading.remove();

    }

}


// =========================================================
// SCROLL ASK TO BOTTOM
// =========================================================

function scrollAskToBottom() {

    if (!askResults) {

        return;

    }


    requestAnimationFrame(
        () => {

            askResults.scrollTo({

                top:
                    askResults.scrollHeight,

                behavior:
                    "smooth"

            });

        }
    );

}


// =========================================================
// CLEAR ASK HISTORY
// =========================================================

function clearAskHistory() {

    console.log(
        "Clearing Ask conversation"
    );


    removeLoadingMessage();


    if (askResults) {

        askResults
            .querySelectorAll(
                ".ask-result"
            )
            .forEach(
                element => {

                    element.remove();

                }
            );

    }


    showAskEmptyState();


    if (questionInput) {

        questionInput.value =
            "";

        questionInput.style.height =
            "auto";

    }


    const chatInput =
        document.getElementById(
            "chatInput"
        );


    if (chatInput) {

        chatInput.value =
            "";

    }


    if (answerContainer) {

        answerContainer.classList.add(
            "hidden"
        );

    }


    if (answerElement) {

        answerElement.innerHTML =
            "";

    }


    if (sourcesElement) {

        sourcesElement.innerHTML =
            "";

    }

}


// =========================================================
// CLEAR BUTTON
// =========================================================

if (clearAskButton) {

    clearAskButton.addEventListener(
        "click",
        clearAskHistory
    );

}


// =========================================================
// NEW CONVERSATION
// =========================================================

if (newConversationButton) {

    newConversationButton.addEventListener(
        "click",
        clearAskHistory
    );

}


// =========================================================
// SUGGESTION CHIPS
// =========================================================

document
    .querySelectorAll(
        ".suggestion-chip"
    )
    .forEach(
        chip => {

            chip.addEventListener(
                "click",
                () => {

                    const question =
                        chip.dataset.question;


                    if (!questionInput) {

                        return;

                    }


                    questionInput.value =
                        question;


                    autoResizeQuestionInput();


                    questionInput.focus();


                    handleAsk();

                }
            );

        }
    );


// =========================================================
// ASK - API
// =========================================================

async function askQuestion(
    question
) {

    const token =
        getToken();


    if (!token) {

        logout();

        throw new Error(
            "Please login to continue."
        );

    }


    const response =
        await fetch(
            "/ask",
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body:
                    JSON.stringify({

                        question:
                            question

                    })

            }
        );


    let result;


    try {

        result =
            await response.json();

    } catch {

        result = {};

    }


    if (
        response.status === 401
    ) {

        logout();

        throw new Error(
            "Your session has expired. Please login again."
        );

    }


    if (
        response.status === 403
    ) {

        throw new Error(
            "You do not have permission to ask questions."
        );

    }


    if (!response.ok) {

        throw new Error(
            result.detail ||
            result.message ||
            "Unable to get an answer."
        );

    }


    return result;

}


// =========================================================
// ASK - HANDLE
// =========================================================

async function handleAsk() {

    if (!questionInput) {

        return;

    }


    const question =
        questionInput.value.trim();


    if (!question) {

        questionInput.focus();

        return;

    }


    // ==========================================
    // ADD USER QUESTION
    // ==========================================

    addUserMessage(
        question
    );


    // ==========================================
    // CLEAR INPUT
    // ==========================================

    questionInput.value =
        "";

    questionInput.style.height =
        "auto";


    // ==========================================
    // DISABLE SEND BUTTON
    // ==========================================

    if (askButton) {

        askButton.disabled =
            true;

    }


    // ==========================================
    // SHOW LOADING
    // ==========================================

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


        // ======================================
        // EXTRACT ANSWER
        // ======================================

        const answer =
            result.answer ||
            result.response ||
            result.message ||
            "No answer was returned.";


        // ======================================
        // EXTRACT SOURCES
        // ======================================

        const sources =
            result.sources ||
            result.context ||
            [];


        // ======================================
        // ADD AI RESPONSE
        // ======================================

        addAssistantMessage(
            answer,
            sources
        );


    } catch (error) {

        console.error(
            "Ask error:",
            error
        );


        removeLoadingMessage();


        addAssistantMessage(
            `Sorry, I was unable to process your question. ${error.message}`,
            []
        );


    } finally {

        if (askButton) {

            askButton.disabled =
                false;

        }


        if (questionInput) {

            questionInput.focus();

        }

    }

}


// =========================================================
// ASK BUTTON
// =========================================================

if (askButton) {

    askButton.addEventListener(
        "click",
        handleAsk
    );

}


// =========================================================
// AUTO RESIZE QUESTION INPUT
// =========================================================

function autoResizeQuestionInput() {

    if (!questionInput) {

        return;

    }


    questionInput.style.height =
        "auto";


    questionInput.style.height =
        Math.min(
            questionInput.scrollHeight,
            160
        ) + "px";

}


// =========================================================
// QUESTION INPUT
// =========================================================

if (questionInput) {

    questionInput.addEventListener(
        "input",
        autoResizeQuestionInput
    );


    questionInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                if (
                    askButton &&
                    !askButton.disabled
                ) {

                    handleAsk();

                }

            }

        }
    );

}


// =========================================================
// CHAT INPUT COMPATIBILITY
// =========================================================

const chatInput =
    document.getElementById(
        "chatInput"
    );

const chatSendButton =
    document.getElementById(
        "chatSendButton"
    );


if (chatSendButton) {

    chatSendButton.addEventListener(
        "click",
        () => {

            if (!chatInput) {

                return;

            }


            const value =
                chatInput.value.trim();


            if (!value) {

                return;

            }


            if (questionInput) {

                questionInput.value =
                    value;

                autoResizeQuestionInput();

            }


            chatInput.value =
                "";


            handleAsk();

        }
    );

}


// =========================================================
// ASSISTANT OVERVIEW
// =========================================================

async function loadAssistantOverview() {

    const token =
        getToken();


    if (!token) {

        return;

    }


    try {

        const response =
            await fetch(
                "/documents",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Unable to load knowledge base information."
            );

        }


        const documents =
            await response.json();


        const documentArray =
            Array.isArray(
                documents
            )
                ? documents
                : [];


        updateAssistantOverview(
            documentArray
        );


    } catch (error) {

        console.error(
            "Assistant overview error:",
            error
        );


        if (assistantDocumentCount) {

            assistantDocumentCount.innerText =
                "Unavailable";

        }


        if (assistantChunkCount) {

            assistantChunkCount.innerText =
                "—";

        }


        if (assistantLastUpdated) {

            assistantLastUpdated.innerText =
                "—";

        }

    }

}


// =========================================================
// UPDATE ASSISTANT OVERVIEW
// =========================================================

function updateAssistantOverview(
    documents
) {

    if (!Array.isArray(documents)) {

        documents = [];

    }


    // =====================================================
    // DOCUMENT COUNT
    // =====================================================

    if (assistantDocumentCount) {

        assistantDocumentCount.innerText =
            documents.length === 0
                ? "No documents"
                : `${documents.length} indexed`;

    }


    // =====================================================
    // TOTAL CHUNKS
    // =====================================================

    const totalChunks =
        documents.reduce(
            (
                total,
                document
            ) => {

                return (
                    total +
                    Number(
                        document.chunk_count ||
                        0
                    )
                );

            },
            0
        );


    if (assistantChunkCount) {

        assistantChunkCount.innerText =
            totalChunks.toLocaleString();

    }


    // =====================================================
    // LAST UPDATED
    // =====================================================

    let latestDate =
        null;


    documents.forEach(
        document => {

            const dateValue =
                document.updated_at ||
                document.created_at;


            if (!dateValue) {

                return;

            }


            const date =
                new Date(
                    dateValue
                );


            if (
                !latestDate ||
                date > latestDate
            ) {

                latestDate =
                    date;

            }

        }
    );


    if (assistantLastUpdated) {

        assistantLastUpdated.innerText =
            latestDate
                ? formatDate(
                    latestDate
                )
                : "—";

    }


    // =====================================================
    // CATEGORY COUNTS
    // =====================================================

    const categoryCounts = {

        salesforce: 0,

        non_sf: 0,

        telecom: 0

    };


    documents.forEach(
        document => {

            const category =
                String(
                    document.category ||
                    ""
                )
                .toLowerCase()
                .replace(
                    /-/g,
                    "_"
                );


            if (
                category ===
                "salesforce"
            ) {

                categoryCounts.salesforce++;

            }


            else if (
                category ===
                "non_sf" ||
                category ===
                "nonsf" ||
                category ===
                "non_sforce"
            ) {

                categoryCounts.non_sf++;

            }


            else if (
                category ===
                "telecom"
            ) {

                categoryCounts.telecom++;

            }

        }
    );


    updateAssistantDomainCounts(
        categoryCounts
    );

}


// =========================================================
// UPDATE ASSISTANT DOMAIN COUNTS
// =========================================================

function updateAssistantDomainCounts(
    counts
) {

    if (!assistantDomainList) {

        return;

    }


    const domainRows =
        assistantDomainList.querySelectorAll(
            ".domain-row"
        );


    domainRows.forEach(
        row => {

            const strong =
                row.querySelector(
                    "strong"
                );


            const span =
                row.querySelector(
                    "span"
                );


            if (
                !strong ||
                !span
            ) {

                return;

            }


            const name =
                strong.innerText
                    .toLowerCase();


            let count =
                0;


            if (
                name.includes(
                    "salesforce"
                )
            ) {

                count =
                    counts.salesforce;

            }


            else if (
                name.includes(
                    "non-sf"
                )
            ) {

                count =
                    counts.non_sf;

            }


            else if (
                name.includes(
                    "telecom"
                )
            ) {

                count =
                    counts.telecom;

            }


            span.innerText =
                `${count} document${
                    count === 1
                        ? ""
                        : "s"
                }`;

        }
    );

}


// =========================================================
// DOCUMENT LIST INITIALIZATION
// =========================================================
//
// IMPORTANT:
// Do NOT load all documents on application startup.
// The Home page should start with an empty current-upload
// list and only populate it after a successful upload.
//
// The Documents page loads all documents when opened.
//

async function initializeDocuments() {

    if (
        getRole() !== "admin"
    ) {

        return;

    }


    // Start Home page with current-session documents only.

    renderCurrentUploadedDocuments(
        currentUploadedDocuments
    );

}


// =========================================================
// DRAG & DROP UPLOAD
// =========================================================

const uploadCard =
    document.querySelector(
        ".upload-card"
    );


if (uploadCard) {

    [
        "dragenter",
        "dragover"
    ].forEach(
        eventName => {

            uploadCard.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    uploadCard.classList.add(
                        "drag-active"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ].forEach(
        eventName => {

            uploadCard.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    uploadCard.classList.remove(
                        "drag-active"
                    );

                }
            );

        }
    );


    uploadCard.addEventListener(
        "drop",
        event => {

            if (
                getRole() !== "admin"
            ) {

                return;

            }


            const files =
                Array.from(
                    event.dataTransfer.files ||
                    []
                );


            if (
                files.length === 0
            ) {

                return;

            }


            // =========================================
            // USE THE SAME FILE SELECTION LOGIC
            // =========================================

            handleFileSelection(
                files
            );

        }
    );

}


// =========================================================
// UPLOAD CARD CLICK
// =========================================================

if (uploadCard) {

    uploadCard.addEventListener(
        "click",
        event => {

            // Do not open picker when clicking
            // an actual button/select/input.

            if (
                event.target.closest(
                    "button"
                ) ||
                event.target.closest(
                    "select"
                ) ||
                event.target.closest(
                    "input"
                )
            ) {

                return;

            }


            openFilePicker();

        }
    );

}


// =========================================================
// DOCUMENT CATEGORY
// =========================================================

if (documentCategory) {

    documentCategory.addEventListener(
        "change",
        event => {

            console.log(
                "Document category:",
                event.target.value
            );


            // Update Build button state

            renderSelectedFiles();

        }
    );

}


// =========================================================
// NAVIGATION INITIALIZATION
// =========================================================

function initializeNavigation() {

    console.log(
        "Initializing navigation..."
    );


    if (
        getRole() === "admin"
    ) {

        activateNav(
            homeNav
        );

    }

}


// =========================================================
// INITIAL APP LOAD
// =========================================================

function initializeApp() {

    console.log(
        "Initializing RAG application..."
    );


    const token =
        getToken();


    if (!token) {

        showLogin();

        return;

    }


    showApp();


    initializeNavigation();


    // =====================================================
    // DO NOT LOAD ALL DOCUMENTS HERE
    // =====================================================
    //
    // Previously this called:
    //
    //     loadAllDocuments();
    //
    // That caused all 18 documents to appear on the
    // Home / Train page.
    //
    // The Documents page loads all documents separately.
    //


    if (
        getRole() === "admin"
    ) {

        initializeDocuments();

    }


    // =====================================================
    // LOAD KNOWLEDGE-BASE STATISTICS
    // =====================================================

    loadAssistantOverview();

}


// =========================================================
// AUTH TOKEN CHECK
// =========================================================

async function verifyAuthentication() {

    const token =
        getToken();


    if (!token) {

        showLogin();

        return false;

    }


    try {

        const response =
            await fetch(
                "/auth/me",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (
            response.status === 401
        ) {

            logout();

            return false;

        }


        if (
            response.ok
        ) {

            const user =
                await response.json();


            if (
                user.username
            ) {

                localStorage.setItem(
                    "username",
                    user.username
                );

            }


            if (
                user.role
            ) {

                localStorage.setItem(
                    "role",
                    user.role
                );

            }


            return true;

        }


        return true;

    } catch (error) {

        /*
         * If the backend does not expose /auth/me,
         * keep the existing local authentication
         * state instead of preventing the application
         * from loading.
         */

        console.warn(
            "Authentication verification unavailable:",
            error
        );


        return true;

    }

}


// =========================================================
// KEYBOARD SHORTCUTS
// =========================================================

document.addEventListener(
    "keydown",
    event => {

        // Escape clears current input

        if (
            event.key === "Escape"
        ) {

            if (
                questionInput &&
                document.activeElement ===
                    questionInput
            ) {

                questionInput.value =
                    "";

                autoResizeQuestionInput();

            }

        }

    }
);


// =========================================================
// WINDOW VISIBILITY
// =========================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            !document.hidden &&
            getToken()
        ) {

            loadAssistantOverview();

        }

    }
);


// =========================================================
// START APPLICATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "DOM loaded."
        );


        const authenticated =
            await verifyAuthentication();


        if (
            authenticated
        ) {

            initializeApp();

        }

    }
);