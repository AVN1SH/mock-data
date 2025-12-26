import { BotResponse, CollectedData } from "../types";

const MOCK_STEPS = [
  {
    id: 1,
    text: "Hello! I'm your AI Travel assistant. Let's plan your dream vacation together. First, what kind of vibe are you looking for?",
    options: ["Relaxing Beach", "City Exploration", "Mountain Adventure", "Cultural Immersion"],
    key_name: "vibe"
  },
  {
    id: 2,
    text: "Great choice! What is your budget range for this trip?",
    options: ["Budget Friendly", "Moderate", "Luxury", "Money is no object"],
    key_name: "budget"
  },
  {
    id: 3,
    text: "Got it. How long are you planning to stay?",
    options: ["Weekend Getaway", "1 Week", "2 Weeks", "Month or more"],
    key_name: "duration"
  },
  {
    id: 4,
    text: "Nice. Who will you be traveling with?",
    options: ["Solo", "Couple", "Family", "Friends"],
    key_name: "companions"
  },
  {
    id: 5,
    text: "What kind of activities interest you the most?",
    options: ["Relaxing", "Adventure Sports", "Museums & History", "Food & Nightlife"],
    key_name: "activity"
  },
  {
    id: 6,
    text: "Almost done! Do you have a culinary preference?",
    options: ["Street Food", "Fine Dining", "Local Home Cooked", "Anything goes"],
    key_name: "food"
  }
];

export const getNextStep = async (
  collectedData: CollectedData,
  historySummary: string
): Promise<BotResponse> => {
  // Reduced delay because the UI now handles the "thinking" animation time
  await new Promise(resolve => setTimeout(resolve, 400));

  // Determine which step we are on based on the number of collected data points.
  // collectedData accumulates keys as we go.
  const stepsTaken = Object.keys(collectedData).length;

  if (stepsTaken >= MOCK_STEPS.length) {
    // Collect values for summary
    const values = Object.values(collectedData);
    const vibe = values[0] || "vacation";
    const budget = values[1] || "trip";

    return {
      text: `Perfect! I have all the details. Based on your interest in a ${vibe} with a ${budget} budget, I'll start putting together a custom itinerary.`,
      options: [],
      key_name: "finished",
      finished: true
    };
  }

  const step = MOCK_STEPS[stepsTaken];

  return {
    text: step.text,
    options: step.options,
    key_name: step.key_name,
    finished: false
  };
};