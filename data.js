// Initial mock data for EduChanger CBSE Class 10

const DEFAULT_MATERIALS = [
  {
    id: "m1",
    subject: "Mathematics",
    title: "Real Numbers Chapter Summary & Notes",
    description: "Detailed notes on Euclid's Division Lemma, Fundamental Theorem of Arithmetic, and proofs of irrationality.",
    link: "#",
    date: "2026-07-01"
  },
  {
    id: "m2",
    subject: "Mathematics",
    title: "Quadratic Equations Formula Sheet & Practice",
    description: "Quick revision sheet containing standard form, quadratic formula, nature of roots, and practice questions.",
    link: "#",
    date: "2026-07-02"
  },
  {
    id: "m3",
    subject: "Science",
    title: "Chemical Reactions & Equations - Study Guide",
    description: "Comprehensive notes covering types of chemical reactions, balancing equations, effects of oxidation, rancidity, and corrosion.",
    link: "#",
    date: "2026-06-28"
  },
  {
    id: "m4",
    subject: "Science",
    title: "Life Processes - NCERT Diagram Pack",
    description: "High-quality labeled diagrams of human digestive system, respiratory system, circulatory system, and excretory system.",
    link: "#",
    date: "2026-07-03"
  },
  {
    id: "m5",
    subject: "Social Science",
    title: "Rise of Nationalism in Europe - Timeline & Summary",
    description: "Visual timeline of major events from the French Revolution (1789) to the unification of Germany and Italy.",
    link: "#",
    date: "2026-06-15"
  },
  {
    id: "m6",
    subject: "Social Science",
    title: "Resources & Development - Map Work Guide",
    description: "CBSE Syllabus map marking requirements for soils, dams, minerals, agriculture, power plants, and ports.",
    link: "#",
    date: "2026-06-20"
  },
  {
    id: "m7",
    subject: "English",
    title: "First Flight: A Letter to God - Detailed Analysis",
    description: "Character sketches of Lencho and the Postmaster, chapter themes, vocabulary lists, and critical thinking answers.",
    link: "#",
    date: "2026-07-04"
  },
  {
    id: "m8",
    subject: "English",
    title: "Tenses & Active-Passive Voice Rules Cheat Sheet",
    description: "Grammar rules summary with formulas, conversion charts, and 50 solved practice sentences for Class 10.",
    link: "#",
    date: "2026-07-04"
  }
];

const DEFAULT_VIDEOS = [
  {
    id: "v1",
    subject: "Mathematics",
    title: "Real Numbers Class 10 Full Chapter Revision",
    url: "https://www.youtube.com/embed/8vGZzD1L2Qk",
    description: "A complete explanation of Real Numbers, covering concepts, theorems, and previous year questions."
  },
  {
    id: "v2",
    subject: "Science",
    title: "Chemical Reactions & Equations Full Chapter",
    url: "https://www.youtube.com/embed/3HkU4E4Znt8",
    description: "Animated video covering balance of equations, redox reactions, combination, decomposition, displacement, and double displacement."
  },
  {
    id: "v3",
    subject: "Social Science",
    title: "Rise of Nationalism in Europe One-Shot Lecture",
    url: "https://www.youtube.com/embed/3e2oTptZ02s",
    description: "Master the rise of nationalism, French revolution, Napoleon's code, unification of Italy/Germany in one shot."
  }
];

// Initialize localStorage if data isn't set yet
function initializeDatabase() {
  if (!localStorage.getItem("educhanger_materials")) {
    localStorage.setItem("educhanger_materials", JSON.stringify(DEFAULT_MATERIALS));
  }
  if (!localStorage.getItem("educhanger_videos")) {
    localStorage.setItem("educhanger_videos", JSON.stringify(DEFAULT_VIDEOS));
  }
  if (!localStorage.getItem("educhanger_users")) {
    const DEFAULT_USERS = [
      { email: "student@educhanger.com", password: "password123", name: "Student X", method: "Form", date: "2026-07-02" },
      { email: "topper@educhanger.com", password: "password123", name: "Board Topper", method: "Form", date: "2026-07-03" },
      { email: "student.google@gmail.com", password: "", name: "Google Student", method: "Google", date: "2026-07-04" }
    ];
    localStorage.setItem("educhanger_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("educhanger_reviews")) {
    const DEFAULT_REVIEWS = [
      { id: "r1", name: "Ananya Sharma", rating: 5, comment: "The 3D book interface is absolutely gorgeous! Finding Class 10 notes in one place has saved me hours of search.", date: "2026-07-03" },
      { id: "r2", name: "Rahul Verma", rating: 4, comment: "Highly recommend the formula sheets in the study section. Very detailed and aligned with CBSE board weightage.", date: "2026-07-04" }
    ];
    localStorage.setItem("educhanger_reviews", JSON.stringify(DEFAULT_REVIEWS));
  }
}

// Call on load
initializeDatabase();

// Expose functions to modify data
const EduDatabase = {
  getMaterials() {
    return JSON.parse(localStorage.getItem("educhanger_materials") || "[]");
  },
  saveMaterials(materials) {
    localStorage.setItem("educhanger_materials", JSON.stringify(materials));
  },
  addMaterial(material) {
    const materials = this.getMaterials();
    material.id = 'm_' + Date.now();
    material.date = new Date().toISOString().split('T')[0];
    materials.push(material);
    this.saveMaterials(materials);
    return material;
  },
  editMaterial(id, updatedFields) {
    let materials = this.getMaterials();
    materials = materials.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    this.saveMaterials(materials);
  },
  deleteMaterial(id) {
    let materials = this.getMaterials();
    materials = materials.filter(m => m.id !== id);
    this.saveMaterials(materials);
  },
  getVideos() {
    return JSON.parse(localStorage.getItem("educhanger_videos") || "[]");
  },
  saveVideos(videos) {
    localStorage.setItem("educhanger_videos", JSON.stringify(videos));
  },
  addVideo(video) {
    const videos = this.getVideos();
    video.id = 'v_' + Date.now();
    videos.push(video);
    this.saveVideos(videos);
    return video;
  },
  editVideo(id, updatedFields) {
    let videos = this.getVideos();
    videos = videos.map(v => v.id === id ? { ...v, ...updatedFields } : v);
    this.saveVideos(videos);
  },
  deleteVideo(id) {
    let videos = this.getVideos();
    videos = videos.filter(v => v.id !== id);
    this.saveVideos(videos);
  },
  getUsers() {
    return JSON.parse(localStorage.getItem("educhanger_users") || "[]");
  },
  saveUsers(users) {
    localStorage.setItem("educhanger_users", JSON.stringify(users));
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  deleteUser(email) {
    let users = this.getUsers();
    users = users.filter(u => u.email !== email);
    this.saveUsers(users);
  },
  getReviews() {
    return JSON.parse(localStorage.getItem("educhanger_reviews") || "[]");
  },
  saveReviews(reviews) {
    localStorage.setItem("educhanger_reviews", JSON.stringify(reviews));
  },
  addReview(review) {
    const reviews = this.getReviews();
    review.id = 'r_' + Date.now();
    review.date = new Date().toISOString().split('T')[0];
    reviews.push(review);
    this.saveReviews(reviews);
    return review;
  },
  deleteReview(id) {
    let reviews = this.getReviews();
    reviews = reviews.filter(r => r.id !== id);
    this.saveReviews(reviews);
  }
};
