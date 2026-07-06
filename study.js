// EduVerse Study Portal Logic - 40 Lessons & Next Toppers Playlists

document.addEventListener('DOMContentLoaded', () => {
  // 1. Session check
  const isLoggedIn = sessionStorage.getItem('educhanger_logged_in') === 'true';
  if (!isLoggedIn) {
    window.location.href = 'index.html';
    return;
  }

  // 2. Comprehensive 40 Lessons Dataset for CBSE
  const STUDY_DATA_CBSE = {
    "Mathematics": {
      desc: "Master CBSE Class 10 Mathematics with Next Toppers video walk-throughs, handwritten formula guides, and practice modules.",
      lessons: [
        { id: "math_1", ch: 1, title: "Real Numbers", desc: "Fundamental Theorem of Arithmetic, Rational/Irrational numbers, and Euclid's Division Lemma.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "math_2", ch: 2, title: "Polynomials", desc: "Geometrical meaning of zeroes, relationship between coefficients, and division algorithm.", url: "https://www.youtube.com/embed/yFpxRCH3c_g" },
        { id: "math_3", ch: 3, title: "Pair of Linear Equations in Two Variables", desc: "Graphical and algebraic methods: substitution, elimination, and cross-multiplication.", url: "https://www.youtube.com/embed/9G_9RjQ-L1M" },
        { id: "math_4", ch: 4, title: "Quadratic Equations", desc: "Standard form, factorization method, completing the square, and nature of roots.", url: "https://www.youtube.com/embed/fD-NqW5Z0d0" },
        { id: "math_5", ch: 5, title: "Arithmetic Progressions (AP)", desc: "Finding the nth term, sum of first n terms, and real-life word problems.", url: "https://www.youtube.com/embed/fUjH9z1KkOM" },
        { id: "math_6", ch: 6, title: "Triangles", desc: "Similarity criteria, Basic Proportionality Theorem (BPT), and Pythagoras Theorem proofs.", url: "https://www.youtube.com/embed/2_Y5uW0Rz0s" },
        { id: "math_7", ch: 7, title: "Coordinate Geometry", desc: "Distance formula, Section formula, mid-point calculations, and area of triangles.", url: "https://www.youtube.com/embed/N0gZq7X0B0k" },
        { id: "math_8", ch: 8, title: "Introduction to Trigonometry", desc: "Trigonometric ratios, values for specific angles, and basic trigonometric identities.", url: "https://www.youtube.com/embed/_Gk6kQjL9c8" },
        { id: "math_9", ch: 9, title: "Some Applications of Trigonometry", desc: "Heights and distances, line of sight, angle of elevation, and angle of depression.", url: "https://www.youtube.com/embed/H6x4_8X08S4" },
        { id: "math_10", ch: 10, title: "Circles", desc: "Tangents to a circle, length of tangents from external points, and theorem proofs.", url: "https://www.youtube.com/embed/6T2wXf3l4N8" }
      ]
    },
    "Science": {
      desc: "Explore chemical formulas, physical forces, and biological lifecycles with fully illustrated NCERT modules and Next Toppers guides.",
      lessons: [
        { id: "sci_1", ch: 1, title: "Chemical Reactions & Equations", desc: "Balancing equations, types of reactions (redox, combustion), corrosion, and rancidity.", url: "https://www.youtube.com/embed/3HkU4E4Znt8" },
        { id: "sci_2", ch: 2, title: "Acids, Bases & Salts", desc: "Indicators, pH scale, chemical properties, chlor-alkali process, and plaster of paris.", url: "https://www.youtube.com/embed/J7gqF6gZq2w" },
        { id: "sci_3", ch: 3, title: "Metals & Non-Metals", desc: "Physical/chemical traits, reactivity series, ionic bonding, metallurgy, and refining.", url: "https://www.youtube.com/embed/2a1T3qOqO58" },
        { id: "sci_4", ch: 4, title: "Carbon & its Compounds", desc: "Covalent bonds, versatile nature of carbon, homologous series, and functional groups.", url: "https://www.youtube.com/embed/4b-GkY3Xf0k" },
        { id: "sci_5", ch: 5, title: "Life Processes", desc: "Nutrition (autotrophic/heterotrophic), respiration, double circulation, and excretion.", url: "https://www.youtube.com/embed/8A4Q_j4S-y8" },
        { id: "sci_6", ch: 6, title: "Control & Coordination", desc: "Human brain divisions, nervous coordination, reflex action, and plant hormones.", url: "https://www.youtube.com/embed/4U6wLz8Qxsk" },
        { id: "sci_7", ch: 7, title: "How do Organisms Reproduce?", desc: "Asexual vs sexual reproduction, structure of flower, and human reproductive health.", url: "https://www.youtube.com/embed/G6jWl7Wz_gM" },
        { id: "sci_8", ch: 8, title: "Heredity", desc: "Mendel's laws of inheritance, monohybrid/dihybrid crosses, and sex determination.", url: "https://www.youtube.com/embed/8vjVj4S-y8A" },
        { id: "sci_9", ch: 9, title: "Light - Reflection & Refraction", desc: "Spherical mirrors, lens formulas, magnification, refractive index, and power of lens.", url: "https://www.youtube.com/embed/4z-mY-6yV88" },
        { id: "sci_10", ch: 10, title: "Human Eye & Colorful World", desc: "Eye defects (myopia, hypermetropia), dispersion of light, atmospheric refraction.", url: "https://www.youtube.com/embed/G6wL7W_yV88" }
      ]
    },
    "Social Science": {
      desc: "Master historical timelines, resource allocation, and democratic principles with graphic flashcards and Next Toppers playlists.",
      lessons: [
        { id: "sst_1", ch: 1, title: "The Rise of Nationalism in Europe", desc: "French revolution legacy, unification of Italy/Germany, and imperialism.", url: "https://www.youtube.com/embed/3e2oTptZ02s" },
        { id: "sst_2", ch: 2, title: "Nationalism in India", desc: "Non-cooperation movement, civil disobedience, salt march, and collective belonging.", url: "https://www.youtube.com/embed/4Gq_v8w_yV8" },
        { id: "sst_3", ch: 3, title: "The Making of a Global World", desc: "Pre-modern trade, silk routes, rinderpest, colonisation, and Bretton Woods institutions.", url: "https://www.youtube.com/embed/G6wLz8QxY88" },
        { id: "sst_4", ch: 4, title: "Resources & Development", desc: "Classification of resources, sustainable development, soil profiles, and land degradation.", url: "https://www.youtube.com/embed/8vjW_yV8S8A" },
        { id: "sst_5", ch: 5, title: "Forest & Wildlife Resources", desc: "Flora and fauna categories, conservation programs, Joint Forest Management (JFM).", url: "https://www.youtube.com/embed/3e2oTptZ02s" },
        { id: "sst_6", ch: 6, title: "Water Resources", desc: "Water scarcity reasons, multi-purpose river valley projects, and rainwater harvesting.", url: "https://www.youtube.com/embed/4Gq_v8w_yV8" },
        { id: "sst_7", ch: 7, title: "Power Sharing", desc: "Belgian model vs Sri Lankan majoritarianism, and forms of power sharing.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "sst_8", ch: 8, title: "Federalism", desc: "Key features of federal setups, local self-governments, and decentralization in India.", url: "https://www.youtube.com/embed/9G_9RjQ-L1M" },
        { id: "sst_9", ch: 9, title: "Development", desc: "Income vs non-income goals, national development indicators, and HDR indexes.", url: "https://www.youtube.com/embed/fUjH9z1KkOM" },
        { id: "sst_10", ch: 10, title: "Sectors of the Indian Economy", desc: "Primary, secondary, and tertiary sectors, organized vs unorganized workforces.", url: "https://www.youtube.com/embed/N0gZq7X0B0k" }
      ]
    },
    "English": {
      desc: "Excel in your literature reading, prose context, and poetry vocabulary. Curated guides covering themes and character sketches.",
      lessons: [
        { id: "eng_1", ch: 1, title: "A Letter to God", desc: "Faith of Lencho, irony of the situation, postmaster's compassion, and chapter summary.", url: "https://www.youtube.com/embed/G6jWl7Wz_gM" },
        { id: "eng_2", ch: 2, title: "Nelson Mandela: Long Walk to Freedom", desc: "Inauguration ceremony, concept of freedom, twin obligations, and character notes.", url: "https://www.youtube.com/embed/8vjVj4S-y8A" },
        { id: "eng_3", ch: 3, title: "Two Stories about Flying", desc: "First flight of the young seagull, and the mysterious pilot in the black aeroplane.", url: "https://www.youtube.com/embed/4z-mY-6yV88" },
        { id: "eng_4", ch: 4, title: "From the Diary of Anne Frank", desc: "Anne Frank's diary habits, relationships with Mr. Keesing, and family history summaries.", url: "https://www.youtube.com/embed/G6wL7W_yV88" },
        { id: "eng_5", ch: 5, title: "Glimpses of India", desc: "Baker from Goa, Coorg landscapes, and tea estates of Assam stories reviews.", url: "https://www.youtube.com/embed/3HkU4E4Znt8" },
        { id: "eng_6", ch: 6, title: "Madam Rides the Bus", desc: "Valli's journey, bus conductor interactions, lifecycle realities, and question banks.", url: "https://www.youtube.com/embed/J7gqF6gZq2w" },
        { id: "eng_7", ch: 7, title: "The Sermon at Benares", desc: "Kisa Gotami story, teachings of Lord Buddha, impermanence of human life.", url: "https://www.youtube.com/embed/2a1T3qOqO58" },
        { id: "eng_8", ch: 8, title: "Dust of Snow & Fire and Ice (Poems)", desc: "Robert Frost's poetic devices, symbolism, central themes, and stanza explanations.", url: "https://www.youtube.com/embed/4b-GkY3Xf0k" },
        { id: "eng_9", ch: 9, title: "A Triumph of Surgery", desc: "Tricki the dog, Mrs. Pumphrey's pampering, and Dr. Herriot's tactical cure.", url: "https://www.youtube.com/embed/8A4Q_j4S-y8" },
        { id: "eng_10", ch: 10, title: "The Thief's Story", desc: "Hari Singh the thief, trust-building with Anil, and the power of education.", url: "https://www.youtube.com/embed/4U6wLz8Qxsk" }
      ]
    }
  };

  // 2.2 Comprehensive 40 Lessons Dataset for State Board SSC
  const STUDY_DATA_SSC = {
    "Mathematics": {
      desc: "Complete State Board SSC Class 10 Mathematics syllabus desk covering Sets, Progressions, Coordinate Geometry, and trigonometry.",
      lessons: [
        { id: "math_ssc_1", ch: 1, title: "Real Numbers", desc: "Prime factorization, proofs of irrationality, logarithms, and fundamental theorems.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "math_ssc_2", ch: 2, title: "Sets", desc: "Well-defined collections, subsets, operations (union, intersection, difference), and Venn diagrams.", url: "https://www.youtube.com/embed/yFpxRCH3c_g" },
        { id: "math_ssc_3", ch: 3, title: "Polynomials", desc: "Zeroes representation, relationship between coefficients, and cubic polynomial factorization.", url: "https://www.youtube.com/embed/9G_9RjQ-L1M" },
        { id: "math_ssc_4", ch: 4, title: "Pair of Linear Equations in Two Variables", desc: "Graphical representation, consistency conditions, and algebraic solutions.", url: "https://www.youtube.com/embed/fD-NqW5Z0d0" },
        { id: "math_ssc_5", ch: 5, title: "Quadratic Equations", desc: "Roots of equation, factorization method, quadratic formula, and nature of roots.", url: "https://www.youtube.com/embed/fUjH9z1KkOM" },
        { id: "math_ssc_6", ch: 6, title: "Progressions", desc: "Arithmetic Progressions (AP), Geometric Progressions (GP), finding nth term and sums.", url: "https://www.youtube.com/embed/2_Y5uW0Rz0s" },
        { id: "math_ssc_7", ch: 7, title: "Coordinate Geometry", desc: "Distance formula, section formula, area of triangle, slope of a line, and collinearity.", url: "https://www.youtube.com/embed/N0gZq7X0B0k" },
        { id: "math_ssc_8", ch: 8, title: "Similar Triangles", desc: "Basic Proportionality Theorem (BPT), similarity criteria, and Pythagoras theorem proofs.", url: "https://www.youtube.com/embed/_Gk6kQjL9c8" },
        { id: "math_ssc_9", ch: 9, title: "Tangents & Secants to a Circle", desc: "Tangents property, lengths of tangents from external point, secants relations.", url: "https://www.youtube.com/embed/H6x4_8X08S4" },
        { id: "math_ssc_10", ch: 10, title: "Trigonometry & Applications", desc: "Complementary angle ratios, identities, angle of elevation, heights and distances.", url: "https://www.youtube.com/embed/6T2wXf3l4N8" }
      ]
    },
    "Science": {
      desc: "Complete State Board SSC Class 10 Physical & Biological Science chapters covering refraction, quantum structure, and human systems.",
      lessons: [
        { id: "sci_ssc_1", ch: 1, title: "Chemical Equations", desc: "Writing and balancing chemical equations, types of reactions, oxidation/reduction.", url: "https://www.youtube.com/embed/3HkU4E4Znt8" },
        { id: "sci_ssc_2", ch: 2, title: "Acids, Bases & Salts", desc: "Indicators, pH scale importance, chemical properties of acids/bases, nature of salts.", url: "https://www.youtube.com/embed/J7gqF6gZq2w" },
        { id: "sci_ssc_3", ch: 3, title: "Refraction of Light at Plane Surfaces", desc: "Fermat's principle, refractive index, Snell's law, total internal reflection.", url: "https://www.youtube.com/embed/2a1T3qOqO58" },
        { id: "sci_ssc_4", ch: 4, title: "Refraction of Light at Curved Surfaces", desc: "Behavior of light rays at curved surfaces, lens formula, lens maker's formula.", url: "https://www.youtube.com/embed/4b-GkY3Xf0k" },
        { id: "sci_ssc_5", ch: 5, title: "Structure of Atom", desc: "Bohr's atomic model limitations, quantum numbers, orbital shapes, Aufbau principle.", url: "https://www.youtube.com/embed/8A4Q_j4S-y8" },
        { id: "sci_ssc_6", ch: 6, title: "Nutrition - Food Supplying System", desc: "Autotrophic nutrition, leaf structure, photosynthesis mechanism, heterotrophic systems.", url: "https://www.youtube.com/embed/4U6wLz8Qxsk" },
        { id: "sci_ssc_7", ch: 7, title: "Respiration - Energy Producing System", desc: "Aerobic vs anaerobic respiration, glycolysis, cellular energy, human respiratory steps.", url: "https://www.youtube.com/embed/G6jWl7Wz_gM" },
        { id: "sci_ssc_8", ch: 8, title: "Transportation - Circulatory System", desc: "Structure of heart, blood vessels, lymphatic system, double circulation mechanism.", url: "https://www.youtube.com/embed/8vjVj4S-y8A" },
        { id: "sci_ssc_9", ch: 9, title: "Excretion - Waste Disposing System", desc: "Structure of human excretory system, structure of nephron, primary/secondary metabolites.", url: "https://www.youtube.com/embed/4z-mY-6yV88" },
        { id: "sci_ssc_10", ch: 10, title: "Coordination - Linking System", desc: "Central nervous system, structure of neuron, reflex arc, plant hormones overview.", url: "https://www.youtube.com/embed/G6wL7W_yV88" }
      ]
    },
    "Social Science": {
      desc: "Complete State Board SSC Class 10 Social Studies covering relief features, world war timelines, and globalization.",
      lessons: [
        { id: "sst_ssc_1", ch: 1, title: "India: Relief Features", desc: "Himalayas, Indo-Gangetic plains, Peninsular plateau, Thar desert, Coastal plains.", url: "https://www.youtube.com/embed/3e2oTptZ02s" },
        { id: "sst_ssc_2", ch: 2, title: "Ideas of Development", desc: "Income indicators, Human Development Index (HDI), sustainability, development ideas.", url: "https://www.youtube.com/embed/4Gq_v8w_yV8" },
        { id: "sst_ssc_3", ch: 3, title: "Production & Employment", desc: "Gross Domestic Product (GDP), employment trends in sectors, organized/unorganized.", url: "https://www.youtube.com/embed/G6wLz8QxY88" },
        { id: "sst_ssc_4", ch: 4, title: "Climate of India", desc: "Monsoons mechanism, factors affecting climate, greenhouse effect, global warming.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "sst_ssc_5", ch: 5, title: "Indian Rivers & Water Resources", desc: "Himalayan vs Peninsular rivers, water availability, management case studies.", url: "https://www.youtube.com/embed/3e2oTptZ02s" },
        { id: "sst_ssc_6", ch: 6, title: "People & Settlement", desc: "Settlement types, urbanization trends in India, migration patterns, and relief policies.", url: "https://www.youtube.com/embed/4Gq_v8w_yV8" },
        { id: "sst_ssc_7", ch: 7, title: "Globalization", desc: "Multinational Corporations (MNCs), foreign trade, WTO, impacts on Indian workers.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "sst_ssc_8", ch: 8, title: "Food Security", desc: "PDS role, nutrition security, buffer stock, and public nutrition programs.", url: "https://www.youtube.com/embed/9G_9RjQ-L1M" },
        { id: "sst_ssc_9", ch: 9, title: "World Between World Wars (1900-1950)", desc: "Causes of WWI and WWII, League of Nations, Russian Revolution, rise of dictators.", url: "https://www.youtube.com/embed/fUjH9z1KkOM" },
        { id: "sst_ssc_10", ch: 10, title: "National Movement in India - Freedom Era", desc: "Gandhian phase, Partition, integration of princely states, constitutional features.", url: "https://www.youtube.com/embed/N0gZq7X0B0k" }
      ]
    },
    "English": {
      desc: "Complete State Board SSC Class 10 English Literature desk covering Personality Development, Wit, and Humour plays.",
      lessons: [
        { id: "eng_ssc_1", ch: 1, title: "Attitude is Altitude (Personality Development)", desc: "Story of Nick Vujicic, overcoming disabilities, self-esteem, and character notes.", url: "https://www.youtube.com/embed/G6jWl7Wz_gM" },
        { id: "eng_ssc_2", ch: 2, title: "The Dear Departed - Part 1 (Wit and Humour)", desc: "Stanley Houghton's play, satiring children's greed, character sketch of Slater and Jordan.", url: "https://www.youtube.com/embed/8vjVj4S-y8A" },
        { id: "eng_ssc_3", ch: 3, title: "The Dear Departed - Part 2 (Wit and Humour)", desc: "Abel Merryweather's surprise will update, marrying Shorrocks, and moral values.", url: "https://www.youtube.com/embed/4z-mY-6yV88" },
        { id: "eng_ssc_4", ch: 4, title: "The Journey (Human Relations)", desc: "Traditional father-son relationship, carrying luggage, traditional respect values.", url: "https://www.youtube.com/embed/G6wL7W_yV88" },
        { id: "eng_ssc_5", ch: 5, title: "Another Woman (Science & Technology / Poem)", desc: "Imtiaz Dharker's poem, domestic violence, gender inequality themes, questions.", url: "https://www.youtube.com/embed/3HkU4E4Znt8" },
        { id: "eng_ssc_6", ch: 6, title: "A Tribute (Education & Career)", desc: "Biography of veteran actress Savitri, film achievements, and humanitarian side.", url: "https://www.youtube.com/embed/J7gqF6gZq2w" },
        { id: "eng_ssc_7", ch: 7, title: "Unity in Diversity in India (Nation & Diversity)", desc: "India's rich cultural heritage, tolerance, common identity, essay summary.", url: "https://www.youtube.com/embed/2a1T3qOqO58" },
        { id: "eng_ssc_8", ch: 8, title: "The Brave Little Bowman", desc: "Contextual readings, character analysis, narrative themes, and synonyms lists.", url: "https://www.youtube.com/embed/4b-GkY3Xf0k" },
        { id: "eng_ssc_9", ch: 9, title: "Environment (Speech)", desc: "Wangari Maathai Nobel speech, deforestation impacts, planting trees for peace.", url: "https://www.youtube.com/embed/8A4Q_j4S-y8" },
        { id: "eng_ssc_10", ch: 10, title: "My Childhood", desc: "APJ Abdul Kalam's early life, friends, values of honesty and self-discipline.", url: "https://www.youtube.com/embed/4U6wLz8Qxsk" }
      ]
    }
  };

  // 2.3 Comprehensive 40 Lessons Dataset for ICSE Board
  const STUDY_DATA_ICSE = {
    "Mathematics": {
      desc: "Complete ICSE Class 10 Mathematics syllabus covering GST, Banking, Shares, Matrices, and Circle Theorems.",
      lessons: [
        { id: "math_icse_1", ch: 1, title: "Goods and Services Tax (GST)", desc: "CGST, SGST, IGST calculations, Input Tax Credit, and tax invoices.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "math_icse_2", ch: 2, title: "Banking (Recurring Deposits)", desc: "Maturity value calculation, interest formulas, and deposit schemes.", url: "https://www.youtube.com/embed/yFpxRCH3c_g" },
        { id: "math_icse_3", ch: 3, title: "Shares and Dividends", desc: "Face value vs market value, dividend yields, investment and return calculations.", url: "https://www.youtube.com/embed/9G_9RjQ-L1M" },
        { id: "math_icse_4", ch: 4, title: "Linear Inequations", desc: "Solving algebraic inequalities, graphical representation on a number line.", url: "https://www.youtube.com/embed/fD-NqW5Z0d0" },
        { id: "math_icse_5", ch: 5, title: "Quadratic Equations", desc: "Roots of equation, factorization, formula method, nature of roots, word problems.", url: "https://www.youtube.com/embed/fUjH9z1KkOM" },
        { id: "math_icse_6", ch: 6, title: "Ratio and Proportion", desc: "Componendo and Dividendo properties, continued proportion, and properties.", url: "https://www.youtube.com/embed/2_Y5uW0Rz0s" },
        { id: "math_icse_7", ch: 7, title: "Matrices", desc: "Order of matrices, addition, subtraction, multiplication, and identity matrix.", url: "https://www.youtube.com/embed/N0gZq7X0B0k" },
        { id: "math_icse_8", ch: 8, title: "AP & GP Progressions", desc: "Arithmetic and Geometric Progressions, finding general terms, sum of n terms.", url: "https://www.youtube.com/embed/_Gk6kQjL9c8" },
        { id: "math_icse_9", ch: 9, title: "Coordinate Geometry (Reflection & Line)", desc: "Reflection in lines, section formula, slope, equation of a straight line.", url: "https://www.youtube.com/embed/H6x4_8X08S4" },
        { id: "math_icse_10", ch: 10, title: "Similarity & Circles", desc: "Similarity criteria, angles subtended, cyclic quadrilaterals, tangents, chords.", url: "https://www.youtube.com/embed/6T2wXf3l4N8" }
      ]
    },
    "Science": {
      desc: "ICSE Class 10 Science covering Force and Simple Machines, Sound resonance, Organic compounds, and Human Physiology.",
      lessons: [
        { id: "sci_icse_1", ch: 1, title: "Force, Work, Power & Energy", desc: "Moment of force, center of gravity, pulleys and simple machines.", url: "https://www.youtube.com/embed/3HkU4E4Znt8" },
        { id: "sci_icse_2", ch: 2, title: "Light - Lenses and Refraction", desc: "Refraction through prism, lens formula, total internal reflection, electromagnetic spectrum.", url: "https://www.youtube.com/embed/J7gqF6gZq2w" },
        { id: "sci_icse_3", ch: 3, title: "Sound & Resonance", desc: "Echoes, sound reflection, natural/forced vibrations, loudness and pitch.", url: "https://www.youtube.com/embed/2a1T3qOqO58" },
        { id: "sci_icse_4", ch: 4, title: "Electricity & Electromagnetism", desc: "Household circuits, Ohm's law, electric power, electromagnetic induction.", url: "https://www.youtube.com/embed/4b-GkY3Xf0k" },
        { id: "sci_icse_5", ch: 5, title: "Periodic Table & Chemical Bonding", desc: "Properties, electronegativity, ionic, covalent, and coordinate bonds.", url: "https://www.youtube.com/embed/8A4Q_j4S-y8" },
        { id: "sci_icse_6", ch: 6, title: "Salts & Metallurgy", desc: "Preparation of salts, extraction of Aluminium, alloys properties.", url: "https://www.youtube.com/embed/4U6wLz8Qxsk" },
        { id: "sci_icse_7", ch: 7, title: "Organic Chemistry", desc: "Homologous series, alkanes, alkenes, alkynes, functional groups, isomerism.", url: "https://www.youtube.com/embed/G6jWl7Wz_gM" },
        { id: "sci_icse_8", ch: 8, title: "Absorption & Transpiration in Plants", desc: "Osmosis, turgor pressure, active transport, potometer experiments.", url: "https://www.youtube.com/embed/8vjVj4S-y8A" },
        { id: "sci_icse_9", ch: 9, title: "Circulatory System", desc: "Heart structure, blood cells, clotting, double circulation, lymph flow.", url: "https://www.youtube.com/embed/4z-mY-6yV88" },
        { id: "sci_icse_10", ch: 10, title: "Nervous System & Endocrine Glands", desc: "Brain structure, reflex arc, hormones, feedback control.", url: "https://www.youtube.com/embed/G6wL7W_yV88" }
      ]
    },
    "Social Science": {
      desc: "ICSE History & Civics: Union Parliament, Executive, Judiciary, World Wars, and the United Nations.",
      lessons: [
        { id: "sst_icse_1", ch: 1, title: "The Union Parliament", desc: "Lok Sabha, Rajya Sabha, speaker, powers, functions, parliamentary procedures.", url: "https://www.youtube.com/embed/3e2oTptZ02s" },
        { id: "sst_icse_2", ch: 2, title: "The Union Executive", desc: "President, Vice President, Prime Minister, Cabinet, powers and appointments.", url: "https://www.youtube.com/embed/4Gq_v8w_yV8" },
        { id: "sst_icse_3", ch: 3, title: "The Judiciary", desc: "Supreme Court, High Court, Subordinate Courts, judicial review, writs.", url: "https://www.youtube.com/embed/G6wLz8QxY88" },
        { id: "sst_icse_4", ch: 4, title: "The First War of Independence (1857)", desc: "Causes (political, military, economic, religious), results, and significance.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "sst_icse_5", ch: 5, title: "Growth of Nationalism & Early Nationalists", desc: "Partition of Bengal, Swadeshi movement, early vs assertive nationalists, Muslim League.", url: "https://www.youtube.com/embed/3e2oTptZ02s" },
        { id: "sst_icse_6", ch: 6, title: "Mahatma Gandhi & Freedom Struggle", desc: "Non-cooperation, Civil Disobedience, Quit India, Cabinet Mission plan.", url: "https://www.youtube.com/embed/4Gq_v8w_yV8" },
        { id: "sst_icse_7", ch: 7, title: "Forward Bloc & INA", desc: "Subhas Chandra Bose contribution, objectives, Trial of INA officers.", url: "https://www.youtube.com/embed/8vGZzD1L2Qk" },
        { id: "sst_icse_8", ch: 8, title: "The First and Second World Wars", desc: "Treaty of Versailles, rise of fascism, aggression of Germany, outcomes.", url: "https://www.youtube.com/embed/9G_9RjQ-L1M" },
        { id: "sst_icse_9", ch: 9, title: "The United Nations Organization", desc: "General Assembly, Security Council, ICJ, UN charter and objectives.", url: "https://www.youtube.com/embed/fUjH9z1KkOM" },
        { id: "sst_icse_10", ch: 10, title: "Major UN Agencies", desc: "UNICEF, UNESCO, WHO, operations, and global impacts.", url: "https://www.youtube.com/embed/N0gZq7X0B0k" }
      ]
    },
    "English": {
      desc: "Prepare for ICSE English Literature covering Shakespeare's Merchant of Venice and Treasure Trove literature anthology.",
      lessons: [
        { id: "eng_icse_1", ch: 1, title: "The Merchant of Venice - Act I", desc: "Belmont lottery, Antonio's bond, Shylock's terms, Portia's suitors.", url: "https://www.youtube.com/embed/G6jWl7Wz_gM" },
        { id: "eng_icse_2", ch: 2, title: "The Merchant of Venice - Act II", desc: "Caskets selection, gold/silver caskets, Jessica's elopement play summaries.", url: "https://www.youtube.com/embed/8vjVj4S-y8A" },
        { id: "eng_icse_3", ch: 3, title: "The Merchant of Venice - Act III", desc: "Bassanio chooses lead, Shylock's anger, Antonio's arrest, Portia disguised.", url: "https://www.youtube.com/embed/4z-mY-6yV88" },
        { id: "eng_icse_4", ch: 4, title: "The Merchant of Venice - Act IV", desc: "The court trial scene, quality of mercy, Shylock penalty, ring demand.", url: "https://www.youtube.com/embed/G6wL7W_yV88" },
        { id: "eng_icse_5", ch: 5, title: "The Merchant of Venice - Act V", desc: "Belmont reconciliation, ring truth, Antonio's ships safe.", url: "https://www.youtube.com/embed/3HkU4E4Znt8" },
        { id: "eng_icse_6", ch: 6, title: "Chief Seattle's Speech", desc: "Environmental warnings, native culture values, reconciliation with settlers.", url: "https://www.youtube.com/embed/J7gqF6gZq2w" },
        { id: "eng_icse_7", ch: 7, title: "Hearts and Hands (O. Henry)", desc: "Short story of Miss Fairchild, Marshal, and convict. Irony, deception theme.", url: "https://www.youtube.com/embed/2a1T3qOqO58" },
        { id: "eng_icse_8", ch: 8, title: "A Face in the Dark (Ruskin Bond)", desc: "Horror story of Mr. Oliver, supernatural elements in Pine forest.", url: "https://www.youtube.com/embed/4b-GkY3Xf0k" },
        { id: "eng_icse_9", ch: 9, title: "Treasure Trove Poetry Collection", desc: "Maya Angelou's 'Caged Bird', Wordsworth's 'Daffodils', analysis.", url: "https://www.youtube.com/embed/8A4Q_j4S-y8" },
        { id: "eng_icse_10", ch: 10, title: "The Patriot (Robert Browning)", desc: "A hero's shift from welcome to execution, optimism, theme of religious faith.", url: "https://www.youtube.com/embed/4U6wLz8Qxsk" }
      ]
    }
  };

  const currentBoard = localStorage.getItem('educhanger_board') || 'cbse';
  const STUDY_DATA = currentBoard === 'ssc' ? STUDY_DATA_SSC : (currentBoard === 'icse' ? STUDY_DATA_ICSE : STUDY_DATA_CBSE);

  // Elements
  const tabs = document.querySelectorAll('.subject-tab');
  const badgeTitle = document.getElementById('subject-badge-title');
  const mainTitle = document.getElementById('subject-main-title');
  const mainDesc = document.getElementById('subject-main-desc');
  const lessonsList = document.getElementById('lessons-list');

  // Theater elements
  const theaterModal = document.getElementById('theater-modal');
  const theaterTitle = document.getElementById('theater-video-title');
  const theaterIframe = document.getElementById('theater-iframe');
  const theaterClose = document.getElementById('theater-close');

  let activeSubject = "Mathematics";

  // 3. Render function
  function renderSubjectLessons(subjectName) {
    const data = STUDY_DATA[subjectName];
    if (!data) return;

    const boardTag = currentBoard === 'ssc' ? 'SSC' : (currentBoard === 'icse' ? 'ICSE' : 'CBSE');

    // Update Banner Info
    badgeTitle.textContent = `${boardTag} • ${subjectName}`;
    mainTitle.textContent = `${boardTag} Class 10 ${subjectName}`;
    mainDesc.textContent = data.desc;

    // Clear list
    lessonsList.innerHTML = '';

    // Render lessons cards
    data.lessons.forEach(l => {
      const card = document.createElement('div');
      // subject type specific styling classes
      const safeSubject = subjectName.replace(/\s+/g, '');
      card.className = `lesson-card accent-${safeSubject}`;

      card.innerHTML = `
        <div class="lesson-info">
          <h4>Lesson ${l.ch}: ${l.title}</h4>
          <p>${l.desc}</p>
        </div>
        <div class="lesson-actions">
          <button class="btn-lesson-action btn-practice-desk" data-title="${l.title}" data-ch="${l.ch}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Practice Desk
          </button>
          <button class="btn-lesson-action btn-video-watch" data-url="${l.url}" data-title="${l.title}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Watch Lecture
          </button>
        </div>
      `;
      lessonsList.appendChild(card);
    });

    // Attach Watch Lecture event listeners
    document.querySelectorAll('.btn-video-watch').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        const title = btn.getAttribute('data-title');
        openVideoPlayer(url, title);
      });
    });

    // Attach Practice Desk event listeners
    document.querySelectorAll('.btn-practice-desk').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = btn.getAttribute('data-ch');
        const title = btn.getAttribute('data-title');
        openPracticeDesk(activeSubject, ch, title);
      });
    });
  }

  // 4. Modal Player Logic
  function openVideoPlayer(url, title) {
    theaterTitle.textContent = `Next Toppers Lecture: ${title}`;
    // Force autoplay and show controls query parameters
    const autoplayUrl = `${url}?autoplay=1&rel=0`;
    theaterIframe.setAttribute('src', autoplayUrl);
    theaterModal.classList.add('active');
  }

  function closeVideoPlayer() {
    theaterModal.classList.remove('active');
    theaterIframe.setAttribute('src', '');
  }

  theaterClose.addEventListener('click', closeVideoPlayer);
  
  // Close modal on backdrop click
  theaterModal.addEventListener('click', (e) => {
    if (e.target === theaterModal) {
      closeVideoPlayer();
    }
  });

  // ==========================================
  // LMS Interactive Study Practice Desk Logic
  // ==========================================
  const practiceModal = document.getElementById('practice-modal');
  const practiceClose = document.getElementById('practice-close');
  const pracChapterTag = document.getElementById('prac-chapter-tag');
  const pracLessonTitle = document.getElementById('prac-lesson-title');
  const pracTabsList = document.querySelectorAll('.prac-tab');
  const pracContentsList = document.querySelectorAll('.prac-content');
  const pracTabBtnAnalytics = document.getElementById('prac-tab-btn-analytics');

  // Practice state
  let currentLessonData = null;
  let flashcardIndex = 0;

  // Practice Desk dataset generator
  function getPracticeDataForLesson(subject, ch, title) {
    let summary = "";
    let flashcards = [];
    let mcqs = [];
    let blanks = [];

    const board = localStorage.getItem('educhanger_board') || 'cbse';

    if (board === 'ssc') {
      if (subject === "Mathematics") {
        summary = `SSC State Board Class 10 Mathematics Chapter: ${title}. Key Highlights:
        - Sets: Union (A∪B), Intersection (A∩B), and Difference (A-B) operations.
        - Similar Triangles: Basic Proportionality Theorem (Thales Theorem).
        - Coordinate Geometry: Distance formula, mid-point, and centroid of triangles.
        - Tangents and Secants: Tangent perpendicular to radius, lengths from external point.`;
        
        flashcards = [
          { q: `What is a Set?`, a: `A well-defined collection of distinct objects.` },
          { q: `State the formula for centroid of a triangle.`, a: `((x1+x2+x3)/3, (y1+y2+y3)/3).` },
          { q: `What is the value of sin(90° - θ)?`, a: `cos θ according to complementary angle ratios.` }
        ];

        mcqs = [
          { q: `If A = {1, 2, 3} and B = {3, 4, 5}, what is A ∩ B?`, options: [`{3}`, `{1,2,3,4,5}`, `{1,2}`, `{4,5}`], correct: 0 },
          { q: `What is the distance between (0, 0) and (3, 4)?`, options: [`5`, `7`, `25`, `12`], correct: 0 },
          { q: `The line intersecting a circle at two distinct points is called a ___`, options: [`Secant`, `Tangent`, `Diameter`, `Radius`], correct: 0 }
        ];

        blanks = [
          { q: `If A ⊂ B, then A ∩ B is equal to ___`, a: `A` },
          { q: `The formula for the sum of first n terms in an AP is (n/2) * [2a + (n-1)*___]`, a: `d` }
        ];
      } else if (subject === "Science") {
        summary = `SSC State Board Class 10 Science (Physical & Biological) Chapter: ${title}. Core Chapters:
        - Refraction of Light: Snell's law (sin i / sin r = constant). Lens maker's formula: 1/f = (n - 1)(1/R1 - 1/R2).
        - Structure of Atom: Quantum numbers (n, l, m_l, m_s) describing orbitals.
        - Periodic Table: Dobereiner's Triads, Newlands' Octaves, Mendeleev's, and Modern Periodic Table.
        - Life Systems: Nutrition (Photosynthesis dark/light reactions), Respiration (aerobic/anaerobic), Heart structures.`;

        flashcards = [
          { q: `State Snell's Law.`, a: `sin i / sin r = constant (refractive index of second medium relative to first).` },
          { q: `What is the principal quantum number (n)?`, a: `Describes the size and energy of the shell (n = 1, 2, 3...).` },
          { q: `What is double circulation?`, a: `Blood flows through the heart twice in one complete cycle of body circulation.` }
        ];

        mcqs = [
          { q: `Which quantum number represents the shape of the orbital?`, options: [`Principal (n)`, `Azimuthal (l)`, `Magnetic (m)`, `Spin (s)`], correct: 1 },
          { q: `What is the focal length of a lens if its power is +2D?`, options: [`0.5m`, `50cm`, `Both A & B`, `2m`], correct: 2 },
          { q: `Where do dark reactions of photosynthesis occur?`, options: [`Stroma`, `Grana`, `Thylakoid`, `Cytoplasm`], correct: 0 }
        ];

        blanks = [
          { q: `The focal length of a plane mirror is ___`, a: `infinite` },
          { q: `The waste disposing system in human body is performed by ___`, a: `nephrons` }
        ];
      } else if (subject === "Social Science") {
        summary = `SSC State Board Class 10 Social Studies: ${title}. Key Landmarks:
        - Relief Features: Northern Himalayas, Peninsular Plateau, Thar Desert, Coastal Plains, Islands.
        - Relief Areas: Indian Standard Time (IST) is calculated from 82°30' E longitude near Prayagraj.
        - World War Timeline: Triple Entente, Triple Alliance, Treaty of Versailles, League of Nations.
        - Freedom Movement: Civil Disobedience (Salt Satyagraha), Quit India Movement, partition and freedom.`;

        flashcards = [
          { q: `What is the standard meridian of India?`, a: `82°30' E longitude, which determines Indian Standard Time (IST).` },
          { q: `Name the highest peak in the Himalayas in India.`, a: `Kanchenjunga.` },
          { q: `What is the Bretton Woods conference famous for?`, a: `Setting up the IMF and World Bank in 1944.` }
        ];

        mcqs = [
          { q: `Which river basin forms the largest fertile plain in India?`, options: [`Indus`, `Ganges`, `Brahmaputra`, `Godavari`], correct: 1 },
          { q: `Which country was part of the Axis powers in WWII?`, options: [`Germany`, `Great Britain`, `USA`, `France`], correct: 0 },
          { q: `When did the Indian National Congress pass the Quit India resolution?`, options: [`1930`, `1940`, `1942`, `1947`], correct: 2 }
        ];

        blanks = [
          { q: `The highest peak in South India is ___`, a: `anamudi` },
          { q: `The Treaty of ___ ended the First World War`, a: `versailles` }
        ];
      } else {
        summary = `SSC State Board Class 10 English Literature: ${title}. Summaries:
        - Personality Development: Nick Vujicic biography (Attitude is Altitude), overcoming phocomelia.
        - Wit and Humour: 'The Dear Departed' play highlighting mock grief of daughters over grandfather Abel Merryweather.
        - Human Relations: 'The Journey' highlighting traditional father-son bond, carrying luggage, traditional respect.`;

        flashcards = [
          { q: `Who is Nick Vujicic?`, a: `A world-famous motivational speaker born without arms and legs (Phocomelia).` },
          { q: `What is the central theme of 'The Dear Departed'?`, a: `Greed, materialism, and lack of filial love in children towards parents.` },
          { q: `What does the suitcase symbolize in 'The Journey'?`, a: `Responsibility, respect, and traditional bonds between father and son.` }
        ];

        mcqs = [
          { q: `What sport did Nick Vujicic learn to play?`, options: [`Football`, `Surfing`, `Golf`, `All of the above`], correct: 3 },
          { q: `Who did Abel Merryweather decide to marry in 'The Dear Departed'?`, options: [`Mrs. John Shorrocks`, `Mrs. Slater`, `Mrs. Jordan`, `Emily`], correct: 0 },
          { q: `Who carried the author's luggage in 'The Journey'?`, options: [`His father`, `A porter`, `His brother`, `The author`], correct: 0 }
        ];

        blanks = [
          { q: `Nick Vujicic was born in ___, Australia`, a: `melbourne` },
          { q: `Abel Merryweather decided to alter his ___ to leave money to John Shorrocks`, a: `will` }
        ];
      }
    } else if (board === 'icse') {
      if (subject === "Mathematics") {
        summary = `ICSE Board Class 10 Mathematics Chapter: ${title}. Key revision highlights:
        - GST: Goods & Services Tax (intra-state vs inter-state tax distribution).
        - Banking: Recurring Deposit Interest formula: I = P * [n(n+1)/(2*12)] * (r/100).
        - Shares & Dividends: Yield % = (Dividend / Market Value) * 100.
        - Matrices: Product AB is defined only if number of columns of A equals number of rows of B.`;

        flashcards = [
          { q: `State the formula for interest on Recurring Deposits.`, a: `I = P * [n(n+1) / 24] * (r / 100) where n is in months.` },
          { q: `What is the relation between face value and dividend?`, a: `Dividend is always calculated as a percentage of the Face Value.` },
          { q: `What is the condition for two matrices to be conformable for multiplication?`, a: `Columns of first matrix must equal rows of second matrix.` }
        ];

        mcqs = [
          { q: `If the face value of a share is Rs 100, dividend is 10%, and market value is Rs 125, what is the yield %?`, options: [`8%`, `10%`, `12.5%`, `6.25%`], correct: 0 },
          { q: `What is the order of matrix product AB if A is 2x3 and B is 3x4?`, options: [`2x4`, `3x3`, `2x3`, `3x4`], correct: 0 },
          { q: `Under GST, when goods are sold within the same state, the taxes collected are:`, options: [`CGST & SGST`, `IGST only`, `CGST only`, `SGST only`], correct: 0 }
        ];

        blanks = [
          { q: `The maturity value of an RD account is Total Deposit + ___`, a: `interest` },
          { q: `A matrix having only one column is called a ___ matrix`, a: `column` }
        ];
      } else if (subject === "Science") {
        summary = `ICSE Board Class 10 Science (Physics, Chemistry, Biology) Chapter: ${title}. Revision summaries:
        - Physics: Moment of Force = Force * perpendicular distance. Pulley system mechanical advantage (MA = Load/Effort).
        - Sound: Resonance occurs when frequency of external force equals natural frequency.
        - Organic Chemistry: Functional groups (Alcohols -OH, Aldehydes -CHO, Carboxylic Acids -COOH).
        - Biology: Transpiration pull, structure of Nephron, double circulation of human heart.`;

        flashcards = [
          { q: `What is Mechanical Advantage (M.A.)?`, a: `Ratio of load overcome to the effort applied (M.A. = Load / Effort).` },
          { q: `Define Resonance.`, a: `Condition where body vibrates with maximum amplitude under periodic force of its own frequency.` },
          { q: `State the functional group of Alcohols.`, a: `Hydroxyl group (-OH).` }
        ];

        mcqs = [
          { q: `Which of the following classes of lever always has mechanical advantage less than 1?`, options: [`Class I`, `Class II`, `Class III`, `None`], correct: 2 },
          { q: `What is the speed of sound used to calculate distance of an echo if time is 2 seconds?`, options: [`340 m/s`, `1500 m/s`, `100 m/s`, `680 m/s`], correct: 0 },
          { q: `Which hormone is also known as the emergency hormone?`, options: [`Thyroxine`, `Insulin`, `Adrenaline`, `Estrogen`], correct: 2 }
        ];

        blanks = [
          { q: `The unit of mechanical advantage is ___`, a: `none` },
          { q: `The extraction of Aluminium is done by electrolysis of purified ___`, a: `alumina` }
        ];
      } else if (subject === "Social Science") {
        summary = `ICSE Civics & History Chapter: ${title}. Key revision parameters:
        - Union Parliament: Lok Sabha (lower house, 5-year term), Rajya Sabha (permanent house).
        - Judiciary: Writ jurisdiction (Habeas Corpus, Mandamus, Quo Warranto, Prohibition, Certiorari).
        - Independence War: 1857 Revolt triggers, annexation policies (Doctrine of Lapse), end of East India Company rule.
        - World Wars: Causes of World War I (imperialism, secret alliances), UN organs and special agencies.`;

        flashcards = [
          { q: `Who is the ex-officio Chairperson of Rajya Sabha?`, a: `The Vice-President of India.` },
          { q: `What is the Doctrine of Lapse?`, a: `Policy by Lord Dalhousie annexing states without a natural male heir.` },
          { q: `Name the judicial decree to produce a detained person in court.`, a: `Writ of Habeas Corpus.` }
        ];

        mcqs = [
          { q: `What is the maximum strength of the Lok Sabha as per the constitution?`, options: [`500`, `545`, `550`, `250`], correct: 2 },
          { q: `Which treaty ended the First World War in 1919?`, options: [`Treaty of Paris`, `Treaty of Versailles`, `Treaty of Vienna`, `Treaty of Berlin`], correct: 1 },
          { q: `Which UN organ is responsible for maintaining international peace?`, options: [`General Assembly`, `Security Council`, `Secretariat`, `ICJ`], correct: 1 }
        ];

        blanks = [
          { q: `The term of office of a judge of the Supreme Court is up to the age of ___ years`, a: `65` },
          { q: `The headquarters of the International Court of Justice is in The ___`, a: `hague` }
        ];
      } else {
        summary = `ICSE Class 10 English Literature Chapter: ${title}. Revision summaries:
        - Merchant of Venice: Bassanio's marriage quest, Antonio's bond crisis, Portia's courtroom disguise, ring comedy.
        - Poetry & Prose: Chief Seattle Speech (Native American themes), O. Henry's 'Hearts & Hands' (irony of Marshall).`;

        flashcards = [
          { q: `What casket did Bassanio choose and why?`, a: `The lead casket, refusing gold/silver as outward show of beauty.` },
          { q: `What is the central theme of O. Henry's 'Hearts and Hands'?`, a: `Compassion, deception, and appearances vs reality.` },
          { q: `Who wrote the poem 'The Patriot'?`, a: `Robert Browning, reflecting on political fickleness and religious faith.` }
        ];

        mcqs = [
          { q: `What penalty does Shylock demand from Antonio?`, options: [`1000 ducats`, `A pound of flesh`, `His house`, `A ring`], correct: 1 },
          { q: `Who is the real Marshal in 'Hearts and Hands'?`, options: [`Mr. Easton`, `The glum-faced man`, `Miss Fairchild`, `The conductor`], correct: 1 },
          { q: `Where does the trial scene take place in Merchant of Venice?`, options: [`Belmont`, `Venice`, `Genoa`, `Padua`], correct: 1 }
        ];

        blanks = [
          { q: `Portia disguised herself as a young lawyer named ___`, a: `balthazar` },
          { q: `In 'A Face in the Dark', the boy had no eyes, nose, or ___`, a: `mouth` }
        ];
      }
    } else {
      // CBSE Board Dynamic Practice Generator
      if (subject === "Mathematics") {
        summary = `CBSE Class 10 Mathematics Chapter: ${title}. Key theorems:
        - Real Numbers: Fundamental Theorem of Arithmetic (Composite = product of primes).
        - Polynomials: ax² + bx + c = 0 has sum of roots = -b/a and product = c/a.
        - Triangles: Basic Proportionality Theorem (BPT) states a line parallel to one side divides others proportionally.
        - Trigonometry: sin²θ + cos²θ = 1. Reciprocals: cosecθ = 1/sinθ.`;
        
        flashcards = [
          { q: `What is the standard formula for the product of roots?`, a: `Roots product is c/a for quadratic equation ax² + bx + c = 0.` },
          { q: `State the Fundamental Theorem of Arithmetic.`, a: `Every composite number can be uniquely expressed as a product of prime numbers.` },
          { q: `What is the value of sec²θ - tan²θ?`, a: `sec²θ - tan²θ = 1 according to trigonometric identities.` }
        ];

        mcqs = [
          { q: `For a quadratic polynomial, if the sum of roots is -3 and product is 2, what is the equation?`, options: [`x² - 3x + 2 = 0`, `x² + 3x + 2 = 0`, `x² - 3x - 2 = 0`, `x² + 3x - 2 = 0`], correct: 1 },
          { q: `What is the coordinate of the midpoint between (2, 4) and (6, 8)?`, options: [`(4, 6)`, `(2, 6)`, `(8, 12)`, `(3, 5)`], correct: 0 },
          { q: `If sin A = 3/5, what is the value of cos A?`, options: [`4/5`, `5/4`, `3/4`, `4/3`], correct: 0 }
        ];

        blanks = [
          { q: `The formula for the nth term of an AP is a + (n - 1) * ___`, a: `d` },
          { q: `The line intersecting a circle at exactly one point is called a ___`, a: `tangent` }
        ];
      } else if (subject === "Science") {
        summary = `CBSE Class 10 Science Chapter: ${title}. Core Syllabus Highlights:
        - Chemical Reactions: Balancing equations, types of reactions (Redox, decomposition, displacement).
        - Life Processes: Respiration, transportation, excretion, photosynthesis.
        - Light: Mirror Formula: 1/f = 1/v + 1/u. Lens Formula: 1/f = 1/v - 1/u.
        - Eye: Myopia corrected with concave lens. Hypermetropia corrected with convex lens.`;

        flashcards = [
          { q: `What is a Redox reaction?`, a: `A reaction where oxidation and reduction occur simultaneously.` },
          { q: `Define Myopia.`, a: `Nearsightedness: clear vision for close objects, blurry for far. Corrected with concave lenses.` },
          { q: `What is the refractive index formula?`, a: `n = c / v (speed of light in vacuum / speed in medium).` }
        ];

        mcqs = [
          { q: `Which of the following is produced during chlor-alkali process?`, options: [`NaOH`, `Cl₂`, `H₂`, `All of the above`], correct: 3 },
          { q: `Where does fertilization occur in human females?`, options: [`Uterus`, `Ovary`, `Fallopian Tube`, `Cervix`], correct: 2 },
          { q: `Which mirror is used by dentists to view large images of teeth?`, options: [`Convex`, `Concave`, `Plane`, `Cylindrical`], correct: 1 }
        ];

        blanks = [
          { q: `The green pigment in leaves responsible for trapping light is ___`, a: `chlorophyll` },
          { q: `The SI unit of power of a lens is ___`, a: `dioptre` }
        ];
      } else if (subject === "Social Science") {
        summary = `CBSE Class 10 Social Science: ${title}. Key landmarks:
        - Nationalism: Satyagraha, Non-Cooperation Movement (1920), Civil Disobedience (1930).
        - Resources: Soil classification (Alluvial, Black, Red, Laterite).
        - Politics: Federalism (Power division between Centre and States), Democracy.
        - Economy: Sectors (Primary, Secondary, Tertiary), Globalization.`;

        flashcards = [
          { q: `What is Satyagraha?`, a: `Method of non-violent resistance initiated by Mahatma Gandhi based on truth and love.` },
          { q: `Which sector accounts for most employment in India?`, a: `Primary sector (Agriculture).` },
          { q: `Define Federalism.`, a: `System of government where power is divided between center and state levels.` }
        ];

        mcqs = [
          { q: `In which year did the Jallianwala Bagh massacre take place?`, options: [`1915`, `1919`, `1920`, `1922`], correct: 1 },
          { q: `Which soil is also known as Regur soil?`, options: [`Alluvial`, `Black`, `Red`, `Laterite`], correct: 1 },
          { q: `What type of government exists in Belgium?`, options: [`Federal`, `Unitary`, `Dictatorship`, `Monarchy`], correct: 0 }
        ];

        blanks = [
          { q: `The Civil Disobedience movement started with the famous ___ March`, a: `Dandi` },
          { q: `The tertiary sector is also known as the ___ sector`, a: `service` }
        ];
      } else {
        summary = `CBSE Class 10 English Literature: ${title}. Key takeaways:
        - First Flight: Literary devices, character sheets (Lencho, Mandela), themes of faith, freedom, and animal rights.
        - Footprints Without Feet: Character sketches of Griffin, Hari Singh, Mrs. Pumphrey, and moral teachings.`;

        flashcards = [
          { q: `Who is the protagonist of 'A Letter to God'?`, a: `Lencho, a poor hardworking farmer with immense faith in God.` },
          { q: `What is the theme of Nelson Mandela's speech?`, a: `Triumph of humanity over apartheid, freedom, and national reconciliation.` },
          { q: `Who wrote the poem 'Fire and Ice'?`, a: `Robert Frost, representing desire and hatred.` }
        ];

        mcqs = [
          { q: `How much money did Lencho ask God for?`, options: [`50 pesos`, `70 pesos`, `100 pesos`, `150 pesos`], correct: 2 },
          { q: `What did Mrs. Pumphrey feed Tricki that made him sick?`, options: [`Malt`, `Cod-liver oil`, `Chocolates`, `All of the above`], correct: 3 },
          { q: `What was Hari Singh's age in 'The Thief's Story'?`, options: [`15`, `20`, `25`, `30`], correct: 0 }
        ];

        blanks = [
          { q: `In 'A Letter to God', Lencho compared raindrops to new ___`, a: `coins` },
          { q: `Mandela was sworn in as the president of democratic South ___`, a: `Africa` }
        ];
      }
    }

    return { summary, flashcards, mcqs, blanks };
  }

  function openPracticeDesk(subject, ch, title) {
    pracChapterTag.textContent = `Lesson ${ch}`;
    pracLessonTitle.textContent = `${title} - Study Desk`;

    // Load data
    currentLessonData = getPracticeDataForLesson(subject, ch, title);
    flashcardIndex = 0;

    // Reset modals tabs
    pracTabBtnAnalytics.style.display = 'none';
    switchPracTab('summary');

    // Render Summary
    document.getElementById('summary-notes-text').textContent = currentLessonData.summary;

    // Render Flashcard
    renderFlashcardItem();

    // Render MCQ Questions
    renderMCQQuestions();

    // Render Blanks Questions
    renderBlanksQuestions();

    practiceModal.classList.add('active');
  }

  function closePracticeDesk() {
    practiceModal.classList.remove('active');
  }

  if (practiceClose) practiceClose.addEventListener('click', closePracticeDesk);
  if (practiceModal) {
    practiceModal.addEventListener('click', (e) => {
      if (e.target === practiceModal) closePracticeDesk();
    });
  }

  // Switch Prac Tabs
  function switchPracTab(tabName) {
    pracTabsList.forEach(t => {
      if (t.getAttribute('data-prac-tab') === tabName) t.classList.add('active');
      else t.classList.remove('active');
    });

    pracContentsList.forEach(c => {
      if (c.getAttribute('id') === `prac-content-${tabName}`) c.classList.add('active');
      else c.classList.remove('active');
    });
  }

  pracTabsList.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPracTab(tab.getAttribute('data-prac-tab'));
    });
  });

  // Render Flashcard deck
  function renderFlashcardItem() {
    const deck = document.getElementById('flashcard-deck');
    const counter = document.getElementById('flashcard-count');
    if (!deck || !counter || !currentLessonData) return;

    const fc = currentLessonData.flashcards[flashcardIndex];
    counter.textContent = `${flashcardIndex + 1} / ${currentLessonData.flashcards.length}`;

    deck.innerHTML = `
      <div class="flashcard-item-3d" id="flashcard-card-inner">
        <div class="card-face front">
          <div>${fc.q}</div>
        </div>
        <div class="card-face back">
          <div>${fc.a}</div>
        </div>
      </div>
    `;

    const card = document.getElementById('flashcard-card-inner');
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  }

  // Prev / Next flashcards controls
  const btnPrevCard = document.getElementById('btn-prev-card');
  const btnNextCard = document.getElementById('btn-next-card');
  if (btnPrevCard && btnNextCard) {
    btnPrevCard.addEventListener('click', () => {
      if (flashcardIndex > 0) {
        flashcardIndex--;
        renderFlashcardItem();
      }
    });
    btnNextCard.addEventListener('click', () => {
      if (currentLessonData && flashcardIndex < currentLessonData.flashcards.length - 1) {
        flashcardIndex++;
        renderFlashcardItem();
      }
    });
  }

  // Render MCQ Quiz
  function renderMCQQuestions() {
    const container = document.getElementById('mcq-questions-list');
    if (!container || !currentLessonData) return;

    container.innerHTML = currentLessonData.mcqs.map((q, qIndex) => `
      <div class="quiz-question-group">
        <h6>Q${qIndex + 1}: ${q.q}</h6>
        <div class="mcq-options-wrapper">
          ${q.options.map((opt, oIndex) => `
            <label class="mcq-option-item">
              <input type="radio" name="mcq_${qIndex}" value="${oIndex}" required>
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // Render Blanks
  function renderBlanksQuestions() {
    const container = document.getElementById('blanks-questions-list');
    if (!container || !currentLessonData) return;

    container.innerHTML = currentLessonData.blanks.map((q, qIndex) => `
      <div class="blank-question-group">
        <h6>Q${qIndex + 1}: ${q.q}</h6>
        <input type="text" id="blank_${qIndex}" required placeholder="Type answer here...">
      </div>
    `).join('');
  }

  // MCQ submit validation
  const mcqForm = document.getElementById('mcq-quiz-form');
  if (mcqForm) {
    mcqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentLessonData) return;

      let score = 0;
      currentLessonData.mcqs.forEach((q, qIndex) => {
        const checked = document.querySelector(`input[name="mcq_${qIndex}"]:checked`);
        if (checked && parseInt(checked.value) === q.correct) {
          score++;
        }
      });

      triggerSessionEnd(score, currentLessonData.mcqs.length);
    });
  }

  // Blanks submit validation
  const blanksForm = document.getElementById('blanks-quiz-form');
  if (blanksForm) {
    blanksForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentLessonData) return;

      let score = 0;
      currentLessonData.blanks.forEach((q, qIndex) => {
        const ans = document.getElementById(`blank_${qIndex}`).value.trim().toLowerCase();
        if (ans === q.a.toLowerCase()) {
          score++;
        }
      });

      triggerSessionEnd(score, currentLessonData.blanks.length);
    });
  }

  // Session end handler
  function triggerSessionEnd(score, total) {
    // Reward calculation
    const accuracy = Math.round((score / total) * 100);
    const coinsReward = score * 10; // +10 Coins per correct answer!

    // Save coins to localStorage
    let currentCoins = localStorage.getItem('educhanger_coins');
    if (currentCoins === null) currentCoins = 150;
    const newCoins = parseInt(currentCoins) + coinsReward;
    localStorage.setItem('educhanger_coins', newCoins);

    // Update circular progress chart
    const circleVal = document.getElementById('circular-chart-value');
    const accuracyTxt = document.getElementById('session-accuracy-text');
    const scorePill = document.getElementById('session-score-pill');
    const coinsPill = document.getElementById('session-coins-pill');

    if (circleVal) {
      // Stroke dasharray maps from 0 to 100
      circleVal.setAttribute('stroke-dasharray', `${accuracy}, 100`);
    }
    if (accuracyTxt) accuracyTxt.textContent = `${accuracy}%`;
    if (scorePill) scorePill.textContent = `Score: ${score} / ${total}`;
    if (coinsPill) coinsPill.textContent = `🪙 +${coinsReward} Coins Earned`;

    // Unlock analytics tab
    pracTabBtnAnalytics.style.display = 'block';
    switchPracTab('analytics');
    playNotificationSound();
  }

  // Web Audio API helper for chime sound
  function playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.log(e);
    }
  }

  // 5. Subject Tabs switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSubject = tab.getAttribute('data-subject');
      renderSubjectLessons(activeSubject);
    });
  });

  // ==========================================
  // Real Study Session Timer Logic
  // ==========================================
  let timerInterval = null;
  
  function startStudyTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const currentTab = document.querySelector('.subject-tab.active');
      const subject = currentTab ? currentTab.getAttribute('data-subject') : activeSubject;
      
      const storageKey = `educhanger_study_time_${subject}`;
      let currentSeconds = parseInt(localStorage.getItem(storageKey) || '0');
      currentSeconds += 10;
      localStorage.setItem(storageKey, currentSeconds);
      
      updateDailyStudyLog(10);
    }, 10000);
  }

  function updateDailyStudyLog(seconds) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    
    let log = JSON.parse(localStorage.getItem('educhanger_daily_study_log') || '{}');
    if (!log[today]) log[today] = 0;
    log[today] += seconds / 60;
    localStorage.setItem('educhanger_daily_study_log', JSON.stringify(log));
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
      target.classList.contains('practice-tab-btn') ||
      target.closest('.practice-tab-btn') ||
      target.classList.contains('btn-close-prac') ||
      target.closest('.btn-close-prac') ||
      target.classList.contains('prac-card-btn') ||
      target.closest('.prac-card-btn')
    ) {
      if (window.playSynthSound) {
        window.playSynthSound('click');
      }
    }
  });

  startStudyTimer();

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

    const activeLink = navMenu.querySelector('.nav-link.active');
    setTimeout(() => {
      alignIndicator(activeLink || navLinks[0]);
    }, 150);

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => alignIndicator(link));
      link.addEventListener('focus', () => alignIndicator(link));
      
      link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        alignIndicator(link);
      });
    });

    navMenu.addEventListener('mouseleave', () => {
      const currentActive = navMenu.querySelector('.nav-link.active') || navLinks[0];
      alignIndicator(currentActive);
    });
  }

  // Load initial Mathematics lesson cards
  renderSubjectLessons(activeSubject);
});
