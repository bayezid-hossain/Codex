const monitoredOrigin =
  "https://67f69c6542d6c71cca62b961.mockapi.io/";
let capturedRequests = [];

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.url.startsWith(monitoredOrigin)) {
      fetch(details.url)
        .then((response) => {
          if (!response.ok) {
            console.warn(
              `LeadEcho: Error fetching response for ${details.url}`,
              response
            );
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            const requestInfo = {
              requestId: details.requestId,
              url: details.url,
              method: details.method,
              timestamp: details.timeStamp,
              response: data,
            };
            capturedRequests.push(requestInfo);
            chrome.runtime.sendMessage({
              action: "newRequest",
              request: requestInfo,
            });
          }
        })
        .catch((error) => {
          console.error(
            `LeadEcho: Error processing response for ${details.url}`,
            error
          );
        });
    }
  },
  { urls: [`${monitoredOrigin}*`] }
);

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "getRequests") {
      sendResponse(capturedRequests);
    } else if (request.action === "downloadRequest") {
      const foundRequest = capturedRequests.find(
        (req) => req.requestId === request.requestId
      );
      if (foundRequest) {
        const filename = `${foundRequest.url
          .split("/")
          .pop()}_${new Date(foundRequest.timestamp)
          .toISOString()
          .replace(/[:.]/g, "-")}.json`;
        const jsonString = JSON.stringify(
          foundRequest.response,
          null,
          2
        );
        const blob = new Blob([jsonString], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
          url: url,
          filename: filename,
          saveAs: true,
        });

        URL.revokeObjectURL(url);
      }
    } else if (request.action === "clearRequests") {
      capturedRequests = [];
      chrome.runtime.sendMessage({
        action: "requestsCleared",
      });
    }
  }
);
