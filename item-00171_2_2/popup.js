document.addEventListener("DOMContentLoaded", function () {
  const requestList =
    document.getElementById("request-list");
  const noRequests = document.getElementById("no-requests");

  // Get API requests from background script
  chrome.runtime.sendMessage(
    { action: "getRequests" },
    function (response) {
      const apiRequests = response.apiRequests || [];
      renderRequestList(apiRequests);
    }
  );

  // Listen for new requests
  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      if (message.action === "newRequest") {
        addRequestToList(message.request);
      }
    }
  );

  // Render the list of API requests
  function renderRequestList(requests) {
    if (requests.length === 0) {
      noRequests.style.display = "block";
      requestList.style.display = "none";
      return;
    }

    noRequests.style.display = "none";
    requestList.style.display = "block";
    requestList.innerHTML = "";

    // Sort requests by timestamp (newest first)
    requests.sort((a, b) => b.id - a.id);

    requests.forEach((request) => {
      addRequestToList(request);
    });
  }

  // Add a request to the UI list
  function addRequestToList(request) {
    noRequests.style.display = "none";
    requestList.style.display = "block";

    const listItem = document.createElement("li");
    listItem.className = "request-item";
    listItem.dataset.id = request.id;

    // Format the timestamp for display
    const timestamp = new Date(
      request.timestamp.replace(/-/g, ":").replace("T", " ")
    );
    const formattedTime = timestamp.toLocaleString();

    listItem.innerHTML = `
        <div class="request-path">${request.requestPath}</div>
        <div class="request-time">${formattedTime}</div>
        <div class="request-url">${request.url}</div>
        <button class="download-btn">Download JSON</button>
      `;

    // Add download functionality
    const downloadBtn =
      listItem.querySelector(".download-btn");
    downloadBtn.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        action: "downloadRequest",
        requestId: request.id,
      });
    });

    // Add to list (at the beginning)
    if (requestList.firstChild) {
      requestList.insertBefore(
        listItem,
        requestList.firstChild
      );
    } else {
      requestList.appendChild(listItem);
    }
  }
});
