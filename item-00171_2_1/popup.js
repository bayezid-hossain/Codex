document.addEventListener("DOMContentLoaded", () => {
  const requestList =
    document.getElementById("request-list");
  const clearRequestsButton = document.getElementById(
    "clear-requests"
  );

  function renderRequests(requests) {
    requestList.innerHTML = "";
    if (requests.length === 0) {
      const listItem = document.createElement("li");
      listItem.textContent =
        "No API requests captured yet.";
      requestList.appendChild(listItem);
      return;
    }

    requests.forEach((request) => {
      const listItem = document.createElement("li");
      listItem.classList.add("request-item");

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("request-details");

      const urlSpan = document.createElement("span");
      urlSpan.classList.add("request-url");
      urlSpan.textContent = `${request.method} ${request.url}`;
      detailsDiv.appendChild(urlSpan);

      const timestampSpan = document.createElement("span");
      timestampSpan.classList.add("request-timestamp");
      const date = new Date(request.timestamp);
      timestampSpan.textContent = ` @ ${date.toLocaleTimeString()} (${date.toLocaleDateString()})`;
      detailsDiv.appendChild(timestampSpan);

      listItem.appendChild(detailsDiv);

      const downloadButton =
        document.createElement("button");
      downloadButton.classList.add(
        "mdc-button",
        "mdc-button--raised"
      );
      const ripple = document.createElement("span");
      ripple.classList.add("mdc-button__ripple");
      const label = document.createElement("span");
      label.classList.add("mdc-button__label");
      label.textContent = "Download JSON";
      downloadButton.appendChild(ripple);
      downloadButton.appendChild(label);

      downloadButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          action: "downloadRequest",
          requestId: request.requestId,
        });
      });

      listItem.appendChild(downloadButton);
      requestList.appendChild(listItem);
    });

    // Initialize Material Design Components for newly added buttons
    const buttons =
      requestList.querySelectorAll(".mdc-button");
    buttons.forEach((button) => {
      mdc.ripple.MDCRipple.attachTo(button);
    });
  }

  chrome.runtime.sendMessage(
    { action: "getRequests" },
    renderRequests
  );

  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (request.action === "newRequest") {
        chrome.runtime.sendMessage(
          { action: "getRequests" },
          renderRequests
        );
      } else if (request.action === "requestsCleared") {
        chrome.runtime.sendMessage(
          { action: "getRequests" },
          renderRequests
        );
      }
    }
  );

  clearRequestsButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "clearRequests" });
  });

  // Initialize Material Design Components for the clear button
  const clearButtonRipple = new mdc.ripple.MDCRipple(
    clearRequestsButton
  );
});
