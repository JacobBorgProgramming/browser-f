/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

this.EXPORTED_SYMBOLS = ["Preferences"];

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://testing-common/TestUtils.jsm");
Cu.import("resource://testing-common/ContentTask.jsm");

this.Preferences = {

  init(libDir) {
    let panes = [
      ["paneGeneral"],
      ["paneGeneral", browsingGroup],
      ["paneGeneral", connectionDialog],
      ["paneSearch"],
      ["panePrivacy"],
      ["panePrivacy", cacheGroup],
      ["panePrivacy", clearRecentHistoryDialog],
      ["panePrivacy", certManager],
      ["panePrivacy", deviceManager],
<<<<<<< HEAD
      ["paneConnect"],
      ["paneAdvanced"],

      /* The "old" organization. The third argument says to
         set the pref to show the old organization when
         opening the preferences. */
      ["paneGeneral", null, true],
      ["paneSearch", null, true],
      ["paneContent", null, true],
      ["paneApplications", null, true],
      ["panePrivacy", null, true],
      ["panePrivacy", DNTDialog, true],
      ["panePrivacy", clearRecentHistoryDialog, true],
      ["paneSecurity", null, true],
      ["paneSync", null, true],
      ["paneAdvanced", null, true, "generalTab"],
      ["paneAdvanced", null, true, "dataChoicesTab"],
      ["paneAdvanced", null, true, "networkTab"],
      ["paneAdvanced", connectionDialog, true, "networkTab"],
      ["paneAdvanced", null, true, "updateTab"],
      ["paneAdvanced", null, true, "encryptionTab"],
      ["paneAdvanced", certManager, true, "encryptionTab"],
      ["paneAdvanced", deviceManager, true, "encryptionTab"],
||||||| merged common ancestors
      ["paneAdvanced"],

      /* The "old" organization. The third argument says to
         set the pref to show the old organization when
         opening the preferences. */
      ["paneGeneral", null, true],
      ["paneSearch", null, true],
      ["paneContent", null, true],
      ["paneApplications", null, true],
      ["panePrivacy", null, true],
      ["panePrivacy", DNTDialog, true],
      ["panePrivacy", clearRecentHistoryDialog, true],
      ["paneSecurity", null, true],
      ["paneSync", null, true],
      ["paneAdvanced", null, true, "generalTab"],
      ["paneAdvanced", null, true, "dataChoicesTab"],
      ["paneAdvanced", null, true, "networkTab"],
      ["paneAdvanced", connectionDialog, true, "networkTab"],
      ["paneAdvanced", null, true, "updateTab"],
      ["paneAdvanced", null, true, "encryptionTab"],
      ["paneAdvanced", certManager, true, "encryptionTab"],
      ["paneAdvanced", deviceManager, true, "encryptionTab"],
=======
      ["panePrivacy", DNTDialog],
      ["paneSync"],
>>>>>>> origin/upstream-releases
    ];

    for (let [primary, customFn] of panes) {
      let configName = primary.replace(/^pane/, "prefs");
      if (customFn) {
        configName += "-" + customFn.name;
      }
      this.configurations[configName] = {};
      this.configurations[configName].applyConfig = prefHelper.bind(null, primary, customFn);
    }
  },

  configurations: {},
};

let prefHelper = async function(primary, customFn = null) {
  let browserWindow = Services.wm.getMostRecentWindow("navigator:browser");
  let selectedBrowser = browserWindow.gBrowser.selectedBrowser;

  // close any dialog that might still be open
  await ContentTask.spawn(selectedBrowser, null, async function() {
    if (!content.window.gSubDialog) {
      return;
    }
    content.window.gSubDialog.close();
  });

  let readyPromise = null;
  if (selectedBrowser.currentURI.specIgnoringRef == "about:preferences") {
    if (selectedBrowser.currentURI.spec == "about:preferences#" + primary.replace(/^pane/, "")) {
      // We're already on the correct pane.
      readyPromise = Promise.resolve();
    } else {
      readyPromise = paintPromise(browserWindow);
    }
  } else {
    readyPromise = TestUtils.topicObserved("sync-pane-loaded");
  }

  browserWindow.openPreferences(primary);

  await readyPromise;

  if (customFn) {
    let customPaintPromise = paintPromise(browserWindow);
    await customFn(selectedBrowser);
    await customPaintPromise;
  }
};

function paintPromise(browserWindow) {
  return new Promise((resolve) => {
    browserWindow.addEventListener("MozAfterPaint", function() {
      resolve();
    }, {once: true});
  });
}

async function browsingGroup(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("browsingGroup").scrollIntoView();
  });
}

async function cacheGroup(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("cacheGroup").scrollIntoView();
  });
}

async function DNTDialog(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("doNotTrackSettings").click();
  });
}

async function connectionDialog(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("connectionSettings").click();
  });
}

async function clearRecentHistoryDialog(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("historyRememberClear").click();
  });
}

async function certManager(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("viewCertificatesButton").click();
  });
}

async function deviceManager(aBrowser) {
  await ContentTask.spawn(aBrowser, null, async function() {
    content.document.getElementById("viewSecurityDevicesButton").click();
  });
}
