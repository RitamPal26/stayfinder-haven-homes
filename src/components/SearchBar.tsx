
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Users, Mic, MicOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  // Voice input state
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [transcriptLive, setTranscriptLive] = useState('');
  const recognitionRef = useRef<any>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Voice recognition logic
  const handleMicClick = () => {
    if (!speechSupported) {
      setVoiceError("Sorry, your browser does not support voice input.");
      return;
    }
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      return;
    }
    setVoiceError('');
    setTranscriptLive('');
    // Use browser compatible API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setTranscriptLive('');
    };
    recognition.onerror = (event: any) => {
      setListenFalse();
      setVoiceError('Speech recognition error: ' + event.error);
    };
    recognition.onend = () => {
      setListenFalse();
    };
    recognition.onresult = (event: any) => {
      let interim_transcript = "";
      let final_transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final_transcript += transcript;
        } else {
          interim_transcript += transcript;
        }
      }
      setTranscriptLive(interim_transcript || final_transcript);
      if (final_transcript) {
        setLocation(final_transcript.trim());
        setTranscriptLive('');
        recognition.stop();
        setTimeout(() => {
          handleSearchAuto();
        }, 100); // small delay to make search feel natural
      }
    };

    recognition.start();
  };

  const setListenFalse = () => {
    setListening(false);
    recognitionRef.current = null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchAuto();
  };

  const handleSearchAuto = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setTranscriptLive('');
    setVoiceError('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <Card className="p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4" aria-label="Property search form">
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location-field">
              Where
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="location-field"
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={handleLocationChange}
                className={`pl-10 pr-12 ${listening ? "ring-2 ring-[#FF5A5F]" : ""}`}
                autoComplete="off"
                aria-describedby={voiceError ? "voice-error" : (transcriptLive ? "voice-live" : undefined)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    setTranscriptLive('');
                    setVoiceError('');
                  }
                }}
              />
              <button
                type="button"
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                tabIndex={0}
                onClick={handleMicClick}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1 transition-colors ${
                  listening ? "bg-[#FF5A5F]/90 text-white animate-pulse" : "bg-gray-100 hover:bg-gray-200"
                }`}
                style={{ zIndex: 2 }}
              >
                {listening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
            </div>
            {transcriptLive && (
              <div
                id="voice-live"
                aria-live="polite"
                className="mt-2 text-xs text-[#FF5A5F]"
              >
                <span className="sr-only">Live voice transcript: </span>
                {transcriptLive}
              </div>
            )}
            {voiceError && (
              <div
                id="voice-error"
                aria-live="assertive"
                className="mt-2 text-xs text-red-600"
              >
                <span className="sr-only">Error: </span>
                {voiceError}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="Add guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <Button type="submit" size="lg" className="w-full md:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
