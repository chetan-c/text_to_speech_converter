let speech = new SpeechSynthesisUtterance();
let voices = [];
const voiceSelect = document.querySelector("select");
const downloadButton = document.querySelector("#downloadButton");
let audioChunks = [];

// Load available voices and filter by supported language
function loadVoices() {
    voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
    if (voices.length === 0) {
        alert("No supported voices available on this device.");
    } else {
        speech.voice = voices[0];
        voiceSelect.innerHTML = "";  // Clear previous options
        voices.forEach((voice, index) => {
            voiceSelect.options[index] = new Option(`${voice.name} (${voice.lang})`, index);
        });
    }
}

// Load voices dynamically
window.speechSynthesis.onvoiceschanged = loadVoices;

// Set voice when selected
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Handle Text-to-Speech and Recording
document.querySelector("#speakButton").addEventListener("click", () => {
    const textInput = document.querySelector("textarea").value.trim();
    if (!textInput) {
        alert("Please enter text to speak.");
        return;
    }

    speech.text = textInput;
    speech.pitch = 1;  // Adjust pitch (0.1 to 2)
    speech.rate = 1;   // Adjust rate (0.1 to 10)
    speech.volume = 1; // Adjust volume (0 to 1)

    window.speechSynthesis.speak(speech);

    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);

    speech.onstart = () => {
        mediaRecorder.start();
    };

    speech.onend = () => {
        mediaRecorder.stop();
    };

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioURL = URL.createObjectURL(audioBlob);

        downloadButton.href = audioURL;
        downloadButton.download = "speech.mp3";
        downloadButton.style.display = "block";
    };
});
