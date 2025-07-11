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
  SecondScreenText1: "Okay Sangeeth",
  SecondScreenText2: "Do you know",
  SecondScreenText3: "is a Good Friend ",
  SecondScreenText4: "So, I'm sure",
  GlobalMesssageLast: [
    "So Yaluu,",
    "You Are Good Friend",
    "I have to go now",
    "Wait more 10 seconds",
    "Good bye !"
  ]
};

// Declare global variables
var SecondScreenText1 = defaultData.SecondScreenText1;
var SecondScreenText2 = defaultData.SecondScreenText2;
var SecondScreenText3 =   defaultData.SecondScreenText3;
var SecondScreenText4 = defaultData.SecondScreenText4;
var GlobalMesssageLast =  defaultData.GlobalMesssageLast;

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
  // Always remove any old cache (optional: check for STORAGE_KEY existence first)
  localStorage.removeItem(STORAGE_KEY);

  // Fetch fresh data
  const res = await fetch(`https://bitymuqzjivftbneisfg.supabase.co/functions/v1/get-message-by-random-id?random_id=${randomId}`);
  if (res.ok) {
    const json = await res.json();
    if (json.message) {
      data = json.message;

      // Store fresh data with timestamp
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    }
  } else {
    console.warn("Using default values due to response error:", res.status);
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

  dynamicIslandName(data["fire_name"]); // after fetch


  // Set screen and global values
  SecondScreenText1 = data.second_screen1;
  SecondScreenText2 = data.second_screen2;
  SecondScreenText3 = data.second_screen3;
  SecondScreenText4 = data.second_screen4;
  GlobalMesssageLast = data.global_messages.messages;

  // Optional: do something with them
  
}

loadMessages();
