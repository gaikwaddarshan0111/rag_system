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
    document.getElementById("documentCategory");


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


// =========================================================
// ASK ELEMENTS
// =========================================================

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
        document.createElement("div");

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
        new Date(dateString);


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
// LOGOUT
// =========================================================

function logout() {

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
        .querySelectorAll(".admin-only")
        .forEach(element => {

            if (role === "admin") {

                element.classList.remove(
                    "hidden"
                );

            } else {

                element.classList.add(
                    "hidden"
                );

            }

        });


    // =====================================================
    // AGENT DEFAULT VIEW
    // =====================================================

    if (role !== "admin") {

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
                    tab.dataset.mode === "ask"
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


    // =====================================================
    // HIDE OLD DOCUMENT LIST
    // =====================================================

    const oldDocumentHeader =
        document.querySelector(
            ".documents-header"
        );


    if (oldDocumentHeader) {

        oldDocumentHeader.style.display =
            "none";

    }


    if (documentList) {

        documentList.style.display =
            "none";

    }

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

                            body: JSON.stringify({
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


                // ==========================================
                // STORE AUTH DATA
                // ==========================================

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


                // ==========================================
                // SECURITY CHECK
                // ==========================================

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
// FILE SELECTION
// =========================================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        () => {

            const files =
                Array.from(
                    fileInput.files
                );


            if (
                files.length === 0
            ) {

                return;

            }


            if (documentList) {

                documentList.innerHTML =
                    "";

            }


            files.forEach(
                file => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "document-item";


                    item.innerHTML = `

                        <div class="document-icon">
                            📄
                        </div>


                        <div class="document-info">

                            <div class="document-name">

                                ${escapeHtml(
                                    file.name
                                )}

                            </div>


                            <div class="document-meta">

                                ${(
                                    file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)} MB

                            </div>

                        </div>


                        <span class="status-badge">
                            Ready
                        </span>

                    `;


                    if (documentList) {

                        documentList.appendChild(
                            item
                        );

                    }

                }
            );


            if (documentCount) {

                documentCount.innerText =
                    `${files.length} document${
                        files.length > 1
                            ? "s"
                            : ""
                    }`;

            }

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
        documentCategory.value
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


            const files =
                Array.from(
                    fileInput.files
                );


            if (
                files.length === 0
            ) {

                alert(
                    "Please select at least one document."
                );

                return;

            }


            trainButton.disabled =
                true;


            trainButton.innerText =
                "Processing...";


            try {

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


                trainButton.innerText =
                    "Completed ✓";


                await loadAllDocuments();


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
                            false;


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
        doc.status === "indexed"
            ? "status-indexed"
            : doc.status === "failed"
                ? "status-failed"
                : "status-processing";


    const statusText =
        doc.status === "indexed"
            ? "Indexed"
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
                    ${doc.chunk_count}
                    chunks
                </span>


                <span>
                    ${escapeHtml(
                        doc.uploaded_by
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


        renderAllDocuments(
            Array.isArray(
                documents
            )
                ? documents
                : []
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
        );


    const count =
        document.getElementById(
            "allDocumentsCount"
        );


    if (!container) {

        return;

    }


    if (count) {

        count.innerText =
            `${documents.length} document${
                documents.length === 1
                    ? ""
                    : "s"
            }`;

    }


    container.innerHTML =
        "";


    if (
        documents.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div>
                    📄
                </div>


                <p>
                    No documents yet.
                </p>

            </div>

        `;

        return;

    }


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


    if (role === "admin") {

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
// SHOW TEAM FOLDER
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

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    if (!chatMessages) {

        return;

    }


    const message =
        document.createElement(
            "div"
        );


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


// =========================================================
// ASK - AI MESSAGE
// =========================================================

function addAssistantMessage(
    text,
    sources = []
) {

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    if (!chatMessages) {

        return;

    }


    const message =
        document.createElement(
            "div"
        );


    message.className =
        "message assistant-message";


    let sourcesHtml =
        "";


    if (
        sources.length > 0
    ) {

        sourcesHtml = `

            <div class="chat-sources">


                <div class="chat-sources-title">

                    Sources

                </div>


                ${sources.map(
                    source => `

                        <div class="chat-source">

                            📄
                            ${escapeHtml(
                                source
                            )}

                        </div>

                    `
                ).join("")}


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


// =========================================================
// ASK - LOADING
// =========================================================

function addLoadingMessage() {

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    if (!chatMessages) {

        return;

    }


    const message =
        document.createElement(
            "div"
        );


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

                    Thinking

                    <span>.</span>
                    <span>.</span>
                    <span>.</span>

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


// =========================================================
// ASK - REMOVE LOADING
// =========================================================

function removeLoadingMessage() {

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );


    if (loadingMessage) {

        loadingMessage.remove();

    }

}


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

                body: JSON.stringify({
                    question:
                        question
                })

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


    if (!response.ok) {

        throw new Error(
            result.detail ||
            "Unable to get an answer."
        );

    }


    return result;

}


// =========================================================
// ASK - MAIN RESULT
// =========================================================

function addAskResult(
    question,
    answer,
    sources = []
) {

    if (!askResults) {

        return;

    }


    const result =
        document.createElement(
            "div"
        );


    result.className =
        "ask-result";


    let sourcesHtml =
        "";


    if (
        Array.isArray(sources) &&
        sources.length > 0
    ) {

        sourcesHtml = `

            <div class="ask-result-sources">

                <div class="ask-result-sources-title">

                    Sources

                </div>


                ${sources.map(
                    source => `

                        <div class="ask-result-source">

                            📄
                            ${escapeHtml(
                                source
                            )}

                        </div>

                    `
                ).join("")}


            </div>

        `;

    }


    result.innerHTML = `

        <div class="ask-result-question">

            ${escapeHtml(
                question
            )}

        </div>


        <div class="ask-result-answer">

            <div class="ask-result-answer-label">

                AI Assistant

            </div>


            <div class="ask-answer-text">

                ${escapeHtml(
                    answer
                )}

            </div>


            ${sourcesHtml}

        </div>

    `;


    askResults.appendChild(
        result
    );


    askResults.scrollTop =
        askResults.scrollHeight;

}


// =========================================================
// CLEAR ASK HISTORY
// =========================================================

function clearAskHistory() {

    console.log(
        "Clearing Ask history"
    );


    // ==========================================
    // CLEAR MAIN ASK RESULTS
    // ==========================================

    if (askResults) {

        askResults.innerHTML =
            "";

    }


    // ==========================================
    // CLEAR RIGHT AI ASSISTANT CHAT
    // ==========================================

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );


    if (chatMessages) {

        chatMessages.innerHTML = `

            <div class="message assistant-message">

                <div class="message-avatar">

                    ✦

                </div>


                <div>

                    <div class="message-bubble">

                        Hello! I'm ready to answer
                        questions about your knowledge base.

                    </div>


                    <span class="message-time">

                        Just now

                    </span>

                </div>

            </div>

        `;

    }


    // ==========================================
    // CLEAR QUESTION INPUT
    // ==========================================

    if (questionInput) {

        questionInput.value =
            "";

    }


    // ==========================================
    // CLEAR CHAT INPUT
    // ==========================================

    const chatInput =
        document.getElementById(
            "chatInput"
        );


    if (chatInput) {

        chatInput.value =
            "";

    }


    if (questionInput) {

        questionInput.focus();

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
// NEW CONVERSATION BUTTON
// =========================================================

if (newConversationButton) {

    newConversationButton.addEventListener(
        "click",
        clearAskHistory
    );

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

        return;

    }


    // ==========================================
    // ADD USER QUESTION TO RIGHT SIDEBAR
    // ==========================================

    addUserMessage(
        question
    );


    // ==========================================
    // CLEAR INPUT
    // ==========================================

    questionInput.value =
        "";


    // ==========================================
    // DISABLE BUTTON
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


        // ======================================
        // CALL RAG API
        // ======================================

        const result =
            await askQuestion(
                question
            );


        console.log(
            "RAG response:",
            result
        );


        // ======================================
        // REMOVE LOADING
        // ======================================

        removeLoadingMessage();


        // ======================================
        // MAIN ASK SECTION
        // ======================================

        addAskResult(
            question,
            result.answer,
            result.sources || []
        );


        // ======================================
        // RIGHT AI ASSISTANT SIDEBAR
        // ======================================

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


        // ======================================
        // SHOW ERROR IN MAIN ASK SECTION
        // ======================================

        addAskResult(
            question,
            error.message ||
            "Sorry, I couldn't process your question. Please try again.",
            []
        );


        // ======================================
        // SHOW ERROR IN SIDEBAR
        // ======================================

        addAssistantMessage(
            error.message ||
            "Sorry, I couldn't process your question. Please try again."
        );


    } finally {

        if (askButton) {

            askButton.disabled =
                false;

        }


        questionInput.focus();

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
// ASK ENTER KEY
// =========================================================

if (questionInput) {

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

}


// =========================================================
// RESTORE SESSION
// =========================================================

if (
    getToken()
) {

    showApp();

} else {

    showLogin();

}