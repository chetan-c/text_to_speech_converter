let speech = new SpeechSynthesisUtterance();
let voices = [];
const audioChunks = [];
const voiceSelect = document.querySelector("select");
const downloadButton = document.querySelector("#downloadButton");

// Load and populate available voices
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
    voiceSelect.innerHTML = "";  // Clear existing options
    voices.forEach((voice, index) => {
        voiceSelect.options[index] = new Option(voice.name, index);
    });
    speech.voice = voices[0];  // Set default voice
};

// Set selected voice when user changes tone
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Speak text and allow multiple button presses
document.querySelector("#speakButton").addEventListener("click", () => {
    const textInput = document.querySelector("textarea").value.trim();
    if (!textInput) {
        alert("Please enter text to speak.");
        return;
    }

    speech.text = textInput;
    speech.voice = voices[voiceSelect.value];  // Ensure correct voice is set
    window.speechSynthesis.speak(speech);

    // Start recording audio for download
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);

    speech.onstart = () => {
        mediaRecorder.start();
    };

    speech.onend = () => {
        mediaRecorder.stop();
    };

    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);

        downloadButton.href = audioURL;
        downloadButton.download = "speech.wav";
        downloadButton.style.display = "block";
    };
});
