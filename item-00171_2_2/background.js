// Store API requests
let apiRequests = [];

// Listen for API requests from Ocean.io
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (
      details.url.includes(
        "https://67f69c6542d6c71cca62b961.mockapi.io/api/"
      ) &&
      details.method === "GET"
    ) {
      // Create a timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

      // Extract the request path from the URL
      const urlObj = new URL(details.url);
      const requestPath = urlObj.pathname.replace(
        "/api/",
        ""
      );

      // Store request info
      const requestInfo = {
        id: Date.now(),
        url: details.url,
        method: details.method,
        timestamp: timestamp,
        requestPath: requestPath,
        filename: `${requestPath}_${timestamp}.json`,
      };

      // Fetch the response content
      fetch(details.url)
        .then((response) => response.json())
        .then((data) => {
          requestInfo.response = data;
          apiRequests.push(requestInfo);

          // Notify popup if open
          chrome.runtime.sendMessage({
            action: "newRequest",
            request: requestInfo,
          });

          // Store in local storage (keep last 50)
          if (apiRequests.length > 50) apiRequests.shift();
          chrome.storage.local.set({
            apiRequests: apiRequests,
          });
        })
        .catch((error) =>
          console.error(
            "Error fetching API response:",
            error
          )
        );
    }
    return { cancel: false };
  },
  {
    urls: ["*://67f69c6542d6c71cca62b961.mockapi.io/api/*"],
  },
  ["requestBody"]
);

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "getRequests") {
      sendResponse({ apiRequests: apiRequests });
    } else if (message.action === "downloadRequest") {
      const requestId = message.requestId;
      const request = apiRequests.find(
        (req) => req.id === requestId
      );

      if (request) {
        const jsonContent = JSON.stringify(
          request.response,
          null,
          2
        );
        const blob = new Blob([jsonContent], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
          url: url,
          filename: request.filename,
          saveAs: true,
        });
      }
    }
    return true;
  }
);

// Load saved requests when extension starts
chrome.storage.local.get("apiRequests", (data) => {
  if (data.apiRequests) {
    apiRequests = data.apiRequests;
  }
});
