/* EduVerse Real-Time Peer Collaborative Whiteboard Engine */

document.addEventListener('DOMContentLoaded', () => {
  const emailVal = sessionStorage.getItem('educhanger_user_email') || '';
  const userName = sessionStorage.getItem('educhanger_user_name') || (emailVal ? emailVal.split('@')[0] : 'Guest Student');
  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get('code');

  if (!roomCode) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Display Room Code inside Header
  const displayRoomCode = document.getElementById('display-room-code');
  if (displayRoomCode) {
    displayRoomCode.textContent = roomCode;
  }

  // Setup click-to-copy Room Code feature
  const btnShowRoomCode = document.getElementById('btn-show-room-code');
  if (btnShowRoomCode) {
    btnShowRoomCode.addEventListener('click', () => {
      navigator.clipboard.writeText(roomCode).then(() => {
        showToast('Room Code copied to clipboard!');
      });
    });
  }

  // Update Curriculum title badge based on active board selection
  const currentBoard = localStorage.getItem('educhanger_board') || 'cbse';
  const boardCurriculum = document.getElementById('board-curriculum');
  if (boardCurriculum) {
    const boardNames = { cbse: 'CBSE Class X', icse: 'ICSE Class X', ssc: 'SSC Class X State Board' };
    boardCurriculum.textContent = boardNames[currentBoard] || 'Class X Board Prep';
  }

  // Particle Background
  const partCanvas = document.getElementById('particle-canvas');
  if (partCanvas) {
    const ctxP = partCanvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      partCanvas.width = window.innerWidth;
      partCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * partCanvas.width,
        y: Math.random() * partCanvas.height,
        r: Math.random() * 2 + 1,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15
      });
    }

    function animateParticles() {
      ctxP.clearRect(0, 0, partCanvas.width, partCanvas.height);
      ctxP.fillStyle = 'rgba(168, 85, 247, 0.25)';
      particles.forEach(p => {
        ctxP.beginPath();
        ctxP.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxP.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > partCanvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > partCanvas.height) p.speedY *= -1;
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // Premium Web Audio Synthesizer (Loud 0.35 gain)
  // ==========================================
  const playSynthSound = function(type) {
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
      } else if (type === 'join') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch(e) {
      console.warn("Audio Context blocked", e);
    }
  };

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.classList.contains('color-swatch') ||
      target.classList.contains('tool-btn')
    ) {
      playSynthSound('click');
    }
  });

  // ==========================================
  // HTML5 Whiteboard Drawing Logic
  // ==========================================
  const canvas = document.getElementById('whiteboard-canvas');
  const ctx = canvas.getContext('2d');

  function resizeBoard() {
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = activeSize;
  }

  let isDrawing = false;
  let activeTool = 'pencil';
  let activeColor = '#a855f7';
  let activeSize = 5;
  let lastX = 0;
  let lastY = 0;
  let strokeQueue = [];

  // Batch broadcast strokes to the server every 100ms
  setInterval(() => {
    if (strokeQueue.length > 0) {
      const batch = [...strokeQueue];
      strokeQueue = []; // Clear queue buffer

      fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          action: 'draw',
          sender: userName,
          strokes: batch
        })
      }).catch(err => console.warn('Broadcast error:', err));
    }
  }, 100);

  const toolPencil = document.getElementById('tool-pencil');
  const toolEraser = document.getElementById('tool-eraser');
  const toolClear = document.getElementById('tool-clear');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeVal = document.getElementById('brush-size-val');

  brushSizeInput.value = activeSize;
  brushSizeVal.textContent = `${activeSize}px`;

  toolPencil.addEventListener('click', () => {
    activeTool = 'pencil';
    toolPencil.classList.add('active');
    toolEraser.classList.remove('active');
  });

  toolEraser.addEventListener('click', () => {
    activeTool = 'eraser';
    toolEraser.classList.add('active');
    toolPencil.classList.remove('active');
  });

  toolClear.addEventListener('click', () => {
    // Clear locally
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Send clear action to room
    fetch('/api/room', {
      method: 'POST',
      body: JSON.stringify({ code: roomCode, action: 'clear' })
    });
  });

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      activeColor = swatch.getAttribute('data-color');
      activeTool = 'pencil';
      toolPencil.classList.add('active');
      toolEraser.classList.remove('active');
    });
  });

  brushSizeInput.addEventListener('input', (e) => {
    activeSize = e.target.value;
    brushSizeVal.textContent = `${activeSize}px`;
  });

  // Canvas drawing listeners
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Mobile Touch support
  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });

  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = activeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const color = activeTool === 'eraser' ? '#0d0d1b' : activeColor;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    // Broadcast stroke to the room session in batch queue
    strokeQueue.push({
      lastX: lastX,
      lastY: lastY,
      x: x,
      y: y,
      color: color,
      size: activeSize
    });

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  setTimeout(resizeBoard, 150);

  // ==========================================
  // Collaborative Room Sync Service
  // ==========================================
  const toast = document.getElementById('toast');
  const membersList = document.getElementById('group-members-list');
  const membersCount = document.getElementById('members-count');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatContainer = document.getElementById('chat-messages-container');

  let localStrokesCount = 0;
  let chatMessagesCount = 0;
  let currentGroupMembers = [];

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    playSynthSound('join');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }

  // Join room request on load
  function joinRoomSession() {
    fetch('/api/room', {
      method: 'POST',
      body: JSON.stringify({ code: roomCode, action: 'join', name: userName })
    })
    .then(r => r.json())
    .then(() => {
      pollRoomState();
      // Start polling sync cycle every 250ms
      setInterval(pollRoomState, 250);
    });
  }

  function pollRoomState() {
    fetch(`/api/room?code=${roomCode}`)
      .then(r => r.json())
      .then(data => {
        // Sync members
        syncMembersList(data.members);
        
        // Sync chat messages
        syncChatMessages(data.chat);

        // Sync drawing strokes
        syncDrawingStrokes(data.strokes);
      })
      .catch(err => console.warn('Room sync error:', err));
  }

  function syncMembersList(members) {
    if (!members) return;
    
    // Check if member count changed
    if (members.length !== currentGroupMembers.length) {
      // Find new members to toast
      members.forEach(m => {
        if (!currentGroupMembers.includes(m) && m !== userName) {
          showToast(`${m} joined the group study session!`);
        }
      });
      
      currentGroupMembers = members;
      membersCount.textContent = `${members.length} Online`;
      
      // Re-render members sidebar
      membersList.innerHTML = '';
      members.forEach(m => {
        const item = document.createElement('div');
        item.className = `member-item ${m === userName ? 'current-user' : ''}`;
        item.innerHTML = `
          <span class="user-avatar" style="background: ${m === userName ? 'var(--accent-gradient)' : '#00f0ff'};">${m.substring(0, 2).toUpperCase()}</span>
          <div class="member-info">
            <span class="member-name">${m}</span>
            <span class="member-status">${m === userName ? 'Room Host' : 'Study Partner'}</span>
          </div>
          <span class="peer-dot active"></span>
        `;
        membersList.appendChild(item);
      });
    }
  }

  function syncChatMessages(chat) {
    if (!chat || chat.length <= chatMessagesCount) return;

    for (let i = chatMessagesCount; i < chat.length; i++) {
      const msg = chat[i];
      const msgItem = document.createElement('div');
      
      if (msg.system) {
        msgItem.className = 'system-message';
        msgItem.textContent = `🎯 System: ${msg.text}`;
      } else {
        msgItem.className = `chat-message-item ${msg.sender === userName ? 'me' : 'peer'}`;
        msgItem.innerHTML = `
          <span class="msg-sender">${msg.sender}</span>
          <div class="msg-bubble">${msg.text}</div>
        `;
      }
      chatContainer.appendChild(msgItem);
    }
    
    chatMessagesCount = chat.length;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function syncDrawingStrokes(strokes) {
    if (!strokes) return;

    // Handle clear action from peer
    if (strokes.length === 0 && localStrokesCount > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localStrokesCount = 0;
      return;
    }

    if (strokes.length > localStrokesCount) {
      for (let i = localStrokesCount; i < strokes.length; i++) {
        const s = strokes[i];
        // Draw strokes made by peers
        if (s.sender !== userName) {
          ctx.lineWidth = s.size;
          ctx.strokeStyle = s.color;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(s.lastX, s.lastY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
          ctx.closePath();
        }
      }
      localStrokesCount = strokes.length;
    }
  }

  // Send chat message
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    fetch('/api/room', {
      method: 'POST',
      body: JSON.stringify({ code: roomCode, action: 'chat', sender: userName, text: text })
    });
    chatInput.value = '';
  });

  // Join the session on load
  joinRoomSession();
});
