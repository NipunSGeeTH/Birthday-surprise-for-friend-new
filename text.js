const message1 = document.getElementById('message1');
const message2 = document.getElementById('message2');
const message3 = document.getElementById('message3');
const message4 = document.getElementById('message4');
const message5 = document.getElementById('message5');
const entertext1 = document.getElementById('message22');

const STORAGE_KEY = "fetched_message_data";
const EXPIRATION_TIME_MS = 10 * 60 * 1000; // 10 minutes

// ✅ Define this function
function getRandomIdFromUrl() {
  const rawQuery = window.location.search; // ?2570ea
  return rawQuery.startsWith("?") ? rawQuery.slice(1) : rawQuery;
}

// Default values
const defaultData = {
  message1: "Power On",
  message2: "Hi' baba",
  message3: "I'm Your New Phone",
  message4: "Please Turn up Volume bit.",
  message5: "I have to Say You Somthing",
  entertext1: "Enter your friend's name please",
  second_screen1: "Okay Sangeeth",
  second_screen2: "Do you know",
  second_screen3: "is a Good Friend ",
  second_screen4: "So, I'm sure",
  global_messages: [
    "So Yaluu,",
    "You Are Good Friend",
    "I have to go now",
    "Wait more 10 seconds",
    "Good bye !",
  ]
};


//This function to change dynamic island name text
function dynamicIslandName(newName) {
  const style = document.createElement('style');
  style.innerHTML = `
    .content .text::before {
      content: "${newName}";
      order: 1;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);
}


async function loadMessages() {
  let data = defaultData;

  const randomId = getRandomIdFromUrl(); // ✅ This now works

  if (!randomId) {
    console.warn("No random_id found in URL");
    return;
  }

  try {
    // Check if cached data exists and is still valid
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;

      if (age < EXPIRATION_TIME_MS && parsed.data) {
        data = parsed.data;
        console.log("Loaded data from cache");
      } else {
        localStorage.removeItem(STORAGE_KEY); // expired
      }
    }

    // If no valid cache, fetch fresh data
    if (data === defaultData) {
      const res = await fetch(`https://bitymuqzjivftbneisfg.supabase.co/functions/v1/get-message-by-random-id?random_id=${randomId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.message) {
          data = json.message;
          // Cache the result with timestamp
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: data
          }));
        }
      } else {
        console.warn("Using default values due to response error:", res.status);
      }
    }
  } catch (error) {
    console.warn("Fetch failed, using default values:", error);
  }

  // Update content
  message1.textContent = data.message1;
  message2.textContent = data.message2;
  message3.textContent = data.message3;
  message4.textContent = data.message4;
  message5.textContent = data.message5;
  entertext1.textContent = data.entertext1;

  dynamicIslandName(data["fire-name"]); // after fetch


  // Set screen and global values
  let SecondScreenText1 = data.second_screen1;
  let SecondScreenText2 = data.second_screen2;
  let SecondScreenText3 = data.second_screen3;
  let SecondScreenText4 = data.second_screen4;
  let GlobalMesssageLast = data.global_messages;

  // Optional: do something with them
  console.log({ SecondScreenText1, SecondScreenText2, SecondScreenText3, SecondScreenText4, GlobalMesssageLast });
}

loadMessages();
