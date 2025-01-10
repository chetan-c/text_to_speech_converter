let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let audioChunks = [];

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

// Start speaking and recording audio
document.querySelector("#speakButton").addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;

    // Speak text
    window.speechSynthesis.speak(speech);

    // Record speech synthesis audio via MediaStream API
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    
    // Connect speech to audio context
    const synthSource = audioContext.createMediaStreamSource(destination.stream);
    synthSource.connect(destination);
    
    mediaRecorder.start();
    
    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);

        // Enable and set up download button
        const downloadButton = document.querySelector("#downloadButton");
        downloadButton.href = audioURL;
        downloadButton.download = "speech.wav";
        downloadButton.style.display = "inline-block";
    };

    speech.onend = () => mediaRecorder.stop();  // Stop recording when speech ends
});
