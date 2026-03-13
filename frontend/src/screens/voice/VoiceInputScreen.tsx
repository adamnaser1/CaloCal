import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic, Square, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function VoiceInputScreen() {
    const navigate = useNavigate()
    const { toast } = useToast()

    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcription, setTranscription] = useState('')
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            })

            chunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            mediaRecorderRef.current = mediaRecorder
            setIsRecording(true)

        } catch (error) {
            console.error('Microphone access denied:', error)
            toast({
                title: "Microphone Error",
                description: "Could not access microphone. Please allow microphone permission.",
                variant: "destructive"
            })
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    const analyzeVoice = async () => {
        if (!audioBlob) return

        setIsProcessing(true)

        try {
            const formData = new FormData()
            formData.append('audio', audioBlob, 'voice.webm')

            const response = await fetch(`${API_URL}/api/analyze-voice`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('Voice analysis failed')

            const data = await response.json()

            setTranscription(data.transcription)

            // Navigate to results with data
            navigate('/results', {
                state: {
                    analysisResult: {
                        mealName: data.meal_name,
                        totalCalories: data.total_calories,
                        totalProteins: data.total_proteins,
                        totalCarbs: data.total_carbs,
                        totalFats: data.total_fats,
                        items: data.items
                    },
                    source: 'voice',
                    language: data.detected_language
                }
            })

        } catch (error) {
            console.error('Voice analysis error:', error)
            toast({
                title: "Analysis Failed",
                description: "Could not analyze voice input. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Voice Input</h1>
            </header>

            <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                {/* Recording Animation */}
                {!audioBlob ? (
                    <div className="flex flex-col items-center gap-8">
                        <div className="relative">
                            {isRecording && (
                                <>
                                    <motion.div
                                        className="absolute inset-0 bg-red-500 rounded-full opacity-20"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-red-500 rounded-full opacity-10"
                                        animate={{ scale: [1, 2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                </>
                            )}

                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`relative w-32 h-32 rounded-full flex items-center justify-center
                           transition-all ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-[#F5C518] hover:bg-yellow-500'
                                    }`}
                            >
                                {isRecording ? (
                                    <Square className="w-12 h-12 text-white fill-white" />
                                ) : (
                                    <Mic className="w-12 h-12 text-white" />
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-lg font-semibold mb-2">
                                {isRecording ? '🎙️ Recording...' : '🎤 Tap to start recording'}
                            </p>
                            <p className="text-sm text-gray-600 max-w-md">
                                Describe your meal in English, French, or Tunisian Arabic
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 w-full max-w-md">
                        <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Recording Ready</h3>
                                <button
                                    onClick={() => {
                                        setAudioBlob(null)
                                        setTranscription('')
                                    }}
                                    className="text-sm text-red-500 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            </div>

                            <audio controls className="w-full mb-4">
                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                            </audio>

                            {transcription && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Transcription:</p>
                                    <p className="text-gray-900">{transcription}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={analyzeVoice}
                            disabled={isProcessing}
                            className="w-full py-4 bg-[#F5C518] text-white rounded-xl
                       font-semibold hover:bg-yellow-500 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Analyze Meal
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
