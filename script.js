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

// Speak text and record audio
document.querySelector("#speakButton").addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;

    // Speak text
    window.speechSynthesis.speak(speech);

    // Record audio for download
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    const audioChunks = [];

    speech.onstart = () => mediaRecorder.start();
    speech.onend = () => mediaRecorder.stop();

    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);

        // Set download link
        const downloadButton = document.querySelector("#downloadButton");
        downloadButton.href = audioURL;
        downloadButton.download = "speech.wav";
        downloadButton.style.display = "inline-block";
    };
});
