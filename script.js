document.addEventListener("DOMContentLoaded", function() {
    const messages = [
        { id: "message1" },
        { id: "message2"},
        { id: "message3"},
        { id: "message4" },
        { id: "message5" },
        { id: "message6" },
        
    ];

    let currentIndex = 0;

    function showNextMessage() {
        if (currentIndex < messages.length - 1) {
            const messageElement = document.getElementById(messages[currentIndex].id);
            messageElement.style.display = "block";
            messageElement.classList.add("fade-in");
            let displayTime= 2000;
            // Check if the current message is message4
            if (messages[currentIndex].id === "message4") {
                const imgElement = document.createElement("img");
                imgElement.src = "src/img/turn-up-volume.gif"; // Change this to your image path
                imgElement.alt = "Turn up volume";
                imgElement.id = "volumeImage"; // ID for styling/removal
                displayTime=5000;
    
                // Append the image to message4
                messageElement.appendChild(imgElement);
            }
    
            setTimeout(() => {
                messageElement.classList.remove("fade-in");
                messageElement.classList.add("fade-out");
    
                setTimeout(() => {
                    // Remove the image when hiding message4
                    if (messages[currentIndex].id === "message4") {
                        const imgToRemove = document.getElementById("volumeImage");
                        if (imgToRemove) imgToRemove.remove();
                    }
    
                    messageElement.style.display = "none";
                    messageElement.classList.remove("fade-out");
                    currentIndex++;
                    showNextMessage();
                }, 2000); // Time for fading out
            }, displayTime); // Time for displaying the message
        } else if (currentIndex === messages.length - 1) {
            const messageElement = document.getElementById(messages[currentIndex].id);
            messageElement.style.display = "block";
            messageElement.classList.add("fade-in");
    
            setTimeout(() => {
                messageElement.classList.remove("fade-in");
                document.getElementById("swipfirst").style.display = "inline-block";
            }, 2000); // Time for displaying the message
        }
    }
    
    // Add event listener to the start button to begin the animation sequence
    document.getElementById("start-button").addEventListener("click", function() {
        setTimeout(function() {
            document.getElementById("start-button").style.display = "none";
            document.getElementById("full-screen").style.display = "flex";
            document.getElementsByClassName("px__screen__frame")[0].style.backgroundImage = "url('src/img/gh.jpg')";
            let clickSound = document.getElementById('clickSound');
            clickSound.play();
          

   

            
    
            showNextMessage();
        }, 2000);
    });

    // Add event listener to the action button to show the image
    document.getElementById("swipfirst").addEventListener("touchstart", function() {
        document.getElementsByClassName("px__screen__frame")[0].style.backgroundImage = "url('src/img/iphonewall.jpg')";
        document.getElementById("swipfirst").style.display = "none";
        document.getElementById("message6").style.display = "none";

        document.getElementById("input-container").style.display = "block";
    });
    
});



function goFullscreen() {
    let elem = document.documentElement; // Get full document
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen(); // Firefox
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // Chrome, Safari, Edge
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen(); // IE/Edge
    }
  }

  // Add event listener to the button
  document.getElementById('start-button').addEventListener('click', function () {
    let button = this;
    button.classList.add('animate');

    // Call fullscreen function
    goFullscreen();

    setTimeout(() => {
      button.classList.remove('animate');
    }, 300);
  });







 // user entered name

 let globalName="";

function doSomething() {
    const name = document.getElementById('txtSearch').value.trim();
    const inputContainer = document.getElementById('input-container');
    const messageContainer = document.getElementById('message-container2');
    const nameError = document.getElementById('nameError');

    if (name === "") {
        nameError.textContent = "Please enter a name."; // Display error message
        return; // Stop further execution
    } else {
        nameError.textContent = ""; // Clear any previous error message
    }

    inputContainer.style.display = 'none'; 
    globalName = name; 
    let GlobalSecondScreenText = [
        SecondScreenText1,
        SecondScreenText2,
        `${globalName} ${SecondScreenText3}`,
        SecondScreenText4,
        `${globalName} will call You Now`
    ];

    const messages = GlobalSecondScreenText;

    // Longer delay for more time on screen
    let delay = 5000; // Adjust this value as needed 

    messages.forEach((message, index) => {
        setTimeout(() => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message22';
            messageElement.textContent = message;
            messageContainer.appendChild(messageElement);

            // Longer delay before removing
            setTimeout(() => {
                messageElement.remove();
            }, 5000); // Adjust this value as needed

        }, delay * index);
    });

    messageContainer.style.display = 'block';

    // Display the button after the messages have been shown and removed
    const totalDelay = delay * messages.length + 1000; // Adding extra delay for button display

    setTimeout(() => {
        document.getElementById('but3').style.display=("block");
    }, totalDelay);
}



document.getElementById('but3').addEventListener('click', handleInteraction);
document.getElementById('but3').addEventListener('touchstart', handleInteraction);
document.getElementById('but3').addEventListener('touchmove', handleInteraction);


function handleInteraction() {
    let clickS = document.getElementById('clickS');
    let clickSound = document.getElementById('clickSound');
    let ringtone = document.getElementById('ringtone');
    let button = this;
    document.getElementById('but3').style.display = "none";
    document.getElementsByClassName("px__screen__frame")[0].style.backgroundImage = "url('src/img/iphonehome.jpg')";


    // Pause clickSound and play clickS
    clickSound.pause();
    clickS.play();

    // Change the background image with a delay of 5 seconds
    setTimeout(() => {
        // Change the background image
        document.getElementsByClassName("px__screen__frame")[0].style.backgroundImage = "url('src/img/calling.png')";
        
        // Set the text content to globalName and display it
        document.getElementById('ringName').textContent = globalName + " 😊";
        document.getElementById('ringName').style.display = "block";
        
        // Make the 'trabsparentrectangle' element visible
        document.getElementById('trabsparentrectangle').style.display = "block";
    }, 5000);

    // Play ringtone with a delay of 5 seconds
    setTimeout(() => {
        ringtone.play();
    }, 5000);

    // Add and remove 'animate' class to the button
    button.classList.add('animate');
    setTimeout(() => {
        button.classList.remove('animate');
    }, 300);
}




document.getElementById('trabsparentrectangle').addEventListener('click', function() {
    let clickS = document.getElementById('clickS');
    let happybithdaymusic = document.getElementById('happybithdaymusic');
    
    let ringtone = document.getElementById('ringtone');

    // Pause clickSound and ringtone, play happybithdaymusic
    document.getElementById('ringName').style.display="none";
    document.getElementById('trabsparentrectangle').style.display = "none";
    document.getElementsByClassName("px__screen__frame")[0].style.backgroundImage = "url('src/img/birthwall1.jpg')"
    clickS.pause();
    ringtone.pause();
    happybithdaymusic.play();

    // Array of background images
    let images = [
        "url('src/img/birthwall2.jpg')",
        "url('src/img/birthwall5.jpg')",
        "url('src/img/birthwall4.jpg')",
        
        "url('src/img/birthwall11.jpg')",
        
    ];
    
    let currentIndex = 0;
    const screenFrame = document.getElementsByClassName("px__screen__frame")[0];
    
    setTimeout(() => {
        const imageInterval = setInterval(() => {
            screenFrame.style.backgroundImage = images[currentIndex++];
            if (currentIndex >= images.length) clearInterval(imageInterval);
        }, 5000);
    }, 5000);
    

    setTimeout(() => {
        document.getElementById('fireRectangle').style.display = "block";
    
        // Toggle the background image every 5 seconds
       
        // Clear the interval after 10 seconds (2 cycles)
        
    }, 30000);
});



document.getElementById('fireRectangle').addEventListener('touchmove', handleInteraction2);

function handleInteraction2() {
    let happybirthdaymusic = document.getElementById('happybithdaymusic');
    document.getElementById('fireRectangle').style.display = "none";
    happybirthdaymusic.pause();
    document.getElementsByClassName("px__screen__frame")[0].style.backgroundImage = "url('src/img/gh.jpg')";

    const messageslast = GlobalMesssageLast;
    let delay = 5000; // Delay between messages

    messageslast.forEach((message, index) => {
        setTimeout(() => {
            const messageElement = document.createElement('div');
            messageElement.className = 'lastscreen-message1';
            messageElement.textContent = message;
            document.body.appendChild(messageElement);

            setTimeout(() => {
                messageElement.remove();

                if (index === messageslast.length - 1) {
                    document.getElementById("iphonescreen").style.display = "none";
                    document.body.style.backgroundColor = "black";
                    window.location.href = "src/fire/index.html";
                }
            }, 7000); // how long each message stays

        }, delay * index);
    });
}


