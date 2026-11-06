const STARTING_STATE = Object.freeze({ empathy: 55, influence: 45, fear: 40, hope: 60, control: 50, integrity: 100 });
const DAYS_PER_RUN = 12;
const STAT_KEYS = Object.keys(STARTING_STATE);
const state = { ...STARTING_STATE };

// The opening is familiar; the remaining events are shuffled without repeats each run.
const events = {
  intro: {
    title: "First Transmission", category: "OBSERVATION DECK", tag: "INCOMING TRANSMISSION",
    text: "Earth turns beneath your station: a bright, noisy world of storms, songs, and unfinished plans. Your first signal could change how its people see one another—or keep your presence a mystery.",
    choices: [
      { label: "Send a gentle pulse that encourages people to listen across borders.", result: "A soft signal crosses the planet. For one strange moment, millions pause to hear it.", effects: { empathy: 7, hope: 7, fear: -3, influence: 4 } },
      { label: "Stay hidden and study how humanity handles its own first crisis.", result: "You keep your distance. Earth carries on, unaware of its quiet audience.", effects: { control: 5, fear: 2, empathy: -2, influence: -2 } },
    ],
  },
  storm: {
    title: "The Turning Storm", category: "CLIMATE & CITIES", tag: "WEATHER ANOMALY",
    text: "A cyclone is veering toward a crowded coast. Emergency teams are stretched thin, but local volunteers are already moving people to safety. One nudge from orbit could change the storm's course—and the story people tell afterward.",
    choices: [
      { label: "Bend the storm out to sea, risking a glimpse of your power.", result: "The cyclone curls away from the coast. Relief spreads alongside questions about the impossible forecast.", effects: { hope: 8, control: 5, fear: 4, integrity: -5 } },
      { label: "Boost the evacuation signal and let people protect one another.", result: "The storm lands hard, but early warnings save lives and strengthen local response networks.", effects: { empathy: 7, influence: 3, hope: 3, integrity: 2 } },
    ],
  },
  garden: {
    title: "A Garden Above the City", category: "FOOD & COMMUNITY", tag: "CIVILIAN REPORT",
    text: "A rooftop garden has become a neighborhood food source. A developer wants the land for a tower; residents ask for time to prove the garden can feed more people. Your influence could tip the debate.",
    choices: [
      { label: "Beam a season of perfect growing weather onto the garden.", result: "The harvest is undeniable. The city preserves the garden, though some wonder who arranged the sunshine.", effects: { hope: 7, empathy: 6, influence: 3, integrity: -2 } },
      { label: "Send the residents a blueprint for a cooperative greenhouse network.", result: "Neighbors organize, share skills, and make the idea bigger than one rooftop.", effects: { empathy: 8, control: -2, hope: 5 } },
    ],
  },
  signal: {
    title: "The Ocean's Reply", category: "DEEP BIOSPHERE", tag: "REPEATING SIGNAL",
    text: "A listening array catches a rhythmic pulse from the deep ocean. Scientists are divided: mineral resonance, animal song, or something stranger. The signal seems to change whenever humans answer.",
    choices: [
      { label: "Answer with a pattern of prime numbers and invite open study.", result: "The pulses shift into a new rhythm. Researchers share their data across borders, and curiosity beats fear—for now.", effects: { influence: 6, hope: 6, empathy: 4, fear: 2 }, chain: "deepReply" },
      { label: "Quiet the signal and protect the unknown source from a rush to exploit it.", result: "The deep goes quiet. You buy the hidden life time, but the unanswered mystery feeds speculation.", effects: { control: 5, empathy: 5, fear: 3 } },
    ],
  },
  archive: {
    title: "The Lost Archive", category: "CULTURE & MEMORY", tag: "DATA RECOVERY",
    text: "A flood has damaged a town's public archive: family letters, local histories, and the records of a community that has rebuilt itself for generations. A perfect reconstruction is possible, but it would require quietly scanning private memories.",
    choices: [
      { label: "Restore only public records and let families decide what to share.", result: "The archive returns with gaps, but its people choose what their history means.", effects: { empathy: 8, influence: 3, control: -2, hope: 4 } },
      { label: "Rebuild every record from the station's hidden observations.", result: "The archive is flawless. The town is grateful—until someone asks who had access to their memories.", effects: { control: 7, fear: 4, integrity: -2, hope: 2 } },
    ],
  },
  blackout: {
    title: "Night Without Power", category: "INFRASTRUCTURE", tag: "GRID ALERT",
    text: "A cascading outage darkens a region during a heat wave. Hospitals switch to backup power, while neighbors open cool basements and share water. Your station can restore the grid quickly, or help people get through the night together.",
    choices: [
      { label: "Feed clean power into the grid until engineers stabilize it.", result: "Lights return before dawn. The rescue is celebrated, though dependence on an invisible helper grows.", effects: { hope: 7, control: 6, fear: 3, integrity: -6 } },
      { label: "Guide emergency supplies to the neighborhoods most at risk.", result: "The outage lasts, but community kitchens and cooling centers keep people safe.", effects: { empathy: 8, hope: 4, influence: 3 } },
    ],
  },
  festival: {
    title: "The Unplanned Festival", category: "CULTURE & CONNECTION", tag: "CIVILIAN REPORT",
    text: "A citywide transit delay strands strangers in a plaza. Someone begins playing music; soon food stalls, dancers, and improvised translators fill the square. Officials want to clear it. The crowd asks for one more song.",
    choices: [
      { label: "Keep the plaza lights glowing and let the gathering continue safely.", result: "The festival becomes a story people tell for years. Their joy is their own, even if the lights were not.", effects: { hope: 8, empathy: 5, fear: -3, integrity: -1 } },
      { label: "Send the transit authority a route plan that gets everyone home.", result: "The crowd disperses peacefully, carrying new friendships onto the late-night trains.", effects: { control: 5, empathy: 4, influence: 3 } },
    ],
  },
  summit: {
    title: "The Almost-Summit", category: "DIPLOMACY", tag: "GLOBAL CHANNEL",
    text: "Delegates are close to a shared climate and disaster-response pact. One argument over who pays for the first year threatens to collapse the meeting. A small nudge might rescue the deal—or make the agreement feel imposed.",
    choices: [
      { label: "Broadcast a transparent model for sharing costs and credit.", result: "The delegates negotiate through the night and sign a modest but real agreement.", effects: { influence: 8, hope: 7, empathy: 4, control: -2 } },
      { label: "Make each delegation believe the others have already agreed.", result: "The pact is signed quickly. Trust will be harder to rebuild when the trick is discovered.", effects: { control: 8, fear: 4, influence: 4, empathy: -5 } },
    ],
  },
  pollinators: {
    title: "The Last Orchard", category: "ECOLOGY", tag: "BIOSPHERE WARNING",
    text: "A region's pollinators are disappearing. Local scientists have a promising habitat plan but need years of support; a station-made bloom could reverse the crisis overnight, with unknown consequences for the food web.",
    choices: [
      { label: "Help fund attention for the scientists' long-term habitat plan.", result: "The recovery is slow and patchy, but the ecosystem begins to mend on its own terms.", effects: { empathy: 7, hope: 5, influence: 4, control: -2 } },
      { label: "Trigger a sudden, spectacular bloom across the valley.", result: "The orchards burst with color. Researchers celebrate, then scramble to understand the changed ecosystem.", effects: { hope: 8, control: 5, integrity: -5, fear: 2 } },
    ],
  },
  rumor: {
    title: "A Face in the Static", category: "PUBLIC PERCEPTION", tag: "SIGNAL LEAK",
    text: "A telescope technician posts a blurry image of your station. It spreads online, inspiring art, jokes, and a few frightening conspiracy theories. The image is too vague to prove anything, but the story is growing legs.",
    choices: [
      { label: "Send a harmless, unmistakably silly pattern to the telescope.", result: "The internet erupts with alien memes. The mood turns playful, though the mystery deepens.", effects: { hope: 5, fear: -4, influence: 4, empathy: 2 } },
      { label: "Scrub the image and quietly silence the story.", result: "The post disappears. People notice the deletion and decide it must have been important.", effects: { control: 7, fear: 6, empathy: -3 } },
    ],
  },
  river: {
    title: "The River's New Course", category: "CLIMATE & CITIES", tag: "CIVILIAN PETITION",
    text: "A dry river basin is at the center of a dispute between farms, a growing city, and the wetlands downstream. There is enough water if everyone changes, but no one wants to be first.",
    choices: [
      { label: "Reveal a shared-use plan based on the basin's real seasonal data.", result: "The parties agree to try the plan. It is imperfect, but nobody is asked to disappear for someone else's future.", effects: { empathy: 6, influence: 5, hope: 5 } },
      { label: "Make rain fall over the basin for one dramatic week.", result: "The crisis eases, and the hard choices are postponed. The water returns to its old argument.", effects: { hope: 6, control: 5, integrity: -4 } },
    ],
  },
  museum: {
    title: "The Museum of Tomorrow", category: "CULTURE & MEMORY", tag: "PUBLIC PROJECT",
    text: "Students propose a museum about futures they hope to build—not disasters they fear. The budget committee wants a safer exhibit of past triumphs. The students ask you, unknowingly, for a little inspiration.",
    choices: [
      { label: "Send vivid dreams of a future they can create together.", result: "The students make their own plans, and the museum opens as a workshop rather than a monument.", effects: { hope: 8, empathy: 4, influence: 3 } },
      { label: "Project a dazzling vision of a perfect future onto the museum walls.", result: "The opening is spectacular. For a while, people mistake a beautiful picture for a promise.", effects: { hope: 6, fear: 2, control: 4, integrity: -2 } },
    ],
  },
  launch: {
    title: "A Rocket, a School, and a Question", category: "SCIENCE & DISCOVERY", tag: "ORBITAL TRAJECTORY",
    text: "A student-built research rocket is drifting off course toward a decommissioned satellite. The mission carries months of work from a small school team. A tiny correction could save it, but might expose your station's reach.",
    choices: [
      { label: "Give the rocket a barely detectable push into a safe orbit.", result: "The students' experiment works. They credit careful engineering and a little luck.", effects: { hope: 6, influence: 4, integrity: -3 } },
      { label: "Send a warning signal so the students can correct their own trajectory.", result: "The team catches the error and makes the correction themselves. Their confidence soars.", effects: { empathy: 5, hope: 5, control: -2 } },
    ],
  },
  migration: {
    title: "A Safe Harbor", category: "HUMANITARIAN RESPONSE", tag: "CIVILIAN PETITION",
    text: "Families displaced by rising seas arrive at a port whose residents are already short on housing. Volunteers offer space, while a rumor campaign claims there is none to spare. The response could define this city's next decade.",
    choices: [
      { label: "Amplify the volunteers' stories and connect them with support.", result: "More homes open than anyone expected. The welcome is hard, practical work—not a miracle.", effects: { empathy: 9, hope: 5, fear: -3, influence: 2 } },
      { label: "Secretly create a temporary shelter complex on the waterfront.", result: "People have a roof tonight, but the sudden construction fuels suspicion and political backlash.", effects: { hope: 6, control: 5, fear: 3, integrity: -3 } },
    ],
  },
  aurora: {
    title: "The Borrowed Aurora", category: "PUBLIC PERCEPTION", tag: "UPPER ATMOSPHERE",
    text: "An unusual solar storm is expected to light the polar sky. Millions are traveling to see it; many more will miss out. Your station can widen the display, but some scientists are already watching the atmospheric readings closely.",
    choices: [
      { label: "Paint a gentle aurora visible across several latitudes.", result: "The sky becomes a shared canvas. People look up together, and observatories log a phenomenon for the ages.", effects: { hope: 7, influence: 4, fear: 2, integrity: -4 } },
      { label: "Leave the aurora to nature and share the best viewing forecasts.", result: "The display is smaller, but viewers know it is the real sky—and they help one another find it.", effects: { empathy: 5, control: 3, hope: 3 } },
    ],
  },
  deepReply: {
    title: "The Deep Reply", category: "DEEP BIOSPHERE", tag: "CHAIN · FOLLOW-UP",
    text: "The ocean pulse answers your numbers with a map of warm vents and a repeating pattern. Scientists argue over whether it is a living signal. A research ship is already asking permission to descend.",
    choices: [
      { label: "Share the map openly and ask researchers to move slowly.", result: "The team publishes its findings and agrees to protect the site while they learn what lives there.", effects: { empathy: 7, hope: 5, influence: 4, fear: -2 } },
      { label: "Keep the location secret until you understand the signal yourself.", result: "The site stays undisturbed, but a leak turns caution into rumors of a hidden discovery.", effects: { control: 6, fear: 5, empathy: -2 } },
    ],
  },
  blackoutAfter: {
    title: "After the Lights Return", category: "INFRASTRUCTURE", tag: "CHAIN · FOLLOW-UP",
    text: "With power restored, engineers discover that an unknown source briefly stabilized the grid. The public wants answers; the emergency crews want their work recognized. What story will you leave behind?",
    choices: [
      { label: "Credit local crews and let their report disclose the anomaly honestly.", result: "The crews receive recognition. The mystery remains, but the account belongs to the people who were there.", effects: { empathy: 6, influence: 3, hope: 4, fear: -2 } },
      { label: "Let officials claim the entire rescue as their own success.", result: "The public is reassured, but the people who kept one another safe are left out of the story.", effects: { control: 5, fear: -1, empathy: -4 } },
    ],
  },
  summitAfter: {
    title: "The Morning After the Pact", category: "DIPLOMACY", tag: "CHAIN · FOLLOW-UP",
    text: "The agreement is signed, but its first test arrives before sunrise: one delegation wants to withdraw from the funding plan. The others are watching to see whether the pact means anything.",
    choices: [
      { label: "Offer a transparent compromise and give the smallest delegation time.", result: "The pact survives its first wobble. Trust grows by inches, which is how it tends to grow.", effects: { empathy: 5, hope: 6, influence: 4 } },
      { label: "Use a spectacular signal to make withdrawal look politically impossible.", result: "No one withdraws. The agreement holds, surrounded by a new and very visible fear.", effects: { control: 7, influence: 3, fear: 6, hope: -2 } },
    ],
  },
  rumorAfter: {
    title: "The Joke Becomes a Movement", category: "PUBLIC PERCEPTION", tag: "CHAIN · FOLLOW-UP",
    text: "The silly signal has become an online movement for curiosity and science education. Its organizers ask for a sign that they are not foolish to keep looking up.",
    choices: [
      { label: "Give them a constellation-shaped light show, then leave the sky alone.", result: "The movement celebrates wonder without demanding proof. Telescope clubs fill up across the planet.", effects: { hope: 6, empathy: 4, fear: -3, integrity: -2 } },
      { label: "Send a clear message that confirms an intelligence is watching.", result: "The answer is unmistakable. Humanity's curiosity surges, along with every fear that comes with being seen.", effects: { influence: 8, hope: 4, fear: 8, integrity: -5 } },
    ],
  },
};

const EVENT_POOL = ["storm", "garden", "signal", "archive", "blackout", "festival", "summit", "pollinators", "rumor", "river", "museum", "launch", "migration", "aurora"];
let run = createRun();
let toastTimer;

function createRun() {
  return { stats: { ...STARTING_STATE }, turn: 0, deck: shuffle(EVENT_POOL).slice(0, DAYS_PER_RUN - 1), deckIndex: 0, currentEventId: "intro", chainReturn: false, log: [], ended: false };
}
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function clamp(value) { return Math.min(100, Math.max(0, value)); }
function get(id) { return document.getElementById(id); }
function notify(message) {
  const toast = get("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function updateStats() {
  STAT_KEYS.forEach((key) => {
    const value = clamp(run.stats[key]);
    const number = get(`${key}Value`);
    const fill = get(`${key}Fill`);
    if (number) number.textContent = value;
    if (fill) fill.style.width = `${value}%`;
  });
}
function updateCycle() {
  const counter = get("dayCounter");
  if (counter) counter.textContent = String(Math.min(run.turn + 1, DAYS_PER_RUN)).padStart(2, "0");
  const number = get("eventNumber");
  if (number) number.textContent = `FILE ${String(Math.min(run.turn + 1, DAYS_PER_RUN)).padStart(3, "0")}`;
}
function renderLog() {
  const list = get("logList");
  if (!list) return;
  list.replaceChildren();
  run.log.slice(-12).reverse().forEach((entry) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = entry.title;
    item.append(title, document.createTextNode(entry.result));
    list.appendChild(item);
  });
  const count = get("feedCount");
  if (count) count.textContent = String(run.log.length).padStart(2, "0");
  const empty = get("feedEmpty");
  if (empty) empty.hidden = run.log.length > 0;
}
function renderEvent() {
  const event = events[run.currentEventId];
  if (!event) return;
  const title = get("eventTitle");
  const text = get("eventText");
  const category = get("eventCategory");
  const tag = get("eventTag");
  if (title) title.textContent = event.title;
  if (text) text.textContent = event.text;
  if (category) category.textContent = event.category;
  if (tag) tag.textContent = event.tag;
  updateCycle();
  updateStats();
  renderLog();

  const choices = get("choices");
  if (!choices) return;
  choices.replaceChildren();
  event.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    const number = document.createElement("span");
    number.className = "choice-number";
    number.textContent = `DIRECTIVE 0${index + 1}`;
    const label = document.createElement("span");
    label.className = "choice-label";
    label.textContent = choice.label;
    const impact = document.createElement("span");
    impact.className = "choice-impact";
    impact.textContent = Object.entries(choice.effects).map(([key, value]) => `${value > 0 ? "+" : ""}${value} ${key.toUpperCase()}`).join("  ·  ");
    const arrow = document.createElement("span");
    arrow.className = "choice-arrow";
    arrow.textContent = "↗";
    button.append(number, label, impact, arrow);
    button.addEventListener("click", () => choose(choice));
    choices.appendChild(button);
  });
}
function applyEffects(effects) {
  Object.entries(effects || {}).forEach(([key, delta]) => {
    if (STAT_KEYS.includes(key)) run.stats[key] = clamp(run.stats[key] + delta);
  });
}
function choose(choice) {
  if (run.ended) return;
  const event = events[run.currentEventId];
  run.log.push({ title: event.title, result: choice.result });
  applyEffects(choice.effects);

  if (run.chainReturn) {
    run.chainReturn = false;
    if (run.turn >= DAYS_PER_RUN) finishRun();
    else nextRandomEvent();
    return;
  }

  run.turn += 1;
  if (choice.chain) {
    run.chainReturn = true;
    run.currentEventId = choice.chain;
    renderEvent();
    return;
  }
  if (run.turn >= DAYS_PER_RUN) {
    finishRun();
    return;
  }
  nextRandomEvent();
}
function nextRandomEvent() {
  if (run.deckIndex >= run.deck.length) run.deck = shuffle(EVENT_POOL);
  run.currentEventId = run.deck[run.deckIndex++];
  renderEvent();
}
function getEnding() {
  const s = run.stats;
  if (s.fear >= 70 && s.control >= 70) return { title: "The Quiet Empire", text: "Earth has grown orderly beneath your watch, but its people have learned to look over their shoulders. The station is secure; the world is not sure it is free." };
  if (s.hope >= 70 && s.empathy >= 70) return { title: "A Garden of Worlds", text: "Humanity's kindness and hope outlast your interventions. The people of Earth build a future together, and your station learns the rare art of watching without taking credit." };
  if (s.integrity <= 35) return { title: "The Distant Signal", text: "Your station's systems are failing. Earth will have to continue without your guidance, carrying the consequences—and a few inexplicable stories—into the future." };
  if (s.empathy <= 25) return { title: "A Planet Apart", text: "Earth's systems endure, but the bonds between people have frayed. Your observation record is full of outcomes, and painfully short on understanding." };
  return { title: "The Human Horizon", text: "Earth remains complicated, surprising, and entirely its own. Your choices mattered, but they never wrote the whole story. The next chapter belongs to humanity." };
}
function finishRun() {
  run.ended = true;
  const ending = getEnding();
  const title = get("endingTitle");
  const description = get("endingDescription");
  if (title) title.textContent = ending.title;
  if (description) description.textContent = ending.text;
  const metrics = get("endingMetrics");
  if (metrics) metrics.textContent = STAT_KEYS.map((key) => `${key.toUpperCase()} ${run.stats[key]}`).join(" · ");
  get("endingOverlay")?.classList.remove("hidden");
  updateStats();
  renderLog();
}
function newRun() {
  run = createRun();
  get("endingOverlay")?.classList.add("hidden");
  renderEvent();
  notify("A new observation cycle has begun.");
}

get("restartButton")?.addEventListener("click", newRun);
get("newGameButton")?.addEventListener("click", () => {
  if (window.confirm("Start a new run? Your autosave will be replaced.")) newRun();
});
renderEvent();
