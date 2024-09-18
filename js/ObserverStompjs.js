let lastMessageId = '';
let lastMessageBody = '';
let extensionStatusData = [];
let activeCallsData = [];


let MessageSender = (() => {
    let sendMessage = (action, callId, number, whisperNumber = null, transferNumber = null ) => {
        let userId = 'admin'; // Replace with dynamic user ID
        let topic = `/exchange/ExchangePBXAction/monitor.${userId}`;

        let dataFormat = {
            "function": "MONITOR",
            "action": action,
            "callid": callId,
            "number": number
        };

        if (action === 'WHISPER' && whisperNumber) {
            dataFormat.whisper_number = whisperNumber;
        }

        console.log(transferNumber)

        if (action === 'TRANSFER' && transferNumber) {
            dataFormat.transfer_number = transferNumber;
        }

        // Send message to server
        let message = JSON.stringify(dataFormat);
        console.log("Sending message:", message); // Log the message for debugging
        MessageClient.send(topic, message);
    };

    return { sendMessage };
})();

let MessageReceiver = (() => {

    let subscribe = (client) => {
        let userId = "*"; // Default value
        
        client.subscribe(`/exchange/ExchangePBXMonitor/monitor.${userId}`, (message) => {
            // if (lastMessageId === message.headers['message-id']) {
            //     return; // Skip if it's the same message
            // }
            
            let body = JSON.parse(message.body);
            let bodyString = JSON.stringify(body);

            console.log("Màn hình giám sát cuộc gọi",body.ActiveCalls)
            
            lastMessageId = message.headers['message-id'];
            lastMessageBody = bodyString;

            activeCallsData = body.ActiveCalls; // Store the active calls data
            extensionStatusData = body.ExtensionStatus; // Store the extension status data
            renderActiveCalls(body)
            renderWaitingCalls(body)
            updateDashboard(body)
            updateAgentStatusTable(extensionStatusData, activeCallsData);
            message.ack({ id: message.headers['message-id'] });
        },{ ack: 'client-individual' });
    };
    


    let updateAgentStatusTable = (extensionStatus, activeCalls) => {
        let tbody = document.getElementById('agentStatusTableBody');
        let existingRows = Array.from(tbody.getElementsByTagName('tr'));
    
        // Create a set to track the numbers we've processed
        let processedNumbers = new Set();
    
        // Loop through ExtensionStatus to update or add rows
        extensionStatus.forEach(status => {
            // Skip the row if CurrentProfile is null
            if (status.CurrentProfile === null) {
                return;
            }
    
            let existingRow = existingRows.find(row => row.querySelector('.value-wrapper').textContent === status.Number);
            let indicatorClass = '';
    
            let profileClass;
            switch(status.CurrentProfile){
                case 'Away':
                    profileClass = 'away';
                    break;
                case 'Lunch':
                    profileClass = 'lunch';
                    break;
                case 'Meeting':
                    profileClass = 'meeting';
                    break;
                case 'Callback':
                    profileClass = 'callback';
                    break;
                case 'Outbound':
                    profileClass = 'outbound';
                    break;
                case 'Logout':
                    profileClass = 'logout';
                    break;
                case 'Campaign':
                    profileClass = 'campaign';
                    break;
                default:
                    profileClass = '';
            }
    
            indicatorClass += `${profileClass} `;
    
            // Check if the agent has an active connection
            if (status.ActiveConnectionNumber === 1) {
                indicatorClass = 'blink routing';
    
                // Check if there is a call with status "Talking" and the caller or callee matches the extension number
                let call = activeCalls.find(call => 
                    (call.Caller.includes(status.Number) || call.Callee.includes(status.Number)) && call.Status === 'Talking'
                );
    
                if (call) {
                    indicatorClass = 'blink talking';
                }
            }
    
            if (existingRow) {
                // If the row exists, update its specific <td> elements
    
                let tdElements = existingRow.getElementsByTagName('td');
                
                // Update the status indicator (first column)
                let statusIndicator = tdElements[0].querySelector('.status-indicator');
                if (statusIndicator.className !== `status-indicator ${indicatorClass}`) {
                    statusIndicator.className = `status-indicator ${indicatorClass}`;
                }
    
                // Update the fullname (second column)
                let fullNameWrapper = tdElements[1].querySelector('.value-wrapper');
                if (fullNameWrapper.textContent !== status.fullname) {
                    fullNameWrapper.textContent = status.fullname;
                }
    
                // Update the current profile (third column)
                let profileWrapper = tdElements[2].querySelector('.value-wrapper');
                if (profileWrapper.textContent !== status.CurrentProfile) {
                    profileWrapper.textContent = status.CurrentProfile;
                }
    
                // Update the queues (fourth column)
                let queueWrapper = tdElements[3].querySelector('.value-wrapper');
                if (queueWrapper.textContent !== (status.Queues || '')) {
                    queueWrapper.textContent = status.Queues || '';
                }
    
            } else {
                console.log("Yeah!2!")

                // If the row doesn't exist, create a new one
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="td-content">
                            <span class="status-indicator ${indicatorClass}"></span>
                            <div class="value-wrapper">${status.Number}</div>
                        </div>
                    </td>
                    <td><div class="value-wrapper">${status.fullname}</div></td>
                    <td><div class="value-wrapper">${status.CurrentProfile}</div></td>
                    <td><div class="value-wrapper">${status.Queues || ''}</div></td>
                `;
                tbody.appendChild(tr); // Add the new row to the table
            }
    
            // Mark this number as processed
            processedNumbers.add(status.Number);
        });
    
        // Remove any rows that are no longer in the current ExtensionStatus
        existingRows.forEach(row => {
            let rowNumber = row.querySelector('.value-wrapper').textContent;
            if (!processedNumbers.has(rowNumber)) {
                tbody.removeChild(row); // Remove the row if the number is not in the processed set
            }
        });
    };
    return {
        subscribe,
        getExtensionStatusData: () => extensionStatusData,
        getActiveCallsData: () => activeCallsData
    };
})();

let MessageClient = (() => {
    let websocketUrl;
    // Determine the WebSocket URL based on the current hostname
    let hostname = window.location.hostname;
    if (hostname !== 'crm-lpbank-uat.dxws.io' && hostname !== '127.0.0.1') {
        websocketUrl = 'wss://uat-crmcskh.lpbank.com.vn:8050/ntf/ws';
    } else {
        websocketUrl = 'wss://crm-lpbank-uat.dxws.io/ntf/ws';
    }

    let client = Stomp.client(websocketUrl);
    client.heartbeat.outgoing = 10000;
    client.heartbeat.incoming = 0;
    let headers = {
        login: "admin",  // Correct header key  
        passcode: "Lvpb@1234",  // Correct header key
    };
    client.reconnect_delay = 1000;
    client.debug = (e) => {};

    let isReconnecting = false;

    let init = () => {
        client.connect(headers, (frame) => {
            console.log('Connected: ' + frame);
            isReconnecting = false;
            MessageReceiver.subscribe(client);
        }, (error) => {
            console.log('Connection error: ' + error);
            // scheduleReconnect();
        });
    };

    let scheduleReconnect = () => {
        if (isReconnecting) return;
        isReconnecting = true;
        console.log('Scheduling reconnect...');
        setTimeout(() => {
            console.log('Reconnecting...');
            init();
        }, client.reconnect_delay);
    };

    let send = (topic, message) => client.send(topic, {}, message);

    // Handle disconnection event
    client.onclose = () => {
        console.log('Connection lost. Scheduling immediate reconnect...');
        // scheduleReconnect(true);
    };

    return {
        init,
        send,
        getClient: () => client
    };
})();

// Initialize the connection
MessageClient.init();
