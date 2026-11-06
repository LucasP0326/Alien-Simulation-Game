const initialState = {
  day: 1,
  empathy: 55,
  influence: 45,
  fear: 40,
  hope: 60,
  control: 50,
  integrity: 100,
  ending: null,
};

const state = { ...initialState };

const eventOrder = [
  "intro",
  "coastalStorm",
  "protest",
  "warheadCrisis",
  "summit",
  "oceanSignal",
  "bioethics",
  "orbitalDebris",
  "finale"
];

const eventMap = {
  intro: {
    title: "First Transmission",
    text: "Your observation station drifts above Earth like a cold star. Below it, nations argue, scientists collaborate, and civilizations dream. From your perspective, the planet is a living machine—fragile, brilliant, and dangerous. You must decide how much to disturb the pattern beneath you.",
    choices: [
      {
        label: "Broadcast a soft signal to encourage global cooperation.",
        result: "A gentle pulse ripples through radio arrays across Earth, reminding humanity that it is not alone.",
        effects: { empathy: 8, hope: 7, fear: -3, influence: 5 },
        next: "coastalStorm"
      },
      {
        label: "Observe quietly and let the planet evolve without intervention.",
        result: "The world continues in its own chaotic rhythm, and no one notices the unseen watcher above.",
        effects: { control: 4, fear: 2, empathy: -3, influence: -2 },
        next: "coastalStorm"
      }
    ]
  },

  coastalStorm: {
    title: "Coastal Storm",
    text: "A massive cyclone tears across the eastern coastlines. Floodwaters swallow entire neighborhoods. Governments scramble to distribute aid while climate activists demand emergency action. The planet is in pain, and the world is looking at the sky for answers.",
    choices: [
      {
        label: "Create a brief atmospheric disturbance that redirects the storm away from densely populated cities.",
        result: "The storm bends north, sparing millions. Humanity calls it a miracle. Your station hums with quiet satisfaction.",
        effects: { control: 9, fear: 5, hope: 7, integrity: -4 },
        next: "protest"
      },
      {
        label: "Reveal nothing and let natural systems take their course.",
        result: "The storm destroys coastlines and forces a global conversation about climate policy. The human world learns to panic and to adapt.",
        effects: { empathy: 4, fear: 8, hope: -6, influence: 3 },
        next: "protest"
      }
    ]
  },

  protest: {
    title: "Global Protest",
    text: "People gather in cities, not only to demand climate reform but to accuse their leaders of failing to act. A chorus of fear and hope rises across the planet. In the middle of it all, a single unknown signal appears in the data from your station.",
    choices: [
      {
        label: "Use your influence to release a public message: humanity must unite before the climate crisis deepens.",
        result: "A message from the sky appears in every major language. It is treated as a call to action. Some call it divine. Others call it manipulation.",
        effects: { influence: 11, hope: 10, fear: 4, empathy: 7 },
        next: "protestFollowUp"
      },
      {
        label: "Suppressed the signal and let human leaders take responsibility alone.",
        result: "The world recoils from the silence. The protests intensify. Some believe they were betrayed by fate itself.",
        effects: { fear: 8, hope: -5, control: 3, empathy: -2 },
        next: "warheadCrisis"
      }
    ]
  },

  protestFollowUp: {
    title: "After the Signal",
    text: "The message changes global priorities. Cities begin organizing emergency response, and an unlikely alliance forms between nations, activists, and corporations. But a small number of extremists interpret your act as a sign that something larger is watching them.",
    choices: [
      {
        label: "Send a second message offering a peace plan with scientific cooperation and fair resource sharing.",
        result: "The world begins to collaborate, but the more you intervene, the more your presence feels inevitable.",
        effects: { influence: 9, hope: 7, empathy: 8, fear: -3 },
        next: "warheadCrisis"
      },
      {
        label: "Turn your attention elsewhere and leave humanity to decide its own future.",
        result: "The momentum fades. The world still grows more resilient, but it also grows more suspicious of the unknown.",
        effects: { hope: 3, empathy: -2, control: -5, fear: 4 },
        next: "warheadCrisis"
      }
    ]
  },

  warheadCrisis: {
    title: "Warhead Crisis",
    text: "A chain of mistakes, paranoia, and military software errors brings nuclear missiles to high alert across two rival powers. The world teeters on the edge of mutual destruction. One false move could erase entire cities.",
    choices: [
      {
        label: "Temporarily jam a small portion of the satellites in the region to prevent a strike.",
        result: "A panic-alarm fails to trigger. The missiles remain on standby, but the launch sequence is interrupted. The world breathes again.",
        effects: { control: 12, fear: -7, hope: 8, integrity: -8 },
        next: "warheadFollowUp"
      },
      {
        label: "Do nothing. Let tension burn until the nations choose their own path.",
        result: "The arms race intensifies. World leaders parse every gesture as a threat. The planet trembles with dread.",
        effects: { fear: 12, hope: -8, empathy: -4, influence: 3 },
        next: "summit"
      }
    ]
  },

  warheadFollowUp: {
    title: "The Countdown",
    text: "The missiles do not launch, but the silence afterward is heavier than the noise. The surviving commanders face a truth they cannot ignore: if they are not in control of the world, then someone else may be. A new wave of fear spreads through every capital.",
    choices: [
      {
        label: "Reveal your presence as a benevolent observer and offer a diplomatic intervention model.",
        result: "The world is stunned. Some governments refuse to believe it, others pursue alliance, and the rest begin to prepare for a new era of narrative warfare.",
        effects: { influence: 10, fear: 7, hope: 6, empathy: 5 },
        next: "summit"
      },
      {
        label: "Keep your actions secret and let the world learn from its own near catastrophe.",
        result: "The crisis resolves without fanfare, and humanity gains a harsh lesson in the cost of fear.",
        effects: { fear: -6, hope: 5, empathy: 4, control: -3 },
        next: "summit"
      }
    ]
  },

  summit: {
    title: "Summit of the Broken World",
    text: "Representatives from multiple nations gather in an emergency summit. Their speeches are fractured by exhaustion, grief, and pride. One of the delegates proposes a new global institution dedicated to planetary stewardship. The decision will define the next generation.",
    choices: [
      {
        label: "Assist the summit by amplifying a call for global stewardship and transparency.",
        result: "Nations agree to share climate data, disaster response, and resource planning. For a moment, the planet moves toward unity.",
        effects: { hope: 10, empathy: 8, influence: 7, fear: -4 },
        next: "oceanSignal"
      },
      {
        label: "Whisper a warning that humanity will slip into authoritarianism if it is not challenged.",
        result: "The summit fractures. Scientists and reformers gain power, but fear of hidden forces grows stronger.",
        effects: { fear: 9, control: 8, empathy: -2, hope: 2 },
        next: "oceanSignal"
      }
    ]
  },

  oceanSignal: {
    title: "Ocean Signal",
    text: "A deep-sea listening array detects a pattern beneath the Atlantic—a sequence of rhythmic pulses that repeats with impossible regularity. The media calls it a natural phenomenon. The scientific community calls it a message.",
    choices: [
      {
        label: "Send a signal back to the source to see whether it responds.",
        result: "The pulses answer. A second sequence arrives, richer and more deliberate. The world learns that the biosphere might not be alone.",
        effects: { influence: 7, fear: 8, hope: 6, empathy: 5 },
        next: "oceanFollowUp"
      },
      {
        label: "Cut the transmission and let the ocean remain a mystery.",
        result: "The pattern fades into the deep. Humanity remains curious but secure in its ignorance.",
        effects: { fear: -4, control: 5, empathy: -3, hope: -2 },
        next: "bioethics"
      }
    ]
  },

  oceanFollowUp: {
    title: "The Deep Reply",
    text: "The reply is not a language but a map. It collapses into a sequence of coordinates, weather anomalies, and an unmistakable biological formula. That formula describes a hidden ecosystem moving beneath the earth's crust.",
    choices: [
      {
        label: "Share the coordinates with scientists and permit a deep public inquiry.",
        result: "Humanity becomes obsessed with discovery. It begins to see itself not as ruler of the planet, but as one species among many.",
        effects: { empathy: 10, hope: 8, influence: 5, fear: -3 },
        next: "bioethics"
      },
      {
        label: "Keep the discovery private and prepare to study it in secrecy.",
        result: "Governments speculate and panic. There are whispers of secret landings, ancient rituals, and a new kind of sovereignty.",
        effects: { fear: 8, control: 10, influence: 5, empathy: -2 },
        next: "bioethics"
      }
    ]
  },

  bioethics: {
    title: "The Bioethics Debate",
    text: "A new debate begins: if life exists beneath the Earth's crust, do humans have a duty to protect it? If your station can produce a field that alters ecosystems, should you? The debate is not about science but about values.",
    choices: [
      {
        label: "Create a subtle ecological intervention to heal a dying region and demonstrate restraint.",
        result: "The region recovers, but the world’s scientific community becomes convinced that the unknown is capable of managing the planet better than governments are.",
        effects: { empathy: 8, hope: 9, influence: 6, integrity: -6 },
        next: "orbitalDebris"
      },
      {
        label: "Leave the ecosystem alone and let humanity discover nature without a helper.",
        result: "The planet remains wild, but conflict erupts over whether the unknown should ever act at all.",
        effects: { fear: 7, control: 4, empathy: -3, hope: -2 },
        next: "orbitalDebris"
      }
    ]
  },

  orbitalDebris: {
    title: "Orbital Debris",
    text: "A cloud of armored fragments from old satellites begins to drift toward the Earth. The debris threatens weather satellites, navigation networks, and the fragile order that keeps modern cities alive. The question is no longer whether the world can survive, but whether it can survive itself.",
    choices: [
      {
        label: "Pull the debris into a harmless orbit using a temporary gravitational nudge.",
        result: "The cloud is redirected. The world continues. Some humans believe you saved them; others believe you chose their future for them.",
        effects: { hope: 10, control: 11, integrity: -4, fear: -4 },
        next: "finale"
      },
      {
        label: "Do nothing and let the planet face the consequences of its own machinery.",
        result: "The debris crashes into heavily populated regions. The aftermath reshapes the planet into a far more fearful and fractured place.",
        effects: { fear: 12, empathy: -5, hope: -8, control: 2 },
        next: "finale"
      }
    ]
  },

  finale: {
    title: "The New Dawn",
    text: "Your observation arc reaches its end. Earth has been changed by the decisions you made, by the choices humans made, and by the unseen pressure of a distant intelligence guiding events from above. Now the planet must decide who it is after the night.",
    choices: [
      {
        label: "Open a final transmission and declare that humanity is capable of its own salvation.",
        result: "The world accepts the message with awe and renewed responsibility.",
        effects: {},
        gameOver: true
      },
      {
        label: "Remain silent and let Earth define its own destiny.",
        result: "The planet is left to inherit the uncertain future you stewarded.",
        effects: {},
        gameOver: true
      }
    ]
  }
};

const metricKeys = ["empathy", "influence", "fear", "hope", "control", "integrity"];

const statRefs = {
  empathy: document.getElementById("empathyValue"),
  influence: document.getElementById("influenceValue"),
  fear: document.getElementById("fearValue"),
  hope: document.getElementById("hopeValue"),
  control: document.getElementById("controlValue"),
  integrity: document.getElementById("integrityValue"),
};

const fillRefs = {
  empathy: document.getElementById("empathyFill"),
  influence: document.getElementById("influenceFill"),
  fear: document.getElementById("fearFill"),
  hope: document.getElementById("hopeFill"),
  control: document.getElementById("controlFill"),
  integrity: document.getElementById("integrityFill"),
};

const eventTitle = document.getElementById("eventTitle");
const eventText = document.getElementById("eventText");
const choicesContainer = document.getElementById("choices");
const logList = document.getElementById("logList");
const dayCounter = document.getElementById("dayCounter");
const endingOverlay = document.getElementById("endingOverlay");
const endingTitle = document.getElementById("endingTitle");
const endingDescription = document.getElementById("endingDescription");
const restartButton = document.getElementById("restartButton");

let currentEventId = "intro";
let currentIndex = 0;

function clamp(value) {
  return Math.min(100, Math.max(0, value));
}

function updateStats() {
  metricKeys.forEach((key) => {
    const value = clamp(state[key]);
    const current = statRefs[key];
    const fill = fillRefs[key];

    if (current) current.textContent = value;
    if (fill) fill.style.width = `${value}%`;

    if (key === "fear") {
      fill.style.background = "linear-gradient(90deg, #fbbf24, #f87171)";
    } else if (key === "integrity") {
      fill.style.background = "linear-gradient(90deg, #6ee7b7, #7dd3fc)";
    } else {
      fill.style.background = "linear-gradient(90deg, #7dd3fc, #a78bfa)";
    }
  });
}

function addLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  logList.prepend(item);
}

function getCurrentEvent() {
  return eventMap[currentEventId];
}

function renderCurrentEvent() {
  const event = getCurrentEvent();
  if (!event) return;

  eventTitle.textContent = event.title;
  eventText.textContent = event.text;
  choicesContainer.innerHTML = "";

  event.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.textContent = choice.label;
    button.addEventListener("click", () => handleChoice(choice));
    choicesContainer.appendChild(button);
  });
}

function applyEffects(effectMap) {
  Object.entries(effectMap).forEach(([key, value]) => {
    if (!(key in state)) return;
    state[key] = clamp(state[key] + value);
  });
}

function determineEnding() {
  const fearHigh = state.fear >= 75;
  const hopeHigh = state.hope >= 75;
  const empathyHigh = state.empathy >= 75;
  const controlHigh = state.control >= 80;
  const integrityLow = state.integrity <= 35;

  if (fearHigh && controlHigh) {
    return {
      title: "The Silent Sovereign",
      description: "You taught Earth to fear the unseen. Under your distant rule, global systems become efficient, rigid, and deeply afraid. Humanity survives, but it does so under a colder sky."
    };
  }

  if (hopeHigh && empathyHigh) {
    return {
      title: "The Gentle Watcher",
      description: "You guided Earth toward cooperation without crushing its autonomy. Humanity grows wiser and kinder, sharing power instead of hoarding it. The planet thrives beneath a brighter horizon."
    };
  }

  if (integrityLow && fearHigh) {
    return {
      title: "The Ashen Future",
      description: "Your station could not stop the planet from collapsing into panic and decay. The world suffers, and the story of Earth becomes one of loss, chaos, and unfinished loyalties."
    };
  }

  return {
    title: "The Human Horizon",
    description: "Earth survives, imperfect and restless, but with a new understanding of itself. You leave the world to decide its future while you remain a distant, unanswered question in the dark."
  };
}

function endGame() {
  const ending = determineEnding();
  endingTitle.textContent = ending.title;
  endingDescription.textContent = ending.description;
  endingOverlay.classList.remove("hidden");
}

function advanceToNextEvent(nextId) {
  currentEventId = nextId;
  currentIndex = eventOrder.indexOf(nextId);
  dayCounter.textContent = String(Math.min(currentIndex + 1, eventOrder.length));
  renderCurrentEvent();
}

function handleChoice(choice) {
  const event = getCurrentEvent();
  addLog(`${event.title}: ${choice.result}`);
  applyEffects(choice.effects || {});
  updateStats();

  if (choice.gameOver) {
    endGame();
    return;
  }

  const nextEventId = choice.next || eventOrder[Math.min(currentIndex + 1, eventOrder.length - 1)];

  if (nextEventId === "finale" || currentIndex >= eventOrder.length - 1) {
    advanceToNextEvent("finale");
    return;
  }

  advanceToNextEvent(nextEventId);
}

function resetGame() {
  Object.assign(state, initialState);
  currentEventId = "intro";
  currentIndex = 0;
  endingOverlay.classList.add("hidden");
  dayCounter.textContent = "1";
  updateStats();
  renderCurrentEvent();
  addLog("Mission initialized. Earth is entering a new observation cycle.");
}

restartButton.addEventListener("click", resetGame);

updateStats();
renderCurrentEvent();
addLog("Mission initialized. Earth is entering a new observation cycle.");
