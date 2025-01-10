let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");

// Load available voices
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];  // Set default voice

    voices.forEach((voice, index) => {
        voiceSelect.options[index] = new Option(voice.name, index);
    });
};

// Change voice when selecting from dropdown
voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

// Capture audio for download
const audioChunks = [];
const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();
const recorder = new MediaRecorder(destination.stream);
const synthSource = audioContext.createMediaStreamSource(destination.stream);

recorder.ondataavailable = event => audioChunks.push(event.data);
recorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(audioBlob);

    // Set up download link
    const downloadButton = document.querySelector("#downloadButton");
    downloadButton.href = audioURL;
    downloadButton.download = "speech.wav";
    downloadButton.style.display = "inline-block";
};

// Speak text and start recording
document.querySelector("#speakButton").addEventListener("click", () => {
    const textToSpeak = document.querySelector("textarea").value;
    if (textToSpeak.trim() === "") return;  // Prevent empty text input

    speech.text = textToSpeak;
    recorder.start();
    
    // Speak text
    window.speechSynthesis.speak(speech);

    // Stop recording after speech ends
    speech.onend = () => recorder.stop();
});
