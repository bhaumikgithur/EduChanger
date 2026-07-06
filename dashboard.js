// EduChanger JS - Student Dashboard & Content Management

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session and Auth Check
  const isLoggedIn = sessionStorage.getItem('educhanger_logged_in') === 'true';
  if (!isLoggedIn) {
    // If not logged in, redirect to login page
    window.location.href = 'index.html';
    return;
  }

  const userRole = sessionStorage.getItem('educhanger_role') || 'student';
  const isAdmin = userRole === 'admin';

  // Elements
  const userDisplayName = document.getElementById('user-display-name');
  const adminBadge = document.getElementById('admin-badge');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutBtn = document.getElementById('logout-btn');

  // Set Profile UI
  if (isAdmin) {
    userDisplayName.textContent = 'Administrator';
    adminBadge.style.display = 'flex';
    welcomeMessage.textContent = 'Welcome Back, Admin';
    // Reveal all elements marked admin-only
    document.querySelectorAll('.admin-only').forEach(el => {
      if (el.tagName === 'A') {
        el.style.display = 'inline-block';
      } else {
        el.style.display = 'flex';
      }
    });
  } else {
    userDisplayName.textContent = 'Student X';
    adminBadge.style.display = 'none';
    welcomeMessage.textContent = 'Welcome to Your Study Desk';
  }

  // Logout action
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
  });


  // 2. Load and Render Data
  const materialsGrid = document.getElementById('materials-grid');
  const reviewsGrid = document.getElementById('reviews-grid');
  const reviewForm = document.getElementById('review-form');
  const reviewRatingInput = document.getElementById('review-rating');
  const reviewCommentInput = document.getElementById('review-comment');
  const starsSelector = document.getElementById('stars-selector');
  const searchInput = document.getElementById('search-input');

  let currentMaterialFilter = 'all';
  let searchQuery = '';

  // Helper: Convert youtube link to embed url
  function getEmbedUrl(url) {
    if (!url) return '';
    // If already in embed format
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('player.vimeo.com/')) return url;
    
    // YouTube watch URLs (e.g. watch?v=ID)
    if (url.includes('youtube.com/watch')) {
      try {
        const urlParams = new URLSearchParams(new URL(url).search);
        const vParam = urlParams.get('v');
        if (vParam) return `https://www.youtube.com/embed/${vParam}`;
      } catch (e) {
        console.error("Failed to parse watch url", e);
      }
    }
    // YouTube short share URLs (e.g. youtu.be/ID)
    if (url.includes('youtu.be/')) {
      try {
        const parts = url.split('/');
        const id = parts[parts.length - 1].split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      } catch (e) {
        console.error("Failed to parse youtu.be url", e);
      }
    }
    return url; // Return as-is if no match
  }

  // Render Materials function
  function renderMaterials() {
    if (!materialsGrid) return;
    const materials = EduDatabase.getMaterials();
    materialsGrid.innerHTML = '';

    // Filter by subject and search query
    const filtered = materials.filter(m => {
      const matchSubject = currentMaterialFilter === 'all' || m.subject === currentMaterialFilter;
      const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });

    if (filtered.length === 0) {
      materialsGrid.innerHTML = `
        <div class="empty-state">
          <p>No study materials found matching your filter or query.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(m => {
      const card = document.createElement('div');
      card.className = 'material-card';
      card.setAttribute('data-subject-type', m.subject);

      // Construct actions for admin
      let adminActions = '';
      if (isAdmin) {
        adminActions = `
          <div class="admin-card-actions">
            <button class="btn-icon-action edit-action" data-id="${m.id}" title="Edit Material">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon-action delete-action" data-id="${m.id}" title="Delete Material">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="card-header-info">
          <div class="card-tag">${m.subject}</div>
          <h4 class="card-title">${m.title}</h4>
          <p class="card-description">${m.description}</p>
        </div>
        <div class="card-footer">
          <span class="card-date">Added: ${m.date}</span>
          <div style="display: flex; align-items: center; gap: 15px;">
            ${adminActions}
            <a href="${m.link}" class="card-link" target="_blank">
              Download PDF
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      `;
      materialsGrid.appendChild(card);
    });

    // Attach admin actions listeners
    if (isAdmin) {
      document.querySelectorAll('.edit-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditMaterialModal(btn.getAttribute('data-id'));
        });
      });
      document.querySelectorAll('.delete-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleDeleteMaterial(btn.getAttribute('data-id'));
        });
      });
    }
  }

  // Render Reviews function
  function renderReviews() {
    if (!reviewsGrid) return;
    const reviews = EduDatabase.getReviews();
    reviewsGrid.innerHTML = '';

    reviews.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';

      // stars html
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= r.rating) {
          starsHtml += '★';
        } else {
          starsHtml += '☆';
        }
      }

      // Admin delete button
      let adminControls = '';
      if (isAdmin) {
        adminControls = `
          <button class="admin-delete-review-btn" data-id="${r.id}" title="Delete Review">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        `;
      }

      const initials = r.name ? r.name.substring(0, 2).toUpperCase() : 'ST';

      card.innerHTML = `
        <div>
          <div class="review-card-header">
            <div class="review-stars">${starsHtml}</div>
            <span class="review-date">${r.date}</span>
          </div>
          <p class="review-comment">"${r.comment}"</p>
        </div>
        <div class="review-author">
          <div class="review-avatar">${initials}</div>
          <div style="flex-grow: 1;">
            <div class="review-author-name">${r.name}</div>
          </div>
          ${adminControls}
        </div>
      `;
      reviewsGrid.appendChild(card);
    });

    // attach admin delete action
    if (isAdmin) {
      document.querySelectorAll('.admin-delete-review-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const reviewId = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this feedback review?')) {
            EduDatabase.deleteReview(reviewId);
            showToast('Review removed successfully.');
            renderReviews();
          }
        });
      });
    }
  }

  // Load initially
  renderMaterials();
  renderReviews();

  // 3. Search and Tag filters listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderMaterials();
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMaterialFilter = btn.getAttribute('data-subject');
        renderMaterials();
      });
    });
  }

  // Rating stars selection interaction
  if (starsSelector) {
    const stars = starsSelector.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'));
        reviewRatingInput.value = val;
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-value'));
          if (sVal <= val) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });
  }

  // Review Form Submit Handler
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = parseInt(reviewRatingInput.value);
      const comment = reviewCommentInput.value.trim();
      const userEmail = sessionStorage.getItem('educhanger_user_email') || 'student@educhanger.com';
      const name = userEmail.split('@')[0];

      EduDatabase.addReview({
        name: name,
        rating: rating,
        comment: comment
      });

      reviewCommentInput.value = '';
      if (starsSelector) {
        starsSelector.querySelectorAll('.star').forEach(s => s.classList.add('active'));
      }
      reviewRatingInput.value = 5;

      showToast('Thank you! Review posted.');
      renderReviews();
    });
  }


  // 4. Modal Dialog Controllers
  const materialModal = document.getElementById('material-modal');
  const videoModal = document.getElementById('video-modal');
  const btnCloseModals = document.querySelectorAll('.btn-close-modal');

  // Form input elements
  const materialForm = document.getElementById('material-form');
  const editMaterialId = document.getElementById('edit-material-id');
  const materialTitle = document.getElementById('material-title');
  const materialSubject = document.getElementById('material-subject');
  const materialLink = document.getElementById('material-link');
  const materialDesc = document.getElementById('material-desc');

  const videoForm = document.getElementById('video-form');
  const editVideoId = document.getElementById('edit-video-id');
  const videoTitle = document.getElementById('video-title');
  const videoSubject = document.getElementById('video-subject');
  const videoUrl = document.getElementById('video-url');
  const videoDesc = document.getElementById('video-desc');

  // Close helper
  btnCloseModals.forEach(btn => {
    btn.addEventListener('click', () => {
      materialModal.classList.remove('active');
      videoModal.classList.remove('active');
    });
  });

  // Open modals to add new
  const btnAddMaterial = document.getElementById('btn-add-material');
  if (btnAddMaterial) {
    btnAddMaterial.addEventListener('click', () => {
      document.getElementById('material-modal-title').textContent = 'Add Study Material';
      editMaterialId.value = '';
      materialForm.reset();
      materialLink.value = '#';
      materialModal.classList.add('active');
    });
  }
 
  const btnAddVideo = document.getElementById('btn-add-video');
  if (btnAddVideo) {
    btnAddVideo.addEventListener('click', () => {
      document.getElementById('video-modal-title').textContent = 'Add Educational Video';
      editVideoId.value = '';
      videoForm.reset();
      videoModal.classList.add('active');
    });
  }

  // Open modals to edit existing
  function openEditMaterialModal(id) {
    const materials = EduDatabase.getMaterials();
    const material = materials.find(m => m.id === id);
    if (!material) return;

    document.getElementById('material-modal-title').textContent = 'Edit Study Material';
    editMaterialId.value = material.id;
    materialTitle.value = material.title;
    materialSubject.value = material.subject;
    materialLink.value = material.link;
    materialDesc.value = material.description;

    materialModal.classList.add('active');
  }

  function openEditVideoModal(id) {
    const videos = EduDatabase.getVideos();
    const video = videos.find(v => v.id === id);
    if (!video) return;

    document.getElementById('video-modal-title').textContent = 'Edit Educational Video';
    editVideoId.value = video.id;
    videoTitle.value = video.title;
    videoSubject.value = video.subject;
    videoUrl.value = video.url;
    videoDesc.value = video.description;

    videoModal.classList.add('active');
  }

  // 5. Submit Form handlers (Save Actions)
  materialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editMaterialId.value;
    const data = {
      title: materialTitle.value.trim(),
      subject: materialSubject.value,
      link: materialLink.value.trim(),
      description: materialDesc.value.trim()
    };

    if (id) {
      // Edit
      EduDatabase.editMaterial(id, data);
      showToast('Study material updated!');
    } else {
      // Add
      EduDatabase.addMaterial(data);
      showToast('New study material added!');
    }

    materialModal.classList.remove('active');
    renderMaterials();
  });

  // 6. Delete Action handlers
  function handleDeleteMaterial(id) {
    if (confirm('Are you sure you want to delete this study resource? This cannot be undone.')) {
      EduDatabase.deleteMaterial(id);
      showToast('Study material deleted successfully.');
      renderMaterials();
    }
  }

  // 7. Tab toggles inside instructional section
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.getAttribute('data-tab')}`;
      document.getElementById(targetId).classList.add('active');
    });
  });

  // 8. Toast Helper
  const toast = document.getElementById('toast');
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }

  // 9. Mock Welcome Email Notification Controller
  const justRegistered = sessionStorage.getItem('educhanger_just_registered') === 'true';
  if (justRegistered) {
    // Clear flag so it triggers only once
    sessionStorage.setItem('educhanger_just_registered', 'false');

    const userEmail = sessionStorage.getItem('educhanger_user_email') || 'student@educhanger.com';
    const emailToDisplay = document.getElementById('email-to-display');
    if (emailToDisplay) {
      emailToDisplay.textContent = userEmail;
    }

    const emailNotif = document.getElementById('email-notif');
    const emailNotifClose = document.getElementById('email-notif-close');
    const emailModal = document.getElementById('email-modal');
    const emailModalClose = document.getElementById('email-modal-close');

    // Slide in email notification after 2 seconds
    setTimeout(() => {
      if (emailNotif) {
        emailNotif.classList.add('active');
        // Play soft synth notification sound (using Web Audio API, very premium touch!)
        playNotificationSound();
      }
    }, 2200);

    // Click notif to open email details
    if (emailNotif) {
      emailNotif.addEventListener('click', () => {
        emailNotif.classList.remove('active');
        if (emailModal) {
          emailModal.classList.add('active');
        }
      });
    }

    // Close notification alert
    if (emailNotifClose) {
      emailNotifClose.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening modal
        emailNotif.classList.remove('active');
      });
    }

    // Close email details modal
    if (emailModalClose) {
      emailModalClose.addEventListener('click', () => {
        emailModal.classList.remove('active');
      });
    }
  }

  // Web Audio API helper for premium chime notification
  function playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Chime tone 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.6);

      // Chime tone 2 (delayed slightly)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.8);
      }, 100);
      
    } catch (e) {
      console.log('Audio context is blocked or unsupported', e);
    }
  }

  // ==========================================
  // LMS Interactive System Logic
  // ==========================================

  // 10. LMS Tabs switching
  const lmsTabs = document.querySelectorAll('.lms-tab');
  const lmsContents = document.querySelectorAll('.lms-tab-content');
  
  lmsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      lmsTabs.forEach(t => t.classList.remove('active'));
      lmsContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetContentId = `lms-content-${tab.getAttribute('data-lms-tab')}`;
      const targetContent = document.getElementById(targetContentId);
      if (targetContent) targetContent.classList.add('active');
      
      // If analytics tab is clicked, redraw canvas chart!
      if (tab.getAttribute('data-lms-tab') === 'analytics') {
        drawAnalyticsChart();
      }
    });
  });

  // 11. Rewards System (Coins & Milestone Badges)
  function getCoins() {
    let coins = localStorage.getItem('educhanger_coins');
    if (coins === null) {
      coins = 150;
      localStorage.setItem('educhanger_coins', coins);
    }
    return parseInt(coins);
  }
  
  window.addCoins = function(amount) {
    const newCoins = getCoins() + amount;
    localStorage.setItem('educhanger_coins', newCoins);
    updateCoinsDisplay();
    renderLeaderboard();
    playNotificationSound();
  }
  
  function updateCoinsDisplay() {
    const coins = getCoins();
    const displayVal = document.getElementById('coins-count-display');
    const headerVal = document.getElementById('coins-header-value');
    if (displayVal) displayVal.textContent = coins;
    if (headerVal) headerVal.textContent = `${coins} Coins`;
    
    // Update milestone badges dynamically!
    renderMilestones(coins);
  }
  
  function renderMilestones(coins) {
    const badgesGrid = document.getElementById('badges-grid-list');
    if (!badgesGrid) return;
    
    const milestones = [
      { name: "Syllabus Explorer", desc: "Earned at 100+ coins", min: 100, icon: "🧭" },
      { name: "Quiz Master", desc: "Earned at 250+ coins", min: 250, icon: "🎯" },
      { name: "Perfect Scorer", desc: "Earned at 400+ coins", min: 400, icon: "🏆" },
      { name: "Trivia Champion", desc: "Earned at 500+ coins", min: 500, icon: "⚡" }
    ];
    
    badgesGrid.innerHTML = milestones.map(m => {
      const unlocked = coins >= m.min;
      return `
        <div class="badge-item-lms ${unlocked ? 'unlocked' : ''}">
          <span class="b-icon">${m.icon}</span>
          <div class="b-name">${m.name}</div>
          <div class="b-desc">${m.desc}</div>
        </div>
      `;
    }).join('');
  }

  // 12. State Toppers Leaderboard
  function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-body-list');
    if (!tbody) return;
    
    const toppers = [
      { rank: 1, name: "Aarav Sharma (Delhi)", submissions: 42, coins: 580 },
      { rank: 2, name: "Sneha Reddy (Hyderabad)", submissions: 39, coins: 490 },
      { rank: 3, name: "Aditya Verma (Mumbai)", submissions: 35, coins: 380 },
      { rank: 4, name: "You (Student X)", submissions: 12, coins: getCoins(), isUser: true },
      { rank: 5, name: "Pooja Patel (Ahmedabad)", submissions: 8, coins: 120 }
    ];
    
    // Sort toppers by coins!
    toppers.sort((a, b) => b.coins - a.coins);
    
    // Re-assign ranks based on sorted order!
    toppers.forEach((t, i) => t.rank = i + 1);
    
    tbody.innerHTML = toppers.map(t => `
      <tr class="${t.isUser ? 'user-row' : ''}">
        <td><span class="rank-badge rank-${t.rank}">${t.rank}</span></td>
        <td><strong>${t.name}</strong></td>
        <td>${t.submissions}</td>
        <td><span style="color: var(--accent-amber); font-weight:700;">🪙 ${t.coins}</span></td>
      </tr>
    `).join('');
  }

  // 13. GPA Calculator
  const btnCalcGpa = document.getElementById('btn-calc-gpa');
  if (btnCalcGpa) {
    btnCalcGpa.addEventListener('click', () => {
      const m = parseFloat(document.getElementById('gpa-math').value) || 0;
      const s = parseFloat(document.getElementById('gpa-science').value) || 0;
      const sst = parseFloat(document.getElementById('gpa-sst').value) || 0;
      const e = parseFloat(document.getElementById('gpa-english').value) || 0;
      
      const average = (m + s + sst + e) / 4;
      let cgpa = average / 9.5;
      if (cgpa > 10) cgpa = 10;
      
      let grade = 'Fail';
      if (average >= 91) grade = 'Grade A1 (Outstanding)';
      else if (average >= 81) grade = 'Grade A2 (Excellent)';
      else if (average >= 71) grade = 'Grade B1 (Very Good)';
      else if (average >= 61) grade = 'Grade B2 (Good)';
      else if (average >= 51) grade = 'Grade C1 (Satisfactory)';
      else if (average >= 33) grade = 'Grade D (Pass)';
      
      const resultBox = document.getElementById('gpa-result-box');
      const cgpaVal = document.getElementById('gpa-cgpa-value');
      const gradeLbl = document.getElementById('gpa-grade-label');
      
      if (resultBox && cgpaVal && gradeLbl) {
        cgpaVal.textContent = cgpa.toFixed(1);
        gradeLbl.textContent = grade;
        resultBox.style.display = 'block';
      }
    });
  }

  // 14. Notes Sticky pad
  const stickyPad = document.getElementById('sticky-notes-text');
  const saveStickyBtn = document.getElementById('save-sticky-notes-btn');
  if (stickyPad) {
    stickyPad.value = localStorage.getItem('educhanger_sticky_notes') || '';
    if (saveStickyBtn) {
      saveStickyBtn.addEventListener('click', () => {
        localStorage.setItem('educhanger_sticky_notes', stickyPad.value);
        alert('sticky pad notes saved successfully!');
      });
    }
  }

  // 15. Timetable slots saver
  const saveTimetableBtn = document.getElementById('save-timetable-btn');
  if (saveTimetableBtn) {
    // Load existing values
    document.querySelectorAll('.timetable-select').forEach(el => {
      const slot = el.getAttribute('data-slot');
      el.value = localStorage.getItem(`educhanger_timetable_${slot}`) || el.value;
    });
    
    saveTimetableBtn.addEventListener('click', () => {
      document.querySelectorAll('.timetable-select').forEach(el => {
        const slot = el.getAttribute('data-slot');
        localStorage.setItem(`educhanger_timetable_${slot}`, el.value);
      });
      alert('study timetable schedule saved successfully!');
    });
  }

  // 16. Vocabulary Matcher Retro Game
  const vocabularyTerms = [
    { id: 1, text: "Quadratic Equation", matchId: 1 },
    { id: 2, text: "Redox Reaction", matchId: 2 },
    { id: 3, text: "Refraction of Light", matchId: 3 },
    { id: 4, text: "BPT Theorem", matchId: 4 }
  ];
  const vocabularyDefinitions = [
    { id: 1, text: "ax² + bx + c = 0", matchId: 1 },
    { id: 2, text: "Transfer of electrons", matchId: 2 },
    { id: 3, text: "Bending through a medium", matchId: 3 },
    { id: 4, text: "Triangles ratio parallel line similarity", matchId: 4 }
  ];

  let selectedTerm = null;
  let selectedDef = null;

  function renderGame() {
    const grid = document.getElementById('matcher-game-grid');
    if (!grid) return;
    grid.innerHTML = '';
    document.getElementById('game-feedback').style.display = 'none';

    // Shuffle arrays
    const terms = [...vocabularyTerms].sort(() => Math.random() - 0.5);
    const defs = [...vocabularyDefinitions].sort(() => Math.random() - 0.5);

    // Create term buttons
    terms.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'game-btn-lms';
      btn.textContent = t.text;
      btn.setAttribute('data-type', 'term');
      btn.setAttribute('data-id', t.id);
      btn.addEventListener('click', () => handleGameClick(btn));
      grid.appendChild(btn);
    });

    // Create def buttons
    defs.forEach(d => {
      const btn = document.createElement('button');
      btn.className = 'game-btn-lms';
      btn.textContent = d.text;
      btn.setAttribute('data-type', 'def');
      btn.setAttribute('data-id', d.id);
      btn.addEventListener('click', () => handleGameClick(btn));
      grid.appendChild(btn);
    });
  }

  function handleGameClick(btn) {
    const type = btn.getAttribute('data-type');
    const id = btn.getAttribute('data-id');

    if (type === 'term') {
      document.querySelectorAll('[data-type="term"]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTerm = id;
    } else {
      document.querySelectorAll('[data-type="def"]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedDef = id;
    }

    // Check matches
    if (selectedTerm && selectedDef) {
      if (selectedTerm === selectedDef) {
        // Matched!
        document.querySelectorAll(`.game-btn-lms[data-id="${selectedTerm}"]`).forEach(b => {
          b.classList.remove('selected');
          b.classList.add('matched');
        });
        selectedTerm = null;
        selectedDef = null;

        // Check if all matched
        const remaining = document.querySelectorAll('.game-btn-lms:not(.matched)');
        if (remaining.length === 0) {
          addCoins(20);
          document.getElementById('game-feedback').style.display = 'block';
        }
      } else {
        // Mismatch feedback
        setTimeout(() => {
          btn.classList.remove('selected');
          selectedTerm = null;
          selectedDef = null;
          document.querySelectorAll('.game-btn-lms.selected').forEach(b => b.classList.remove('selected'));
        }, 300);
      }
    }
  }

  const resetGameBtn = document.getElementById('reset-game-btn');
  if (resetGameBtn) resetGameBtn.addEventListener('click', renderGame);

  // 17. Daily Progress Canvas Chart
  function drawAnalyticsChart() {
    const canvas = document.getElementById('analytics-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const minutes = [30, 45, 60, 40, 80, 50, 70];
    
    // Draw grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = 30 + i * 35;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(650, y);
      ctx.stroke();
    }
    
    // Draw Line Graph
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const points = [];
    for (let i = 0; i < days.length; i++) {
      const x = 70 + i * 85;
      // Map minutes (0-100) to y-coords (210 to 30)
      const y = 210 - (minutes[i] / 100) * 180;
      points.push({ x, y });
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Fill Area gradient
    const grad = ctx.createLinearGradient(0, 30, 0, 210);
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, 210);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, 210);
    ctx.closePath();
    ctx.fill();
    
    // Draw Dots & values
    points.forEach((p, i) => {
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Day labels
      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px Outfit, sans-serif';
      ctx.fillText(days[i], p.x - 10, 230);
      
      // Value labels
      ctx.fillStyle = '#fff';
      ctx.fillText(`${minutes[i]}m`, p.x - 10, p.y - 12);
    });
  }

  // 18. Multilingual Translations
  const langSwitcher = document.getElementById('lang-switcher');
  const translations = {
    en: {
      totalPracticeTime: "Syllabus Practice Time",
      totalQuizzes: "Completed Quizzes",
      triviaAccuracy: "Trivia Accuracy",
      earnedCoinsLabel: "Earned Coins",
      chartHeading: "Daily Study Progression Minutes",
      rewardsChestSubtitle: "Solve board quizzes and play educational games to earn coins and climb up the leaderboard ranks!",
      badgesMilestones: "Milestone Badges (Class 10)",
      leaderboardHeading: "State Toppers Leaderboard",
      cgpaCalculator: "CGPA Calculator",
      cgpaSubtitle: "Estimate your board score from subject grades.",
      btnCalculateCGPA: "Calculate CGPA",
      timetablePlanner: "Timetable Planner",
      timetableSubtitle: "Assign hourly slots to Class X syllabus subjects.",
      btnSaveTimetable: "Save Timetable",
      boardPrepPad: "Board Prep Sticky Pad",
      stickySubtitle: "Keep active study goals and formulae handy.",
      btnSaveNotes: "Save Note",
      learningPath: "Personalized Learning Path Roadmap",
      learningPathSubtitle: "Track core checkpoints to ace CBSE boards.",
      pathNode1: "Concept Mastery",
      pathNode1Desc: "Read all 40 lessons summaries inside study portal.",
      pathNode2: "Topper Videos",
      pathNode2Desc: "Watch lecture clips under English / Science chapters.",
      pathNode3: "Practice Quizzes",
      pathNode3Desc: "Complete 10 correct answers on Study desk tools.",
      pathNode4: "Board Success",
      pathNode4Desc: "Claim Leaderboard Rank 1 and perfect CGPA ratings.",
      gameTitle: "Vocabulary Matcher Arcade",
      gameSubtitle: "Connect correct study concepts to their definitions to earn +20 Coins!",
      btnResetGame: "Play New Round",
      textbookResources: "CBSE NCERT Textbook Resources",
      textbookSubtitle: "Direct download access links to NCERT books for Class 10th Syllabus subjects."
    },
    hi: {
      totalPracticeTime: "पाठ्यक्रम अभ्यास समय",
      totalQuizzes: "पूर्ण की गई प्रश्नोत्तरी",
      triviaAccuracy: "सामान्य ज्ञान सटीकता",
      earnedCoinsLabel: "अर्जित किए गए सिक्के",
      chartHeading: "दैनिक अध्ययन प्रगति मिनट",
      rewardsChestSubtitle: "सिक्के कमाने और लीडरबोर्ड रैंक पर चढ़ने के लिए बोर्ड प्रश्नोत्तरी हल करें और शैक्षिक खेल खेलें!",
      badgesMilestones: "मील का पत्थर बैज (कक्षा 10)",
      leaderboardHeading: "राज्य टॉपर्स लीडरबोर्ड",
      cgpaCalculator: "सीजीपीए कैलकुलेटर",
      cgpaSubtitle: "विषय ग्रेड से अपने बोर्ड स्कोर का अनुमान लगाएं।",
      btnCalculateCGPA: "सीजीपीए की गणना करें",
      timetablePlanner: "समय सारिणी योजनाकार",
      timetableSubtitle: "कक्षा X पाठ्यक्रम विषयों के लिए प्रति घंटा स्लॉट असाइन करें।",
      btnSaveTimetable: "समय सारिणी सहेजें",
      boardPrepPad: "बोर्ड तैयारी स्टिकी पैड",
      stickySubtitle: "सक्रिय अध्ययन लक्ष्यों और सूत्रों को संभाल कर रखें।",
      btnSaveNotes: "नोट सहेजें",
      learningPath: "व्यक्तिगत शिक्षण पथ रोडमैप",
      learningPathSubtitle: "सीबीएसई बोर्डों में सफलता पाने के लिए मुख्य चौकियों को ट्रैक करें।",
      pathNode1: "अवधारणा महारत",
      pathNode1Desc: "अध्ययन पोर्टल के अंदर सभी 40 पाठों के सारांश पढ़ें।",
      pathNode2: "टॉपर वीडियो",
      pathNode2Desc: "अंग्रेजी / विज्ञान अध्यायों के तहत व्याख्यान क्लिप देखें।",
      pathNode3: "अभ्यास प्रश्नोत्तरी",
      pathNode3Desc: "अध्ययन डेस्क टूल पर 10 सही उत्तर पूरे करें।",
      pathNode4: "बोर्ड सफलता",
      pathNode4Desc: "लीडरबोर्ड रैंक 1 और सही सीजीपीए रेटिंग का दावा करें।",
      gameTitle: "शब्दावली मैच आर्केड",
      gameSubtitle: "+20 सिक्के कमाने के लिए सही अध्ययन अवधारणाओं को उनकी परिभाषाओं से जोड़ें!",
      btnResetGame: "नया दौर खेलें",
      textbookResources: "सीबीएसई एनसीईआरटी पाठ्यपुस्तक संसाधन",
      textbookSubtitle: "कक्षा 10वीं के पाठ्यक्रम विषयों के लिए एनसीईआरटी पुस्तकों के सीधे डाउनलोड लिंक।"
    },
    te: {
      totalPracticeTime: "సిలబస్ సాధన సమయం",
      totalQuizzes: "పూర్తయిన క్విజ్‌లు",
      triviaAccuracy: "ట్రివియా ఖచ్చితత్వం",
      earnedCoinsLabel: "సంపాదించిన నాణేలు",
      chartHeading: "రోజువారీ అధ్యయన పురోగతి నిమిషాలు",
      rewardsChestSubtitle: "నాణేలను సంపాదించడానికి మరియు లీడర్‌బోర్డ్ ర్యాంక్‌లను అధిరోహించడానికి బోర్డు క్విజ్‌లను పరిష్కరించండి మరియు విద్యా ఆటలను ఆడండి!",
      badgesMilestones: "మైలురాయి బ్యాడ్జ్‌లు (క్లాస్ 10)",
      leaderboardHeading: "రాష్ట్ర టాపర్స్ లీడర్‌బోర్డ్",
      cgpaCalculator: "CGPA కాలిక్యులేటర్",
      cgpaSubtitle: "సబ్జెక్ట్ గ్రేడ్‌ల నుండి మీ బోర్డు స్కోర్‌ను అంచనా వేయండి.",
      btnCalculateCGPA: "CGPAని లెక్కించండి",
      timetablePlanner: "టైమ్‌టేబుల్ ప్లానర్",
      timetableSubtitle: "క్లాస్ X సిలబస్ సబ్జెక్టుల కోసం గంటవారీ స్లాట్‌లను కేటాయించండి.",
      btnSaveTimetable: "టైమ్‌టేబుల్‌ను సేవ్ చేయండి",
      boardPrepPad: "బోర్డు ప్రిపరేషన్ స్టిక్కీ ప్యాడ్",
      stickySubtitle: "యాక్టివ్ అధ్యయన లక్ష్యాలను మరియు సూత్రాలను సిద్ధంగా ఉంచుకోండి.",
      btnSaveNotes: "గమనికను సేవ్ చేయి",
      learningPath: "వ్యక్తిగతీకరించిన అభ్యాస మార్గం రోడ్‌మ్యాప్",
      learningPathSubtitle: "CBSE బోర్డులలో రాణించడానికి ప్రధాన తనిఖీ కేంద్రాలను ట్రాక్ చేయండి.",
      pathNode1: "కాన్సెప్ట్ మాస్టరీ",
      pathNode1Desc: "స్టడీ పోర్టల్ లోపల అన్ని 40 పాఠాల సారాంశాలను చదవండి.",
      pathNode2: "టాపర్ వీడియోలు",
      pathNode2Desc: "ఇంగ్లీష్ / సైన్స్ అధ్యాయాల క్రింద లెక్చర్ క్లిప్‌లను చూడండి.",
      pathNode3: "సాధన క్విజ్‌లు",
      pathNode3Desc: "స్టడీ డెస్క్ టూల్స్‌లో 10 సరైన సమాధానాలను పూర్తి చేయండి.",
      pathNode4: "బోర్డు విజయం",
      pathNode4Desc: "లీడర్‌బోర్డ్ ర్యాంక్ 1 మరియు పరిపూర్ణ CGPA రేటింగ్‌లను పొందండి.",
      gameTitle: "పదజాలం మ్యాచ్ ఆర్కేడ్",
      gameSubtitle: "+20 నాణేలను సంపాదించడానికి సరైన అధ్యయన భావనలను వాటి నిర్వచనాలతో సరిపోల్చండి!",
      btnResetGame: "కొత్త రౌండ్ ఆడండి",
      textbookResources: "CBSE NCERT పాఠ్యపుస్తక వనరులు",
      textbookSubtitle: "క్లాస్ 10వ సిలబస్ సబ్జెక్టుల కోసం NCERT పుస్తకాలకు ప్రత్యక్ష డౌన్‌లోడ్ లింకులు."
    }
  };
  
  function applyLanguage(lang) {
    localStorage.setItem('educhanger_lang', lang);
    const dict = translations[lang] || translations.en;
    
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
    
    // Translate dashboard titles
    if (lang === 'hi') {
      if (isAdmin) welcomeMessage.textContent = 'आपका स्वागत है, एडमिन';
      else welcomeMessage.textContent = 'आपके स्टडी डेस्क में आपका स्वागत है';
    } else if (lang === 'te') {
      if (isAdmin) welcomeMessage.textContent = 'స్వాగతం, అడ్మిన్';
      else welcomeMessage.textContent = 'మీ స్టడీ డెస్క్‌కు స్వాగతం';
    } else {
      if (isAdmin) welcomeMessage.textContent = 'Welcome Back, Admin';
      else welcomeMessage.textContent = 'Welcome to Your Study Desk';
    }
  }
  
  if (langSwitcher) {
    langSwitcher.value = localStorage.getItem('educhanger_lang') || 'en';
    langSwitcher.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
    // Apply on load
    applyLanguage(langSwitcher.value);
  }

  // 19. Dynamic CBSE Topic Speed Run Console & Virtual Numpad
  const gameSubTabs = document.querySelectorAll('.game-sub-tab');
  const gameViewNumerical = document.getElementById('game-view-numerical');
  const gameViewMatcher = document.getElementById('game-view-matcher');
  const numGameTitle = document.getElementById('num-game-title');
  const numGameDesc = document.getElementById('num-game-desc');
  
  const startMathBtn = document.getElementById('start-math-btn');
  const mathTimerBox = document.getElementById('math-timer-box');
  const mathQuestionBox = document.getElementById('math-question-box');
  const mathAnswerInput = document.getElementById('math-answer-input');
  const mathScoreBox = document.getElementById('math-score-box');
  
  let activeGameSub = 'math';
  let mathScore = 0;
  let mathTimeLeft = 20;
  let mathInterval = null;
  let currentMathAnswer = 0;
  
  gameSubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gameSubTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeGameSub = tab.getAttribute('data-game-sub');
      
      if (mathInterval) {
        clearInterval(mathInterval);
        mathInterval = null;
      }
      
      mathTimerBox.textContent = `Time Left: --`;
      mathQuestionBox.textContent = `Click Start to Play`;
      mathAnswerInput.value = '';
      mathScoreBox.textContent = `Correct Answers: 0`;
      startMathBtn.disabled = false;
      startMathBtn.textContent = 'Start Game';
      
      if (activeGameSub === 'english') {
        gameViewNumerical.style.display = 'none';
        gameViewMatcher.style.display = 'block';
        renderGame();
      } else {
        gameViewNumerical.style.display = 'block';
        gameViewMatcher.style.display = 'none';
        
        if (activeGameSub === 'math') {
          numGameTitle.textContent = 'Mathematics Blitz';
          numGameDesc.textContent = 'Solve Class X Math problems (Quadratic equations, AP progress, trig ratios) in 20s!';
        } else if (activeGameSub === 'science') {
          numGameTitle.textContent = 'Science Balancer';
          numGameDesc.textContent = 'Type the correct missing balancing coefficients for chemical equations in 20s!';
        } else if (activeGameSub === 'social') {
          numGameTitle.textContent = 'History Timeline Speed Run';
          numGameDesc.textContent = 'Solve major historical dates. Enter the missing single digit to complete the year!';
        }
      }
    });
  });

  function generateNumericalQuestion() {
    if (activeGameSub === 'math') {
      const mathSet = [
        { q: "x² - 16 = 0. Positive x = ?", a: 4 },
        { q: "AP: a=4, d=3. Term a₂ = ?", a: 7 },
        { q: "sin 30° = 1 / _. Find denominator.", a: 2 },
        { q: "Midpoint of (0,0) & (0,8) is (0, _)", a: 4 },
        { q: "Area of square side 7 = _", a: 49 },
        { q: "cos 0° = _", a: 1 },
        { q: "3x + 6 = 12. x = ?", a: 2 },
        { q: "sec² 45° = _", a: 2 },
        { q: "Diameter of radius 15 = _", a: 30 },
        { q: "Value of log₁₀ 100 = _", a: 2 }
      ];
      const selected = mathSet[Math.floor(Math.random() * mathSet.length)];
      mathQuestionBox.textContent = selected.q;
      currentMathAnswer = selected.a;
    } else if (activeGameSub === 'science') {
      const scienceSet = [
        { q: "_ H₂ + O₂ → 2 H₂O", a: 2 },
        { q: "N₂ + _ H₂ → 2 NH₃", a: 3 },
        { q: "2 CO + O₂ → _ CO₂", a: 2 },
        { q: "_ H₂ + Cl₂ → 2 HCl", a: 2 },
        { q: "2 H₂O → _ H₂ + O₂", a: 2 },
        { q: "CH₄ + 2 O₂ → CO₂ + _ H₂O", a: 2 },
        { q: "Fe₂O₃ + _ Al → 2 Fe + Al₂O₃", a: 2 },
        { q: "2 H₂O₂ → _ H₂O + O₂", a: 2 }
      ];
      const selected = scienceSet[Math.floor(Math.random() * scienceSet.length)];
      mathQuestionBox.textContent = `Balance equation: ${selected.q}`;
      currentMathAnswer = selected.a;
    } else if (activeGameSub === 'social') {
      const socialSet = [
        { q: "Jallianwala Bagh massacre: 191_", a: 9 },
        { q: "Non-Cooperation Movement launched: 192_", a: 0 },
        { q: "Civil Disobedience / Dandi March: 193_", a: 0 },
        { q: "Quit India Movement: 194_", a: 2 },
        { q: "First World War starts: 191_", a: 4 },
        { q: "French Revolution begins: 178_", a: 9 },
        { q: "Simon Commission arrived in India: 192_", a: 8 },
        { q: "Gandhi-Irwin Pact signed: 193_", a: 1 }
      ];
      const selected = socialSet[Math.floor(Math.random() * socialSet.length)];
      mathQuestionBox.textContent = `Complete year: ${selected.q}`;
      currentMathAnswer = selected.a;
    }
  }

  // Premium Web Audio API Synth Synthesizer Sound System
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
      target.classList.contains('subject-tab') ||
      target.classList.contains('keypad-btn') ||
      target.classList.contains('sidebar-link') ||
      target.closest('.sidebar-link')
    ) {
      if (window.playSynthSound) {
        window.playSynthSound('click');
      }
    }
  });

  function startMathGame() {
    if (mathInterval) clearInterval(mathInterval);
    mathScore = 0;
    mathTimeLeft = 20;
    mathScoreBox.textContent = `Correct Answers: 0`;
    mathAnswerInput.value = '';
    startMathBtn.disabled = true;
    startMathBtn.textContent = 'Playing...';
    
    generateNumericalQuestion();
    
    mathInterval = setInterval(() => {
      mathTimeLeft--;
      mathTimerBox.textContent = `Time Left: ${mathTimeLeft}s`;
      
      if (mathTimeLeft <= 0) {
        clearInterval(mathInterval);
        mathInterval = null;
        startMathBtn.disabled = false;
        startMathBtn.textContent = 'Play Again';
        
        const rewarded = mathScore * 5;
        if (rewarded > 0) {
          addCoins(rewarded);
          alert(`Game Over! You answered ${mathScore} questions correctly and earned +${rewarded} Coins!`);
        } else {
          alert(`Game Over! You answered ${mathScore} questions correctly.`);
        }
        mathTimerBox.textContent = `Time Left: --`;
        mathQuestionBox.textContent = `Click Start to Play`;
        mathAnswerInput.value = '';
      }
    }, 1000);
  }

  if (startMathBtn) {
    startMathBtn.addEventListener('click', startMathGame);
  }

  document.querySelectorAll('.num-key').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mathInterval) return;
      
      const key = btn.getAttribute('data-key');
      let currentVal = mathAnswerInput.value;
      
      if (key === 'back') {
        mathAnswerInput.value = currentVal.slice(0, -1);
      } else if (key === '-') {
        if (currentVal.startsWith('-')) {
          mathAnswerInput.value = currentVal.substring(1);
        } else {
          mathAnswerInput.value = '-' + currentVal;
        }
      } else {
        mathAnswerInput.value = currentVal + key;
      }
      
      validateNumericalAnswer();
    });
  });

  function validateNumericalAnswer() {
    const val = parseInt(mathAnswerInput.value);
    if (!isNaN(val) && val === currentMathAnswer) {
      mathScore++;
      mathScoreBox.textContent = `Correct Answers: ${mathScore}`;
      mathAnswerInput.value = '';
      generateNumericalQuestion();
      
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start(osc.currentTime);
        osc.stop(osc.currentTime + 0.15);
      } catch(e) {}
    }
  }

  // 20. Real Aggregated Analytics Data Loader
  function loadRealAnalytics() {
    const subjects = ['Mathematics', 'Science', 'Social Science', 'English'];
    let totalSeconds = 0;
    subjects.forEach(sub => {
      totalSeconds += parseInt(localStorage.getItem(`educhanger_study_time_${sub}`) || '0');
    });
    
    // Convert to minutes
    const totalMinutes = Math.round(totalSeconds / 60);
    const timeDisplay = document.getElementById('total-study-time');
    if (timeDisplay) timeDisplay.textContent = `${totalMinutes}m`;
    
    // Completed quizzes count
    const quizzesCount = localStorage.getItem('educhanger_quizzes_completed') || '0';
    const quizzesDisplay = document.getElementById('total-quizzes-taken');
    if (quizzesDisplay) quizzesDisplay.textContent = quizzesCount;
    
    // Trivia Accuracy
    const score = parseInt(localStorage.getItem('educhanger_quiz_score') || '0');
    const total = parseInt(localStorage.getItem('educhanger_quiz_total') || '0');
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const accuracyDisplay = document.getElementById('average-accuracy');
    if (accuracyDisplay) accuracyDisplay.textContent = `${accuracy}%`;
  }

  // ==========================================
  // Board Chooser Logic (CBSE vs SSC)
  // ==========================================
  const btnLearningStart = document.querySelector('.btn-learning-start');
  const boardModal = document.getElementById('board-modal');
  const btnCloseBoardModal = document.getElementById('btn-close-board-modal');
  const btnChooseCbse = document.getElementById('btn-choose-cbse');
  const btnChooseSsc = document.getElementById('btn-choose-ssc');

  // Intercept all "Study Portal" redirects to load Board Choice Modal first
  const studyLinks = document.querySelectorAll('a[href="study.html"]');
  studyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (boardModal) {
        boardModal.classList.add('active');
        if (window.playSynthSound) window.playSynthSound('click');
      } else {
        window.location.href = 'study.html';
      }
    });
  });

  if (btnCloseBoardModal && boardModal) {
    btnCloseBoardModal.addEventListener('click', () => {
      boardModal.classList.remove('active');
    });
  }

  const btnChooseIcse = document.getElementById('btn-choose-icse');

  if (btnChooseCbse) {
    btnChooseCbse.addEventListener('click', () => {
      localStorage.setItem('educhanger_board', 'cbse');
      window.location.href = 'study.html';
    });
  }

  if (btnChooseIcse) {
    btnChooseIcse.addEventListener('click', () => {
      localStorage.setItem('educhanger_board', 'icse');
      window.location.href = 'study.html';
    });
  }

  if (btnChooseSsc) {
    btnChooseSsc.addEventListener('click', () => {
      localStorage.setItem('educhanger_board', 'ssc');
      window.location.href = 'study.html';
    });
  }

  // ==========================================
  // Collaborative Whiteboard Actions
  // ==========================================
  const btnCreateWhiteboard = document.getElementById('btn-create-whiteboard');
  const btnDashboardJoinRoom = document.getElementById('btn-dashboard-join-room');
  const joinRoomModal = document.getElementById('join-room-modal');
  const btnCloseJoinModal = document.getElementById('btn-close-join-modal');
  const joinRoomForm = document.getElementById('join-room-form');
  const joinRoomCodeInput = document.getElementById('join-room-code-input');

  if (btnCreateWhiteboard) {
    btnCreateWhiteboard.addEventListener('click', () => {
      // Generate a fresh 6-digit room code
      const roomCode = Math.floor(100000 + Math.random() * 900000);
      window.location.href = `whiteboard.html?code=${roomCode}`;
    });
  }

  if (btnDashboardJoinRoom && joinRoomModal) {
    btnDashboardJoinRoom.addEventListener('click', () => {
      joinRoomModal.classList.add('active');
    });
  }

  if (btnCloseJoinModal && joinRoomModal) {
    btnCloseJoinModal.addEventListener('click', () => {
      joinRoomModal.classList.remove('active');
    });
  }

  if (joinRoomForm) {
    joinRoomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = joinRoomCodeInput.value.trim();
      if (code && code.length === 6) {
        joinRoomModal.classList.remove('active');
        window.location.href = `whiteboard.html?code=${code}`;
      } else {
        alert('Please enter a valid 6-digit Room Code!');
      }
    });
  }

  // ==========================================
  // Premium Sliding Navigation Menu Indicator
  // ==========================================
  const navMenu = document.getElementById('main-nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.getElementById('nav-indicator');

  if (navMenu && navIndicator) {
    function alignIndicator(element) {
      if (!element) return;
      navIndicator.style.left = `${element.offsetLeft}px`;
      navIndicator.style.width = `${element.offsetWidth}px`;
    }

    // Align to initial active item
    const activeLink = navMenu.querySelector('.nav-link.active');
    setTimeout(() => alignIndicator(activeLink), 150);

    // Event listeners
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => alignIndicator(link));
      link.addEventListener('focus', () => alignIndicator(link));
      
      link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        alignIndicator(link);
      });
    });

    // Slide back on hover leave
    navMenu.addEventListener('mouseleave', () => {
      const currentActive = navMenu.querySelector('.nav-link.active');
      alignIndicator(currentActive);
    });
  }

  // ==========================================
  // Dashboard Video Player Modal (Next Toppers)
  // ==========================================
  const dbTheaterModal = document.getElementById('dashboard-theater-modal');
  const dbTheaterClose = document.getElementById('dashboard-theater-close');
  const dbTheaterTitle = document.getElementById('dashboard-theater-video-title');
  const dbTheaterIframe = document.getElementById('dashboard-theater-iframe');

  function openDashboardVideo(url, title) {
    if (!dbTheaterModal || !dbTheaterIframe) return;
    dbTheaterTitle.textContent = `Next Toppers Lecture: ${title}`;
    dbTheaterIframe.setAttribute('src', `${url}?autoplay=1&rel=0`);
    dbTheaterModal.style.opacity = '1';
    dbTheaterModal.style.pointerEvents = 'auto';
    
    const container = dbTheaterModal.querySelector('.theater-container');
    if (container) container.style.transform = 'scale(1)';
  }

  function closeDashboardVideo() {
    if (!dbTheaterModal || !dbTheaterIframe) return;
    const container = dbTheaterModal.querySelector('.theater-container');
    if (container) container.style.transform = 'scale(0.9)';
    
    dbTheaterModal.style.opacity = '0';
    dbTheaterModal.style.pointerEvents = 'none';
    dbTheaterIframe.setAttribute('src', '');
  }

  if (dbTheaterClose) {
    dbTheaterClose.addEventListener('click', closeDashboardVideo);
  }

  if (dbTheaterModal) {
    dbTheaterModal.addEventListener('click', (e) => {
      if (e.target === dbTheaterModal) closeDashboardVideo();
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-dashboard-video-watch');
    if (btn) {
      const url = btn.getAttribute('data-url');
      const title = btn.getAttribute('data-title');
      openDashboardVideo(url, title);
    }
  });

  // Automatically select Videos tab if URL contains #videos
  function checkHashNavigation() {
    if (window.location.hash === '#videos') {
      const videoTabBtn = document.getElementById('tab-btn-videos');
      if (videoTabBtn) {
        videoTabBtn.click();
        const workspace = document.getElementById('lms-workspace');
        if (workspace) workspace.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  window.addEventListener('hashchange', checkHashNavigation);
  setTimeout(checkHashNavigation, 300);

  // Initial Load Actions
  updateCoinsDisplay();
  renderLeaderboard();
  renderGame();
  loadRealAnalytics();
  drawAnalyticsChart();
});
