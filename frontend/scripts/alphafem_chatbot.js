// AlphaFem Enhanced Chatbot Implementation

// Configuration options
const chatbotConfig = {
    apiEndpoint: 'https://api.example.com/alphafem-ai', // Replace with your actual AI backend
    initialMessages: [
      "Hi there! I'm your AlphaFem financial assistant. How can I help you today?",
      "I can provide guidance on budgeting, investing, saving, and financial planning."
    ],
    suggestedQuestions: [
      "How do I create a budget?",
      "What investment options are best for beginners?",
      "How can I save for retirement?",
      "Tips for paying off debt faster"
    ],
    typingDelay: 300, // Milliseconds per character for typing effect
    themeColor: '#9c27b0' // AlphaFem purple
  };
  
  // User session data - would connect to your auth system
  let userData = {
    isLoggedIn: false,
    userName: '',
    financialProfile: null
  };
  
  // Initialize the chatbot
  function initEnhancedChatbot() {
    createChatbotHTML();
    addChatbotStyles();
    setupChatbotEventListeners();
    checkUserLogin();
    addInitialMessages();
    addSuggestedQuestions();
  }
  
  // Create and append the chatbot HTML structure
  function createChatbotHTML() {
    const chatbotHTML = `
      <div id="alphafem-chatbot" class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-logo">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOCA4TDE2IDE2TTggMTZMMTYgOCIgc3Ryb2tlPSIjOWMyN2IwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=" alt="AlphaFem" width="24" height="24">
          </div>
          <div class="chatbot-title">AlphaFem Financial Assistant</div>
          <div class="chatbot-controls">
            <button id="chatbot-minimize" class="chatbot-btn" title="Minimize">−</button>
            <button id="chatbot-close" class="chatbot-btn" title="Close">×</button>
          </div>
        </div>
        
        <div id="chatbot-messages" class="chatbot-messages"></div>
        
        <div id="suggested-questions" class="suggested-questions"></div>
        
        <div class="chatbot-typing hidden">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        
        <div class="chatbot-input-container">
          <input type="text" id="chatbot-input" placeholder="Ask about budgeting, investing...">
          <button id="chatbot-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <button id="chatbot-toggle" class="chatbot-toggle">
        <span class="toggle-icon">💬</span>
        <span class="toggle-text">Chat Now</span>
      </button>
    `;
    
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'alphafem-chatbot-container';
    chatbotContainer.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotContainer);
  }
  
  // Add styles for the chatbot
  function addChatbotStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      #alphafem-chatbot-container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .chatbot-container {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 350px;
        height: 500px;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
        display: none;
        transition: all 0.3s ease;
      }
      
      .chatbot-container.minimized {
        height: 60px;
        overflow: hidden;
      }
      
      .chatbot-header {
        background-color: ${chatbotConfig.themeColor};
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      }
      
      .chatbot-logo {
        margin-right: 10px;
      }
      
      .chatbot-title {
        font-weight: 600;
        flex-grow: 1;
      }
      
      .chatbot-controls {
        display: flex;
        gap: 5px;
      }
      
      .chatbot-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .chatbot-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .chatbot-messages {
        flex-grow: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: #f8f8f8;
      }
      
      .message {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        margin-bottom: 5px;
        animation: fadeIn 0.3s;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        line-height: 1.4;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .bot-message {
        background-color: white;
        align-self: flex-start;
        border-bottom-left-radius: 5px;
      }
      
      .user-message {
        background-color: ${chatbotConfig.themeColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 5px;
      }
      
      .chatbot-typing {
        display: flex;
        padding: 12px 16px;
        max-width: 80%;
        align-self: flex-start;
        margin: 0 0 10px 15px;
      }
      
      .chatbot-typing .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #b0b0b0;
        border-radius: 50%;
        margin-right: 5px;
        animation: bounce 1.5s infinite;
      }
      
      .chatbot-typing .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .chatbot-typing .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
      }
      
      .hidden {
        display: none;
      }
      
      .suggested-questions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 15px;
        border-top: 1px solid #eee;
        background-color: white;
      }
      
      .suggested-question {
        background-color: #f0f0f0;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        padding: 8px 12px;
        font-size: 0.9em;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .suggested-question:hover {
        background-color: #e8e8e8;
      }
      
      .chatbot-input-container {
        display: flex;
        padding: 15px;
        border-top: 1px solid #eee;
        background-color: white;
      }
      
      #chatbot-input {
        flex-grow: 1;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        margin-right: 10px;
        outline: none;
        font-size: 14px;
        transition: border-color 0.2s;
      }
      
      #chatbot-input:focus {
        border-color: ${chatbotConfig.themeColor};
      }
      
      #chatbot-send {
        background-color: ${chatbotConfig.themeColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      #chatbot-send:hover {
        background-color: #7b1fa2;
      }
      
      .chatbot-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${chatbotConfig.themeColor};
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 999;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.2s;
      }
      
      .chatbot-toggle:hover {
        transform: translateY(-2px);
      }
      
      .toggle-icon {
        font-size: 20px;
      }
      
      @media (max-width: 480px) {
        .chatbot-container {
          width: 90%;
          height: 70vh;
          bottom: 70px;
          right: 5%;
          left: 5%;
        }
        
        .chatbot-toggle {
          width: auto;
          right: 10px;
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  // Set up event listeners
  function setupChatbotEventListeners() {
    // Toggle chatbot visibility
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    
    // Close chatbot
    document.getElementById('chatbot-close').addEventListener('click', () => {
      document.getElementById('alphafem-chatbot').style.display = 'none';
    });
    
    // Minimize chatbot
    document.getElementById('chatbot-minimize').addEventListener('click', () => {
      const chatbot = document.getElementById('alphafem-chatbot');
      chatbot.classList.toggle('minimized');
    });
    
    // Send message on button click
    document.getElementById('chatbot-send').addEventListener('click', sendMessage);
    
    // Send message on Enter key
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Make chatbot draggable
    makeDraggable(document.getElementById('alphafem-chatbot'));
  }
  
  // Check if user is logged in
  function checkUserLogin() {
    // This would connect to your authentication system
    // For demo purposes we're just checking localStorage
    const storedUserData = localStorage.getItem('alphafem-user');
    if (storedUserData) {
      try {
        userData = JSON.parse(storedUserData);
        if (userData.isLoggedIn && userData.userName) {
          // Add personalized welcome message
          setTimeout(() => {
            addBotMessage(`Welcome back, ${userData.userName}! Need help with your financial goals today?`);
          }, 1000);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }
  
  // Add initial welcome messages
  function addInitialMessages() {
    chatbotConfig.initialMessages.forEach((message, index) => {
      setTimeout(() => {
        addBotMessage(message);
      }, 800 * (index + 1));
    });
  }
  
  // Add suggested questions
  function addSuggestedQuestions() {
    const container = document.getElementById('suggested-questions');
    container.innerHTML = '';
    
    chatbotConfig.suggestedQuestions.forEach(question => {
      const element = document.createElement('div');
      element.classList.add('suggested-question');
      element.textContent = question;
      element.addEventListener('click', () => {
        addUserMessage(question);
        getResponse(question);
      });
      container.appendChild(element);
    });
  }
  
  // Toggle chatbot visibility
  function toggleChatbot() {
    const chatbot = document.getElementById('alphafem-chatbot');
    const isVisible = chatbot.style.display === 'flex';
    
    if (isVisible) {
      chatbot.style.display = 'none';
    } else {
      chatbot.style.display = 'flex';
      document.getElementById('chatbot-input').focus();
    }
  }
  
  // Send a message
  function sendMessage() {
    const inputElement = document.getElementById('chatbot-input');
    const message = inputElement.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    inputElement.value = '';
    
    // Get response
    getResponse(message);
  }
  
  // Get response from AI or local fallback
  function getResponse(message) {
    // Show typing indicator
    const typingIndicator = document.querySelector('.chatbot-typing');
    typingIndicator.classList.remove('hidden');
    
    // Try to use the API first
    if (navigator.onLine) {
      // Attempt to call external API
      callAIApi(message)
        .then(response => {
          handleResponse(response);
        })
        .catch(error => {
          console.error('API Error:', error);
          // Fallback to local responses
          const fallbackResponse = getLocalResponse(message);
          handleResponse(fallbackResponse);
        });
    } else {
      // Use local response if offline
      const localResponse = getLocalResponse(message);
      handleResponse(localResponse);
    }
    
    function handleResponse(responseText) {
      // Hide typing indicator after delay
      setTimeout(() => {
        typingIndicator.classList.add('hidden');
        // Add bot response with typing effect
        addBotMessageWithTypingEffect(responseText);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
  }
  
  // Call AI API
  async function callAIApi(message) {
    try {
      // This is a placeholder for actual API call
      // In a real implementation, you would call your backend here
      
      // For demo purposes, we'll just simulate an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getLocalResponse(message));
        }, 1500);
      });
      
      /*
      // Real implementation would look like this:
      const response = await fetch(chatbotConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          message: message,
          userId: userData.isLoggedIn ? userData.userId : null,
          context: getConversationHistory()
        })
      });
      
      if (!response.ok) {
        throw new Error('API response error');
      }
      
      const data = await response.json();
      return data.response;
      */
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
  
  // Get conversation history (last 10 messages)
  function getConversationHistory() {
    const messageElements = document.querySelectorAll('.message');
    const history = [];
    
    // Get last 10 messages
    const recentMessages = Array.from(messageElements).slice(-10);
    
    recentMessages.forEach(msg => {
      history.push({
        role: msg.classList.contains('user-message') ? 'user' : 'assistant',
        content: msg.textContent
      });
    });
    
    return history;
  }
  
  // Get local fallback response
  function getLocalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Finance-related responses
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return "Creating a budget is the foundation of financial wellness. I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Would you like me to help you set up a personalized budget plan?";
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('stock')) {
      return "For beginners, I recommend starting with low-cost index funds that give you broad market exposure. As you learn more, you can diversify into individual stocks or other assets. What's your investment timeline and risk tolerance?";
    } else if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return "The key to successful saving is automation. Set up automatic transfers to a high-yield savings account on payday. Aim to build an emergency fund of 3-6 months of expenses first, then save for specific goals. What are you saving for?";
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
      return "When tackling debt, you have two main strategies: the avalanche method (paying highest interest first) for maximum savings, or the snowball method (paying smallest balances first) for psychological wins. Which approach resonates with you?";
    } else if (lowerMessage.includes('credit score') || lowerMessage.includes('credit report')) {
      return "Your credit score is affected by payment history (35%), amounts owed (30%), length of history (15%), new credit (10%), and credit mix (10%). The best ways to improve it are paying bills on time and keeping credit utilization below 30%.";
    } else if (lowerMessage.includes('retire') || lowerMessage.includes('401k') || lowerMessage.includes('ira')) {
      return "For retirement planning, take advantage of tax-advantaged accounts like 401(k)s and IRAs. Aim to save 15% of your income, including any employer match. The power of compound interest means starting early is crucial.";
    } else if (lowerMessage.includes('financial independence') || lowerMessage.includes('fire')) {
      return "Financial Independence/Retire Early (FIRE) requires aggressive saving (50-70% of income), low-cost index fund investing, and minimizing expenses. Would you like to explore whether this approach might work for your situation?";
    } else if (lowerMessage.includes('side hustle') || lowerMessage.includes('extra income')) {
      return "Popular side hustles include freelancing in your professional field, content creation, tutoring, virtual assistance, or selling handmade items. What skills do you have that could generate additional income?";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your AlphaFem financial assistant. I can help with budgeting, investing, debt management, savings strategies, and more. What financial topic would you like to explore today?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm here to help you achieve financial empowerment. Is there anything else you'd like to know about managing your finances?";
    } else {
      return "I'm here to help with your financial questions about budgeting, investments, savings, debt management, and more. Could you provide more details about what you'd like to know?";
    }
  }
  
  // Add a bot message with typing effect
  function addBotMessageWithTypingEffect(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messagesContainer.appendChild(messageElement);
    
    let i = 0;
    const typingSpeed = Math.max(20, chatbotConfig.typingDelay / text.length); // Adjust speed based on message length
    
    function typeNextChar() {
      if (i < text.length) {
        messageElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeNextChar, typingSpeed);
        scrollToBottom();
      }
    }
    
    typeNextChar();
  }
  
  // Add a bot message to the chat
  function addBotMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Add a user message to the chat
  function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Scroll to the bottom of the chat
  function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Make element draggable
  function makeDraggable(element) {
    const header = element.querySelector('.chatbot-header');
    let isDragging = false;
    let offsetX, offsetY;
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      element.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // Keep within window bounds
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;
      
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      element.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.transition = 'all 0.3s ease';
      }
    });
  }
  
  // Save user data to localStorage
  function saveUserData() {
    localStorage.setItem('alphafem-user', JSON.stringify(userData));
  }
  
  // Initialize the chatbot when the page loads
  document.addEventListener('DOMContentLoaded', initEnhancedChatbot);