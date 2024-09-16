// Helper function to format time in "MM:SS"
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Function to sort the "Cuộc gọi đang diễn ra" by status "Talking"
function sortActiveCalls(calls) {
    const activeCalls = applyActiveFilters(calls).filter(call => call.Status === "Talking");
    return activeCalls.sort((a, b) => {
        if (a.CustomerRank === "Titan" && b.CustomerRank !== "Titan") return -1;
        if (a.CustomerRank !== "Titan" && b.CustomerRank === "Titan") return 1;
        return (new Date(a.EstablishedAt) - new Date(b.EstablishedAt)); // Sort by talking time (ascending)
    });
}

// Function to sort the "Cuộc gọi chờ" by status "Transferring" or "Routing"
function sortWaitingCalls(calls) {
    const waitingCalls = applyWaitingFilters(calls).filter(call => call.Status === "Transferring" || call.Status === "Routing");
    return waitingCalls.sort((a, b) => {
        if (a.CustomerRank === "Titan" && b.CustomerRank !== "Titan") return -1;
        if (a.CustomerRank !== "Titan" && b.CustomerRank === "Titan") return 1;
        return (new Date(a.LastChangeStatus) - new Date(b.LastChangeStatus)); // Sort by ringing time (ascending)
    });
}

// Function to update row data for active calls (Talking) without affecting the action button
function updateActiveRowData(call) {
    const existingRow = $(`#activeCallsTable tr[data-phone="${call.CustomerPhone}"]`);
    if (existingRow.length) {
        const cells = existingRow.find("td");
        cells.eq(0).text(new Date(call.EstablishedAt).toLocaleString()); // Update time
        cells.eq(2).text(call.CustomerName); // Update customer name
        cells.eq(3).text(call.CustomerRank); // Update customer rank
        cells.eq(4).text(call.AgentName); // Update agent
        const talkTime = (new Date() - new Date(call.EstablishedAt)) / 1000;
        cells.eq(5).text(formatTime(Math.floor(talkTime))); // Update talk time
        cells.eq(6).text(call.Queue); // Update IVR
    } else {
        // If row doesn't exist, render it as a new row
        appendActiveRow(call);
    }
}

// Function to update row data for waiting calls (Transferring) without affecting the action button
function updateWaitingRowData(call) {
    const existingRow = $(`#waitingCallsTable tr[data-phone="${call.CustomerPhone}"]`);
    if (existingRow.length) {
        const cells = existingRow.find("td");
        cells.eq(0).text(new Date(call.LastChangeStatus).toLocaleString()); // Update time
        cells.eq(2).text(call.CustomerName); // Update customer name
        cells.eq(3).text(call.CustomerRank); // Update customer rank
        cells.eq(4).text(call.AgentName); // Update agent
        const ringTime = (new Date() - new Date(call.LastChangeStatus)) / 1000;
        cells.eq(5).text(formatTime(Math.floor(ringTime))); // Update ring time
        cells.eq(6).text(call.Queue); // Update IVR
    } else {
        // If row doesn't exist, render it as a new row
        appendWaitingRow(call);
    }
}

// Function to append a new row for active calls (Talking)
function appendActiveRow(call) {
    const tableBody = $("#activeCallsBody");
    const talkTime = (new Date() - new Date(call.EstablishedAt)) / 1000;
    const formattedTalkTime = formatTime(Math.floor(talkTime));

    const row = `
        <tr class="table-row" 
            data-phone="${call.CustomerPhone}" 
            data-id="${call.Id}" 
            data-status="${call.Status}" 
            data-number="${call.CustomerPhone}" 
            data-type="${call.Type}" 
            data-caller="${call.Caller}" 
            data-callee="${call.Callee}">
            <td>${new Date(call.EstablishedAt).toLocaleString()}</td>   <!-- Thời gian -->
            <td>${call.CustomerPhone}</td>                                 <!-- SĐT -->
            <td>${call.CustomerName}</td>                                <!-- KH -->
            <td>${call.CustomerRank}</td>                                <!-- Hạng KH -->
            <td>${call.AgentName}</td>                                   <!-- Agent -->
            <td>${formattedTalkTime}</td>                                <!-- Talk Times formatted as MM:SS -->
            <td>${call.Queue}</td>                                       <!-- Nhánh L3 IVR -->
            <td>
                <button class="btn btn-link action-button"><i class="fa-solid fa-cog"></i></button> <!-- Action button with Font Awesome icon -->
            </td>
        </tr>
    `;
    tableBody.append(row);

    // Add event listener for the action button
    const button = $(`tr[data-phone="${call.CustomerPhone}"] .action-button`);
    button.on("click", function () {
        const row = $(this).closest('.table-row');
        toggleActionPanel(createActiveActionsPanel(row), this, row);
    });
}

// Function to append a new row for waiting calls (Transferring)
function appendWaitingRow(call) {
    const tableBody = $("#waitingCallsBody");
    const ringTime = (new Date() - new Date(call.LastChangeStatus)) / 1000;
    const formattedRingTime = formatTime(Math.floor(ringTime));

    const row = `
        <tr class="table-row" 
            data-phone="${call.CustomerPhone}" 
            data-id="${call.Id}" 
            data-status="${call.Status}" 
            data-number="${call.CustomerPhone}" 
            data-type="${call.Type}" 
            data-caller="${call.Caller}" 
            data-callee="${call.Callee}">
            <td>${new Date(call.LastChangeStatus).toLocaleString()}</td>   <!-- Thời gian -->
            <td>${call.CustomerPhone}</td>                                   <!-- SĐT -->
            <td>${call.CustomerName}</td>                                  <!-- KH -->
            <td>${call.CustomerRank}</td>                                  <!-- Hạng KH -->
            <td>${call.AgentName}</td>                                     <!-- Agent -->
            <td>${formattedRingTime}</td>                                  <!-- Ring Times formatted as MM:SS -->
            <td>${call.Queue}</td>                                         <!-- Nhánh L3 IVR -->
            <td>
                <button class="btn btn-link action-button"><i class="fa-solid fa-cog"></i></button> <!-- Action button with Font Awesome icon -->
            </td>
        </tr>
    `;
    tableBody.append(row);

    // Add event listener for the action button
    const button = $(`tr[data-phone="${call.CustomerPhone}"] .action-button`);
    button.on("click", function () {
        const row = $(this).closest('.table-row');
        toggleActionPanel(createWaitingActionsPanel(row), this, row);
    });
}

// Function to remove rows that no longer exist in the current data (for active calls)
function removeInactiveActiveRows(currentCalls) {
    $("#activeCallsTable tr[data-phone]").each(function () {
        const customerPhone = $(this).attr('data-phone');
        const callId = parseInt($(this).attr('data-id'), 10);

        // Remove the row only if no matching entry exists in the currentCalls data
        const matchingCall = currentCalls.find(call => call.CustomerPhone === customerPhone && call.Id === callId && call.Status === "Talking");

        if (!matchingCall) {
            $(this).remove(); // Remove the row if no matching call is found
        }
    });
}

// Function to remove rows that no longer exist in the current data (for waiting calls)
function removeInactiveWaitingRows(currentCalls) {
    $("#waitingCallsTable tr[data-phone]").each(function () {
        const customerPhone = $(this).attr('data-phone');
        const callId = parseInt($(this).attr('data-id'), 10);

        // Remove the row only if no matching entry exists in the currentCalls data
        const matchingCall = currentCalls.find(call => call.CustomerPhone === customerPhone && call.Id === callId && (call.Status === "Transferring" || call.Status === "Routing"));

        if (!matchingCall) {
            $(this).remove(); // Remove the row if no matching call is found
        }
    });
}

// Render active calls (Cuộc gọi đang diễn ra)
function renderActiveCalls(data) {
    const activeCalls = sortActiveCalls(data.ActiveCalls); // Apply filters and sorting

    // Update each active call row
    activeCalls.forEach(call => updateActiveRowData(call));

    // Remove rows that are no longer in the newest data
    removeInactiveActiveRows(activeCalls);
}

// Render waiting calls (Cuộc gọi chờ)
function renderWaitingCalls(data) {
    const waitingCalls = sortWaitingCalls(data.ActiveCalls); // Apply filters and sorting

    // Update each waiting call row
    waitingCalls.forEach(call => updateWaitingRowData(call));

    // Remove rows that are no longer in the newest data
    removeInactiveWaitingRows(waitingCalls);
}

// Event listeners to trigger re-rendering when filters change
$("#directionFilter, #rankFilter, #statusFilter").on("change", renderActiveCalls);
$("#agentFilter, #phoneFilter, #ivrFilter").on("input", renderActiveCalls);

$("#waitingDirectionFilter, #waitingRankFilter, #waitingStatusFilter").on("change", renderWaitingCalls);
$("#waitingAgentFilter, #waitingPhoneFilter, #waitingIvrFilter").on("input", renderWaitingCalls);


// setInterval(() => {
//             renderActiveCalls(generateRandomData(50))
//             renderWaitingCalls(generateRandomData(50))
// }, 1000);