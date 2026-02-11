import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeedbackModal } from "@/components/FeedbackModal";
import { 
  ArrowLeft,
  Shield, 
  Send,
  CheckCircle2,
  Sparkles,
  Bot,
  Lock,
  Image as ImageIcon,
  Phone,
  MoreVertical,
  X,
  Flag,
  Trash2,
  Ban,
  PhoneOff,
  AlertCircle
} from "lucide-react";
import { useListingsStore } from "@/stores/listingsStore";
import { useChatStore, type Message } from "@/stores/chatStore";
import { useMessagingStore } from "@/stores/messagingStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const Chat = () => {
  const { id } = useParams();
  const listingId = parseInt(id || "0");
  
  const listing = useListingsStore((state) => state.getListingById(listingId));
  const { getConversation, addMessage } = useChatStore();
  const { moveToTop } = useMessagingStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiNegotiating, setAiNegotiating] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [escrowCompleted, setEscrowCompleted] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Product info fallback
  const product = listing || {
    title: "MacBook Air M1 2020",
    price: 55000,
    image: "💻",
    seller: "Priya M.",
  };

  useEffect(() => {
    setMessages(getConversation(listingId));
  }, [listingId, getConversation]);

  useEffect(() => {
    // Initialize messaging store for this conversation
    const chatId = `${listingId}-${product.seller}`;
    const existingMessages = getConversation(listingId);
    
    if (existingMessages.length > 0) {
      const lastMsg = existingMessages[existingMessages.length - 1];
      moveToTop(chatId, lastMsg.content, new Date().toISOString());
    } else {
      // Initialize with default message
      const { addOrUpdateChat } = useMessagingStore.getState();
      addOrUpdateChat({
        id: chatId,
        name: product.seller,
        lastMessage: "Start a conversation",
        timestamp: new Date().toISOString(),
        unread: 0,
        listingId,
        listingTitle: product.title,
        listingPrice: product.price,
        lastMessageTime: new Date(),
      });
    }
  }, [listingId]);

  useEffect(() => {
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: imagePreview || undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    addMessage(listingId, newMessage);
    
    // Update messaging store to show in Messages page
    const chatId = `${listingId}-${product.seller}`;
    moveToTop(chatId, input || (imagePreview ? "[Image]" : ""), new Date().toISOString());
    
    setInput("");
    setImagePreview(null);

    // Simulate seller response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sellerMessage = getSellerResponse(input);
      const response: Message = {
        id: messages.length + 2,
        sender: "seller",
        content: sellerMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
      addMessage(listingId, response);
      
      // Update messaging with seller's response
      moveToTop(chatId, sellerMessage, new Date().toISOString());
    }, 1500 + Math.random() * 1000);
  };

  const getSellerResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes("price") || lower.includes("discount") || lower.includes("less")) {
      return "I can consider a small discount. What's your best offer?";
    }
    if (lower.includes("condition") || lower.includes("working")) {
      return "It's in excellent condition! Everything works perfectly. I can show you during meetup.";
    }
    if (lower.includes("meet") || lower.includes("pickup")) {
      return "Sure! We can meet at the library or hostel block. What time works for you?";
    }
    if (/\d{4,}/.test(userMessage)) {
      const offer = parseInt(userMessage.match(/\d+/)?.[0] || "0");
      if (offer >= product.price * 0.9) {
        return `₹${offer.toLocaleString()} works for me! Let's finalize this. Use the escrow payment for safety.`;
      } else if (offer >= product.price * 0.75) {
        return `₹${offer.toLocaleString()} is a bit low. Can you do ₹${Math.round(product.price * 0.9).toLocaleString()}?`;
      } else {
        return `Sorry, ₹${offer.toLocaleString()} is too low for me. My lowest is ₹${Math.round(product.price * 0.85).toLocaleString()}.`;
      }
    }
    return "Thanks for your interest! Feel free to ask any questions about the item.";
  };

  const handleAINegotiate = () => {
    setShowAI(true);
    setAiNegotiating(true);
    
    const fairPriceLow = Math.round(product.price * 0.85);
    const fairPriceHigh = Math.round(product.price * 0.95);
    const suggestedOffer = Math.round(product.price * 0.88);
    
    const aiMessage: Message = {
      id: messages.length + 1,
      sender: "ai",
      content: `🤖 AI Negotiator activated!\n\nBased on market analysis:\n• Fair price range: ₹${fairPriceLow.toLocaleString()} - ₹${fairPriceHigh.toLocaleString()}\n• Seller's price: ₹${product.price.toLocaleString()}\n• Suggested offer: ₹${suggestedOffer.toLocaleString()}\n\nType an offer amount and I'll help you negotiate!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, aiMessage]);
    setAiNegotiating(false);
  };

  const handleAIOffer = (offerAmount: number) => {
    if (offerAmount <= 0) return;

    const percentage = offerAmount / product.price;
    let aiResponse: string;
    let sellerReaction: string;

    if (percentage >= 0.95) {
      aiResponse = `✅ Excellent offer! ₹${offerAmount.toLocaleString()} is very close to asking price. High chance of acceptance.`;
      sellerReaction = `That works perfectly! ₹${offerAmount.toLocaleString()} is a deal. Let's proceed with escrow payment.`;
    } else if (percentage >= 0.90) {
      aiResponse = `👍 Good offer! ₹${offerAmount.toLocaleString()} is fair. Likely to be accepted.`;
      sellerReaction = `₹${offerAmount.toLocaleString()}... I can do that! Let's close this deal.`;
    } else if (percentage >= 0.80) {
      const counter = Math.round(product.price * 0.92);
      aiResponse = `🤔 Reasonable offer. Seller may counter. Predicted counter: ₹${counter.toLocaleString()}`;
      sellerReaction = `₹${offerAmount.toLocaleString()} is a bit low. How about ₹${counter.toLocaleString()}?`;
    } else if (percentage >= 0.70) {
      const counter = Math.round(product.price * 0.88);
      aiResponse = `⚠️ Low offer. Expect negotiation. Recommended counter: ₹${counter.toLocaleString()}`;
      sellerReaction = `That's quite low. My best price is ₹${counter.toLocaleString()}.`;
    } else {
      aiResponse = `❌ Offer too low. Seller will likely reject. Consider offering at least ₹${Math.round(product.price * 0.75).toLocaleString()}`;
      sellerReaction = `Sorry, I can't go that low. The item is worth much more.`;
    }

    // Add user's offer
    const userOffer: Message = {
      id: messages.length + 1,
      sender: "user",
      content: `I'd like to offer ₹${offerAmount.toLocaleString()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userOffer]);

    // Add AI analysis
    setTimeout(() => {
      const aiAnalysis: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiAnalysis]);
    }, 800);

    // Add seller response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sellerResponse: Message = {
        id: messages.length + 3,
        sender: "seller",
        content: sellerReaction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, sellerResponse]);
    }, 2500);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const offerMatch = input.match(/\d+/);
      if (showAI && offerMatch) {
        handleAIOffer(parseInt(offerMatch[0]));
        setInput("");
      } else {
        handleSend();
      }
    }
  };

  const handleStartCall = () => {
    setCallActive(true);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    toast.success(`Calling ${product.seller}...`);
  };

  const handleEndCall = () => {
    setCallActive(false);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    setCallModalOpen(false);
    toast.info(`Call ended - ${formatDuration(callDuration)}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image exceeds 1MB limit");
      toast.error("Image exceeds 1MB limit");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files allowed");
      toast.error("Only image files allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBlockUser = () => {
    toast.success(`${product.seller} has been blocked`);
  };

  const handleReportUser = () => {
    toast.success("Report submitted. We'll review it shortly.");
  };

  const handleDeleteChat = () => {
    toast.success("Chat deleted");
  };

  const handleCompleteEscrow = () => {
    setEscrowCompleted(true);
    setShowFeedback(true);
    toast.success("✅ Payment released! Now share your feedback.");
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setFeedbackGiven(true);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/product/${listingId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {product.seller.charAt(0)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{product.seller}</span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">Online • IIT Delhi</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCallModalOpen(true)}>
              <Phone className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReportUser}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBlockUser}>
                  <Ban className="w-4 h-4 mr-2" />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteChat} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Reference */}
        <Link to={`/product/${listingId}`}>
          <div className="mt-3 p-3 rounded-xl bg-muted/50 flex items-center gap-3 hover:bg-muted transition-colors">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl overflow-hidden">
              {typeof product.image === 'string' && product.image.startsWith('data:') ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                product.image
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{product.title}</p>
              <p className="text-secondary font-semibold">₹{product.price.toLocaleString()}</p>
            </div>
            <div className="escrow-secured text-xs">
              <Shield className="w-3 h-3" />
              Escrow
            </div>
          </div>
        </Link>
      </header>

      {/* Encryption Notice */}
      <div className="bg-muted/30 py-2 px-4 flex items-center justify-center gap-2">
        <Lock className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Messages are end-to-end encrypted</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${
                msg.sender === "ai" 
                  ? "bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30" 
                  : msg.sender === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-border"
              } rounded-2xl px-4 py-3`}>
                {msg.sender === "ai" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-secondary/20">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-secondary">AI Negotiator</span>
                  </div>
                )}
                {msg.image && (
                  <img src={msg.image} alt="Shared" className="rounded-lg mb-2 max-w-full" />
                )}
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-sm">{product.seller} is typing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI Negotiator Button */}
      {!showAI && (
        <div className="px-4 pb-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full gap-2"
            onClick={handleAINegotiate}
            disabled={aiNegotiating}
          >
            <Sparkles className="w-4 h-4" />
            {aiNegotiating ? "Activating..." : "Activate AI Negotiator"}
          </Button>
        </div>
      )}

      {/* Complete Escrow Button */}
      {!escrowCompleted && (
        <div className="px-4 pb-2">
          <Button 
            variant="trust" 
            size="sm" 
            className="w-full gap-2"
            onClick={handleCompleteEscrow}
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Escrow & Release Payment
          </Button>
        </div>
      )}

      {/* Quick Offer Buttons when AI is active */}
      {showAI && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[0.95, 0.90, 0.85, 0.80].map((pct) => (
              <Button
                key={pct}
                variant="outline"
                size="sm"
                onClick={() => handleAIOffer(Math.round(product.price * pct))}
                className="whitespace-nowrap"
              >
                ₹{Math.round(product.price * pct).toLocaleString()}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              aria-label="Remove image preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {uploadError}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload image"
          title="Upload image"
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} aria-label="Upload image">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input
            placeholder={showAI ? "Enter your offer amount..." : "Type a message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleInputKeyPress}
            className="flex-1"
          />
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={() => {
              const offerMatch = input.match(/\d+/);
              if (showAI && offerMatch) {
                handleAIOffer(parseInt(offerMatch[0]));
                setInput("");
              } else {
                handleSend();
              }
            }}
            disabled={!input.trim() && !imagePreview}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={handleCloseFeedback}
        listingTitle={product.title}
        userName={product.seller}
        listingId={listingId}
        role="buyer"
      />

      {/* Call Modal */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {callActive ? "Call in Progress" : "Call Seller"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {callActive ? formatDuration(callDuration) : `Call ${product.seller} about ${product.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-4xl font-bold mb-4">
              {product.seller.charAt(0)}
            </div>
            <p className="text-lg font-semibold">{product.seller}</p>
            <p className="text-sm text-muted-foreground">IIT Delhi • Verified Seller</p>
          </div>
          <DialogFooter className="flex justify-center gap-4">
            {callActive ? (
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-16 h-16 rounded-full"
                onClick={handleEndCall}
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setCallModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="trust" size="lg" className="gap-2" onClick={handleStartCall}>
                  <Phone className="w-5 h-5" />
                  Start Call
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
