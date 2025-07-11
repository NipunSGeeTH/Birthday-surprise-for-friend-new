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
        
        if (result && result.random_id) {
          const shareUrl = `https://my-domain.com/?${result.random_id}`;
          document.getElementById("response").innerHTML = `
            <div class="response success">
              <h3>🎉 Success! Your birthday message is ready!</h3>
              <p>Share this link with your friend to surprise them:</p>
              <div class="share-controls">
                <input type="text" id="shareLink" value="${shareUrl}" readonly>
                <button id="copyBtn">Copy</button>
                <button id="shareBtn" class="share-btn">Share</button>
              </div>
            </div>
          `;
          
          // Copy functionality
          document.getElementById("copyBtn").addEventListener('click', async function() {
            const linkInput = document.getElementById("shareLink");
            try {
              await navigator.clipboard.writeText(linkInput.value);
              this.textContent = "Copied!";
              setTimeout(() => { this.textContent = "Copy"; }, 2000);
            } catch (err) {
              linkInput.select();
              document.execCommand("copy");
              this.textContent = "Copied!";
              setTimeout(() => { this.textContent = "Copy"; }, 2000);
            }
          });
          
          // Share functionality
          document.getElementById("shareBtn").addEventListener('click', async function() {
            const shareUrl = document.getElementById("shareLink").value;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: "Birthday Surprise! 🎉",
                  text: "Someone created a special birthday message for you!",
                  url: shareUrl
                });
              } catch (err) {
                console.log('Share cancelled');
              }
            } else {
              try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard! You can now paste it anywhere to share.");
              } catch (err) {
                alert("Sharing not supported on this browser. Please copy the link manually.");
              }
            }
          });
          
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