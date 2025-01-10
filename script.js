let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");

// Populate available voices
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0]; // Set default voice

    voices.forEach((voice, index) => {
        voiceSelect.options[index] = new Option(voice.name, index);
    });
};

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

document.querySelector("#speakButton").addEventListener("click", () => {
    let textInput = document.querySelector("textarea").value;
    if (textInput.trim() === "") {
        alert("Please enter some text before speaking!");
        return;
    }
    
    speech.text = textInput;

    // Start speech synthesis
    window.speechSynthesis.speak(speech);

    // Record and prepare audio for download
    let audioContext = new AudioContext();
    let destination = audioContext.createMediaStreamDestination();
    let mediaRecorder = new MediaRecorder(destination.stream);

    let audioChunks = [];
    speech.onstart = () => mediaRecorder.start();
    speech.onend = () => mediaRecorder.stop();

    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioURL = URL.createObjectURL(audioBlob);

        const downloadButton = document.querySelector("#downloadButton");
        downloadButton.href = audioURL;
        downloadButton.download = "speech.mp3";
        downloadButton.style.display = "inline-block"; // Show button
    };
});
