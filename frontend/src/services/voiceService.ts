export class VoiceRecorder {
    private recognition: any = null;
    private lang: string = 'fr-FR';

    isSupported(): boolean {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }

    setLanguage(lang: string) {
        this.lang = lang;
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    start(
        onTranscript: (text: string, isFinal: boolean) => void,
        onEnd: (finalText: string) => void,
        onError: (error: string) => void
    ): void {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            onError('not-supported');
            return;
        }

        // Stop any existing instance
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {
                // ignore
            }
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.lang;

        // Store final transcript across potentially multiple starts/stops if needed, 
        // but for now we assume single session per start()
        let finalTranscript = '';

        this.recognition.onresult = (event: any) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            onTranscript(finalTranscript + interimTranscript, false);

            // If we want to detect when *all* results are final (e.g. user stopped talking for a bit),
            // we can check if interim is empty. But 'continuous=true' keeps going.
            // We rely on user pressing Stop for the final 'onEnd' or 'continuous' behavior.
        };

        this.recognition.onend = () => {
            // This fires when recognition stops (e.g. silence timeout or manual stop)
            // We pass the final accumulated text
            onEnd(finalTranscript);
        };

        this.recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            // 'no-speech' often happens just if user is silent, might not be a hard error to show UI for
            // but 'not-allowed' or 'network' are.
            onError(event.error);
        };

        try {
            this.recognition.start();
        } catch (e) {
            console.error("Failed to start recognition", e);
            onError('start-failed');
        }
    }

    stop(): void {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

// Global type augmentation
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
