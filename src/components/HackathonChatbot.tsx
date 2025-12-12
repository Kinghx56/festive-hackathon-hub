import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, Send, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { saveChatMessage, getChatHistory, ChatMessage } from '@/services/firestore';

interface HackathonChatbotProps {
  teamId: string;
  teamName: string;
}

export const HackathonChatbot = ({ teamId, teamName }: HackathonChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

  // Hackathon context for AI
  const HACKATHON_CONTEXT = `You are a STRICT hackathon support assistant for NumrenoHacks Christmas Hackathon 2024.

CRITICAL RULES - FOLLOW EXACTLY:
1. REFUSE to answer ANY question not directly related to THIS hackathon
2. DO NOT answer: general programming questions, other events, weather, jokes, math, general knowledge, personal advice
3. ONLY answer questions about: NumrenoHacks registration, rules, deadlines, prizes, schedule, team formation, submission process
4. If question is off-topic, say: "I can only help with NumrenoHacks hackathon questions. Please ask about registration, rules, schedule, or submissions."
5. Keep answers SHORT and SPECIFIC (2-3 sentences max)
6. If unsure or complex issue, say: "Please escalate this to our admin team for assistance."

HACKATHON INFORMATION (ONLY answer about these topics):
- Event: NumrenoHacks Christmas Hackathon 2024
- Theme: Christmas/Festive projects only
- Team: 2-5 members required
- Duration: 48 hours
- Format: Online/Hybrid
- Registration: Via website, requires team lead ID verification
- Submission: Through dashboard before deadline
- Tech Stack: Any language/framework allowed
- Prizes: Cash prizes, certificates for top 3 teams
- Judging: Innovation (25%), Implementation (25%), Presentation (25%), Theme Relevance (25%)
- Problem Statements: Available on dashboard after registration
- Deadline: Check dashboard for countdown timer

ESCALATE TO ADMIN if asked about:
- Payment/refund/billing
- Technical bugs/errors
- Registration failures
- Account issues
- Special accommodations
- Rule exceptions
- Post-event certificates/prizes

EXAMPLES:
❌ DON'T ANSWER: "What's the weather?", "How to code in Python?", "Tell me a joke"
✅ DO ANSWER: "What's the deadline?", "How many team members?", "What are the prizes?"

Remember: Be STRICT. Reject ALL non-hackathon questions immediately.`;

  // Load chat history on mount
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await getChatHistory(teamId);
      if (result.success) {
        setMessages(result.messages);
        
        // Add welcome message if no history
        if (result.messages.length === 0) {
          const welcomeMsg: ChatMessage = {
            messageId: 'welcome',
            teamId,
            teamName,
            sender: 'bot',
            message: '🎄 Welcome to NumrenoHacks Support! I can help you with hackathon-related questions like rules, schedule, submission process, and more. How can I assist you today?',
            timestamp: { toMillis: () => Date.now() } as any,
          };
          setMessages([welcomeMsg]);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const isHackathonRelated = (question: string): boolean => {
    const lowerQuestion = question.toLowerCase();
    
    // Strict blacklist - immediately reject these
    const blacklistKeywords = [
      'weather', 'joke', 'cook', 'recipe', 'movie', 'song', 'game', 'sport',
      'news', 'stock', 'crypto', 'bitcoin', 'politics', 'health', 'medicine',
      'travel', 'hotel', 'restaurant', 'shopping', 'fashion', 'celebrity',
      'math problem', 'homework', 'essay', 'translate', 'definition of'
    ];
    
    if (blacklistKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return false;
    }
    
    // Whitelist - must contain at least one hackathon-related keyword
    const hackathonKeywords = [
      'hackathon', 'numerano', 'registration', 'register', 'team', 'member',
      'project', 'submission', 'submit', 'deadline', 'prize', 'win', 'rule',
      'schedule', 'judge', 'judging', 'criteria', 'problem statement', 'track',
      'tech stack', 'event', 'certificate', 'participant', 'id card', 'id verification',
      'upload', 'dashboard', 'login', 'christmas', 'festive', 'theme', 
      'mentor', 'support', 'help', 'when', 'what', 'how', 'where', 'eligib'
    ];

    return hackathonKeywords.some(keyword => lowerQuestion.includes(keyword));
  };

  const shouldEscalate = (question: string, aiResponse: string): boolean => {
    const escalationTriggers = [
      'payment', 'refund', 'money', 'account problem', 'can\'t register',
      'registration failed', 'dispute', 'exception', 'special request',
      'accommodation', 'certificate issue', 'prize claim', 'urgent',
      'technical issue', 'bug', 'error', 'not working'
    ];

    const uncertaintyPhrases = [
      'i\'m not sure', 'i don\'t know', 'unclear', 'contact admin',
      'reach out to', 'suggest escalating', 'human assistance'
    ];

    const lowerQuestion = question.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();

    const hasEscalationTrigger = escalationTriggers.some(trigger => 
      lowerQuestion.includes(trigger)
    );

    const showsUncertainty = uncertaintyPhrases.some(phrase => 
      lowerResponse.includes(phrase)
    );

    return hasEscalationTrigger || showsUncertainty;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      messageId: `user-${Date.now()}`,
      teamId,
      teamName,
      sender: 'team',
      message: userMessage,
      timestamp: { toMillis: () => Date.now() } as any,
    };
    setMessages(prev => [...prev, userMsg]);

    // Save user message to Firebase
    await saveChatMessage(teamId, teamName, 'team', userMessage);

    try {
      // Strict check if question is hackathon-related
      if (!isHackathonRelated(userMessage)) {
        const offTopicMsg: ChatMessage = {
          messageId: `bot-${Date.now()}`,
          teamId,
          teamName,
          sender: 'bot',
          message: '❌ I can ONLY answer NumrenoHacks hackathon questions.\n\n✅ Ask me about:\n• Registration process\n• Team requirements\n• Rules & deadlines\n• Prizes & judging\n• Submission process\n• Problem statements\n\nPlease ask a hackathon-related question!',
          timestamp: { toMillis: () => Date.now() } as any,
        };
        setMessages(prev => [...prev, offTopicMsg]);
        await saveChatMessage(teamId, teamName, 'bot', offTopicMsg.message);
        setLoading(false);
        return;
      }

      // Generate AI response
      console.log('🤖 Calling Gemini API...');
      console.log('API Key available:', !!import.meta.env.VITE_GEMINI_API_KEY);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: HACKATHON_CONTEXT }],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will STRICTLY only answer NumrenoHacks hackathon questions. I will reject ALL other topics immediately.' }],
          },
        ],
      });

      console.log('📤 Sending message to Gemini:', userMessage);
      const result = await chat.sendMessage(userMessage);
      const aiResponse = result.response.text();
      console.log('📥 Received response from Gemini:', aiResponse);

      // Check if needs escalation
      const needsEscalation = shouldEscalate(userMessage, aiResponse);

      let botResponse = aiResponse;
      if (needsEscalation) {
        botResponse += '\n\n⚠️ This query has been escalated to our admin team for better assistance. They will respond soon!';
      }

      // Add bot message
      const botMsg: ChatMessage = {
        messageId: `bot-${Date.now()}`,
        teamId,
        teamName,
        sender: 'bot',
        message: botResponse,
        timestamp: { toMillis: () => Date.now() } as any,
        isEscalated: needsEscalation,
        escalationReason: needsEscalation ? userMessage : undefined,
      };
      setMessages(prev => [...prev, botMsg]);

      // Save bot response to Firebase
      await saveChatMessage(
        teamId,
        teamName,
        'bot',
        botResponse,
        needsEscalation,
        needsEscalation ? userMessage : undefined
      );

      if (needsEscalation) {
        toast.info('Query escalated to admin', {
          description: 'Our team will respond to your query soon!',
        });
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMsg: ChatMessage = {
        messageId: `error-${Date.now()}`,
        teamId,
        teamName,
        sender: 'bot',
        message: '❌ Sorry, I encountered an error. Please try again or contact admin if the issue persists.',
        timestamp: { toMillis: () => Date.now() } as any,
      };
      setMessages(prev => [...prev, errorMsg]);
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-christmas-red hover:bg-christmas-red/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50 border-christmas-gold">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-christmas-red text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">NumrenoHacks Support</h3>
            <p className="text-xs opacity-90">Hackathon Assistant</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-christmas-red" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'team' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'team'
                      ? 'bg-christmas-red text-white'
                      : msg.sender === 'admin'
                      ? 'bg-christmas-green text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.sender === 'admin' && (
                    <p className="text-xs font-semibold mb-1">Admin Response</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  {msg.isEscalated && msg.sender === 'team' && (
                    <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                      <AlertCircle className="h-3 w-3" />
                      <span>Escalated to admin</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the hackathon..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-christmas-red hover:bg-christmas-red/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Ask about rules, schedule, submissions, or prizes
        </p>
      </div>
    </Card>
  );
};
