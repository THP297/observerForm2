// Function to apply filters to active calls
function applyActiveFilters(calls) {
    const directionFilter = $("#directionFilter").val();
    const rankFilter = $("#rankFilter").val();
    // const statusFilter = $("#statusFilter").val();
    const agentFilter = $("#agentFilter").val().toLowerCase();
    const phoneFilter = $("#phoneFilter").val().toLowerCase();
    const ivrFilter = $("#ivrFilter").val().toLowerCase();

    return calls.filter(call => {
        return (!directionFilter || call.Type === directionFilter) &&
               (!rankFilter || call.CustomerRank === rankFilter) &&
            //    (!statusFilter || call.Status === statusFilter) &&
               (!agentFilter || call.AgentName.toLowerCase().includes(agentFilter)) &&
               (!phoneFilter || call.CustomerPhone.toLowerCase().includes(phoneFilter)) &&
               (!ivrFilter || call.Queue.toLowerCase().includes(ivrFilter));
    });
}

// Function to apply filters to waiting calls
function applyWaitingFilters(calls) {
    const directionFilter = $("#waitingDirectionFilter").val() || "";  // Default to empty string if undefined
    const rankFilter = $("#waitingRankFilter").val() || "";            // Default to empty string if undefined
    const statusFilter = $("#waitingStatusFilter").val() || "";        // Default to empty string if undefined
    const agentFilter = $("#waitingAgentFilter").val() ? $("#waitingAgentFilter").val().toLowerCase() : "";  // Check and apply lowercase
    const phoneFilter = $("#waitingPhoneFilter").val() ? $("#waitingPhoneFilter").val().toLowerCase() : "";  // Check and apply lowercase
    const ivrFilter = $("#waitingIvrFilter").val() ? $("#waitingIvrFilter").val().toLowerCase() : "";        // Check and apply lowercase

    // Apply filters to the calls array
    return calls.filter(call => {
        return (!directionFilter || call.Type === directionFilter) &&
               (!rankFilter || call.CustomerRank === rankFilter) &&
               (!statusFilter || call.Status === statusFilter) &&
               (!agentFilter || call.AgentName.toLowerCase().includes(agentFilter)) &&
               (!phoneFilter || call.CustomerPhone.toLowerCase().includes(phoneFilter)) &&
               (!ivrFilter || call.Queue.toLowerCase().includes(ivrFilter));
    });
}

$(document).ready(function(){
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Toggle filters for ongoing calls
    $('#toggleFiltersBtn1').on('click', function() {
        const filters1 = $('#filters1');
        const btn1 = $(this);
        filters1.toggle(); // Show or hide filters
        if (filters1.is(':visible')) {
            btn1.attr('title', 'Ẩn bộ lọc').tooltip('hide').tooltip('show');
        } else {
            btn1.attr('title', 'Hiện bộ loc').tooltip('hide').tooltip('show');
        }
    });

    // Toggle filters for waiting calls
    $('#toggleFiltersBtn2').on('click', function() {
        const filters2 = $('#filters2');
        const btn2 = $(this);
        filters2.toggle(); // Show or hide filters
        if (filters2.is(':visible')) {
            btn2.attr('title', 'Ẩn bộ lọc').tooltip('hide').tooltip('show');
        } else {
            btn2.attr('title', 'Hiện bộ loc').tooltip('hide').tooltip('show');
        }
    });
});