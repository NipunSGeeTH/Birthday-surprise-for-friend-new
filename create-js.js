const defaultData = {
      message1: "Power On",
      message2: "Hi' Sangeeth",
      message3: "I'm Your New Phone",
      message4: "Please Turn up Volume bit.",
      message5: "I have to Say You Something",
      entertext1: "Enter your friend's name please",
      SecondScreenText1: "Okay Sangeeth",
      SecondScreenText2: "Do you know",
      SecondScreenText3: "is a Good Friend",
      SecondScreenText4: "So, I'm sure",
      GlobalMesssageLast: [
        "So Yaluu,",
        "You Are Good Friend",
        "I have to go now",
        "Wait more 10 seconds",
        "Good bye !"
      ],
      fire_title: "Happy Birthday",
      fire_name: "Sangeeth"
    };

    // Image overlay functions
    function showImage(imageSrc, label) {
      const overlay = document.getElementById('imageOverlay');
      const overlayImage = document.getElementById('overlayImage');
      const overlayLabel = document.getElementById('overlayLabel');
      
      overlayImage.src = imageSrc;
      overlayLabel.textContent = label;
      overlay.classList.add('show');
    }

    function hideImage() {
      const overlay = document.getElementById('imageOverlay');
      overlay.classList.remove('show');
    }

    // Close overlay when clicking outside
    document.getElementById('imageOverlay').addEventListener('click', function(e) {
      if (e.target === this) {
        hideImage();
      }
    });

    // Close overlay on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hideImage();
      }
    });

    // Fill defaults on load
    window.addEventListener('load', () => {
      document.getElementById("message1").value = defaultData.message1;
      document.getElementById("message2").value = defaultData.message2;
      document.getElementById("message3").value = defaultData.message3;
      document.getElementById("message4").value = defaultData.message4;
      document.getElementById("message5").value = defaultData.message5;
      document.getElementById("entertext1").value = defaultData.entertext1;
      document.getElementById("second_screen1").value = defaultData.SecondScreenText1;
      document.getElementById("second_screen2").value = defaultData.SecondScreenText2;
      document.getElementById("second_screen3").value = defaultData.SecondScreenText3;
      document.getElementById("second_screen4").value = defaultData.SecondScreenText4;
      document.getElementById("global_messages").value = defaultData.GlobalMesssageLast.join("\n");
      document.getElementById("fire_title").value = defaultData.fire_title;
      document.getElementById("fire_name").value = defaultData.fire_name;
    });

    // Add this function for showing the fullscreen popup with all links
    function showLinksPopup(urls) {
      const popup = document.createElement('div');
      popup.className = 'links-popup';

      popup.innerHTML = `
        <div class="links-popup-content">
          <button class="close-links-popup" onclick="document.body.removeChild(document.querySelector('.links-popup'));">×</button>
          <h2>🎉 Your Birthday Surprise Links</h2>
          you can use any link you like to share with your friend.
          <div class="links-list">
            ${urls.map((url, i) => `
              <div class="link-row">
               
                <input type="text" value="${url}" readonly id="linkInput${i}">
                <button class="copy-link-btn" data-index="${i}">Copy</button>
           
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      // Copy button functionality
      popup.querySelectorAll('.copy-link-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const idx = this.getAttribute('data-index');
          const input = document.getElementById(`linkInput${idx}`);
          try {
            await navigator.clipboard.writeText(input.value);
            this.textContent = "Copied!";
            setTimeout(() => { this.textContent = "Copy"; }, 2000);
          } catch {
            input.select();
            document.execCommand("copy");
            this.textContent = "Copied!";
            setTimeout(() => { this.textContent = "Copy"; }, 2000);
          }
        });
      });

      // Share button functionality
      popup.querySelectorAll('.share-link-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const idx = this.getAttribute('data-index');
          const url = document.getElementById(`linkInput${idx}`).value;
          if (navigator.share) {
            try {
              await navigator.share({
                title: "Birthday Surprise! 🎉",
                text: "Someone created a special birthday message for you!",
                url
              });
            } catch {}
          } else {
            try {
              await navigator.clipboard.writeText(url);
              alert("Link copied to clipboard! You can now paste it anywhere to share.");
            } catch {
              alert("Sharing not supported on this browser. Please copy the link manually.");
            }
          }
        });
      });
    }

    document.getElementById("birthdayForm").addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const submitBtn = document.querySelector('.submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      
      // Show loading state
      btnText.innerHTML = '<span class="loading"></span> Generating...';
      submitBtn.disabled = true;

      const data = {
        message1: document.getElementById("message1").value,
        message2: document.getElementById("message2").value,
        message3: document.getElementById("message3").value,
        message4: document.getElementById("message4").value,
        message5: document.getElementById("message5").value,
        entertext1: document.getElementById("entertext1").value,
        second_screen1: document.getElementById("second_screen1").value,
        second_screen2: document.getElementById("second_screen2").value,
        second_screen3: document.getElementById("second_screen3").value,
        second_screen4: document.getElementById("second_screen4").value,
        global_messages: {
          messages: document.getElementById("global_messages").value.split("\n").filter(msg => msg.trim())
        },
        fire_title: document.getElementById("fire_title").value,
        fire_name: document.getElementById("fire_name").value
      };

      try {
        const res = await fetch("https://bitymuqzjivftbneisfg.supabase.co/functions/v1/add-birthday-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        // --- Update: handle 5 URLs ---
        if (result && result.random_id) {
          // Example: 5 different domains
      const urls = [
  `https://whatinsideits.web.app/?${result.random_id}`,
  `https://giftoyou.web.app/?${result.random_id}`,
  `https://it4you.web.app/?${result.random_id}`,
  `https://itforyou.web.app/?${result.random_id}`,
  `https://whatit.web.app/?${result.random_id}`
];
          showLinksPopup(urls);
          document.getElementById("response").innerHTML = "";
        } else {
          document.getElementById("response").innerHTML = `
            <div class="response success">
              <h3>✅ Success!</h3>
              <p>Response: ${JSON.stringify(result)}</p>
            </div>
          `;
        }

      } catch (error) {
        document.getElementById("response").innerHTML = `
          <div class="response error">
            <h3>❌ Error occurred</h3>
            <p>Something went wrong: ${error.message}</p>
            <p>Please try again.</p>
          </div>
        `;
      } finally {
        // Reset button state
        btnText.textContent = 'Generate Link';
        submitBtn.disabled = false;
      }
    });