let speech = new SpeechSynthesisUtterance();
let voices = [];
let audioChunks = [];
const voiceSelect = document.querySelector("select");
const downloadButton = document.querySelector("#downloadButton");

// Load and populate available voices
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];
    voices.forEach((voice, index) => {
        voiceSelect.options[index] = new Option(voice.name, index);
    });
};

// Set selected voice
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Text-to-Speech and Audio Download
document.querySelector("#speakButton").addEventListener("click", () => {
    const textInput = document.querySelector("textarea").value.trim();
    if (!textInput) {
        alert("Please enter text to speak.");
        return;
    }

    speech.text = textInput;
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
