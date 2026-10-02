```javascript
const state = {
    currentPage: "dashboard",

    ticket: null,
    position: null,
    wait: null,
    department: null,

    reference: null,

    concernType: "",
    sectionSubject: "",
    concernDetails: ""
};


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function navigateTo(page) {

    const validPages = [
        "dashboard",
        "concern",
        "queue",
        "kiosk"
    ];

    if (!validPages.includes(page)) {
        return;
    }

    state.currentPage = page;

    renderPage();
    updateNavigation();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function renderPage() {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(
        `page-${state.currentPage}`
    );

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    updatePageData();
}


function updateNavigation() {

    document.querySelectorAll("[data-page]").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === state.currentPage
        );

    });
}


/* =========================================================
   QUEUE SYSTEM
========================================================= */

function generateQueueNumber() {

    const number =
        Math.floor(Math.random() * 900) + 100;

    return `Q-${number}`;
}


function generateReferenceNumber() {

    const number =
        Math.floor(Math.random() * 900000) + 100000;

    return `QS-${number}`;
}


function generateQueuePosition() {

    return Math.floor(Math.random() * 8) + 2;
}


function calculateWaitTime(position) {

    return position * 5;
}


function createQueueTicket(department) {

    if (!state.ticket) {

        state.ticket = generateQueueNumber();

        state.position = generateQueuePosition();

        state.wait = calculateWaitTime(
            state.position
        );

        state.department =
            department || "Admission and Registration";

        state.reference =
            generateReferenceNumber();

        showToast(
            `Queue ticket ${state.ticket} created.`
        );
    }

    updateApplication();
}


/* =========================================================
   DASHBOARD CARD FUNCTIONS
========================================================= */

function openReportConcern() {

    navigateTo("concern");

    showToast(
        "Opening concern form..."
    );
}


function openActiveQueue() {

    navigateTo("queue");

    if (state.ticket) {

        showToast(
            `Your ticket is ${state.ticket}.`
        );

    } else {

        showToast(
            "You don't have an active queue ticket."
        );
    }
}


function openRouting() {

    navigateTo("concern");

    setTimeout(() => {
        highlightRoutingPanel();
    }, 100);

    showToast(
        "Opening routing guide..."
    );
}


/* =========================================================
   SECTION FULL
========================================================= */

function prepareSectionFullConcern() {

    navigateTo("concern");

    const concernType =
        document.getElementById("concern-type");

    const department =
        document.getElementById("department");

    const subject =
        document.getElementById("section-subject");

    if (concernType) {
        concernType.value = "Section Full";
    }

    if (department) {
        department.value =
            "Academic Department";
    }

    if (subject) {
        setTimeout(() => {
            subject.focus();
        }, 100);
    }

    setTimeout(() => {
        highlightRoutingPanel();
    }, 150);

    showToast(
        "Section Full concern selected."
    );
}


/* =========================================================
   CONCERN FORM
========================================================= */

function submitConcern() {

    const concernTypeElement =
        document.getElementById("concern-type");

    const departmentElement =
        document.getElementById("department");

    const subjectElement =
        document.getElementById("section-subject");

    const detailsElement =
        document.getElementById("concern-details");

    const error =
        document.getElementById("form-error");

    const success =
        document.getElementById("submission-success");


    if (!concernTypeElement ||
        !departmentElement ||
        !detailsElement) {

        console.error(
            "QueueSmart form elements are missing."
        );

        return;
    }


    const concernType =
        concernTypeElement.value;

    const department =
        departmentElement.value;

    const sectionSubject =
        subjectElement
            ? subjectElement.value.trim()
            : "";

    const concernDetails =
        detailsElement.value.trim();


    if (error) {
        error.style.display = "none";
    }

    if (success) {
        success.style.display = "none";
    }


    /* VALIDATION */

    if (!concernType) {

        showFormError(
            "Please select a concern type."
        );

        return;
    }


    if (!department) {

        showFormError(
            "Please select the appropriate department."
        );

        return;
    }


    if (!concernDetails) {

        showFormError(
            "Please provide details about your concern."
        );

        return;
    }


    /* SAVE FORM DATA */

    state.concernType =
        concernType;

    state.department =
        department;

    state.sectionSubject =
        sectionSubject;

    state.concernDetails =
        concernDetails;

    state.reference =
        generateReferenceNumber();


    /* CREATE QUEUE */

    state.ticket =
        generateQueueNumber();

    state.position =
        generateQueuePosition();

    state.wait =
        calculateWaitTime(
            state.position
        );


    /* SUCCESS MESSAGE */

    if (success) {

        success.innerHTML = `
            <strong>Concern submitted successfully.</strong><br>
            Reference Number:
            <strong>${state.reference}</strong><br>
            Queue Ticket:
            <strong>${state.ticket}</strong>
        `;

        success.style.display = "block";
    }


    updateApplication();

    showToast(
        "Concern submitted successfully."
    );


    /* GO TO QUEUE */

    setTimeout(() => {

        navigateTo("queue");

    }, 1200);
}


/* =========================================================
   QUEUE PAGE
========================================================= */

function updateQueuePage() {

    const empty =
        document.getElementById("queue-empty");

    const active =
        document.getElementById("queue-active");


    if (!empty || !active) {
        return;
    }


    if (!state.ticket) {

        empty.style.display = "block";
        active.style.display = "none";

        return;
    }


    empty.style.display = "none";
    active.style.display = "grid";


    const queueNumber =
        document.getElementById("queue-number");

    const queuePosition =
        document.getElementById("queue-position");

    const queueWait =
        document.getElementById("queue-wait");

    const queueDepartment =
        document.getElementById("queue-department");


    if (queueNumber) {
        queueNumber.textContent =
            state.ticket;
    }

    if (queuePosition) {
        queuePosition.textContent =
            state.position;
    }

    if (queueWait) {
        queueWait.textContent =
            `${state.wait} min`;
    }

    if (queueDepartment) {
        queueDepartment.textContent =
            state.department;
    }


    const progress =
        document.getElementById("queue-progress");


    if (progress) {

        const percentage =
            Math.max(
                10,
                Math.min(
                    90,
                    100 - state.position * 10
                )
            );

        progress.style.width =
            `${percentage}%`;
    }
}


/* =========================================================
   LEAVE QUEUE
========================================================= */

function leaveQueue() {

    if (!state.ticket) {
        return;
    }


    const oldTicket =
        state.ticket;


    state.ticket = null;
    state.position = null;
    state.wait = null;
    state.department = null;
    state.reference = null;


    updateApplication();


    showToast(
        `${oldTicket} has left the queue.`
    );
}


/* =========================================================
   KIOSK
========================================================= */

function kioskJoinQueue() {

    createQueueTicket(
        "Admission and Registration"
    );

    updateKioskTicket();

    showKioskMessage(
        "You have successfully joined the queue."
    );


    setTimeout(() => {

        navigateTo("queue");

    }, 900);
}


function kioskReportSectionFull() {

    prepareSectionFullConcern();

    showKioskMessage(
        "Opening the Section Full concern form..."
    );
}


function kioskCheckTicket() {

    if (!state.ticket) {

        showKioskMessage(
            "No active queue ticket was found. Please join the queue first."
        );

        showToast(
            "No active queue ticket."
        );

        return;
    }


    updateKioskTicket();


    showKioskMessage(
        `Ticket ${state.ticket} is currently number ${state.position} in the queue.`
    );
}


function kioskAskAssistance() {

    showKioskMessage(
        "Assistance request sent. Please wait for a staff member."
    );

    showToast(
        "Assistance requested."
    );
}


function updateKioskTicket() {

    const ticket =
        document.getElementById("kiosk-ticket");


    if (!ticket) {
        return;
    }


    if (!state.ticket) {

        ticket.style.display = "none";
        ticket.innerHTML = "";

        return;
    }


    ticket.innerHTML = `
        <strong>Active Ticket</strong><br>
        ${state.ticket}
        · Position ${state.position}
        · ${state.wait} min estimated wait
    `;

    ticket.style.display = "block";
}


function showKioskMessage(message) {

    const element =
        document.getElementById("kiosk-message");


    if (!element) {
        return;
    }


    element.textContent =
        message;

    element.style.display =
        "block";
}


/* =========================================================
   ROUTING
========================================================= */

function highlightRoutingPanel() {

    const panel =
        document.getElementById("routing-panel");


    if (!panel) {
        return;
    }


    panel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    panel.classList.add("highlight");


    setTimeout(() => {

        panel.classList.remove("highlight");

    }, 1500);
}


/* =========================================================
   DASHBOARD DATA
========================================================= */

function updateDashboard() {

    const ticket =
        document.getElementById("dashboard-ticket");

    const position =
        document.getElementById("dashboard-position");

    const wait =
        document.getElementById("dashboard-wait");


    if (ticket) {

        ticket.textContent =
            state.ticket || "—";
    }


    if (position) {

        position.textContent =
            state.position || "—";
    }


    if (wait) {

        wait.textContent =
            state.wait
                ? `${state.wait} min`
                : "—";
    }
}


/* =========================================================
   APPLICATION UPDATE
========================================================= */

function updateApplication() {

    updateDashboard();

    updateQueuePage();

    updateKioskTicket();
}


/* =========================================================
   PAGE-SPECIFIC UPDATE
========================================================= */

function updatePageData() {

    updateApplication();
}


/* =========================================================
   FORM ERROR
========================================================= */

function showFormError(message) {

    const error =
        document.getElementById("form-error");


    if (!error) {
        return;
    }


    error.textContent =
        message;

    error.style.display =
        "block";


    error.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================================================
   EVENT SYSTEM
========================================================= */

function initializeEvents() {


    /* SIDEBAR NAVIGATION */

    document.addEventListener(
        "click",
        event => {

            const navigation =
                event.target.closest("[data-page]");


            if (!navigation) {
                return;
            }


            navigateTo(
                navigation.dataset.page
            );
        }
    );


    /* DASHBOARD CARDS */

    const reportButton =
        document.getElementById("action-report");

    if (reportButton) {

        reportButton.addEventListener(
            "click",
            openReportConcern
        );
    }


    const queueButton =
        document.getElementById("action-queue");

    if (queueButton) {

        queueButton.addEventListener(
            "click",
            openActiveQueue
        );
    }


    const routingButton =
        document.getElementById("action-routing");

    if (routingButton) {

        routingButton.addEventListener(
            "click",
            openRouting
        );
    }


    /* CONCERN FORM */

    const concernForm =
        document.getElementById("concern-form");


    if (concernForm) {

        concernForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                submitConcern();
            }
        );
    }


    /* QUEUE */

    const leaveQueueButton =
        document.getElementById("leave-queue");


    if (leaveQueueButton) {

        leaveQueueButton.addEventListener(
            "click",
            leaveQueue
        );
    }


    /* KIOSK */

    const kioskJoinButton =
        document.getElementById("kiosk-join");


    if (kioskJoinButton) {

        kioskJoinButton.addEventListener(
            "click",
            kioskJoinQueue
        );
    }


    const kioskReportButton =
        document.getElementById("kiosk-report");


    if (kioskReportButton) {

        kioskReportButton.addEventListener(
            "click",
            kioskReportSectionFull
        );
    }


    const kioskCheckButton =
        document.getElementById("kiosk-check");


    if (kioskCheckButton) {

        kioskCheckButton.addEventListener(
            "click",
            kioskCheckTicket
        );
    }


    const kioskHelpButton =
        document.getElementById("kiosk-help");


    if (kioskHelpButton) {

        kioskHelpButton.addEventListener(
            "click",
            kioskAskAssistance
        );
    }
}


/* =========================================================
   START APPLICATION
========================================================= */

function initializeQueueSmart() {

    initializeEvents();

    updateApplication();

    navigateTo("dashboard");
}


document.addEventListener(
    "DOMContentLoaded",
    initializeQueueSmart
);
```
