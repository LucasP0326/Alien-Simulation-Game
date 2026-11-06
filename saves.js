(() => {
  "use strict";

  const SAVE_KEY = "earthwatch-save-v1";
  const SAVE_VERSION = 1;
  const saveButton = document.getElementById("saveButton");
  const loadButton = document.getElementById("loadButton");
  const wipeButton = document.getElementById("wipeSaveButton");
  const status = document.getElementById("saveStatus");

  function hasStorage() {
    try {
      const testKey = `${SAVE_KEY}-test`;
      localStorage.setItem(testKey, "ok");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { exists: false, value: null };
      const envelope = JSON.parse(raw);
      if (!envelope || envelope.version !== SAVE_VERSION || !isValidRun(envelope.run)) {
        return { exists: true, invalid: true, value: null };
      }
      return { exists: true, value: envelope.run };
    } catch (error) {
      return { exists: true, invalid: true, value: null };
    }
  }

  function isValidRun(candidate) {
    if (!candidate || typeof candidate !== "object" || !candidate.stats || typeof candidate.stats !== "object") return false;
    if (!STAT_KEYS.every((key) => Number.isFinite(candidate.stats[key]) && candidate.stats[key] >= 0 && candidate.stats[key] <= 100)) return false;
    if (!Number.isInteger(candidate.turn) || candidate.turn < 0 || candidate.turn > DAYS_PER_RUN) return false;
    if (!Array.isArray(candidate.deck) || !candidate.deck.every((id) => EVENT_POOL.includes(id))) return false;
    if (!Number.isInteger(candidate.deckIndex) || candidate.deckIndex < 0 || candidate.deckIndex > candidate.deck.length) return false;
    if (typeof candidate.currentEventId !== "string" || !Object.hasOwn(events, candidate.currentEventId)) return false;
    if (typeof candidate.chainReturn !== "boolean" || typeof candidate.ended !== "boolean") return false;
    if (!Array.isArray(candidate.log) || !candidate.log.every((entry) => entry && typeof entry.title === "string" && typeof entry.result === "string")) return false;
    return true;
  }

  function updateButtons() {
    const result = readSave();
    if (loadButton) loadButton.disabled = !result.value;
    if (wipeButton) wipeButton.disabled = !result.exists;
    if (status) {
      if (result.invalid) status.textContent = "SAVE DAMAGED · WIPE TO RESET";
      else if (result.value) status.textContent = "LOCAL SAVE AVAILABLE";
      else status.textContent = "NO SAVED RUN";
    }
  }

  function saveGame(quiet = false) {
    if (!hasStorage()) {
      if (!quiet) notify("This browser blocked local saves. Check storage or privacy settings.");
      return false;
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: new Date().toISOString(), run }));
      updateButtons();
      if (!quiet) notify("Observation saved on this device.");
      return true;
    } catch (error) {
      if (!quiet) notify("Could not save. This browser may be out of storage space.");
      return false;
    }
  }

  function loadGame(quiet = false) {
    if (!hasStorage()) {
      if (!quiet) notify("Local saves are unavailable in this browser.");
      return false;
    }
    const result = readSave();
    if (!result.value) {
      updateButtons();
      if (!quiet) notify(result.invalid ? "The save is damaged. Wipe it to start a clean slot." : "There is no saved run to load.");
      return false;
    }
    run = JSON.parse(JSON.stringify(result.value));
    document.getElementById("endingOverlay")?.classList.add("hidden");
    if (run.ended) finishRun();
    else renderEvent();
    updateButtons();
    if (!quiet) notify("Saved observation loaded.");
    return true;
  }

  function wipeSave() {
    if (!readSave().exists) {
      updateButtons();
      notify("There is no saved run to wipe.");
      return;
    }
    if (!window.confirm("Permanently delete the saved observation from this browser? Your current run will stay open.")) return;
    try {
      localStorage.removeItem(SAVE_KEY);
      updateButtons();
      notify("Saved run deleted. Your current observation is unchanged.");
    } catch (error) {
      notify("Could not delete the save in this browser.");
    }
  }

  saveButton?.addEventListener("click", () => saveGame());
  loadButton?.addEventListener("click", () => loadGame());
  wipeButton?.addEventListener("click", wipeSave);

  // Choices autosave after the game's own handler updates the current run.
  const originalChoose = choose;
  choose = function (choice) {
    originalChoose(choice);
    saveGame(true);
  };

  // Restore the last autosave when the station is opened or refreshed.
  if (hasStorage() && readSave().value) loadGame(true);
  else updateButtons();

  // A new run can be started from either the header control or ending report.
  ["newGameButton", "restartButton"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => {
      window.setTimeout(() => saveGame(true), 0);
    });
  });

  window.addEventListener("storage", updateButtons);
})();
