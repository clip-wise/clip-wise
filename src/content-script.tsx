import React from 'react';
import ReactDOM from 'react-dom/client';
import Sidebar from './components/Sidebar/Sidebar';

let sidebarContainer: HTMLDivElement | null = null;
let root: ReactDOM.Root | null = null;

const injectSidebar = () => {
  if (!sidebarContainer) {
    sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'youtube-sidebar-extension';
    document.body.appendChild(sidebarContainer);
    root = ReactDOM.createRoot(sidebarContainer);
    root.render(
      <React.StrictMode>
        <Sidebar />
      </React.StrictMode>
    );
  }
};

const removeSidebar = () => {
  if (sidebarContainer && root) {
    const video = document.querySelector<HTMLElement>('#primary');
    if (video) {
      video.style.width = '100%';
    }

    root.unmount();
    sidebarContainer.remove();
    sidebarContainer = null;
    root = null;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_SIDEBAR') {
    if (!sidebarContainer) {
      injectSidebar();
    } else {
      removeSidebar();
    }
    sendResponse({ success: true });
  }
});

const style = document.createElement('style');
style.textContent = `
  #primary {
    transition: width 0.3s ease !important;
  }
  
  #secondary {
    display: none !important;
  }
`;
document.head.appendChild(style);
