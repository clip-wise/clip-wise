const style = document.createElement("style");
style.textContent = `
  #primary {
    transition: width 0.3s ease !important;
  }
  
  #secondary, #related, #comments, ytd-merch-shelf-renderer {
    display: none !important;
  }
`;
document.head.appendChild(style);

// So video resizes after hiding the unnecessary elements
window.dispatchEvent(new Event("resize"));

const theaterButton = document.querySelector(".ytp-size-button");
if (
  theaterButton &&
  theaterButton.getAttribute("title")?.toLowerCase()?.includes("theater")
) {
  (theaterButton as HTMLButtonElement).click();
}

const autoplayButton = document.querySelector(
  '.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]'
);
if (
  autoplayButton &&
  autoplayButton.getAttribute("title")?.toLowerCase()?.includes("on")
) {
  (autoplayButton as HTMLButtonElement).click();
}
