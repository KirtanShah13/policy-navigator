import { app, BrowserWindow, Menu, screen } from "electron";
import path from "path";

let win: BrowserWindow | null = null;

/**
 * Right-click context menu
 */
function createContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: "Open Policy Navigator",
      click: () => {
        win?.show();
      }
    },
    { type: "separator" },
    {
      label: "Hide Orb",
      click: () => {
        win?.hide();
      }
    },
    {
      label: "Reset Position",
      click: () => {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        win?.setPosition(width - 100, height - 120);
        win?.show();
      }
    },
    { type: "separator" },
    {
      label: "Exit",
      click: () => {
        app.quit();
      }
    }
  ]);
}

/**
 * Snap orb to screen edges
 */
function snapToEdge() {
  if (!win) return;

  const bounds = win.getBounds();
  const screenBounds = screen.getPrimaryDisplay().workArea;
  const snapMargin = 20;

  let x = bounds.x;
  let y = bounds.y;

  if (x < snapMargin) x = 0;
  if (y < snapMargin) y = 0;

  if (x + bounds.width > screenBounds.width - snapMargin) {
    x = screenBounds.width - bounds.width;
  }

  if (y + bounds.height > screenBounds.height - snapMargin) {
    y = screenBounds.height - bounds.height;
  }

  win.setPosition(x, y);
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 72,
    height: 72,
    x: width - 100,
    y: height - 120,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile(
    path.join(__dirname, "..", "..", "ui", "orb.html")
  );

  const contextMenu = createContextMenu();

  win.webContents.on("context-menu", () => {
    contextMenu.popup();
  });

  win.on("move", () => {
    clearTimeout((win as any)._snapTimer);
    (win as any)._snapTimer = setTimeout(snapToEdge, 300);
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
});
