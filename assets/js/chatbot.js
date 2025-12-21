document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // IMPORTANT: In a real production app, never expose your API key in client-side code like this.
    // Ideally, you would use a proxy server or Netlify/Cloudflare Functions to hide the key.
    // For this personal profile demo (static site), we are using a direct call pattern.
    // If you have a key, replace 'YOUR_GEMINI_API_KEY' with it.
    const GEMINI_API_KEY = 'AIzaSyCVkd9n87f9JZcPbgj37lFVpqRaSN5KoGQ'; 
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
  
    // --- Elements ---
    const widget = document.getElementById('ai-chat-widget');
    const toggle = document.getElementById('chat-toggle');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const mic = document.getElementById('chat-mic');
    const messages = document.getElementById('chat-messages');
    const quickBtns = document.querySelectorAll('.quick-btn');
  
    // --- State ---
    let isListening = false;
    let recognition;
  
    // --- Speech Recognition Setup ---
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
  
      recognition.onstart = () => {
        isListening = true;
        mic.classList.add('listening');
        input.placeholder = "Listening...";
      };
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        handleQuery(transcript);
      };
  
      recognition.onerror = (event) => {
        console.error("Speech error", event);
        stopListening();
      };
  
      recognition.onend = () => {
        stopListening();
      };
    } else {
      mic.style.display = 'none'; // Hide if not supported
    }
  
    const stopListening = () => {
      isListening = false;
      mic.classList.remove('listening');
      input.placeholder = "Type or use mic...";
    };
  
    // --- Text-to-Speech (TTS) ---
    const speakText = (text) => {
      if (!('speechSynthesis' in window)) return;
      
      // Stop any current speaking
      window.speechSynthesis.cancel();
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      // Try to find a nice voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Male") || v.name.includes("Google US English"));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
  
      window.speechSynthesis.speak(utterance);
    };
  
    // --- Gemini API Call ---
    const callGemini = async (prompt) => {
      // Fallback responses if no key is provided
      if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes('fadil')) return "Dr. Mohamed El Fadil is a physician and Healthcare AI Architect based in Riyadh. He founded BrainSAIT to bridge clinical medicine and AI.";
        if (lowerPrompt.includes('brainsait')) return "BrainSAIT is an AI ecosystem for healthcare. We do clinical decision support, NPHIES integration, and automated coding.";
        if (lowerPrompt.includes('nphies') || lowerPrompt.includes('fhir')) return "Dr. Fadil is an expert in HL7 FHIR R4 and NPHIES standards, helping hospitals in Saudi Arabia achieve interoperability.";
        return "I'm MacKey. Since I don't have my API key configured yet, I can only answer basic questions about Dr. Fadil's profile. Please add a Gemini API key to unlock my full brain!";
      }
  
      // System prompt to set persona
      const systemPrompt = `You are MacKey, a helpful and professional AI assistant named after Dr. Mohamed El Fadil's son. You are an expert on Dr. Fadil's profile.
      Context:
      - Dr. Fadil is a physician and AI Architect.
      - CEO of BrainSAIT.
      - Expert in NPHIES, FHIR, Clinical NLP, and Python.
      - Based in Riyadh, Saudi Arabia.
      - Mission: "Original Intelligence (OI) + AI".
      
      User Query: ${prompt}
      
      Respond concisely (under 50 words) and professionally.`;
  
      try {
        const response = await fetch(GEMINI_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: systemPrompt
              }]
            }]
          })
        });
  
        if (!response.ok) throw new Error('Gemini API Error');
  
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        return text;
      } catch (error) {
        console.error(error);
        return "I'm having trouble connecting to my brain right now. Please try again later.";
      }
    };
  
    // --- UI Logic ---
    const addMessage = (text, type) => {
      const div = document.createElement('div');
      div.className = type === 'ai' ? 'ai-msg' : 'user-msg';
      // Render simple markdown or text
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    };
  
    const handleQuery = async (query) => {
      if (!query.trim()) return;
      
      addMessage(query, 'user');
  
      // Show thinking state?
      // For now, just wait
  
      const aiResponse = await callGemini(query);
      addMessage(aiResponse, 'ai');
      speakText(aiResponse);
    };
  
    // --- Event Listeners ---
    toggle.addEventListener('click', () => widget.classList.add('active'));
    close.addEventListener('click', () => {
      widget.classList.remove('active');
      window.speechSynthesis.cancel(); // Stop talking on close
    });
  
    send.addEventListener('click', () => {
      handleQuery(input.value);
      input.value = '';
    });
  
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleQuery(input.value);
        input.value = '';
      }
    });
  
    mic.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  
    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        handleQuery(btn.getAttribute('data-query'));
      });
    });
  });
