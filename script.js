let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0] || voices.find(v => v.lang.startsWith("en"));

    voices.forEach((voice, index) => {
        voiceSelect.options[index] = new Option(voice.name, index);
    });
};

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

document.querySelector("#speakButton").addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;

    // Start Speech Synthesis
    window.speechSynthesis.speak(speech);

    // Audio Recording and Download Logic
    const audioChunks = [];
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);

    speech.onstart = () => mediaRecorder.start();
    speech.onend = () => mediaRecorder.stop();

    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(audioBlob);

        const downloadButton = document.querySelector("#downloadButton");
        downloadButton.href = audioURL;
        downloadButton.download = "speech.webm"; // Safer format for mobile
        downloadButton.style.display = "inline-block";
    };
});
