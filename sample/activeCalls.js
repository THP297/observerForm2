function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCustomerPhone() {
    return '039' + Math.floor(10000000 + Math.random() * 90000000);
}

function getRandomDate() {
    const now = new Date();
    const randomPast = new Date(now.getTime() - Math.floor(Math.random() * 10000000000));
    return randomPast.toISOString();
}

function createRandomCall(id) {
    const customerNames = ["John Doe", "Jane Smith", "Bob Brown", "Alice Johnson", "Charlie Green", "Dave White", "Emily Black"];
    const customerRanks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Titan"];
    const queues = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"];
    const statuses = ["Talking", "Transferring"];
    const types = ["Inbound", "Outbound"];
    const callerPrefix = "SBC (02473003575+0+";

    return {
        "Id": id,
        "Caller": `1000${id} ${callerPrefix}${getRandomCustomerPhone()}+03264018${id % 10})`,
        "Callee": `1999${id} LPB BOT`,
        "AgentName": `1999${id} LPB BOT`,
        "CustomerName": getRandomElement(customerNames),
        "CustomerRank": getRandomElement(customerRanks),
        "Queue": getRandomElement(queues),
        "Status": getRandomElement(statuses),
        "Type": getRandomElement(types),
        "LastChangeStatus": getRandomDate(),
        "EstablishedAt": getRandomDate(),
        "CustomerPhone": getRandomCustomerPhone()
    };
}

function generateRandomData(numberOfEntries) {
    let data = {
        "ActiveCalls": []
    };

    for (let i = 0; i < numberOfEntries; i++) {
        data.ActiveCalls.push(createRandomCall(i + 170));  // Start ID from 170
    }

    return data;
}


let dataCalls = {
    "ActiveCalls": [
      {
        "Id": 170,
        "Caller": "10001 SBC (02473003575+0+0392063337+032640183)",
        "Callee": "19994 LPB BOT",
        "AgentName": "19994 LPB BOT",
        "CustomerName": "3CX test",
        "CustomerRank": "Titan",
        "Queue": "alo",
        "Status": "Talking",
        "Type": "Inbound",
        "LastChangeStatus": "2024-09-12T03:26:41+00:00",
        "EstablishedAt": "2024-09-12T03:26:41+00:00",
        "CustomerPhone":"0937937214"
      },
      {
        "Id": 170,
        "Caller": "10001 SBC (02473003575+0+0392063337+032640183)",
        "Callee": "19994 LPB BOT",
        "AgentName": "19994 LPB BOT",
        "CustomerName": "3CX test",
        "CustomerRank": "Titan",
        "Queue": "asd",
        "Status": "Transferring",
        "Type": "Inbound",
        "LastChangeStatus": "2024-09-12T03:26:41+00:00",
        "EstablishedAt": "2024-09-12T03:26:41+00:00",
        "CustomerPhone":"0931212121"
      },
      {
        "Id": 170,
        "Caller": "10001 SBC (02473003575+0+0392063337+032640183)",
        "Callee": "19994 LPB BOT",
        "AgentName": "19994 LPB BOT",
        "CustomerName": "3CX test",
        "CustomerRank": "Silver",
        "Queue": "hehe",
        "Status": "Routing",
        "Type": "Inbound",
        "LastChangeStatus": "2024-09-12T03:26:41+00:00",
        "EstablishedAt": "2024-09-12T03:26:41+00:00",
        "CustomerPhone":"0931102121"
      }
    ],
    "ExtensionStatus": [
      {
        "IsRegistered": true,
        "Number": "10000",
        "fullname": "3cx admin",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10023",
        "fullname": "Pham Alex",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10002",
        "fullname": " Zen",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "10022",
        "fullname": "hoang raymond",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "Emergency, Lienviet24h, Card, VIP",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10005",
        "fullname": " Anna",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "19998",
        "fullname": "BOT IVR",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "19999",
        "fullname": "Routing IVR",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "10004",
        "fullname": " leonard",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "VIP",
        "CurrentProfile": "Available",
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10006",
        "fullname": "hoang Nam",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "20023",
        "fullname": "Pham Alex",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "00000",
        "fullname": " Tinh",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "19997",
        "fullname": "Bac A IVR",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "19996",
        "fullname": " Dave's test extension",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "19995",
        "fullname": " Waiting Queue",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "10003",
        "fullname": "Nguyen Patrick",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "Emergency, Lienviet24h, Card, Account, Loan, VIP",
        "CurrentProfile": "Available",
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10009",
        "fullname": " Owen",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "AWS",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10010",
        "fullname": "Le Khoa",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "AWS",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "10011",
        "fullname": "Nguyen Roger",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "VIP",
        "CurrentProfile": "Campaign",
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10012",
        "fullname": " Lionel",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "19994",
        "fullname": "BOT LPB",
        "ExternalPartyNumbers": [
          "02473003575+0+0392063337+032640183"
        ],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 1
      },
      {
        "IsRegistered": true,
        "Number": "10013",
        "fullname": "Ngo Laura",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": true,
        "Number": "10014",
        "fullname": "Tran Dev",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "",
        "CurrentProfile": null,
        "ActiveConnectionNumber": 0
      },
      {
        "IsRegistered": false,
        "Number": "10015",
        "fullname": "Nguyen Ryan",
        "ExternalPartyNumbers": [],
        "QueueStatus": 1,
        "Queues": "VIP",
        "CurrentProfile": "Available",
        "ActiveConnectionNumber": 0
      }
    ]
  }
