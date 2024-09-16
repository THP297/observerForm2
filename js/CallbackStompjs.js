let CallbackMessageReceiver = (() => {

    let subscribe = (client) => {
        let userId = '*'; // Default value
        
        client.subscribe(`/exchange/Reload_Callback/reloadcallback.all`, (message) => {
            let callbackData = JSON.parse(message.body);
            // Update "Cuộc gọi nhỡ" (Missed Calls)
            updateMissedCalls(callbackData);
        }, { ack: 'client-individual' });
    };

    // Function to update "Cuộc gọi nhỡ" and top IVR based on missed call data
    let updateMissedCalls = (missedCallsData) => {
        // 1. Sum of "soLanGoiNho" (Missed Call Attempts) across all entries
        const totalMissedCallAttempts = missedCallsData.reduce((total, call) => {
            return total + parseInt(call.soLanGoiNho, 10); // Summing the missed calls
        }, 0);

        // 2. Update the total Missed Calls count in the UI
        document.getElementById('missed-count').innerText = totalMissedCallAttempts;

        // 3. Count the occurrences of 'nhanhDichVu' (Service Branch)
        const serviceBranchCount = {};
        missedCallsData.forEach(call => {
            const serviceBranch = call.nhanhDichVu;
            if (serviceBranch) {
                serviceBranchCount[serviceBranch] = (serviceBranchCount[serviceBranch] || 0) + 1;
            }
        });

        // 4. Get the top 3 most frequent 'nhanhDichVu'
        const topIVR = Object.entries(serviceBranchCount)
            .sort((a, b) => b[1] - a[1]) // Sort by frequency
            .slice(0, 3) // Get top 3
            .map(item => item[0]); // Extract only the service branch names

        // 5. Update the UI with the top 3 most frequent IVRs for missed calls
        document.getElementById('missed-ivr').innerText = topIVR.join(', ');
    };

    return {
        subscribe,
    };
})();

let CallbackMessageClient = (() => {
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
            CallbackMessageReceiver.subscribe(client);
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
CallbackMessageClient.init();
