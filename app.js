// EduVerse JS - Landing & 3D Book Controller

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const canvas = document.getElementById('particle-canvas');
  const book = document.getElementById('3d-book');
  const coverFront = document.getElementById('cover-front');
  const pageLeft = document.getElementById('page-left');
  const pageRight = document.getElementById('page-right');
  const scrollHelper = document.getElementById('scroll-helper');
  const authForm = document.getElementById('auth-form');
  const authEmailInput = document.getElementById('username-email');
  const authPassInput = document.getElementById('password');
  const authBtn = document.getElementById('auth-btn');
  const formHeader = document.getElementById('form-header');
  const segmentRegister = document.getElementById('segment-register');
  const segmentLogin = document.getElementById('segment-login');
  const sliderPill = document.getElementById('slider-pill');
  const googleLoginBtn = document.getElementById('google-login-btn');
  const googleBtnText = document.getElementById('google-btn-text');
  const authErrorBanner = document.getElementById('auth-error-banner');
  const successOverlay = document.getElementById('success-overlay');
  const successTitle = document.getElementById('success-title');
  const successMsg = document.getElementById('success-msg');

  let isLoginMode = false; // Default: Register Mode
  let isTransitioning = false;
  let currentScrollPercent = 0;

  // 1. Particle Background Setup
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 120;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.7 + 0.3;
    }
    update() {
      // accelerate speed dynamically based on book opening scroll percent
      const accel = 1 + (currentScrollPercent * 6);
      this.x += this.speedX * accel;
      this.y += this.speedY * accel;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`; // Violet accent
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 2. Scroll Animation Handler for the 3D Book
  function handleScroll() {
    if (isTransitioning) return;

    const scrollTop = window.scrollY;
    // Track limits
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    currentScrollPercent = percent;

    // Fade out helper icon on scroll
    if (percent > 0.05) {
      scrollHelper.style.opacity = '0';
    } else {
      scrollHelper.style.opacity = '1';
    }

    // Front Cover opens rotation (maps from 10% scroll to 80% scroll)
    let coverRotation = 0;
    let coverPercent = 0;
    if (percent > 0.1) {
      coverPercent = Math.min((percent - 0.1) / 0.7, 1);
      coverRotation = -180 * coverPercent;
    }
    // Dynamically retrieve CSS book width variable to compute exact shift offset
    const bookWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--book-width')) || 380;
    const halfWidth = bookWidth / 2;
    const shiftX = -coverPercent * halfWidth; // Shifts the right page (login form) to the center of the viewport

    // Open Book sound effect trigger
    if (coverRotation < -30) {
      if (!window.bookOpenedSoundPlayed) {
        if (window.playSynthSound) window.playSynthSound('open_book');
        window.bookOpenedSoundPlayed = true;
      }
    } else {
      window.bookOpenedSoundPlayed = false;
    }

    // Book is straight facing the screen
    const rx = 0;
    const ry = 0;
    const rz = 0;
    const scale = 1.05 + (percent * 0.15); // Scale up slightly on open (brings it slightly forward)

    book.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale}) translateX(${shiftX}px)`;

    // Fade out and translate the landing intro title (preserving horizontal center)
    const intro = document.getElementById('landing-intro');
    if (intro) {
      intro.style.opacity = Math.max(1 - percent * 3, 0);
      intro.style.transform = `translateX(-50%) translateY(${-percent * 40}px)`;
      if (percent > 0.3) {
        intro.style.pointerEvents = 'none';
      } else {
        intro.style.pointerEvents = 'auto';
      }
    }
    coverFront.style.transform = `rotateY(${coverRotation}deg)`;

    // Pages fade in as soon as cover opens past 85deg (halfway)
    if (coverRotation < -85) {
      pageLeft.classList.add('visible');
      pageRight.classList.add('visible');
    } else {
      pageLeft.classList.remove('visible');
      pageRight.classList.remove('visible');
    }

    // Hide front cover when fully open (past -170deg) to prevent horizontal viewport overflow
    if (coverRotation < -170) {
      coverFront.style.visibility = 'hidden';
    } else {
      coverFront.style.visibility = 'visible';
    }

    // Vortex formula shift on scroll
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
      const delay = index * 0.08;
      const factor = Math.max(percent - delay, 0);
      const rot = factor * 280 + (index * 45);
      const sc = Math.max(1 - (factor * 1.2), 0);
      const transX = -factor * 150;
      const transY = -factor * 150;
      
      el.style.transform = `translate(${transX}px, ${transY}px) rotate(${rot}deg) scale(${sc})`;
      el.style.opacity = Math.max(1 - percent * 1.8, 0);
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once initially

  // 3. Auth Mode Toggle (Login vs Register Segment Control)
  function setAuthMode(mode) {
    if (mode === 'login') {
      isLoginMode = true;
      segmentLogin.classList.add('active');
      segmentRegister.classList.remove('active');
      sliderPill.style.transform = 'translateX(100%)';
      
      formHeader.textContent = 'Account Login';
      authBtn.textContent = 'Login & Access Materials';
      if (googleBtnText) googleBtnText.textContent = 'Login with Google';
    } else {
      isLoginMode = false;
      segmentRegister.classList.add('active');
      segmentLogin.classList.remove('active');
      sliderPill.style.transform = 'translateX(0)';
      
      formHeader.textContent = 'Create Account';
      authBtn.textContent = 'Register & Start Study';
      if (googleBtnText) googleBtnText.textContent = 'Register with Google';
    }
    if (authErrorBanner) authErrorBanner.style.display = 'none';
  }

  if (segmentRegister && segmentLogin) {
    segmentRegister.addEventListener('click', () => setAuthMode('register'));
    segmentLogin.addEventListener('click', () => setAuthMode('login'));
  }

  // 4. Form Action (Authentication)
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const identifier = authEmailInput.value.trim();
    const password = authPassInput.value;
    if (authErrorBanner) authErrorBanner.style.display = 'none';

    if (isLoginMode) {
      // 1. Check Admin credentials
      if (identifier === 'Admin@123' && password === 'Admin@1234') {
        sessionStorage.setItem('educhanger_just_registered', 'false');
        sessionStorage.setItem('educhanger_user_email', identifier);
        sessionStorage.setItem('educhanger_user_name', 'Admin');
        triggerSuccessRedirect('Admin Desk Activated', 'Welcome Admin. Launching control panel...', true);
        return;
      }
      
      // 2. Check Standard Users
      const users = EduDatabase.getUsers();
      const matchUser = users.find(u => u.email === identifier);
      if (!matchUser) {
        showAuthError("Email/Username is not registered. Please register first!");
        return;
      }
      if (matchUser.password !== password) {
        showAuthError("Incorrect password. Please try again.");
        return;
      }

      sessionStorage.setItem('educhanger_just_registered', 'false');
      sessionStorage.setItem('educhanger_user_email', identifier);
      sessionStorage.setItem('educhanger_user_name', matchUser.name || identifier.split('@')[0]);
      triggerSuccessRedirect('Welcome Back!', `Logged in successfully as ${matchUser.name || identifier.split('@')[0]}.`, false);
    } else {
      // Register Mode
      if (identifier.toLowerCase().includes('admin') || identifier === 'Admin@123') {
        showAuthError('This identifier is reserved for administration. Please login.');
        return;
      }
      
      const users = EduDatabase.getUsers();
      const userExists = users.some(u => u.email === identifier);
      if (userExists) {
        showAuthError('This email/username is already registered. Please login.');
        return;
      }

      // Add new user
      EduDatabase.addUser({
        email: identifier,
        password: password,
        name: identifier.split('@')[0],
        method: 'Form',
        date: new Date().toISOString().split('T')[0]
      });

      sessionStorage.setItem('educhanger_just_registered', 'true');
      sessionStorage.setItem('educhanger_user_email', identifier);
      sessionStorage.setItem('educhanger_user_name', identifier.split('@')[0]);
      triggerSuccessRedirect('Registration Complete', 'Account created! Welcome to EduChanger.', false);
    }
  });



  // Error Banner Helper
  function showAuthError(message) {
    if (authErrorBanner) {
      authErrorBanner.textContent = message;
      authErrorBanner.style.display = 'block';
    } else {
      alert(message);
    }
  }

  // 6. Form Submission Animation & Close Book Sequence
  function triggerSuccessRedirect(title, message, isAdmin) {
    isTransitioning = true;
    
    // Store Auth Info
    sessionStorage.setItem('educhanger_logged_in', 'true');
    if (isAdmin) {
      sessionStorage.setItem('educhanger_role', 'admin');
    } else {
      sessionStorage.setItem('educhanger_role', 'student');
    }

    // Scroll back to top to align book centered before closing
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      // Play book closing animations (straight)
      book.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)`;
      coverFront.style.transform = `rotateY(0deg)`;
      pageLeft.classList.remove('visible');
      pageRight.classList.remove('visible');

      // Launch overlay spinner
      setTimeout(() => {
        successTitle.textContent = title;
        successMsg.textContent = message;
        successOverlay.classList.add('active');

        // Redirect to Dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1800);
      }, 600);
    }, 300);
  }

  // ==========================================
  // Real working Google Sign-In Integration with Gmail Alerts
  // ==========================================
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let tokenClient = null;

  function initGoogleTokenClient() {
    if (isLocalhost && typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
      try {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: "802951711833-q2v7qp22lqgh6u4p6k3u5o2a12j3t7df.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              handleGoogleTokenSuccess(tokenResponse.access_token);
            }
          }
        });
      } catch (err) {
        console.error("GIS Token Client initialization failed", err);
      }
    }
  }

  function handleGoogleTokenSuccess(accessToken) {
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
      .then(res => res.json())
      .then(userinfo => {
        const email = userinfo.email;
        const name = userinfo.name;
        const picture = userinfo.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c';
        
        const users = EduDatabase.getUsers();
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          user = EduDatabase.addUser({
            email: email,
            password: 'GoogleUserPassword',
            method: 'Google',
            name: name,
            picture: picture
          });
        }
        
        sessionStorage.setItem('educhanger_logged_in', 'true');
        sessionStorage.setItem('educhanger_user_email', email);
        sessionStorage.setItem('educhanger_user_name', name);
        sessionStorage.setItem('educhanger_user_picture', picture);
        sessionStorage.setItem('educhanger_role', 'student');

        // Send real email alert using user's Gmail access token!
        sendGmailNotification(email, name, accessToken);
      })
      .catch(err => {
        console.error("Error fetching Google profile info", err);
        alert("Failed to retrieve profile info from Google.");
      });
  }

  function sendGmailNotification(email, name, accessToken) {
    const emailLines = [
      `To: ${email}`,
      `Subject: EduChanger Login Alert`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      `<html>`,
      `<body style="font-family: Arial, sans-serif; background-color: #0f0c1b; color: #ffffff; padding: 30px;">`,
      `  <div style="background: linear-gradient(135deg, #1e1b4b, #311042); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">`,
      `    <h2 style="color: #a855f7; margin-top: 0; font-size: 24px;">🎉 Welcome to EduChanger!</h2>`,
      `    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>`,
      `    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">You have successfully logged in to the <strong>EduChanger CBSE Class 10 Prep Portal</strong> using Google Sign-In.</p>`,
      `    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 20px 0;">`,
      `      <h4 style="color: #e2e8f0; margin-top: 0; margin-bottom: 10px; font-size: 16px;">📚 Your Prep Desk Status</h4>`,
      `      <ul style="color: #94a3b8; font-size: 14px; margin: 0; padding-left: 20px;">`,
      `        <li style="margin-bottom: 6px;">Syllabus Chapters: 40 Lessons Unlocked</li>`,
      `        <li style="margin-bottom: 6px;">Interactive Desk Sheets: Active</li>`,
      `        <li>AI chatbot Buddy (EduBot): Online</li>`,
      `      </ul>`,
      `    </div>`,
      `    <p style="color: #94a3b8; font-size: 13px; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; margin-top: 20px;">`,
      `      Learn today, Lead tomorrow.<br>`,
      `      <em>The EduChanger Development Team</em>`,
      `    </p>`,
      `  </div>`,
      `</body>`,
      `</html>`
    ].join('\r\n');

    // Base64URL encode MIME message
    const base64SafeEmail = btoa(unescape(encodeURIComponent(emailLines)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: base64SafeEmail
      })
    })
    .then(() => {
      console.log("Real Gmail notification successfully dispatched.");
      triggerSuccessRedirect('Google Login Successful', `Welcome back, ${name}! Alert email sent to your inbox.`, false);
    })
    .catch(err => {
      console.error("Gmail send error:", err);
      // Fallback redirect even if mail block occurs
      triggerSuccessRedirect('Google Login Successful', `Welcome back, ${name}! Redirecting to study portal...`, false);
    });
  }

  // Simulated Popup fallback for file:/// protocol
  function showSimulatedGooglePopup() {
    const width = 500;
    const height = 620;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const popup = window.open("", "Google Sign In", `width=${width},height=${height},left=${left},top=${top}`);
    
    popup.document.write(`
      <html>
        <head>
          <title>Sign in - Google Accounts</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 40px 30px;
              background-color: #ffffff;
              color: #202124;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 100vh;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              width: 100%;
            }
            .logo {
              font-size: 24px;
              font-weight: 500;
              letter-spacing: -0.5px;
              margin-bottom: 16px;
            }
            .logo span:nth-child(1) { color: #4285F4; }
            .logo span:nth-child(2) { color: #EA4335; }
            .logo span:nth-child(3) { color: #FBBC05; }
            .logo span:nth-child(4) { color: #4285F4; }
            .logo span:nth-child(5) { color: #34A853; }
            .logo span:nth-child(6) { color: #EA4335; }
            
            .title {
              font-size: 24px;
              font-weight: 400;
              margin-top: 10px;
              margin-bottom: 8px;
            }
            .subtitle {
              font-size: 16px;
              color: #5f6368;
              margin-bottom: 24px;
            }
            
            .input-group {
              width: 100%;
              max-width: 380px;
              position: relative;
              margin-bottom: 20px;
            }
            .input-group input {
              width: 100%;
              padding: 16px;
              border: 1px solid #dadce0;
              border-radius: 4px;
              font-size: 16px;
              outline: none;
              box-sizing: border-box;
            }
            .input-group input:focus {
              border-color: #1a73e8;
              border-width: 2px;
              padding: 15px;
            }
            
            .buttons {
              display: flex;
              justify-content: space-between;
              width: 100%;
              max-width: 380px;
              margin-top: 20px;
              align-items: center;
            }
            .btn-link {
              color: #1a73e8;
              text-decoration: none;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
            }
            .btn-primary {
              background-color: #1a73e8;
              color: #ffffff;
              border: none;
              padding: 10px 24px;
              border-radius: 4px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .btn-primary:hover {
              background-color: #1557b0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
            </div>
            <div class="title">Sign in</div>
            <div class="subtitle">to continue to EduChanger</div>
            
            <div class="input-group" style="margin-top: 30px;">
              <input type="email" id="email" required placeholder="Google Email" value="student.demo@gmail.com">
            </div>
            <div class="input-group">
              <input type="text" id="name" required placeholder="Display Name" value="Class X Topper">
            </div>
          </div>
          
          <div class="buttons">
            <a class="btn-link">Create account</a>
            <button class="btn-primary" id="btn-next">Next</button>
          </div>
          
          <script>
            document.getElementById('btn-next').addEventListener('click', () => {
              const email = document.getElementById('email').value.trim();
              const name = document.getElementById('name').value.trim();
              if (email && name) {
                window.opener.postMessage({
                  type: 'GOOGLE_SIGN_IN_MOCK',
                  email: email,
                  name: name
                }, '*');
                window.close();
              }
            });
          </script>
        </body>
      </html>
    `);
  }

  // Handle postMessage mock Google alerts
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'GOOGLE_SIGN_IN_MOCK') {
      const email = e.data.email;
      const name = e.data.name;
      
      const users = EduDatabase.getUsers();
      let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = EduDatabase.addUser({
          email: email,
          password: 'GoogleUserPassword',
          method: 'Google',
          name: name,
          picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        });
      }
      
      sessionStorage.setItem('educhanger_logged_in', 'true');
      sessionStorage.setItem('educhanger_user_email', email);
      sessionStorage.setItem('educhanger_user_name', name);
      sessionStorage.setItem('educhanger_user_picture', 'https://lh3.googleusercontent.com/a/default-user=s96-c');
      sessionStorage.setItem('educhanger_role', 'student');
      
      triggerSuccessRedirect('Google Login Successful', `Welcome back, ${name}! Mock alert email dispatched.`, false);
    }
  });

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isLocalhost && tokenClient) {
        tokenClient.requestAccessToken();
      } else {
        showSimulatedGooglePopup();
      }
    });
  }

  // ==========================================
  // Premium Web Audio API Synth Synthesizer Sound System
  // ==========================================
  window.playSynthSound = function(type) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      } else if (type === 'open_book') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      }
    } catch(e) {
      console.warn("Audio Context block", e);
    }
  };

  // Intercept all button, segment control, and interactive tab clicks globally
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.classList.contains('segment-btn') || 
      target.classList.contains('tab-btn') ||
      target.classList.contains('lms-tab') ||
      target.classList.contains('subject-tab')
    ) {
      if (window.playSynthSound) {
        window.playSynthSound('click');
      }
    }
  });

  setTimeout(initGoogleTokenClient, 800);
});
