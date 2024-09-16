let showTransferModal = (transferNumber, callId, number) => {
    let modal = document.getElementById("transferModal");
    let span = document.getElementsByClassName("close")[0];
    let transferTitle = document.getElementById("transferTitle");
    let transferInput = document.getElementById("transferNumberInput");
    let filteredExtensions = document.getElementById("filteredExtensions");

    transferTitle.innerText = `Transfer ${transferNumber}`;
    transferInput.value = '';
    filteredExtensions.innerHTML = '';
    modal.style.display = "block";

    transferInput.oninput = () => {
        let query = transferInput.value.toLowerCase();
        filteredExtensions.innerHTML = '';
        if (query) {
            let extensions = filterExtensions(query);
            extensions.forEach(ext => {
                let div = document.createElement('div');
                let statusClass = getStatusClass(ext);
                div.innerHTML = `<span class="status-dot ${statusClass}"></span>${ext.Number} - ${ext.fullname}`;
                div.onclick = () => {
                    console.log(number)
                    MessageSender.sendMessage('TRANSFER', callId, ext.Number, null, transferNumber.split(' ')[0]);
                    modal.style.display = "none";
                };
                filteredExtensions.appendChild(div);
            });
        }
    };

    span.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};

let getStatusClass = (extension) => {
    if (extension.CurrentProfile === 'Away') {
        return 'away';
    }
    let activeCalls = MessageReceiver.getActiveCallsData();
    let isInCall = activeCalls.some(call => call.Caller.split(" ")[0] === extension.Number && call.Status === 'Talking');
    return isInCall ? 'in-call' : 'available';
};

let filterExtensions = (query) => {
    let extensionsData = MessageReceiver.getExtensionStatusData();
    return extensionsData.filter(ext => ext.Number.includes(query) || ext.fullname.toLowerCase().includes(query));
};
