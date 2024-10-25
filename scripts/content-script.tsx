import React from "react";
import ReactDOM from "react-dom/client";

function initial() {
  // Create a new div element and append it to the document body
  const rootDiv = document.createElement("div");
  rootDiv.id = "extension-root";
  document.body.appendChild(rootDiv);

  // Create a root and render the <Extension /> component
  const root = ReactDOM.createRoot(rootDiv);
  root.render(<div>ClipWise</div>);
}

initial();
