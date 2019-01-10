const { app, Menu } = require("electron");

const PLATFORM = process.platform;
const SEPARATOR = platform => ({ type: "separator", showOn: platform });
const passThrough = value => value;

const createTemplate = i18nFunc => [
  {
    label: app.getName(),
    showOn: ["darwin"],
    submenu: [
      { role: "about" },
      SEPARATOR(),
      { role: "services" },
      SEPARATOR(),
      { role: "hide" },
      { role: "hideothers" },
      { role: "unhide" },
      SEPARATOR()
    ]
  },
  {
    label: i18nFunc("File"),
    hideOn: ["darwin"],
    submenu: [{ role: "about" }, { role: "quit" }]
  },
  {
    label: i18nFunc("Edit"),
    submenu: [
      { role: "undo" },
      { role: "redo" },
      SEPARATOR(),
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" },
      SEPARATOR("darwin"),
      {
        label: i18nFunc("Speech"),
        showOn: ["darwin"],
        submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
      }
    ]
  },
  {
    label: i18nFunc("View"),
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      SEPARATOR(),
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      SEPARATOR(),
      { role: "togglefullscreen" }
    ]
  },
  {
    role: "window",
    submenu: [
      { role: "minimize" },
      { role: "close" },
      { role: "zoom", showOn: ["darwin"] },
      SEPARATOR("darwin"),
      { role: "front", showOn: ["darwin"] }
    ]
  },
  {
    role: "help",
    submenu: []
  }
];

const shouldShowItem = item => {
  let shouldShow = item.hideOn || item.showOn ? false : true;

  if (item.hideOn) {
    if (typeof item.hideOn === "string") {
      shouldShow = item.hideOn !== PLATFORM;
    } else if (Array.isArray(item.hideOn)) {
      shouldShow = !item.hideOn.includes(PLATFORM);
    } else {
      throw Error(
        `hideOn for item "${JSON.stringify(item)}" is not a string or an array`
      );
    }
  }

  if (item.showOn) {
    if (typeof item.showOn === "string") {
      shouldShow = item.showOn === PLATFORM;
    } else if (Array.isArray(item.showOn)) {
      shouldShow = item.showOn.includes(PLATFORM);
    } else {
      throw Error(
        `showOn for item "${JSON.stringify(item)}" is not a string or an array`
      );
    }
  }

  return shouldShow;
};

const filterMenu = list =>
  list
    .map(item => {
      if(item.submenu) {
        item.submenu = filterMenu(item.submenu);
      }
      return shouldShowItem(item) ? item : false;
    })
    .filter(x => x);

const electronMenu = (callback = passThrough, i18nFunc = passThrough) => {
  const createdMenu = Menu.buildFromTemplate(
    filterMenu(callback(createTemplate(i18nFunc), SEPARATOR))
  );

  Menu.setApplicationMenu(createdMenu);

  return createdMenu;
};

module.exports = electronMenu;
