(() => {
  "use strict";

  const SAVE_KEY = "earthwatch-save-v1";
  const SAVE_VERSION = 2;
  const saveButton = document.getElementById("saveButton");
  const loadButton = document.getElementById("loadButton");
  const wipeButton = document.getElementById("wipeSaveButton");
  const status = document.getElementById("saveStatus");

  const PLANETS = {
    earth: {
      name: "Earth", population: "8.2 billion", civilization: "A mosaic of nations, languages, and living traditions, connected by restless networks.",
      description: "A crowded, ocean-blue home where cooperation and conflict travel at the speed of light.",
      pool: ["earth_flood", "earth_orbit", "earth_garden", "earth_monsoon", "earth_signal", "garden", "archive", "festival", "river", "museum", "migration"],
      color: "earth",
    },
    mars: {
      name: "Mars", population: "12.4 million", civilization: "The Basin Compact: independent dome-cities joined by water councils, rover caravans, and a fierce belief in shared survival.",
      description: "A young frontier civilization is deciding whether survival means pulling together—or claiming every resource first.",
      pool: ["mars_water", "mars_dust", "mars_green", "mars_cave", "mars_signal", "garden", "archive", "festival", "river", "museum", "launch"],
      color: "mars",
    },
    venus: {
      name: "Venus", population: "4.6 million", civilization: "The Aerial Commons: floating cities where cloud-guilds share lift-gas, art, and decisions across the bright upper atmosphere.",
      description: "High above a crushing world, cloud cities balance fragile habitats with a culture built on mutual care.",
      pool: ["venus_lift", "venus_cloud", "venus_balloon", "venus_garden", "venus_signal", "garden", "archive", "festival", "museum", "launch", "aurora"],
      color: "venus",
    },
    saturn: {
      name: "Saturn", population: "2.1 million", civilization: "The Ringward Accord: drifting research flotillas and settlements in the Saturnian system, linked by patient trade and ring-navigation rites.",
      description: "A speculative future civilization of orbital habitats and atmospheric skimmers lives among Saturn's magnificent rings.",
      pool: ["saturn_rings", "saturn_titan", "saturn_storm", "saturn_rescue", "saturn_signal", "garden", "archive", "festival", "museum", "launch", "aurora"],
      color: "saturn",
    },
  };

  function event(title, category, tag, text, first, second) {
    return { title, category, tag, text, choices: [first, second] };
  }
  function choice(label, result, effects, chain) {
    return { label, result, effects, ...(chain ? { chain } : {}) };
  }

  Object.assign(events, {
    earth_flood: event("The Delta Keeps Its Name", "EARTH · COASTAL COMMUNITIES", "CIVILIAN PETITION", "A river delta is sinking. Its residents have designed a retreat that keeps their neighborhoods and histories connected, but a distant authority favors a seawall that protects only the port.", choice("Amplify the residents' plan and help them win a public hearing.", "The hearing becomes a negotiation led by the people who know the delta best.", { empathy: 7, influence: 4, hope: 5 }), choice("Raise the seawall before the next tide.", "The port is spared, while the delta communities are left to fight for recognition.", { control: 6, fear: 2, hope: 2, integrity: -3 })),
    earth_orbit: event("The Crowded Sky", "EARTH · ORBITAL COMMONS", "ORBITAL ALERT", "Thousands of satellites share Earth's busy orbital lanes. A near miss has put research, communications, and weather forecasts at risk. Nations disagree on who should make room.", choice("Share a transparent traffic map with every space agency.", "Agencies coordinate openly and begin negotiating common rules.", { influence: 7, hope: 5, empathy: 3 }), choice("Nudge the most dangerous debris into a safe orbit yourself.", "The sky clears, but observatories detect the unexplained correction.", { control: 5, hope: 4, fear: 3, integrity: -4 })),
    earth_garden: event("Seeds for Everyone", "EARTH · FOOD & COMMUNITY", "CIVILIAN REPORT", "A seed library is connecting neighborhoods across a dry region. The collection is small, but its keepers want to share it freely before a private buyer can lock it away.", choice("Give the seed network a season of gentle rain.", "The first harvest is modest; the seed library spreads to nearby towns.", { hope: 6, empathy: 6, integrity: -1 }), choice("Send the keepers a map of every community asking to join.", "The network grows through human hands, one generous exchange at a time.", { empathy: 7, influence: 4, control: -2 })),
    earth_monsoon: event("Monsoon of Two Choices", "EARTH · CLIMATE & CITIES", "WEATHER ANOMALY", "An unusually late monsoon threatens both a farming region and a city reservoir. A small shift in the clouds could help one, but only shared planning can protect both.", choice("Guide the rain toward the watershed and publish the forecast early.", "Farmers and city planners share the incoming water, imperfectly but peacefully.", { hope: 5, influence: 5, empathy: 4 }), choice("Make a dramatic downpour over the fields.", "The crops recover. The city reservoir stays low, and the next argument is already forming.", { hope: 7, control: 3, integrity: -3 })),
    earth_signal: event("A Message in the Static", "EARTH · PUBLIC PERCEPTION", "SIGNAL LEAK", "A radio astronomer catches a repeating pulse near Earth's orbit. The public wants an answer; the research team wants time to check its instruments.", choice("Send back a simple mathematical pattern and publish the exchange.", "The signal becomes a shared scientific question instead of a private rumor.", { influence: 7, hope: 5, fear: 3 }), choice("Let the astronomers investigate quietly before anyone answers.", "The team finds a natural explanation for part of the pulse—and a mystery that remains.", { control: 4, empathy: 3, fear: -2 })),

    mars_water: event("The Ice Ledger", "MARS · WATER COUNCIL", "BASIN COMPACT", "A fresh ice seam has been found beneath the southern ridge. The Basin Compact must decide how to share it between a growing dome-city and a chain of smaller settlements.", choice("Publish the ice survey and let every settlement negotiate its share.", "The council is loud, slow, and surprisingly fair. A shared water ledger is born.", { empathy: 7, influence: 5, hope: 4 }), choice("Move the ice to the largest dome before the next dust season.", "The capital survives the dry months; outlying settlements begin preparing to leave.", { control: 7, fear: 3, hope: -4 })),
    mars_dust: event("A Sky Full of Rust", "MARS · DUST SEASON", "HABITAT WARNING", "A planet-wide dust front is dimming solar farms. Rover caravans are racing supplies between domes, but the routes cross a stretch claimed by two rival settlement councils.", choice("Illuminate a safe route using a brief orbital beacon.", "The caravans reach both domes. The councils agree to share route beacons next season.", { hope: 6, influence: 4, integrity: -3 }), choice("Send each council the other's supply needs and let them coordinate.", "The councils share fuel and food, then argue over whose idea it was.", { empathy: 7, control: -2, influence: 3 })),
    mars_green: event("The First Greenhouse", "MARS · CULTURE & ECOLOGY", "BASIN COMPACT", "A school greenhouse has grown the first locally pollinated fruit. The discovery could help Mars become less dependent on imports, but a corporation wants exclusive rights to the seed strain.", choice("Help the students register the seeds as a public commons.", "The fruit is shared at a planet-wide festival. The seed remains everyone's responsibility.", { empathy: 6, hope: 7, influence: 3 }), choice("Make the greenhouse produce a spectacular overnight harvest.", "The harvest is astonishing, but every settlement asks how to reproduce a miracle.", { hope: 7, fear: 2, integrity: -4 })),
    mars_cave: event("Voices Beneath the Regolith", "MARS · DISCOVERY", "ROVER TRANSMISSION", "A rover hears rhythmic tapping from a lava tube. The sound could be shifting rock—or a small community's signal from a settlement that vanished from the maps decades ago.", choice("Share the coordinates with the rover network and invite a careful search.", "A forgotten settlement answers. The Basin Compact welcomes its survivors back into the conversation.", { empathy: 8, influence: 4, hope: 5 }), choice("Send supplies to the cave entrance without revealing your station.", "The supplies are taken. Someone scratches a thank-you into the dust.", { hope: 5, control: 4, integrity: -2 })),
    mars_signal: event("A Blue Dot in the Sky", "MARS · PUBLIC PERCEPTION", "OBSERVATORY REPORT", "Young Martian astronomers discover a pale blue point moving against the stars. Their elders disagree about whether contact would unite the settlements or distract from daily survival.", choice("Answer with a harmless sequence of lights and leave interpretation to them.", "The astronomers build a new observatory open to every dome-city.", { hope: 6, influence: 5, fear: 2 }), choice("Wait and let the young astronomers publish their evidence first.", "Their careful report earns respect across Mars, even without an answer from the stars.", { empathy: 5, control: -1, hope: 4 })),

    venus_lift: event("The Lift-Gas Vote", "VENUS · AERIAL COMMONS", "HABITAT COUNCIL", "A leak in a shared lift-gas refinery threatens three floating neighborhoods. The cloud-guilds vote on emergency repairs, but the smallest habitat has no representative at the table.", choice("Patch the leak and open a public maintenance fund.", "The habitats stay aloft, and the missing neighborhood receives a seat on the council.", { empathy: 7, hope: 5, integrity: -3 }), choice("Transfer lift-gas from the smallest habitat to the larger cities.", "The refinery stabilizes. The smallest habitat drifts lower and the vote's legitimacy with it.", { control: 7, fear: 4, empathy: -5 })),
    venus_cloud: event("A Garden in the Clouds", "VENUS · AERIAL ECOLOGY", "CLOUD-GUILD REPORT", "A cloud-guild greenhouse has found a way to filter trace minerals from the upper atmosphere. Its first harvest could feed a district—or be released as a gift to every floating city.", choice("Help the guild publish its filter design for all habitats.", "Other cities adapt the design. The harvest grows more slowly, but nobody owns the sky-garden.", { empathy: 7, influence: 4, hope: 5 }), choice("Boost this greenhouse into a bountiful first harvest.", "The district celebrates. Neighboring guilds demand an equal share of the breakthrough.", { hope: 7, control: 3, integrity: -3 })),
    venus_balloon: event("The Drifting Nursery", "VENUS · CIVILIAN PETITION", "HABITAT ALERT", "A nursery habitat has slipped from its usual altitude. Its young residents are safe for now, but the repair crews are on the far side of the cloud belt.", choice("Guide a rescue skiff with a string of glowing beacons.", "The nursery is brought home, and the beacon route becomes a shared safety system.", { hope: 6, empathy: 5, integrity: -2 }), choice("Broadcast a calm repair plan and let the neighboring guilds lead.", "Three guilds coordinate their skiffs. The rescue takes longer, but it belongs to them.", { influence: 5, empathy: 6, control: -2 })),
    venus_garden: event("The Singing Condenser", "VENUS · CULTURE & SCIENCE", "AERIAL COMMONS", "A condenser tower makes a musical hum when the wind changes. The sound has become a symbol of one city, but engineers want to silence it to improve efficiency.", choice("Tune the tower so it sings without wasting lift-gas.", "The engineers and musicians collaborate; the tower's song becomes a festival signal.", { hope: 6, empathy: 5, influence: 3 }), choice("Leave the tower alone and protect the city's tradition.", "The song continues, though the repair crews must work harder around its old machinery.", { empathy: 6, control: -2, integrity: -1 })),
    venus_signal: event("The Horizon Below", "VENUS · PUBLIC PERCEPTION", "ATMOSPHERIC SIGNAL", "A research balloon catches a repeating light beneath the cloud deck, far below any known habitat. The cloud-guilds wonder whether the pattern is geology, machinery, or someone asking to be heard.", choice("Answer with a slow pulse of light from the upper atmosphere.", "The lights below answer once. The guilds form a careful, open research mission.", { influence: 6, hope: 5, fear: 3 }), choice("Send instruments first and keep the discovery out of the news.", "The instruments return strange mineral traces, and the secrecy becomes its own story.", { control: 5, fear: 3, empathy: -1 })),

    saturn_rings: event("The Ring Shadow", "SATURN · RINGWARD ACCORD", "NAVIGATION ALERT", "A fragment in Saturn's rings is drifting toward a busy flotilla corridor. Ring-navigators disagree on whether to close the route or risk guiding the habitats through the shadow.", choice("Map a safe passage and share it with every flotilla.", "The flotillas travel together and add a new route to their navigation songs.", { hope: 6, influence: 5, empathy: 3 }), choice("Nudge the fragment away from the corridor yourself.", "The route stays open. Navigators notice the impossible change in the ring's pattern.", { control: 5, fear: 3, integrity: -4 })),
    saturn_titan: event("The Warmth Beneath Titan", "SATURN · TITAN EXPEDITION", "RESEARCH FLOTILLA", "A survey crew on Titan finds a warm fissure beneath the ice. The discovery may hold clues to life—or simply be a rare geological vent. The Ringward Accord debates whether to send a crew.", choice("Fund a slow, jointly crewed expedition with strict habitat protections.", "The flotillas share the mission and agree the unknown deserves patience.", { empathy: 6, influence: 4, hope: 5 }), choice("Send a probe immediately before another crew claims the find.", "The probe returns valuable data, but the rush sets off a dispute over who owns discovery.", { control: 6, influence: 3, fear: 2 })),
    saturn_storm: event("The Great Cloud's Edge", "SATURN · ATMOSPHERIC SKIMMERS", "FLIGHT WARNING", "A storm band shifts near a cluster of atmospheric skimmers. The pilots can reroute through the rings, but the detour will delay a medical shipment to an isolated habitat.", choice("Create a brief calm corridor through the storm.", "The shipment arrives on time. The skimmer crews log a weather pattern that should not exist.", { hope: 6, integrity: -4, fear: 2 }), choice("Share the storm data and let the pilots choose their route.", "The pilots reroute together and establish a new emergency flight protocol.", { empathy: 6, influence: 4, control: -1 })),
    saturn_rescue: event("The Quiet Flotilla", "SATURN · COMMUNITY", "LOST TRANSPONDER", "A small research flotilla has gone quiet behind the rings. Its last transmission was a lullaby used by navigators to mark safe passage. The Accord's rescue crews are split over which route to take.", choice("Repeat the lullaby on every navigation channel.", "A faint answer comes back. The flotilla is found, and the song gains a new verse.", { hope: 7, empathy: 5, influence: 3 }), choice("Guide a rescue vessel through a route only your station can see.", "The crew returns safely, but the pilots begin asking who guided them.", { control: 5, fear: 2, integrity: -3 })),
    saturn_signal: event("A Lantern in the Rings", "SATURN · PUBLIC PERCEPTION", "RINGWARD TRANSMISSION", "A drifting beacon flashes in a pattern unknown to the Ringward Accord. Some say it is an old navigation marker; others think a new flotilla is arriving from beyond the system.", choice("Answer with a welcoming sequence and publish the beacon's location.", "The Accord prepares a welcome convoy instead of a defensive line.", { hope: 6, influence: 5, fear: -2 }), choice("Observe silently until the beacon identifies itself.", "The beacon fades, then returns with a pattern that resembles a question mark.", { control: 4, fear: 2, empathy: 2 })),
  });

  // Keep the save validator aware of every planet-exclusive event.
  const planetEventIds = Object.values(PLANETS).flatMap((profile) => profile.pool);
  planetEventIds.forEach((id) => { if (!EVENT_POOL.includes(id)) EVENT_POOL.push(id); });

  function getSavedPlanet() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      const id = saved?.run?.planetId;
      return Object.hasOwn(PLANETS, id) ? id : "earth";
    } catch (error) { return "earth"; }
  }
  let selectedPlanetId = getSavedPlanet();
  const originalCreateRun = createRun;
  createRun = function () {
    const next = originalCreateRun();
    const profile = PLANETS[selectedPlanetId] || PLANETS.earth;
    next.planetId = selectedPlanetId;
    next.deck = shuffle(profile.pool);
    next.deckIndex = 0;
    next.currentEventId = "intro";
    return next;
  };

  const originalRenderEvent = renderEvent;
  renderEvent = function () {
    const profile = PLANETS[run.planetId] || PLANETS.earth;
    run.planetId = profile.color;
    originalRenderEvent();
    const title = document.getElementById("eventTitle");
    const text = document.getElementById("eventText");
    const category = document.getElementById("eventCategory");
    const eventTag = document.getElementById("eventTag");
    const eventNo = document.getElementById("eventNumber");
    const eventData = events[run.currentEventId];
    if (run.currentEventId === "intro") {
      if (title) title.textContent = `First Contact with ${profile.name}`;
      if (text) text.textContent = `${profile.description} ${profile.civilization} Your first signal may shape how this civilization sees the stars—or whether it notices you at all.`;
      if (category) category.textContent = `${profile.name.toUpperCase()} · POPULATION ${profile.population.toUpperCase()}`;
      if (eventTag) eventTag.textContent = "NEW OBSERVATION";
    } else if (eventData) {
      if (category) category.textContent = `${profile.name.toUpperCase()} · ${eventData.category}`;
      if (eventTag) eventTag.textContent = eventData.tag;
    }
    if (eventNo) eventNo.textContent = `${profile.name.toUpperCase()} · FILE ${String(Math.min(run.turn + 1, DAYS_PER_RUN)).padStart(3, "0")}`;
    document.documentElement.dataset.observedPlanet = profile.color;
    const earthLabel = document.getElementById("earthYear");
    if (earthLabel) earthLabel.textContent = profile.name;
    document.querySelectorAll(".console-left").forEach((el) => { el.firstElementChild.textContent = `${profile.name.toUpperCase()} / LIVE`; });
    const caption = document.querySelector(".room-caption span:first-child");
    if (caption) caption.textContent = profile.name.toUpperCase() + (profile.name === "Saturn" ? "'S RINGS" : " / OBSERVED");
    updatePlanetPanel(profile);
    updatePlanetPicker();
  };

  function updatePlanetPanel(profile) {
    let panel = document.getElementById("planetProfile");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "planetProfile";
      panel.className = "planet-profile";
      const room = document.querySelector(".observation-room");
      if (room) room.insertAdjacentElement("afterend", panel);
    }
    if (panel) {
      panel.innerHTML = `<span class="planet-profile-kicker">CIVILIZATION DOSSIER</span><strong>${profile.name} <i>·</i> Population ${profile.population}</strong><p>${profile.civilization}</p>`;
    }
  }

  function updatePlanetPicker() {
    const picker = document.getElementById("planetPicker");
    if (picker) picker.value = selectedPlanetId;
  }

  function installPlanetStyles() {
    if (document.getElementById("planetStyles")) return;
    const style = document.createElement("style");
    style.id = "planetStyles";
    style.textContent = `
      .planet-picker-wrap{display:flex;align-items:center;gap:8px;color:#89a0ae;font:10px var(--mono);letter-spacing:.08em}
      .planet-picker{max-width:145px;background:#102131;color:#d9ecee;border:1px solid rgba(120,225,209,.35);border-radius:6px;padding:8px 26px 8px 10px;font:11px var(--body);cursor:pointer}
      .planet-profile{margin:-10px 0 22px;padding:14px 18px;border:1px solid rgba(143,178,202,.2);border-radius:8px;background:rgba(13,25,39,.84)}
      .planet-profile-kicker{display:block;color:#78e1d1;font:9px var(--mono);letter-spacing:.14em;margin-bottom:6px}
      .planet-profile strong{font:500 14px var(--display);color:#e5f0f3}.planet-profile strong i{color:#78e1d1;font-style:normal}.planet-profile p{margin:5px 0 0;color:#89a0ae;font-size:12px;line-height:1.55}
      .utility-button:disabled{opacity:.42;cursor:not-allowed}
      html[data-observed-planet="mars"] .earth{filter:hue-rotate(125deg) saturate(.8)}
      html[data-observed-planet="venus"] .earth{filter:hue-rotate(55deg) saturate(.75) brightness(1.16)}
      html[data-observed-planet="saturn"] .earth{filter:hue-rotate(300deg) saturate(.72) brightness(1.12)}
      html[data-observed-planet="saturn"] .earth:before{content:"";position:absolute;z-index:5;left:-18%;top:40%;width:136%;height:26%;border:5px solid rgba(226,199,147,.82);border-left-color:rgba(226,199,147,.28);border-right-color:rgba(226,199,147,.52);border-radius:50%;transform:rotate(-24deg);box-shadow:0 0 8px rgba(238,212,159,.38);pointer-events:none}
      @media(max-width:700px){.planet-picker-wrap{order:3;flex:1 0 100%;justify-content:flex-start}.planet-picker{max-width:none}.planet-profile{margin:0 0 14px}}
    `;
    document.head.appendChild(style);
  }

  function installPlanetPicker() {
    const actions = document.querySelector(".topbar-actions");
    if (!actions || document.getElementById("planetPicker")) return;
    const wrap = document.createElement("label");
    wrap.className = "planet-picker-wrap";
    wrap.htmlFor = "planetPicker";
    wrap.appendChild(document.createTextNode("OBSERVE"));
    const select = document.createElement("select");
    select.id = "planetPicker";
    select.className = "planet-picker";
    select.setAttribute("aria-label", "Choose the planet to observe");
    Object.entries(PLANETS).forEach(([id, profile]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${profile.name} · ${profile.population}`;
      select.appendChild(option);
    });
    select.value = selectedPlanetId;
    select.addEventListener("change", () => {
      const chosenId = select.value;
      if (!Object.hasOwn(PLANETS, chosenId)) return;
      const profile = PLANETS[chosenId];
      if (!window.confirm(`Start a new observation of ${profile.name}? This replaces the current run and its autosave.`)) {
        select.value = run.planetId || selectedPlanetId;
        return;
      }
      selectedPlanetId = chosenId;
      run = createRun();
      document.getElementById("endingOverlay")?.classList.add("hidden");
      renderEvent();
      notify(`Observation begun: ${profile.name}.`);
      saveGame(true);
    });
    wrap.appendChild(select);
    actions.insertBefore(wrap, saveButton || actions.firstChild);
  }

  function hasStorage() {
    try {
      const testKey = `${SAVE_KEY}-test`;
      localStorage.setItem(testKey, "ok");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) { return false; }
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
    if (candidate.planetId !== undefined && !Object.hasOwn(PLANETS, candidate.planetId)) return false;
    return true;
  }
  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { exists: false, value: null };
      const envelope = JSON.parse(raw);
      if (!envelope || ![1, SAVE_VERSION].includes(envelope.version) || !isValidRun(envelope.run)) return { exists: true, invalid: true, value: null };
      if (!envelope.run.planetId) envelope.run.planetId = "earth";
      return { exists: true, value: envelope.run };
    } catch (error) { return { exists: true, invalid: true, value: null }; }
  }
  function updateButtons() {
    const result = readSave();
    if (loadButton) loadButton.disabled = !result.value;
    if (wipeButton) wipeButton.disabled = !result.exists;
    if (status) status.textContent = result.invalid ? "SAVE DAMAGED · WIPE TO RESET" : result.value ? `SAVE AVAILABLE · ${PLANETS[result.value.planetId]?.name || "EARTH"}` : "NO SAVED RUN";
  }
  function saveGame(quiet = false) {
    if (!hasStorage()) { if (!quiet) notify("This browser blocked local saves. Check storage or privacy settings."); return false; }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SAVE_VERSION, savedAt: new Date().toISOString(), run }));
      updateButtons();
      if (!quiet) notify("Observation saved on this device.");
      return true;
    } catch (error) { if (!quiet) notify("Could not save. This browser may be out of storage space."); return false; }
  }
  function loadGame(quiet = false) {
    if (!hasStorage()) { if (!quiet) notify("Local saves are unavailable in this browser."); return false; }
    const result = readSave();
    if (!result.value) { updateButtons(); if (!quiet) notify(result.invalid ? "The save is damaged. Wipe it to start a clean slot." : "There is no saved run to load."); return false; }
    run = JSON.parse(JSON.stringify(result.value));
    selectedPlanetId = run.planetId || "earth";
    document.getElementById("endingOverlay")?.classList.add("hidden");
    if (run.ended) finishRun(); else renderEvent();
    updateButtons();
    if (!quiet) notify("Saved observation loaded.");
    return true;
  }
  function wipeSave() {
    if (!readSave().exists) { updateButtons(); notify("There is no saved run to wipe."); return; }
    if (!window.confirm("Permanently delete the saved observation from this browser? Your current run will stay open.")) return;
    try { localStorage.removeItem(SAVE_KEY); updateButtons(); notify("Saved run deleted. Your current observation is unchanged."); }
    catch (error) { notify("Could not delete the save in this browser."); }
  }

  installPlanetStyles();
  installPlanetPicker();
  // Render once more after wrapping to update the dossier and planet artwork.
  renderEvent();

  saveButton?.addEventListener("click", () => saveGame());
  loadButton?.addEventListener("click", () => loadGame());
  wipeButton?.addEventListener("click", wipeSave);
  const originalChoose = choose;
  choose = function (selectedChoice) { originalChoose(selectedChoice); saveGame(true); };
  ["newGameButton", "restartButton"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => window.setTimeout(() => saveGame(true), 0));
  });
  if (hasStorage() && readSave().value) loadGame(true); else updateButtons();
  window.addEventListener("storage", updateButtons);
})();
