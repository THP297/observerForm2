// Helper function to create the action panel for active calls
function createActiveActionsPanel(row) {
    // Get the data attributes from the clicked row
    let status = $(row).attr('data-status');
    let callType = $(row).attr('data-type');
    let caller = $(row).attr('data-caller');
    let callee = $(row).attr('data-callee');

    // Generate the context menu options dynamically based on the call's status and type
    let contextMenuHtml = '';

    if (status === 'Talking') {
        contextMenuHtml = `
            <li data-action="BARGEIN">Tham gia cuộc gọi</li>
            <li data-action="LISTEN">Nghe</li>
            <li data-action="DROP">Ngắt kết nối</li>
        `;
        if (callType === 'Outbound') {
            contextMenuHtml += `<li data-action="WHISPER" data-whisper="${caller}">Thì thầm với ${caller}</li>`;
            contextMenuHtml += `<li data-action="TRANSFER" data-transfer="${callee}">Chuyển cuộc gọi đến ${callee}</li>`;
        } else if (callType === 'Inbound') {
            contextMenuHtml += `<li data-action="WHISPER" data-whisper="${callee}">Thì thầm với ${callee}</li>`;
            contextMenuHtml += `<li data-action="TRANSFER" data-transfer="${caller}">Chuyển cuộc gọi đến ${caller}</li>`;
        } else if (callType === 'Internal') {
            contextMenuHtml += `<li data-action="WHISPER" data-whisper="${caller}">Thì thầm với ${caller}</li>`;
            contextMenuHtml += `<li data-action="WHISPER" data-whisper="${callee}">Thì thầm với ${callee}</li>`;
            contextMenuHtml += `<li data-action="TRANSFER" data-transfer="${caller}">Chuyển cuộc gọi đến ${caller}</li>`;
            contextMenuHtml += `<li data-action="TRANSFER" data-transfer="${callee}">Chuyển cuộc gọi đến ${callee}</li>`;
        }
    } else if (status === 'Routing') {
        contextMenuHtml = `
            <li data-action="DROP">Ngắt kết nối</li>
            <li data-action="PICKUP">Nhận cuộc gọi</li>
        `;
    } else if (status === 'Transferring') {
        contextMenuHtml = `
            <li data-action="DROP">Ngắt kết nối</li>
            <li data-action="PICKUP">Nhận cuộc gọi</li>
        `;
    }

    // Return the panel HTML with the dynamically generated context menu options
    return `
        <div class="action-panel" style="position: absolute; top: 0; right: 100%; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000; padding: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;" id="context-menu-options">
                ${contextMenuHtml}
            </ul>
        </div>
    `;
}

  
// Helper function to create the action panel for waiting calls
function createWaitingActionsPanel(row) {
    // Get the data attributes from the clicked row
    let status = $(row).attr('data-status');

    // Generate the context menu options dynamically based on the call's status
    let contextMenuHtml = '';

    if (status === 'Routing' || status === 'Transferring') {
        contextMenuHtml = `
            <li data-action="DROP">Ngắt kết nối</li>
            <li data-action="PICKUP">Nhận cuộc gọi</li>
        `;
    }

    // Return the panel HTML with the dynamically generated context menu options
    return `
        <div class="action-panel" style="position: absolute; top: 0; right: 100%; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 1000; padding: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;" id="context-menu-options">
                ${contextMenuHtml}
            </ul>
        </div>
    `;
}


// Variable to keep track of the currently opened action panel
let currentOpenPanel = null;

// Function to toggle the action panel
function toggleActionPanel(panelHTML, button, row) {
    const $parentTd = $(button).parent(); // Get the parent <td> element
    const $existingPanel = $parentTd.find('.action-panel'); // Check if an action panel already exists

    // If there's a currently opened panel and it's not the same as the current one, close it
    if (currentOpenPanel && currentOpenPanel !== $parentTd) {
        currentOpenPanel.find('.action-panel').remove(); // Close the previous panel
        $(document).off('click.closePanel'); // Remove the document click listener
        $(window).off('blur.closePanel'); // Remove window blur listener for iframe
        currentOpenPanel = null; // Reset the current panel tracker
    }

    if ($existingPanel.length) {
        $existingPanel.remove(); // Remove the panel if it already exists (close it)
        $(document).off('click.closePanel'); // Remove the document click listener
        $(window).off('blur.closePanel'); // Remove window blur listener
    } else {
        $parentTd.append(panelHTML); // Append the panel as a child of the <td> element
        $parentTd.css("position", "relative"); // Ensure <td> is positioned relative for absolute positioning of the panel
        currentOpenPanel = $parentTd; // Track the current open panel

        // Add click event to the document to close the panel when clicking outside
        $(document).on('click.closePanel', function(event) {
            if (!$(event.target).closest('.action-panel').length && !$(event.target).closest(button).length) {
                $parentTd.find('.action-panel').remove(); // Remove the panel
                $(document).off('click.closePanel'); // Remove the document click listener
                $(window).off('blur.closePanel'); // Remove the window blur listener
                currentOpenPanel = null; // Reset the current panel tracker
            }
        });

        // Add blur event to window (handles if clicking outside iframe)
        $(window).on('blur.closePanel', function() {
            $parentTd.find('.action-panel').remove(); // Remove the panel
            $(document).off('click.closePanel'); // Remove the document click listener
            $(window).off('blur.closePanel'); // Remove the window blur listener
            currentOpenPanel = null; // Reset the current panel tracker
        });

        // Attach click event to the context menu options
        $('#context-menu-options').off('click', 'li').on('click', 'li', function () {
            let action = $(this).data('action');
            let callId = $(row).data('id'); // Get the data from the clicked row
            let number = $(row).data('number').split(' ')[0]; // Use the data-number from the row
            let whisperNumber = number;
            let transferNumber = $(this).data('transfer') || null;
            console.log(`Action: ${action}, Call ID: ${callId}, Number: ${number}, Whisper Number: ${whisperNumber}, Transfer Number: ${transferNumber}`);

            if (action === 'WHISPER') {
                MessageSender.sendMessage(action, callId, urlParamSup, whisperNumber);
                $('.action-panel').hide();
            } else if (action === 'TRANSFER') {
                showTransferModal(transferNumber, callId, number);
                $('.action-panel').hide();
            } else {
                MessageSender.sendMessage(action, callId, urlParamSup);
                $('.action-panel').hide();
            }
        });
    }
}
