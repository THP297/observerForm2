// Function to update the UI with counts and top IVR data
function updateDashboard(data) {
    const activeCalls = data.ActiveCalls;
    
    // Calculate "Cuộc gọi đang diễn ra" (Ongoing Calls)
    const ongoingCalls = activeCalls.filter(call => call.Status === "Talking");
    document.getElementById('ongoing-count').innerText = ongoingCalls.length;

    // Calculate "Cuộc gọi chờ" (Queued Calls)
    const queuedCalls = activeCalls.filter(call => call.Status === "Routing" || call.Status === "Transferring");
    document.getElementById('queued-count').innerText = queuedCalls.length;

    // Calculate "KH Pri chờ kết nối" (Priority Customers Waiting) - Titan customers with status "Routing" or "Transferring"
    const priorityCalls = activeCalls.filter(call => call.CustomerRank === "Titan" && (call.Status === "Routing" || call.Status === "Transferring"));
    document.getElementById('priority-count').innerText = priorityCalls.length;

    // Get the top 3 most frequent Queues for Ongoing Calls (Talking)
    const ongoingQueueCount = {};
    ongoingCalls.forEach(call => {
        if (call.Queue) {
            ongoingQueueCount[call.Queue] = (ongoingQueueCount[call.Queue] || 0) + 1;
        }
    });
    const topOngoingIVR = Object.entries(ongoingQueueCount)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 3) // Get top 3
        .map(item => item[0]); // Extract only the queue names
    document.getElementById('ongoing-ivr').innerText = topOngoingIVR.join(', ');

    // Get the top 3 most frequent Queues for Queued Calls (Routing/Transferring)
    const queuedQueueCount = {};
    queuedCalls.forEach(call => {
        if (call.Queue) {
            queuedQueueCount[call.Queue] = (queuedQueueCount[call.Queue] || 0) + 1;
        }
    });
    const topQueuedIVR = Object.entries(queuedQueueCount)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 3) // Get top 3
        .map(item => item[0]); // Extract only the queue names
    document.getElementById('queued-ivr').innerText = topQueuedIVR.join(', ');

    // Get the top 3 most frequent Queues for Priority (Titan) customers waiting
    const priorityQueueCount = {};
    priorityCalls.forEach(call => {
        if (call.Queue) {
            priorityQueueCount[call.Queue] = (priorityQueueCount[call.Queue] || 0) + 1;
        }
    });
    const topPriorityIVR = Object.entries(priorityQueueCount)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 3) // Get top 3
        .map(item => item[0]); // Extract only the queue names
    document.getElementById('priority-ivr').innerText = topPriorityIVR.join(', ');
}
