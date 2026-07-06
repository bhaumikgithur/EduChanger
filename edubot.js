// EduBot AI Chat Controller - Dynamic Universal Component

document.addEventListener('DOMContentLoaded', () => {
  // 1. Injected Widget HTML
  const botDiv = document.createElement('div');
  botDiv.innerHTML = `
    <button class="edubot-toggle-btn" id="edubot-toggle" title="Chat with EduBot">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>

    <div class="edubot-chat-container" id="edubot-container">
      <div class="edubot-header">
        <div class="edubot-profile-info">
          <div class="edubot-avatar">🤖</div>
          <div class="edubot-header-text">
            <h4>EduBot Study Buddy</h4>
            <div class="edubot-status">
              <span class="edubot-pulse-dot"></span> Active Assistant
            </div>
          </div>
        </div>
        <button class="edubot-close-btn" id="edubot-close">&times;</button>
      </div>

      <div class="edubot-messages" id="edubot-messages"></div>

      <div class="edubot-suggestions" id="edubot-suggestions">
        <span class="suggestion-pill" data-query="admin credentials">🔑 Admin Login Info</span>
        <span class="suggestion-pill" data-query="how to add videos">🎥 How to Add Videos</span>
        <span class="suggestion-pill" data-query="math notes">📐 Mathematics Prep</span>
        <span class="suggestion-pill" data-query="science notes">🔬 Science Diagrams</span>
      </div>

      <form class="edubot-input-form" id="edubot-form">
        <input type="text" id="edubot-input" placeholder="Ask EduBot a question..." autocomplete="off" required>
        <button type="submit" class="edubot-send-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(botDiv);

  // Grab nodes
  const toggleBtn = document.getElementById('edubot-toggle');
  const chatContainer = document.getElementById('edubot-container');
  const closeBtn = document.getElementById('edubot-close');
  const messagesArea = document.getElementById('edubot-messages');
  const inputForm = document.getElementById('edubot-form');
  const inputField = document.getElementById('edubot-input');
  const suggestionContainer = document.getElementById('edubot-suggestions');

  let hasOpenedBefore = false;

  // 2. Event Listeners
  toggleBtn.addEventListener('click', () => {
    const isActive = chatContainer.classList.toggle('active');
    toggleBtn.classList.toggle('active', isActive);
    
    if (isActive && !hasOpenedBefore) {
      sendBotWelcome();
      hasOpenedBefore = true;
    }
  });

  closeBtn.addEventListener('click', () => {
    chatContainer.classList.remove('active');
    toggleBtn.classList.remove('active');
  });

  // Suggestion pill click events
  suggestionContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-pill')) {
      const query = e.target.getAttribute('data-query');
      handleUserQuery(query);
    }
  });

  // Input submission
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = inputField.value.trim();
    if (!query) return;

    inputField.value = '';
    handleUserQuery(query);
  });

  // 3. Messages render helpers
  function addMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}`;
    bubble.innerHTML = text;
    messagesArea.appendChild(bubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'edubot-typing';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    messagesArea.appendChild(indicator);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('edubot-typing');
    if (indicator) {
      indicator.remove();
    }
  }

  function sendBotWelcome() {
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(
        "👋 Hello! I am <strong>EduBot</strong>, your personal AI Study Buddy.<br><br>I can provide revision materials guidelines, help you with study shortcuts, or assist with administrator actions. What are you studying today?",
        'bot'
      );
    }, 800);
  }

  function handleUserQuery(query) {
    // Add user question
    addMessage(query, 'user');
    
    // Show bot thinking state
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const response = generateAIResponse(query);
      addMessage(response, 'bot');
    }, 1200);
  }

  // 4. Response Logic engine
  function generateAIResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('admin') || q.includes('cred') || q.includes('pass') || q.includes('console') || q.includes('suspend') || q.includes('manage')) {
      return "🔒 <strong>Admin Console:</strong><br>To access the restricted <strong>Admin Console (admin.html)</strong>, you must log in using authorized administrator credentials. <br><br><em>Note: For security reasons, the administrator ID and password are not listed in this public chat console. Please check your system documentation or supervisor dashboard!</em>";
    }

    if (q.includes('math') || q.includes('mathematics') || q.includes('formula')) {
      return "📐 <strong>Mathematics Next Toppers Lectures & PDFs:</strong><br>• <a href='https://www.youtube.com/watch?v=8vGZzD1L2Qk' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Real Numbers Lecture Video</a><br>• <a href='https://www.youtube.com/watch?v=fD-NqW5Z0d0' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Quadratic Equations Lecture Video</a><br>• <a href='#' style='color:#a855f7; text-decoration:underline;'>Download Mathematics Board formulas (PDF)</a><br><br>Open the Study Portal inside EduChanger to access all 10 Mathematics chapter files!";
    }

    if (q.includes('science') || q.includes('diagram') || q.includes('chem') || q.includes('biology')) {
      return "🔬 <strong>Science Next Toppers Lectures & PDFs:</strong><br>• <a href='https://www.youtube.com/watch?v=3HkU4E4Znt8' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Chemical Reactions Lecture Video</a><br>• <a href='https://www.youtube.com/watch?v=8A4Q_j4S-y8' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Life Processes Lecture Video</a><br>• <a href='#' style='color:#a855f7; text-decoration:underline;'>Download Science NCERT diagrams pack (PDF)</a><br><br>Access all 10 Science chapters directly in the Study Portal!";
    }

    if (q.includes('social') || q.includes('sst') || q.includes('history') || q.includes('map')) {
      return "🌍 <strong>Social Science Next Toppers Lectures & PDFs:</strong><br>• <a href='https://www.youtube.com/watch?v=3e2oTptZ02s' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Nationalism in Europe Lecture Video</a><br>• <a href='https://www.youtube.com/watch?v=4Gq_v8w_yV8' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Nationalism in India Lecture Video</a><br>• <a href='#' style='color:#a855f7; text-decoration:underline;'>Download Board maps marking sheet (PDF)</a><br><br>Find all 10 Social Science chapter notes in the Study Portal!";
    }

    if (q.includes('english') || q.includes('grammar') || q.includes('prose') || q.includes('poem')) {
      return "✍️ <strong>English Literature Next Toppers Lectures & PDFs:</strong><br>• <a href='https://www.youtube.com/watch?v=G6jWl7Wz_gM' target='_blank' style='color:#00f0ff; text-decoration:underline;'>A Letter to God Lecture Video</a><br>• <a href='https://www.youtube.com/watch?v=8vjVj4S-y8A' target='_blank' style='color:#00f0ff; text-decoration:underline;'>Long Walk to Freedom Lecture Video</a><br>• <a href='#' style='color:#a855f7; text-decoration:underline;'>Download Character sketches summary guide (PDF)</a><br><br>Explore all 10 English lessons inside the Study Portal!";
    }

    if (q.includes('study') || q.includes('lesson') || q.includes('chapter') || q.includes('pdf') || q.includes('note')) {
      return "📚 <strong>Study Portal & Syllabus Chapters:</strong><br>Log in and click the glowing <strong>'Let's Start Learning'</strong> button on your dashboard to unlock the <strong>Study Portal (study.html)</strong>. <br><br>The portal displays 10 comprehensive lessons for Mathematics, Science, Social Science, and English, with links to download board revision PDFs and watch Next Toppers lecture videos!";
    }

    if (q.includes('video') || q.includes('next toppers') || q.includes('lecture') || q.includes('watch') || q.includes('player') || q.includes('youtube')) {
      return "🎥 <strong>Next Toppers Video Integration:</strong><br>EduChanger integrates high-quality video tutorials from the popular <strong>Next Toppers</strong> CBSE channel. <br><br>To watch them, go to the Study Portal, select your subject, and click <strong>'Watch Lecture'</strong>. The video will load instantly inside our dark, immersive Theater Modal player. Closing the modal immediately silences and stops the video.";
    }

    if (q.includes('review') || q.includes('feedback') || q.includes('comment') || q.includes('star') || q.includes('rate')) {
      return "⭐ <strong>Review Center:</strong><br>Located at the bottom of the dashboard home page. Registered students can select a 1-to-5 star rating, write feedback in the comment box, and click 'Post Review'. The card is immediately rendered with the user's initials avatar. Administrators have the power to delete reviews.";
    }

    if (q.includes('register') || q.includes('login') || q.includes('signup') || q.includes('sign up') || q.includes('google') || q.includes('not registered')) {
      return "🔑 <strong>Login & Registration Rules:</strong><br>• <strong>Account Restriction:</strong> Only registered users can log in. If you enter an unregistered email, the landing page displays an inline crimson warning banner.<br>• <strong>Registration:</strong> Register via the Form on Page 2 of the 3D book, or click <strong>'Register with Google'</strong> (which signs up and registers <code>student.google@gmail.com</code>). Switch between modes using the auth toggles.";
    }

    if (q.includes('email') || q.includes('chime') || q.includes('notification') || q.includes('welcome') || q.includes('inbox')) {
      return "📩 <strong>Mock Welcome Email:</strong><br>When you register a new account on EduChanger, our system triggers a premium welcome event. Upon landing on the dashboard, a browser audio chime plays and a floating amber notification slides down: <em>New email: 'Welcome to EduChanger!'</em>. Click it to open a beautiful inbox reader showing the welcome letter.";
    }

    if (q.includes('contact') || q.includes('message') || q.includes('support') || q.includes('plane') || q.includes('send')) {
      return "✈️ <strong>Contact Us (contact.html):</strong><br>Reach out to the team using our colorful contact form featuring animated floating blobs. Fill your query and click 'Send Message'—the button will morph into a paper-plane and fly away! You can also email us at <code>support@educhanger.com</code>.";
    }

    if (q.includes('about') || q.includes('vision') || q.includes('purpose') || q.includes('mission')) {
      return "👁️ <strong>About Us (about.html):</strong><br>EduChanger's vision is to bring CBSE Class X study guidelines, textbook summaries, and visual lectures under a single, eye-strain-free, dark-themed glassmorphic workspace. Learn more by clicking 'About' in the navbar.";
    }

    if (q.includes('website') || q.includes('educhanger') || q.includes('portal') || q.includes('features') || q.includes('theme') || q.includes('book')) {
      return "✨ <strong>EduChanger Overview:</strong><br>EduChanger is a 3D animated dark-themed educational website for CBSE Class 10 students. <br><strong>Key Features:</strong><br>• Interactive 3D cover book scroll physics<br>• Register-enforced Login validations<br>• Custom welcome email chime widgets<br>• Study Portal with 40 structured lessons (Math, Science, Social, English)<br>• Next Toppers video embeds with Theater modal<br>• Interactive Star Review Center<br>• Admin Auditing registry console";
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greet') || q.includes('help')) {
      return "👋 Hello! I am <strong>EduBot</strong>, your EduChanger Study Guide.<br><br>Ask me about subject lessons, Next Toppers videos, review submissions, welcome email chime triggers, page links, or the 403 access barriers! What would you like to know?";
    }

    // Default Fallback
    return "💡 <strong>EduBot Quick Tip:</strong> I can tell you everything about the EduChanger platform! <br><br>Try asking me: <strong>'How to study?'</strong>, <strong>'Where are the science maps?'</strong>, <strong>'How to write a review?'</strong>, or <strong>'What is the Google login rules?'</strong>.";
  }
});
