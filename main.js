// Mode pill toggle
  document.querySelectorAll('.mode-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Pref chip toggle
  document.querySelectorAll('.pref-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.pref-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Route card selection
  document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.route-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Open journey planner
  function openPlanner() {
    const dest = document.getElementById('destInput') ? document.getElementById('destInput').value : '';
    navigate('planner') + (dest ? '?dest=' + encodeURIComponent(dest) : '');
  }

  // Nav active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const st = section.offsetTop - 100;
      if (window.scrollY >= st) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // Animate congestion bars on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.cong-bar').forEach(bar => observer.observe(bar));

/* ===== */

// ════════════════════════════════════════════════
// GPS ↔ CANVAS COORDINATE SYSTEM
// Center: Jakarta (-6.21, 106.823) → canvas (462, 390)
// Scale: 1800 px/degree × 0.9 vertical compression
// ════════════════════════════════════════════════
const CX=462, CY=390, SC=1800, SCV=0.9;
function g2c(lat,lng){return{x:CX+(lng-106.823)*SC, y:CY+(lat-(-6.21))*SC*SCV};}

// ════════════════════════════════════════════════
// REAL MRT JAKARTA (official M01–M20 + LRT)
// ════════════════════════════════════════════════
const MRT_L1={name:'MRT Jakarta North-South',col:'#4af0c4',short:'L1',
  st:[
    {id:'m01',nm:'Lebak Bulus Grab',code:'M01',lat:-6.2893,lng:106.7745},
    {id:'m02',nm:'Fatmawati Indomaret',code:'M02',lat:-6.2747,lng:106.7944},
    {id:'m03',nm:'Cipete Raya',code:'M03',lat:-6.2665,lng:106.7985},
    {id:'m04',nm:'Haji Nawi',code:'M04',lat:-6.2584,lng:106.799},
    {id:'m05',nm:'Blok A',code:'M05',lat:-6.2499,lng:106.799},
    {id:'m06',nm:'Blok M BCA',code:'M06',lat:-6.2441,lng:106.7998},
    {id:'m07',nm:'ASEAN',code:'M07',lat:-6.2363,lng:106.8004},
    {id:'m08',nm:'Senayan Mastercard',code:'M08',lat:-6.2283,lng:106.8015},
    {id:'m09',nm:'Istora Mandiri',code:'M09',lat:-6.2217,lng:106.8024},
    {id:'m10',nm:'Bendungan Hilir',code:'M10',lat:-6.2139,lng:106.8151},
    {id:'m11',nm:'Setiabudi Astra',code:'M11',lat:-6.2076,lng:106.821},
    {id:'m12',nm:'Dukuh Atas BNI',code:'M12',lat:-6.2007,lng:106.823},
    {id:'m13',nm:'Bundaran HI Bank DKI',code:'M13',lat:-6.1944,lng:106.8229},
    {id:'m14',nm:'Thamrin',code:'M14',lat:-6.1868,lng:106.8228},
    {id:'m15',nm:'Monas',code:'M15',lat:-6.1758,lng:106.8272},
    {id:'m16',nm:'Harmoni',code:'M16',lat:-6.1655,lng:106.8131},
    {id:'m17',nm:'Sawah Besar',code:'M17',lat:-6.1555,lng:106.8151},
    {id:'m18',nm:'Mangga Besar',code:'M18',lat:-6.1488,lng:106.8135},
    {id:'m19',nm:'Glodok',code:'M19',lat:-6.1442,lng:106.8118},
    {id:'m20',nm:'Kota',code:'M20',lat:-6.137,lng:106.8139},
  ]};
const LRT_BK={name:'LRT Jabodebek – Bekasi',col:'#f0b44a',short:'BK',
  st:[
    {id:'bk1',nm:'Dukuh Atas BNI',lat:-6.2007,lng:106.823},
    {id:'bk2',nm:'Setiabudi',lat:-6.21,lng:106.827},
    {id:'bk3',nm:'Rasuna Said',lat:-6.214,lng:106.831},
    {id:'bk4',nm:'Kuningan',lat:-6.22,lng:106.832},
    {id:'bk5',nm:'Pancoran Mas',lat:-6.236,lng:106.842},
    {id:'bk6',nm:'Cikoko',lat:-6.248,lng:106.849},
    {id:'bk7',nm:'Cawang',lat:-6.2424,lng:106.8671},
    {id:'bk8',nm:'Halim',lat:-6.262,lng:106.892},
    {id:'bk9',nm:'Jatimulya',lat:-6.308,lng:106.97},
  ]};
const LRT_CB={name:'LRT Jabodebek – Cibubur',col:'#a46af0',short:'CB',
  st:[
    {id:'cb1',nm:'Dukuh Atas BNI',lat:-6.2007,lng:106.823},
    {id:'cb2',nm:'Setiabudi',lat:-6.21,lng:106.827},
    {id:'cb3',nm:'Rasuna Said',lat:-6.214,lng:106.831},
    {id:'cb4',nm:'Kuningan Madya',lat:-6.224,lng:106.835},
    {id:'cb5',nm:'Cawang',lat:-6.2424,lng:106.8671},
    {id:'cb6',nm:'Harjamukti Cibubur',lat:-6.35,lng:106.92},
  ]};
const ALL_MRT=[MRT_L1,LRT_BK,LRT_CB];
ALL_MRT.forEach(l=>l.st.forEach(s=>{const c=g2c(s.lat,s.lng);s.x=c.x;s.y=c.y;}));

// ════════════════════════════════════════════════
// REAL TRANSJAKARTA — all 14 official corridors
// ════════════════════════════════════════════════
const TJ=[
  {id:'C1',nm:'Corridor 1: Blok M – Kota',col:'#f05c4a',stops:[
    {nm:'Blok M',lat:-6.2441,lng:106.7998},{nm:'Masjid Agung',lat:-6.2393,lng:106.8001},
    {nm:'Polda Metro',lat:-6.2244,lng:106.8103},{nm:'Bendungan Hilir',lat:-6.213,lng:106.8148},
    {nm:'Karet',lat:-6.2068,lng:106.8189},{nm:'Dukuh Atas 2',lat:-6.201,lng:106.8228},
    {nm:'Tosari / Bundaran HI',lat:-6.1944,lng:106.8229},{nm:'Kebon Sirih',lat:-6.187,lng:106.8228},
    {nm:'Monas',lat:-6.1758,lng:106.8272},{nm:'Harmoni',lat:-6.166,lng:106.813},
    {nm:'Sawah Besar',lat:-6.1555,lng:106.8155},{nm:'Mangga Besar',lat:-6.149,lng:106.8138},
    {nm:'Glodok',lat:-6.1445,lng:106.812},{nm:'Kota',lat:-6.137,lng:106.8139},
  ]},
  {id:'C2',nm:'Corridor 2: Pulo Gadung – Monas',col:'#4a90f0',stops:[
    {nm:'Pulo Gadung',lat:-6.18,lng:106.8878},{nm:'Bermis',lat:-6.1788,lng:106.88},
    {nm:'Kayu Putih',lat:-6.185,lng:106.87},{nm:'Pramuka',lat:-6.198,lng:106.856},
    {nm:'Matraman',lat:-6.204,lng:106.845},{nm:'Salemba',lat:-6.194,lng:106.8496},
    {nm:'Kebon Sirih',lat:-6.187,lng:106.8228},{nm:'Monas',lat:-6.1758,lng:106.8272},
  ]},
  {id:'C3',nm:'Corridor 3: Kalideres – Monas',col:'#4af07a',stops:[
    {nm:'Kalideres',lat:-6.1501,lng:106.702},{nm:'Rawa Buaya',lat:-6.16,lng:106.723},
    {nm:'Jembatan Baru',lat:-6.1665,lng:106.738},{nm:'Taman Kota',lat:-6.175,lng:106.755},
    {nm:'S. Parman',lat:-6.18,lng:106.78},{nm:'Tomang',lat:-6.1875,lng:106.795},
    {nm:'Harmoni',lat:-6.166,lng:106.813},{nm:'Monas',lat:-6.1758,lng:106.8272},
  ]},
  {id:'C4',nm:'Corridor 4: Pulo Gadung – Galunggung',col:'#f05c90',stops:[
    {nm:'Pulo Gadung',lat:-6.18,lng:106.8878},{nm:'Rawasari',lat:-6.19,lng:106.875},
    {nm:'Cempaka Putih',lat:-6.185,lng:106.866},{nm:'Senen',lat:-6.1728,lng:106.8432},
    {nm:'Pecenongan',lat:-6.161,lng:106.826},{nm:'Galunggung',lat:-6.175,lng:106.81},
  ]},
  {id:'C5',nm:'Corridor 5: Ancol – Kampung Melayu',col:'#4af0c4',stops:[
    {nm:'Ancol',lat:-6.124,lng:106.837},{nm:'Pademangan',lat:-6.138,lng:106.845},
    {nm:'Gunung Sahari',lat:-6.152,lng:106.848},{nm:'Pasar Baru',lat:-6.158,lng:106.834},
    {nm:'Senen',lat:-6.1728,lng:106.8432},{nm:'Matraman',lat:-6.204,lng:106.845},
    {nm:'Kampung Melayu',lat:-6.2186,lng:106.8698},
  ]},
  {id:'C6',nm:'Corridor 6: Ragunan – Galunggung',col:'#a46af0',stops:[
    {nm:'Ragunan',lat:-6.3126,lng:106.8214},{nm:'Duren Tiga',lat:-6.2722,lng:106.8302},
    {nm:'Warung Buncit',lat:-6.258,lng:106.829},{nm:'Mampang',lat:-6.2488,lng:106.8284},
    {nm:'Kuningan Timur',lat:-6.235,lng:106.8318},{nm:'Dukuh Atas',lat:-6.201,lng:106.8228},
    {nm:'Bundaran HI',lat:-6.1944,lng:106.8229},{nm:'Galunggung',lat:-6.175,lng:106.81},
  ]},
  {id:'C7',nm:'Corridor 7: Kp. Rambutan – Kp. Melayu',col:'#f0b44a',stops:[
    {nm:'Kampung Rambutan',lat:-6.2979,lng:106.8851},{nm:'Kramat Jati',lat:-6.277,lng:106.872},
    {nm:'Cawang',lat:-6.2424,lng:106.8671},{nm:'Kampung Melayu',lat:-6.2186,lng:106.8698},
  ]},
  {id:'C8',nm:'Corridor 8: Lebak Bulus – Pasar Baru',col:'#f09a4a',stops:[
    {nm:'Lebak Bulus',lat:-6.2893,lng:106.7745},{nm:'Pondok Indah',lat:-6.268,lng:106.786},
    {nm:'Kebayoran Simprug',lat:-6.24,lng:106.793},{nm:'Senayan',lat:-6.2283,lng:106.8015},
    {nm:'Bendungan Hilir',lat:-6.213,lng:106.8148},{nm:'Harmoni',lat:-6.166,lng:106.813},
    {nm:'Pasar Baru',lat:-6.158,lng:106.834},
  ]},
  {id:'C9',nm:'Corridor 9: Pinang Ranti – Pluit',col:'#e8c44a',stops:[
    {nm:'Pinang Ranti',lat:-6.2686,lng:106.905},{nm:'Cawang',lat:-6.2424,lng:106.8671},
    {nm:'Kampung Melayu',lat:-6.2186,lng:106.8698},{nm:'Dukuh Atas',lat:-6.201,lng:106.8228},
    {nm:'Semanggi',lat:-6.22,lng:106.81},{nm:'Senayan',lat:-6.2283,lng:106.8015},
    {nm:'Grogol',lat:-6.1674,lng:106.7955},{nm:'Pluit',lat:-6.1257,lng:106.7942},
  ]},
  {id:'C10',nm:'Corridor 10: PGC – Tanjung Priok',col:'#4acdf0',stops:[
    {nm:'PGC Cililitan',lat:-6.275,lng:106.87},{nm:'Cawang',lat:-6.2424,lng:106.8671},
    {nm:'Kampung Melayu',lat:-6.2186,lng:106.8698},{nm:'Gunung Sahari',lat:-6.152,lng:106.848},
    {nm:'Tanjung Priok',lat:-6.11,lng:106.88},
  ]},
  {id:'C11',nm:'Corridor 11: Pulo Gebang – Kp. Melayu',col:'#f04ab4',stops:[
    {nm:'Pulo Gebang',lat:-6.21,lng:106.923},{nm:'Klender',lat:-6.225,lng:106.9},
    {nm:'Buaran',lat:-6.228,lng:106.895},{nm:'Kampung Melayu',lat:-6.2186,lng:106.8698},
  ]},
  {id:'C12',nm:'Corridor 12: Tanjung Priok – Pluit',col:'#4af04a',stops:[
    {nm:'Tanjung Priok',lat:-6.11,lng:106.88},{nm:'Sunter',lat:-6.13,lng:106.865},
    {nm:'Kelapa Gading',lat:-6.155,lng:106.9},{nm:'Pluit',lat:-6.1257,lng:106.7942},
  ]},
  {id:'C13',nm:'Corridor 13: Ciledug – Tegal Mampang',col:'#f05c90',stops:[
    {nm:'Ciledug',lat:-6.2327,lng:106.7376},{nm:'Seskoal',lat:-6.242,lng:106.75},
    {nm:'Kebayoran Lama',lat:-6.2497,lng:106.772},{nm:'CSW/ASEAN',lat:-6.2363,lng:106.8004},
    {nm:'Kejaksaan Agung',lat:-6.24,lng:106.808},{nm:'Tegal Mampang',lat:-6.26,lng:106.829},
  ]},
  {id:'C14',nm:'Corridor 14: Pasar Senen – JIS',col:'#c4f04a',stops:[
    {nm:'Pasar Senen',lat:-6.1728,lng:106.8432},{nm:'Kemayoran',lat:-6.155,lng:106.845},
    {nm:'JIEXPO',lat:-6.145,lng:106.845},{nm:"Jakarta Int'l Stadium",lat:-6.128,lng:106.843},
  ]},
];
TJ.forEach(c=>{c.path=c.stops.map(s=>{const p=g2c(s.lat,s.lng);return{...s,x:p.x,y:p.y};});});

// ════════════════════════════════════════════════
// PLACES — All 56 Excel destinations + extras
// ════════════════════════════════════════════════
const PLACES=[
  {id:"monas",name:"Monas (National Monument)",type:"Landmark",ic:"🏛️",lat:-6.1753,lng:106.8272,area:"Gambir"},
  {id:"kota_tua",name:"Kota Tua Jakarta",type:"Landmark",ic:"🏙️",lat:-6.1374,lng:106.8139,area:"Kota"},
  {id:"istiqlal",name:"Istiqlal Mosque",type:"Mosque",ic:"🕌",lat:-6.1699,lng:106.8316,area:"Gambir"},
  {id:"cathedral",name:"Jakarta Cathedral",type:"Church",ic:"⛪",lat:-6.1705,lng:106.8319,area:"Gambir"},
  {id:"tmii",name:"Taman Mini Indonesia Indah",type:"Park",ic:"🌳",lat:-6.302,lng:106.895,area:"Jakarta Timur"},
  {id:"museum_nasional",name:"Museum Nasional Indonesia",type:"Museum",ic:"🏺",lat:-6.1766,lng:106.8225,area:"Gambir"},
  {id:"museum_macan",name:"Museum MACAN",type:"Museum",ic:"🎨",lat:-6.1799,lng:106.7897,area:"Kebon Jeruk"},
  {id:"museum_bi",name:"Museum Bank Indonesia",type:"Museum",ic:"🏦",lat:-6.1369,lng:106.8122,area:"Kota"},
  {id:"museum_fatahillah",name:"Museum Fatahillah",type:"Museum",ic:"🏛️",lat:-6.1353,lng:106.8134,area:"Kota"},
  {id:"vihara",name:"Vihara Dharma Bhakti",type:"Temple",ic:"🏮",lat:-6.1468,lng:106.8112,area:"Glodok"},
  {id:"ancol",name:"Ancol Dreamland",type:"Attraction",ic:"🎢",lat:-6.124,lng:106.837,area:"Ancol"},
  {id:"dufan",name:"Dufan (Dunia Fantasi)",type:"Attraction",ic:"🎡",lat:-6.121,lng:106.834,area:"Ancol"},
  {id:"sea_world",name:"Sea World Ancol",type:"Attraction",ic:"🐠",lat:-6.1228,lng:106.836,area:"Ancol"},
  {id:"atlantis",name:"Atlantis Water Adventure",type:"Attraction",ic:"🏊",lat:-6.1198,lng:106.833,area:"Ancol"},
  {id:"ragunan",name:"Ragunan Zoo",type:"Attraction",ic:"🦁",lat:-6.3126,lng:106.8214,area:"Ragunan"},
  {id:"jkt_aquarium",name:"Jakarta Aquarium",type:"Attraction",ic:"🐟",lat:-6.179,lng:106.7897,area:"Neo Soho"},
  {id:"gbk",name:"Gelora Bung Karno Stadium",type:"Stadium",ic:"🏟️",lat:-6.2183,lng:106.802,area:"Senayan"},
  {id:"bundaran_hi",name:"Bundaran HI",type:"Landmark",ic:"🎡",lat:-6.1944,lng:106.8229,area:"Menteng"},
  {id:"lapangan_banteng",name:"Lapangan Banteng",type:"Park",ic:"🌿",lat:-6.1694,lng:106.8316,area:"Sawah Besar"},
  {id:"grand_indonesia",name:"Grand Indonesia",type:"Mall",ic:"🛍️",lat:-6.1955,lng:106.8212,area:"Thamrin"},
  {id:"plaza_indonesia",name:"Plaza Indonesia",type:"Mall",ic:"🛍️",lat:-6.1948,lng:106.8218,area:"Thamrin"},
  {id:"pacific_place",name:"Pacific Place Jakarta",type:"Mall",ic:"🛍️",lat:-6.2252,lng:106.8074,area:"SCBD"},
  {id:"central_park",name:"Central Park Mall",type:"Mall",ic:"🛍️",lat:-6.178,lng:106.7897,area:"Tanjung Duren"},
  {id:"senayan_city",name:"Senayan City",type:"Mall",ic:"🛍️",lat:-6.2266,lng:106.8016,area:"Senayan"},
  {id:"pim",name:"Pondok Indah Mall",type:"Mall",ic:"🛍️",lat:-6.268,lng:106.786,area:"Pondok Indah"},
  {id:"kokas",name:"Kota Kasablanka",type:"Mall",ic:"🛍️",lat:-6.2407,lng:106.8449,area:"Tebet"},
  {id:"mta",name:"Mall Taman Anggrek",type:"Mall",ic:"🛍️",lat:-6.178,lng:106.789,area:"Tanjung Duren"},
  {id:"plaza_senayan",name:"Plaza Senayan",type:"Mall",ic:"🛍️",lat:-6.2248,lng:106.8019,area:"Senayan"},
  {id:"fx",name:"FX Sudirman",type:"Mall",ic:"🛍️",lat:-6.2237,lng:106.8074,area:"Sudirman"},
  {id:"lotte",name:"Lotte Shopping Avenue",type:"Mall",ic:"🛍️",lat:-6.2245,lng:106.8278,area:"Kuningan"},
  {id:"gandaria_city",name:"Gandaria City Mall",type:"Mall",ic:"🛍️",lat:-6.2445,lng:106.7831,area:"Gandaria"},
  {id:"moi",name:"Mall of Indonesia",type:"Mall",ic:"🛍️",lat:-6.155,lng:106.9,area:"Kelapa Gading"},
  {id:"sate_senayan",name:"Sate Khas Senayan",type:"Restaurant",ic:"🍢",lat:-6.2265,lng:106.8029,area:"Senayan"},
  {id:"seribu_rasa",name:"Seribu Rasa",type:"Restaurant",ic:"🍽️",lat:-6.199,lng:106.828,area:"Menteng"},
  {id:"bunga_rampai",name:"Bunga Rampai",type:"Restaurant",ic:"🌺",lat:-6.198,lng:106.829,area:"Menteng"},
  {id:"nasi_goreng_ks",name:"Nasi Goreng Kambing Kebon Sirih",type:"Restaurant",ic:"🍳",lat:-6.187,lng:106.8228,area:"Kebon Sirih"},
  {id:"gioi",name:"GIOI Restaurant",type:"Restaurant",ic:"⭐",lat:-6.225,lng:106.807,area:"SCBD"},
  {id:"skye",name:"SKYE Bar & Restaurant",type:"Restaurant",ic:"🌆",lat:-6.2237,lng:106.8074,area:"Sudirman"},
  {id:"social_house",name:"Social House",type:"Restaurant",ic:"🍹",lat:-6.1955,lng:106.8212,area:"Grand Indonesia"},
  {id:"plataran",name:"Plataran Menteng",type:"Restaurant",ic:"🌿",lat:-6.2,lng:106.831,area:"Menteng"},
  {id:"kaum",name:"Kaum Jakarta",type:"Restaurant",ic:"🏺",lat:-6.1948,lng:106.8218,area:"Menteng"},
  {id:"namaaz",name:"Namaaz Dining",type:"Restaurant",ic:"⭐",lat:-6.237,lng:106.832,area:"Kuningan"},
  {id:"wisma46",name:"Wisma 46",type:"Office Tower",ic:"🏢",lat:-6.196,lng:106.821,area:"Thamrin"},
  {id:"sequis",name:"Sequis Tower",type:"Office Tower",ic:"🏢",lat:-6.224,lng:106.808,area:"Sudirman"},
  {id:"treasury",name:"Treasury Tower",type:"Office Tower",ic:"🏢",lat:-6.2252,lng:106.8074,area:"SCBD"},
  {id:"menara_bca",name:"Menara BCA",type:"Office Tower",ic:"🏢",lat:-6.1949,lng:106.8215,area:"Thamrin"},
  {id:"gama_tower",name:"Gama Tower",type:"Office Tower",ic:"🏢",lat:-6.2244,lng:106.8282,area:"Kuningan"},
  {id:"sinarmas",name:"Sinarmas MSIG Tower",type:"Office Tower",ic:"🏢",lat:-6.2248,lng:106.808,area:"Sudirman"},
  {id:"energy_bldg",name:"The Energy Building",type:"Office Tower",ic:"🏢",lat:-6.225,lng:106.8072,area:"SCBD"},
  {id:"equity_tower",name:"Equity Tower",type:"Office Tower",ic:"🏢",lat:-6.2255,lng:106.8065,area:"SCBD"},
  {id:"pik",name:"Pantai Indah Kapuk (PIK)",type:"District",ic:"🏖️",lat:-6.11,lng:106.74,area:"PIK"},
  {id:"ashta",name:"ASHTA District 8",type:"Mall",ic:"🛍️",lat:-6.2252,lng:106.8074,area:"SCBD"},
  {id:"scbd",name:"SCBD",type:"Office Area",ic:"🏙️",lat:-6.225,lng:106.808,area:"Sudirman"},
  {id:"kemang",name:"Kemang",type:"District",ic:"🌃",lat:-6.2607,lng:106.8147,area:"Kemang"},
  {id:"senopati",name:"Senopati",type:"District",ic:"🌆",lat:-6.244,lng:106.8044,area:"Kebayoran Baru"},
  {id:"blok_m",name:"Blok M",type:"Transport Hub",ic:"🚏",lat:-6.2441,lng:106.7998,area:"Kebayoran Baru"},
  {id:"cikini",name:"Cikini",type:"District",ic:"🎭",lat:-6.198,lng:106.835,area:"Menteng"},
  // Extra important places
  {id:"gambir",name:"Gambir Station",type:"Train Station",ic:"🚆",lat:-6.1765,lng:106.8303,area:"Gambir"},
  {id:"soeta",name:"Soekarno-Hatta Airport",type:"Airport",ic:"✈️",lat:-6.1256,lng:106.6559,area:"Tangerang"},
  {id:"tanjung_priok",name:"Tanjung Priok Port",type:"Port",ic:"⚓",lat:-6.11,lng:106.88,area:"Jakarta Utara"},
  {id:"pasar_senen",name:"Pasar Senen",type:"Market",ic:"🏪",lat:-6.1728,lng:106.8432,area:"Senen"},
  {id:"tanah_abang",name:"Tanah Abang Market",type:"Market",ic:"🧵",lat:-6.1877,lng:106.8135,area:"Tanah Abang"},
  {id:"hotel_mulia",name:"Hotel Mulia Senayan",type:"Hotel",ic:"🏨",lat:-6.22,lng:106.802,area:"Senayan"},
  {id:"mandarin",name:"Mandarin Oriental Jakarta",type:"Hotel",ic:"🏨",lat:-6.195,lng:106.8215,area:"Thamrin"},
  {id:"ritz",name:"The Ritz-Carlton Jakarta",type:"Hotel",ic:"🏨",lat:-6.2251,lng:106.8078,area:"SCBD"},
  {id:"ui",name:"Universitas Indonesia (UI)",type:"University",ic:"🎓",lat:-6.3615,lng:106.8273,area:"Depok"},
  {id:"binus",name:"BINUS University",type:"University",ic:"🎓",lat:-6.2012,lng:106.7819,area:"Kebon Jeruk"},
  {id:"rscm",name:"RSCM Hospital",type:"Hospital",ic:"🏥",lat:-6.1942,lng:106.8496,area:"Salemba"},
  {id:"siloam",name:"Siloam Hospitals Semanggi",type:"Hospital",ic:"🏥",lat:-6.2221,lng:106.8086,area:"Semanggi"},
  {id:"jis",name:"Jakarta International Stadium",type:"Stadium",ic:"🏟️",lat:-6.1282,lng:106.843,area:"Papanggo"},
  {id:"kp_melayu",name:"Kampung Melayu",type:"Transport Hub",ic:"🚏",lat:-6.2186,lng:106.8698,area:"Jakarta Timur"},
  {id:"kp_rambutan",name:"Kampung Rambutan Terminal",type:"Transport Hub",ic:"🚏",lat:-6.2979,lng:106.8851,area:"Ciracas"},
  {id:"grogol",name:"Grogol",type:"District",ic:"🏙️",lat:-6.1674,lng:106.7955,area:"Grogol"},
  {id:"kalideres",name:"Kalideres Terminal",type:"Transport Hub",ic:"🚏",lat:-6.1501,lng:106.702,area:"Kalideres"},
];
PLACES.forEach(p=>{const c=g2c(p.lat,p.lng);p.x=c.x;p.y=c.y;});
// Add MRT stations to places for search
ALL_MRT.forEach(l=>l.st.forEach(s=>{
  PLACES.push({id:'mrt_'+s.id,name:s.nm+(s.code?' ('+s.code+')':''),type:'MRT Station',ic:'🚇',lat:s.lat,lng:s.lng,x:s.x,y:s.y,area:'Jakarta'});
}));

// ════════════════════════════════════════════════
// REAL CONGESTION DATA (GPS-based, peak-aware)
// ════════════════════════════════════════════════
const CONG_DEF=[
  {name:'Sudirman–Semanggi',lat:-6.215,lng:106.81,r:50,sev:'high',road:'Jl. Sudirman'},
  {name:'Thamrin / Bundaran HI',lat:-6.1944,lng:106.8229,r:38,sev:'high',road:'Jl. Thamrin'},
  {name:'Gatot Subroto',lat:-6.2283,lng:106.835,r:34,sev:'high',road:'Jl. Gatot Subroto'},
  {name:'Cawang Interchange',lat:-6.2424,lng:106.8671,r:32,sev:'high',road:'Cawang'},
  {name:'Kuningan',lat:-6.224,lng:106.831,r:28,sev:'medium',road:'Rasuna Said'},
  {name:'Kampung Melayu',lat:-6.2186,lng:106.8698,r:26,sev:'medium',road:'Jl. MT Haryono'},
  {name:'Blok M – Senayan',lat:-6.235,lng:106.801,r:24,sev:'medium',road:'Jl. Sisingamangaraja'},
  {name:'Tanah Abang',lat:-6.1877,lng:106.8135,r:22,sev:'medium',road:'Jl. Jatibaru'},
  {name:'Tomang – Tol',lat:-6.1875,lng:106.795,r:22,sev:'medium',road:'Jl. Tomang'},
  {name:'Harmoni',lat:-6.1655,lng:106.8131,r:20,sev:'medium',road:'Jl. Veteran'},
  {name:'Mampang',lat:-6.26,lng:106.829,r:20,sev:'medium',road:'Jl. Mampang'},
  {name:'Kota / Glodok',lat:-6.137,lng:106.8139,r:18,sev:'low',road:'Jl. Pintu Besar'},
  {name:'Pondok Indah',lat:-6.268,lng:106.786,r:18,sev:'low',road:'Jl. Metro Pondok Indah'},
  {name:'Kelapa Gading',lat:-6.155,lng:106.9,r:16,sev:'low',road:'Jl. Kelapa Gading'},
];
function getCong(){
  const h=new Date().getHours();
  const isPeak=(h>=7&&h<=9)||(h>=17&&h<=20);
  const isMid=(h>=11&&h<=13);
  return CONG_DEF.map(c=>{
    const mult=isPeak?1.45:isMid?1.15:0.72;
    const sevUp=isPeak&&c.sev==='low'?'medium':isPeak&&c.sev==='medium'?'high':c.sev;
    const p=g2c(c.lat,c.lng);
    return{...c,x:p.x,y:p.y,r:c.r*mult,sev:sevUp,peak:isPeak};
  });
}
function isPeak(){const h=new Date().getHours();return(h>=7&&h<=9)||(h>=17&&h<=20);}

// ════════════════════════════════════════════════
// APP STATE
// ════════════════════════════════════════════════
const S={
  or:null,dt:null,mode:'mrt',sort:'fastest',
  zoom:1,px:0,py:0,drag:false,lm:null,
  selR:0,anim:0,
  geoLat:null,geoLng:null,
  trains:[],buses:[],
  cong:getCong(),
  highlightCongs:[],
};
function initVeh(){
  S.trains=Array.from({length:4},(_,i)=>({t:i*.25,spd:0.00032+Math.random()*.00014,col:MRT_L1.col}));
  S.buses=TJ.slice(0,9).map((c,i)=>({ci:i,t:i/9,spd:0.00028+Math.random()*.00018}));
}
initVeh();

// ════════════════════════════════════════════════
// CANVAS
// ════════════════════════════════════════════════
const cv=document.getElementById('mc'),ctx=cv.getContext('2d');
const mw=document.getElementById('mWrap');
const DPR=devicePixelRatio;
function W(){return cv.width/DPR;} function H(){return cv.height/DPR;}
function resize(){
  cv.width=mw.clientWidth*DPR;cv.height=mw.clientHeight*DPR;
  cv.style.width=mw.clientWidth+'px';cv.style.height=mw.clientHeight+'px';
  ctx.scale(DPR,DPR);
}
window.addEventListener('resize',resize);resize();
function ts(wx,wy){return{x:(wx-CX)*S.zoom+W()/2+S.px,y:(wy-CY)*S.zoom+H()/2+S.py};}
function tw(sx,sy){return{x:(sx-W()/2-S.px)/S.zoom+CX,y:(sy-H()/2-S.py)/S.zoom+CY};}

// ════════════════════════════════════════════════
// DRAW LOOP
// ════════════════════════════════════════════════
function draw(){
  ctx.clearRect(0,0,W(),H());
  drawBg(); drawGrid(); drawRoads();
  drawCongLayer();   // ALWAYS — like Google Maps traffic layer
  drawAllMRT();      // always draw MRT lines
  if(S.mode==='tj') drawTJ();
  if(S.mode==='mrt') drawTrains();
  if(S.mode==='tj') drawBuses();
  if(S.zoom>0.55) drawPOI();
  if(S.or&&S.dt) drawRoute();
  if(S.or) drawPin(S.or,'#4af0c4');
  if(S.dt) drawPin(S.dt,'#f05c4a');
  updateVeh();
  S.anim=requestAnimationFrame(draw);
}

function drawBg(){ctx.fillStyle='#07080c';ctx.fillRect(0,0,W(),H());}

function drawGrid(){
  const gs=42*S.zoom,ox=(S.px%gs+gs)%gs,oy=(S.py%gs+gs)%gs;
  ctx.strokeStyle='rgba(255,255,255,.018)';ctx.lineWidth=.5;
  for(let x=ox;x<W();x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H());ctx.stroke();}
  for(let y=oy;y<H();y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W(),y);ctx.stroke();}
}

// Real Jakarta road network
const ROADS=[
  {gps:[[-6.29,106.775],[-6.274,106.794],[-6.244,106.8],[-6.22,106.803],[-6.213,106.815],[-6.2,106.823],[-6.187,106.8228],[-6.1758,106.8272],[-6.166,106.813]],w:4.5,c:'rgba(255,255,255,.09)',lbl:'Jl. Sudirman / Thamrin'},
  {gps:[[-6.222,106.793],[-6.228,106.808],[-6.232,106.822],[-6.237,106.856]],w:3.5,c:'rgba(255,255,255,.07)',lbl:'Jl. Gatot Subroto'},
  {gps:[[-6.207,106.823],[-6.214,106.831],[-6.224,106.835],[-6.237,106.856]],w:3,c:'rgba(255,255,255,.06)',lbl:'Jl. Rasuna Said'},
  {gps:[[-6.219,106.87],[-6.23,106.856],[-6.241,106.85],[-6.248,106.845]],w:2.5,c:'rgba(255,255,255,.055)'},
  {gps:[[-6.137,106.8139],[-6.145,106.812],[-6.155,106.813],[-6.163,106.815]],w:2.5,c:'rgba(255,255,255,.05)'},
  {gps:[[-6.167,106.7955],[-6.18,106.795],[-6.188,106.8],[-6.195,106.809]],w:2.5,c:'rgba(255,255,255,.05)',lbl:'Jl. S. Parman'},
  {gps:[[-6.137,106.847],[-6.148,106.845],[-6.158,106.841],[-6.167,106.843]],w:2,c:'rgba(255,255,255,.04)'},
  {gps:[[-6.244,106.806],[-6.252,106.818],[-6.26,106.829],[-6.27,106.83]],w:2,c:'rgba(255,255,255,.04)',lbl:'Jl. Mampang'},
  {gps:[[-6.16,106.70],[-6.19,106.695],[-6.23,106.72],[-6.275,106.748],[-6.31,106.785],[-6.34,106.84],[-6.32,106.905]],w:2.5,c:'rgba(255,255,255,.04)'},
  {gps:[[-6.11,106.74],[-6.118,106.78],[-6.124,106.83],[-6.11,106.875]],w:1.8,c:'rgba(255,255,255,.04)'},
  {gps:[[-6.17,106.843],[-6.185,106.86],[-6.2,106.878],[-6.21,106.9]],w:2.5,c:'rgba(255,255,255,.05)',lbl:'Jl. Ahmad Yani'},
  {gps:[[-6.218,106.87],[-6.248,106.89],[-6.28,106.9],[-6.3,106.9]],w:2,c:'rgba(255,255,255,.04)'},
];
function drawRoads(){
  for(const r of ROADS){
    const pts=r.gps.map(([la,ln])=>{const p=g2c(la,ln);return ts(p.x,p.y);});
    ctx.strokeStyle=r.c;ctx.lineWidth=(r.w||2)*Math.min(S.zoom*.85,1.4);
    ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
    if(r.lbl&&S.zoom>.75){
      const mid=pts[Math.floor(pts.length/2)];
      ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${Math.max(8,8*Math.min(S.zoom,1.3))}px DM Sans`;ctx.textAlign='center';
      ctx.fillText(r.lbl,mid.x,mid.y);
    }
  }
}

// ═══ CONGESTION LAYER — Google/Apple Maps style ═══
function drawCongLayer(){
  const congs=S.cong;
  const t=Date.now()/1000;
  const SV={
    high:{rgb:[240,92,74],glowA:.65,fillA:.42,edgeA:.04,blur:22},
    medium:{rgb:[240,180,74],glowA:.5,fillA:.3,edgeA:.03,blur:16},
    low:{rgb:[74,240,122],glowA:.35,fillA:.18,edgeA:.02,blur:10},
  };
  // Merge overlapping zones to reduce noise — sort by severity desc
  const sorted=[...congs].sort((a,b)=>({high:3,medium:2,low:1}[b.sev]-{high:3,medium:2,low:1}[a.sev]));
  for(const c of sorted){
    const p=ts(c.x,c.y);
    const sm=SV[c.sev];
    const pulse=1+.04*Math.sin(t*1.1+c.x*.007);
    const rad=c.r*S.zoom*pulse;
    const highlighted=S.highlightCongs.includes(c.name);
    const [r,g,b]=sm.rgb;
    // Main gradient fill
    const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad);
    grad.addColorStop(0,`rgba(${r},${g},${b},${sm.fillA})`);
    grad.addColorStop(.5,`rgba(${r},${g},${b},${sm.fillA*.4})`);
    grad.addColorStop(1,`rgba(${r},${g},${b},${sm.edgeA})`);
    ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);
    ctx.fillStyle=grad;ctx.fill();
    // Inner glow ring
    if(c.sev==='high'||c.sev==='medium'){
      ctx.beginPath();ctx.arc(p.x,p.y,rad*.35,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${r},${g},${b},${sm.glowA*.5})`;ctx.lineWidth=2*S.zoom;ctx.stroke();
    }
    // Dashed border for ROUTE-HIGHLIGHTED zones
    if(highlighted){
      ctx.beginPath();ctx.arc(p.x,p.y,rad*.72,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${r},${g},${b},.75)`;ctx.lineWidth=2.5*S.zoom;
      ctx.setLineDash([5*S.zoom,3*S.zoom]);ctx.stroke();ctx.setLineDash([]);
    }
    // Labels at zoom
    if(S.zoom>.85){
      const icon=c.sev==='high'?'🔴':c.sev==='medium'?'🟡':'🟢';
      ctx.font=`${11*Math.min(S.zoom,1.4)}px serif`;ctx.textAlign='center';
      ctx.fillText(icon,p.x,p.y-rad*.52);
      if(S.zoom>1.05){
        ctx.fillStyle='rgba(255,255,255,.6)';ctx.font=`${8*Math.min(S.zoom,1.4)}px DM Sans`;
        ctx.fillText(c.name,p.x,p.y-rad*.52+11*S.zoom);
        if(highlighted){
          ctx.fillStyle=`rgba(${r},${g},${b},.95)`;ctx.font=`bold ${8*Math.min(S.zoom,1.4)}px Syne`;
          ctx.fillText('⚠ AVOID ZONE',p.x,p.y+rad*.38);
        }
      }
    }
  }
}

function drawAllMRT(){
  for(const line of ALL_MRT){
    const ss=line.st;
    ctx.strokeStyle=line.col;ctx.lineWidth=(line===MRT_L1?5:3.5)*Math.min(S.zoom,1.5);
    ctx.shadowColor=line.col;ctx.shadowBlur=line===MRT_L1?14:8;
    ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    ss.forEach((s,i)=>{const p=ts(s.x,s.y);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});
    ctx.stroke();ctx.shadowBlur=0;
    for(const st of ss){
      const p=ts(st.x,st.y);
      const dr=S.zoom>1?4.5:S.zoom>.6?3:2.2;
      ctx.beginPath();ctx.arc(p.x,p.y,dr*S.zoom,0,Math.PI*2);
      ctx.fillStyle=line.col+'2a';ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,(dr-1.2)*S.zoom,0,Math.PI*2);
      ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle=line.col;ctx.lineWidth=1.6;ctx.stroke();
      if(S.zoom>.92){
        const alpha=S.zoom>1.2?.85:.62;
        ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.font=`${Math.max(7,7.5*Math.min(S.zoom,1.5))}px DM Sans`;ctx.textAlign='left';
        ctx.fillText(st.nm,p.x+5*S.zoom,p.y+3.5*S.zoom);
      } else if(S.zoom>.65&&line===MRT_L1){
        ctx.fillStyle='rgba(255,255,255,.5)';ctx.font=`${Math.max(6,7*S.zoom)}px DM Sans`;ctx.textAlign='left';
        ctx.fillText(st.nm,p.x+4*S.zoom,p.y+3*S.zoom);
      }
    }
  }
}

function drawTJ(){
  TJ.forEach(c=>{
    ctx.strokeStyle=c.col;ctx.lineWidth=3*Math.min(S.zoom,1.4);
    ctx.setLineDash([8*S.zoom,4*S.zoom]);ctx.shadowColor=c.col;ctx.shadowBlur=6;
    ctx.lineCap='round';ctx.beginPath();
    c.path.forEach((p,i)=>{const s=ts(p.x,p.y);i?ctx.lineTo(s.x,s.y):ctx.moveTo(s.x,s.y);});
    ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
    if(S.zoom>.55) c.path.filter((_,i)=>i%2===0).forEach(p=>{
      const s=ts(p.x,p.y);ctx.beginPath();ctx.arc(s.x,s.y,2.5*S.zoom,0,Math.PI*2);
      ctx.fillStyle=c.col;ctx.fill();ctx.strokeStyle='rgba(7,8,12,.8)';ctx.lineWidth=1;ctx.stroke();
    });
    if(S.zoom>.8){
      const mid=c.path[Math.floor(c.path.length/2)];const ms=ts(mid.x,mid.y);
      ctx.fillStyle=c.col;ctx.font=`bold ${Math.max(8,8.5*Math.min(S.zoom,1.3))}px Syne`;ctx.textAlign='center';
      ctx.fillText(c.nm.split(':')[0],ms.x,ms.y-8*S.zoom);
    }
  });
}

function drawPOI(){
  const cw=W(),ch=H();
  for(const p of PLACES){
    if(p.type==='MRT Station') continue;
    const s=ts(p.x,p.y);
    if(s.x<-30||s.x>cw+30||s.y<-30||s.y>ch+30) continue;
    if((S.or&&S.or.id===p.id)||(S.dt&&S.dt.id===p.id)) continue;
    const r=S.zoom>1.35?4.5:3.5;
    ctx.beginPath();ctx.arc(s.x,s.y,r*S.zoom,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,.09)';ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=.7;ctx.stroke();
    if(S.zoom>1.3){
      ctx.fillStyle='rgba(255,255,255,.45)';ctx.font=`${Math.max(7,8*S.zoom)}px DM Sans`;ctx.textAlign='left';
      ctx.fillText(p.name.length>23?p.name.slice(0,23)+'…':p.name,s.x+5*S.zoom,s.y+3.5*S.zoom);
    }
  }
}

function drawPin(pl,col){
  const s=ts(pl.x,pl.y);const t=Date.now()/1000;
  const pulse=.5+.5*Math.abs(Math.sin(t*2.1));
  ctx.beginPath();ctx.arc(s.x,s.y,(13+5*pulse)*S.zoom,0,Math.PI*2);
  ctx.strokeStyle=col+'35';ctx.lineWidth=1.5;ctx.stroke();
  ctx.beginPath();ctx.arc(s.x,s.y,8*S.zoom,0,Math.PI*2);
  ctx.fillStyle=col+'28';ctx.fill();
  ctx.beginPath();ctx.arc(s.x,s.y,5.5*S.zoom,0,Math.PI*2);
  ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=14;ctx.fill();ctx.shadowBlur=0;
}

// ═══ ANIMATED VEHICLES ═══
function drawTrains(){
  const ss=MRT_L1.st,n=ss.length-1;
  for(const tr of S.trains){
    const sf=tr.t*n,si=Math.floor(sf),st2=sf-si;
    if(si>=n) continue;
    const a=ss[si],b=ss[si+1];
    const wx=a.x+(b.x-a.x)*st2,wy=a.y+(b.y-a.y)*st2;
    const p=ts(wx,wy);
    ctx.beginPath();ctx.arc(p.x,p.y,7*S.zoom,0,Math.PI*2);ctx.fillStyle=MRT_L1.col+'20';ctx.fill();
    ctx.beginPath();ctx.arc(p.x,p.y,4.5*S.zoom,0,Math.PI*2);
    ctx.fillStyle=MRT_L1.col;ctx.shadowColor=MRT_L1.col;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
    ctx.beginPath();ctx.arc(p.x,p.y,2*S.zoom,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  }
}
function drawBuses(){
  for(const bus of S.buses){
    const c=TJ[bus.ci];if(!c||!c.path.length) continue;
    const n=c.path.length-1,sf=bus.t*n,si=Math.floor(sf),st2=sf-si;
    if(si>=n) continue;
    const a=c.path[si],b=c.path[si+1];
    const wx=a.x+(b.x-a.x)*st2,wy=a.y+(b.y-a.y)*st2;
    const p=ts(wx,wy);
    ctx.beginPath();ctx.arc(p.x,p.y,4*S.zoom,0,Math.PI*2);
    ctx.fillStyle=c.col;ctx.shadowColor=c.col;ctx.shadowBlur=7;ctx.fill();ctx.shadowBlur=0;
    ctx.beginPath();ctx.arc(p.x,p.y,2*S.zoom,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  }
}
function updateVeh(){
  for(const tr of S.trains){tr.t+=tr.spd;if(tr.t>1)tr.t=0;}
  for(const bus of S.buses){bus.t+=bus.spd;if(bus.t>1)bus.t=0;}
}

// ═══ ROUTE DRAWING ═══
function drawRoute(){
  const o=ts(S.or.x,S.or.y),d=ts(S.dt.x,S.dt.y);
  const t=Date.now()/1000;const hasCong=S.highlightCongs.length>0;
  if(S.mode==='mrt') drawMRTRoute(o,d,t,hasCong);
  else if(S.mode==='walk') drawWalkRoute(o,d,t);
  else if(S.mode==='tj') drawAnimRoute(o,d,'#f05c4a',t,hasCong);
  else if(S.mode==='bike') drawAnimRoute(o,d,'#4af07a',t,false);
  else{drawAnimRoute(o,d,'#f0b44a',t,hasCong);if(hasCong)drawAvoidZones();}
}
function drawMRTRoute(o,d,t,hasCong){
  const near_or=nearestMRT(S.or),near_dt=nearestMRT(S.dt);
  const ss=MRT_L1.st;
  const i1=near_or?ss.findIndex(s=>s.id===near_or.id):0;
  const i2=near_dt?ss.findIndex(s=>s.id===near_dt.id):ss.length-1;
  const lo=Math.min(i1,i2),hi=Math.max(i1,i2);
  const col=hasCong?'#f0b44a':MRT_L1.col;
  ctx.strokeStyle=col;ctx.lineWidth=7*S.zoom;ctx.lineCap='round';
  ctx.shadowColor=col;ctx.shadowBlur=20;ctx.beginPath();
  for(let i=lo;i<=hi;i++){const p=ts(ss[i].x,ss[i].y);i===lo?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
  ctx.stroke();ctx.shadowBlur=0;
  for(let i=lo;i<=hi;i++){
    const p=ts(ss[i].x,ss[i].y);
    ctx.beginPath();ctx.arc(p.x,p.y,6*S.zoom,0,Math.PI*2);
    ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;
    ctx.beginPath();ctx.arc(p.x,p.y,3*S.zoom,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  }
  // Walk legs
  if(i1>=0){const a=ts(ss[lo].x,ss[lo].y);drawWalkLeg(o,a);}
  if(i2>=0){const b=ts(ss[hi].x,ss[hi].y);drawWalkLeg(b,d);}
}
function drawWalkLeg(a,b){
  ctx.strokeStyle='rgba(74,240,196,.48)';ctx.lineWidth=2*S.zoom;ctx.setLineDash([5*S.zoom,4*S.zoom]);
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
}
function drawWalkRoute(o,d,t){
  const mid={x:o.x,y:d.y};
  ctx.strokeStyle='#4af0c4';ctx.lineWidth=3.5*S.zoom;ctx.lineCap='round';
  ctx.setLineDash([9*S.zoom,5*S.zoom]);ctx.shadowColor='#4af0c4';ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(mid.x,mid.y);ctx.lineTo(d.x,d.y);
  ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
  ctx.beginPath();ctx.arc(mid.x,mid.y,4*S.zoom,0,Math.PI*2);ctx.fillStyle='#4af0c4';ctx.fill();
  const prog=((t*.22)%1);
  const bx=L3(o.x,mid.x,d.x,prog),by=L3(o.y,mid.y,d.y,prog);
  ctx.font=`${14*S.zoom}px serif`;ctx.textAlign='center';ctx.fillText('🚶',bx,by);
}
function drawAnimRoute(o,d,col,t,warn){
  const dc=warn?'#f0b44a':col;
  const mx=(o.x+d.x)/2,my=(o.y+d.y)/2-52*S.zoom;
  ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.quadraticCurveTo(mx,my,d.x,d.y);
  ctx.strokeStyle=dc+'88';ctx.lineWidth=5*S.zoom;ctx.lineCap='round';
  ctx.shadowColor=dc;ctx.shadowBlur=14;ctx.stroke();ctx.shadowBlur=0;
  const pr=(t*.25)%1;
  const bx=(1-pr)*(1-pr)*o.x+2*(1-pr)*pr*mx+pr*pr*d.x;
  const by=(1-pr)*(1-pr)*o.y+2*(1-pr)*pr*my+pr*pr*d.y;
  ctx.beginPath();ctx.arc(bx,by,5.5*S.zoom,0,Math.PI*2);
  ctx.fillStyle=dc;ctx.shadowColor=dc;ctx.shadowBlur=14;ctx.fill();ctx.shadowBlur=0;
}
function drawAvoidZones(){
  for(const nm of S.highlightCongs){
    const c=S.cong.find(x=>x.name===nm);if(!c) continue;
    const p=ts(c.x,c.y);
    ctx.beginPath();ctx.arc(p.x,p.y,c.r*S.zoom*1.05,0,Math.PI*2);
    const [r,g,b]=c.sev==='high'?[240,92,74]:[240,180,74];
    ctx.strokeStyle=`rgba(${r},${g},${b},.65)`;ctx.lineWidth=3*S.zoom;
    ctx.setLineDash([6*S.zoom,3*S.zoom]);ctx.stroke();ctx.setLineDash([]);
  }
}
function nearestMRT(pl){
  let best=null,bd=Infinity;
  for(const s of MRT_L1.st){const d=Math.hypot(s.x-pl.x,s.y-pl.y);if(d<bd){bd=d;best=s;}}
  return best;
}
function L3(a,b,c,t){return t<.5?a+(b-a)*t*2:b+(c-b)*(t-.5)*2;}

// ════════════════════════════════════════════════
// CONGESTION ROUTE ANALYSIS
// ════════════════════════════════════════════════
function analyzeCong(or,dt){
  if(!or||!dt) return[];
  const hits=[];
  for(const c of S.cong){
    if(c.sev==='low') continue;
    const dist=ptLineDist(or.x,or.y,dt.x,dt.y,c.x,c.y);
    if(dist<c.r*2.2) hits.push(c.name);
  }
  return hits;
}
function ptLineDist(x1,y1,x2,y2,px,py){
  const A=px-x1,B=py-y1,C=x2-x1,D=y2-y1;
  const dot=A*C+B*D,lenSq=C*C+D*D;
  const param=lenSq?Math.max(0,Math.min(1,dot/lenSq)):-1;
  const xx=x1+param*C,yy=y1+param*D;
  return Math.hypot(px-xx,py-yy);
}

// ════════════════════════════════════════════════
// ROUTE CALCULATION
// ════════════════════════════════════════════════
function distKm(a,b){
  const dx=(a.lng-b.lng)*Math.cos((a.lat+b.lat)*.5*Math.PI/180)*111;
  const dy=(a.lat-b.lat)*111;
  return Math.hypot(dx,dy);
}
function calcRoutes(){
  if(!S.or||!S.dt) return[];
  const km=distKm({lat:S.or.lat||(-6.21),lng:S.or.lng||106.823},{lat:S.dt.lat||(-6.21),lng:S.dt.lng||106.823});
  const peak=isPeak();
  const congZones=analyzeCong(S.or,S.dt);
  S.highlightCongs=congZones;
  const sevHits=congZones.filter(n=>S.cong.find(c=>c.name===n&&c.sev==='high')).length;
  const congDelay=sevHits>0?Math.round(6+sevHits*4+Math.random()*5):congZones.length>0?Math.round(3+Math.random()*4):0;
  const peakAdd=peak?Math.round(km*1.3):0;
  const nm_or=nearestMRT(S.or)?.nm||'nearest station';
  const nm_dt=nearestMRT(S.dt)?.nm||'nearest station';
  const rd=getRoad();
  const routes=[];
  const M=S.mode;

  if(M==='mrt'){
    routes.push({lbl:`MRT: ${nm_or.split(' ')[0]} → ${nm_dt.split(' ')[0]}`,
      badge:'fastest',time:Math.round(km*1.8+5)+(peak?2:0),price:Math.round(3000+km*380),
      steps:[{ic:'🚶',tx:`Walk to ${nm_or}`,dist:Math.round(km*170)+'m'},
             {ic:'🚇',tx:`MRT Line 1 · ${nm_or} → ${nm_dt}`},
             {ic:'🚶',tx:`Walk to ${S.dt.name}`,dist:'~3 min'}],
      co2:Math.round(km*.04),tf:0,cf:4,cw:false,cz:[]});
    routes.push({lbl:'MRT + LRT (via Dukuh Atas)',
      badge:'comfortable',time:Math.round(km*1.8+11)+(peak?3:0),price:7000,
      steps:[{ic:'🚇',tx:`MRT Line 1 → Dukuh Atas BNI`},
             {ic:'🔄',tx:'Transfer to LRT Jabodebek (Platform B)'},
             {ic:'🚇',tx:`LRT → ${nm_dt}`}],
      co2:Math.round(km*.04),tf:1,cf:5,cw:false,cz:[]});
    routes.push({lbl:'MRT + Walk (cheapest)',
      badge:'cheapest',time:Math.round(km*1.8+14)+(peak?2:0),price:3500,
      steps:[{ic:'🚇',tx:'MRT (2 stops)'},{ic:'🚶',tx:`Walk ~800m via ${rd}`}],
      co2:Math.round(km*.03),tf:0,cf:3,cw:false,cz:[]});
  } else if(M==='tj'){
    routes.push({lbl:'Corridor 1: Blok M – Kota',
      badge:'fastest',time:Math.round(km*2.8+8)+peakAdd+congDelay,price:3500,
      steps:[{ic:'🚌',tx:'Corridor 1 from nearest stop',dist:Math.round(km*1.2)+' km'},
             {ic:'↔',tx:Math.round(km/1.8)+' stops'},
             {ic:'🚶',tx:`Walk to ${S.dt.name}`}],
      co2:Math.round(km*.07),tf:0,cf:3,cw:congDelay>0,cz:congZones});
    routes.push({lbl:'TransJakarta + MRT',
      badge:'comfortable',time:Math.round(km*2.4+8)+Math.round(peakAdd*.7),price:10500,
      steps:[{ic:'🚌',tx:'TransJakarta Express'},{ic:'🔄',tx:'Transfer at Dukuh Atas BNI'},
             {ic:'🚇',tx:`MRT → ${S.dt.name}`}],
      co2:Math.round(km*.05),tf:1,cf:5,cw:false,cz:[]});
    routes.push({lbl:'Via Harmoni transfer',
      badge:'cheapest',time:Math.round(km*3.2+8)+peakAdd+congDelay,price:7000,
      steps:[{ic:'🚌',tx:'TransJakarta → Harmoni'},{ic:'🔄',tx:'Transfer at Harmoni Central'},
             {ic:'🚌',tx:`→ ${S.dt.name}`}],
      co2:Math.round(km*.09),tf:1,cf:2,cw:congDelay>0,cz:congZones});
  } else if(M==='walk'){
    routes.push({lbl:'Walking Route',badge:'eco',
      time:Math.round(km*12.5),price:0,steps:walkSteps(),
      co2:0,tf:0,cf:5,cw:congDelay>0&&km<2,cz:congZones.slice(0,1)});
  } else if(M==='bike'){
    routes.push({lbl:'Gowes Shared Bike',badge:'eco',
      time:Math.round(km*5.4),price:Math.round(2000+km*430),
      steps:[{ic:'🚲',tx:'Unlock at nearest Gowes station'},{ic:'🛣️',tx:`Bike lane · ${km.toFixed(1)} km`},{ic:'🚲',tx:`Return at ${S.dt.name} station`}],
      co2:0,tf:0,cf:4,cw:false,cz:[]});
    routes.push({lbl:'Bike → MRT',badge:'fastest',
      time:Math.round(km*3.1),price:5500,
      steps:[{ic:'🚲',tx:`Bike to ${nm_or}`},{ic:'🚇',tx:'MRT (2 stops)'},{ic:'🚶',tx:`Walk to ${S.dt.name}`}],
      co2:Math.round(km*.02),tf:1,cf:4,cw:false,cz:[]});
  } else if(M==='ojek'){
    const tr=peak?1.45+Math.random()*.25:1.08+Math.random()*.12;
    routes.push({lbl:'GrabBike / GoRide',badge:'fastest',
      time:Math.round(km*3.4*tr)+congDelay,price:Math.round(6000+km*1300),
      steps:[{ic:'🛵',tx:`Pickup at ${S.or.name}`},{ic:'🛣️',tx:`Via ${rd} · ${km.toFixed(1)} km`},{ic:'📍',tx:S.dt.name}],
      co2:Math.round(km*.13),tf:0,cf:4,cw:congDelay>0,cz:congZones});
    routes.push({lbl:'GrabCar / GoCar',badge:'comfortable',
      time:Math.round(km*4.1*tr)+congDelay,price:Math.round(12000+km*1700),
      steps:[{ic:'🚗',tx:`GrabCar from ${S.or.name}`},{ic:'🛣️',tx:'Air-conditioned · Door to door'},{ic:'📍',tx:S.dt.name}],
      co2:Math.round(km*.2),tf:0,cf:5,cw:congDelay>0,cz:congZones});
    routes.push({lbl:'GrabShare / GoPool',badge:'cheapest',
      time:Math.round(km*5*tr)+congDelay,price:Math.round(4500+km*850),
      steps:[{ic:'🚗',tx:'Shared ride · up to 2 stops'},{ic:'👥',tx:'3 passengers max'},{ic:'📍',tx:'Near '+S.dt.name}],
      co2:Math.round(km*.09),tf:0,cf:3,cw:congDelay>0,cz:congZones});
    if(sevHits>0){
      routes.push({lbl:'🚇 Switch to MRT (avoid traffic)',badge:'fastest',isAlt:true,
        time:Math.round(km*1.8+5)+(peak?2:0),price:Math.round(3000+km*380),
        steps:[{ic:'💡',tx:'Beat congestion — use MRT instead'},{ic:'🚶',tx:`Walk to ${nm_or}`},{ic:'🚇',tx:`MRT Line 1 → ${nm_dt}`}],
        co2:Math.round(km*.04),tf:0,cf:5,cw:false,cz:[]});
    }
  }
  return sortR(routes);
}
function sortR(r){
  const s=[...r];
  if(S.sort==='fastest') s.sort((a,b)=>a.time-b.time);
  else if(S.sort==='cheapest') s.sort((a,b)=>a.price-b.price);
  else if(S.sort==='comfortable') s.sort((a,b)=>(b.cf||0)-(a.cf||0));
  else s.sort((a,b)=>a.co2-b.co2);
  return s;
}
const ROAD_NMS=['Jl. Sudirman','Jl. Thamrin','Jl. Gatot Subroto','Jl. Rasuna Said','Jl. Imam Bonjol','Jl. Wahid Hasyim','Jl. HR Rasuna Said','Jl. Sisingamangaraja'];
function getRoad(){return ROAD_NMS[Math.abs(Math.floor(((S.or?.x||0)+(S.dt?.x||0))/80))%ROAD_NMS.length]||ROAD_NMS[0];}
function walkSteps(){
  if(!S.or||!S.dt) return[];
  const dx=S.dt.x-S.or.x,dy=S.dt.y-S.or.y;
  return[
    {ic:'🚶',tx:`Head ${dx>0?'east':'west'} on ${getRoad()}`,dist:`${Math.round(Math.abs(dx)*11)}m`},
    {ic:'↰',tx:`Turn ${dy>0?'south':'north'} at junction`,dist:`${Math.round(Math.abs(dy)*10)}m`},
    {ic:'➡️',tx:`Continue past ${nearby()}`,dist:`${Math.round(Math.abs(dx*5+dy*4))}m`},
    {ic:'📍',tx:`Arrive at ${S.dt.name}`,dist:'Destination'},
  ];
}
function nearby(){
  if(!S.or) return 'the junction';
  return PLACES.filter(p=>p.id!==S.or?.id&&p.id!==S.dt?.id&&p.type!=='MRT Station')
    .sort((a,b)=>Math.hypot(a.x-S.or.x,a.y-S.or.y)-Math.hypot(b.x-S.or.x,b.y-S.or.y))[0]?.name||'traffic light';
}

// ════════════════════════════════════════════════
// RENDER PANEL
// ════════════════════════════════════════════════
const BCLS={fastest:'bgf',cheapest:'bgc',comfortable:'bgo',eco:'bge'};
const BTXT={fastest:'FASTEST',cheapest:'CHEAPEST',comfortable:'MOST COMFORTABLE',eco:'LOWEST CO₂'};
const SPIL={
  '🚇':'background:rgba(74,240,196,.14);color:#4af0c4',
  '🚌':'background:rgba(240,92,74,.14);color:#f05c4a',
  '🛵':'background:rgba(240,180,74,.14);color:#f0b44a',
  '🚲':'background:rgba(74,240,122,.14);color:#4af07a',
  '🚶':'background:rgba(255,255,255,.06);color:#8e8d88',
  '🚗':'background:rgba(164,106,240,.14);color:#a46af0',
  '🔄':'background:rgba(255,255,255,.06);color:#8e8d88',
  '📍':'background:rgba(255,255,255,.06);color:#8e8d88',
  '↔':'background:rgba(255,255,255,.06);color:#8e8d88',
  '↰':'background:rgba(74,240,196,.08);color:#4af0c4',
  '➡️':'background:rgba(74,240,196,.08);color:#4af0c4',
  '👥':'background:rgba(74,144,240,.14);color:#4a90f0',
  '💡':'background:rgba(74,240,196,.22);color:#4af0c4',
};

function renderPanel(){
  const rp=document.getElementById('rPanel');
  const mt=document.getElementById('mTabs');
  const sb=document.getElementById('sBar');
  document.getElementById('clrBtn').style.display=S.dt?'flex':'none';
  if(!S.dt){
    mt.style.display='none';sb.style.display='none';
    rp.innerHTML=`<div class="empty"><span class="eic">🔍</span><div class="etx">Where to?</div><div class="esub">Search a mall, landmark, MRT station, or address across Jakarta.</div></div>`;
    return;
  }
  mt.style.display='flex';sb.style.display='flex';
  const routes=calcRoutes();
  if(!routes.length){rp.innerHTML=`<div class="empty"><span class="eic">🚧</span><div class="etx">No routes found</div></div>`;return;}
  const pk=isPeak();
  const sevHits=S.highlightCongs.filter(n=>S.cong.find(c=>c.name===n&&c.sev==='high'));
  const orNm=(S.or?.name||'Current Location').slice(0,22);
  const dtNm=S.dt.name.slice(0,22);
  const km=distKm({lat:S.or?.lat||(-6.21),lng:S.or?.lng||106.823},{lat:S.dt.lat,lng:S.dt.lng});

  let h=`<div style="font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:var(--t2);margin-bottom:9px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
    <span>${routes.length} routes</span><span style="color:var(--t3)">·</span><span>${orNm} → ${dtNm}</span>
    ${pk?`<span style="font-size:10px;color:var(--am);background:var(--amd);border:1px solid rgba(240,180,74,.2);border-radius:6px;padding:1px 7px;">🟠 Peak hour</span>`:''}
    <span style="font-size:10px;color:var(--t3);">${km.toFixed(1)} km</span>
  </div>`;

  // Global congestion alert
  if(sevHits.length>0){
    const delay=Math.round(8+sevHits.length*4+Math.random()*5);
    h+=`<div class="cw-high">⚠️ <div><strong>High congestion on this route</strong><br>Passing through: ${sevHits.slice(0,2).join(', ')}. Expect +${delay} min delay.</div></div>`;
    if(S.mode==='ojek'||S.mode==='tj'){
      h+=`<div class="cw-avoid">🔴 Avoid zones marked on map with dashed rings</div>`;
      h+=`<div class="cw-alt" onclick="setMode('mrt')">💡 Switch to MRT — ~${Math.round(delay*.65)} min faster today →</div>`;
    }
  } else if(S.highlightCongs.length>0){
    h+=`<div style="background:rgba(240,180,74,.07);border:1px solid rgba(240,180,74,.18);border-radius:8px;padding:6px 10px;font-size:11px;color:var(--am);margin-bottom:5px;">🟡 Moderate traffic on route (+${Math.round(2+Math.random()*4)} min)</div>`;
  }

  routes.forEach((r,i)=>{
    const sel=i===S.selR;
    const pills=r.steps.map(s=>`<span class="sp" style="${SPIL[s.ic]||'background:var(--p1);color:var(--t2)'}">${s.ic}</span>`).join('<span class="sa">›</span>');
    h+=`<div class="rc${sel?' sel':''}${r.isAlt?' alt-rec':''}" onclick="selR(${i})">
      <div class="rch">
        <div><span class="rbg ${BCLS[r.badge]||'bgf'}">${BTXT[r.badge]||''}</span><div class="rnm">${r.lbl}</div></div>
        <div style="text-align:right;"><div class="rtm">${r.time}<span style="font-size:13px;font-weight:400"> min</span></div><div class="rpr">Rp ${r.price.toLocaleString()}</div></div>
      </div>
      <div class="rps">${pills}</div>
      <div class="rm">
        <span>🌿 ${r.co2}g CO₂</span>
        <span>🔄 ${r.tf} transfer${r.tf!==1?'s':''}</span>
        <span>⭐ ${'★'.repeat(r.cf||3)}${'☆'.repeat(5-(r.cf||3))}</span>
        ${pk?`<span style="color:var(--am)">+${Math.round(r.time*.11)} peak</span>`:''}
      </div>
      ${r.cw&&r.cz.length?`<div style="background:rgba(240,92,74,.07);border:1px solid rgba(240,92,74,.2);border-radius:7px;padding:5px 9px;font-size:10px;color:#f08878;margin-top:7px;">⚠️ ${r.cz.slice(0,2).join(', ')} — est. +${Math.round(4+Math.random()*6)} min</div>`:''}
      ${sel?`<div class="rd">
        ${r.steps.map(s=>`<div class="ds"><div class="dsic">${s.ic}</div><div class="dstx">${s.tx}</div>${s.dist?`<div class="dsd">${s.dist}</div>`:''}</div>`).join('')}
        ${S.mode==='ojek'?`<button class="ojbtn" onclick="event.stopPropagation();showModal()">🛵 Open Grab / Gojek</button>`:''}
      </div>`:''}
    </div>`;
  });
  rp.innerHTML=h;
  updateWalkPan();
  updateMapUI();
}

function updateWalkPan(){
  const wp=document.getElementById('wPan');
  if(S.mode!=='walk'||!S.or||!S.dt){wp.style.display='none';return;}
  const steps=walkSteps();
  const wmin=Math.round(distKm({lat:S.or.lat||(-6.21),lng:S.or.lng||106.823},{lat:S.dt.lat,lng:S.dt.lng})*12.5);
  wp.style.display='block';
  wp.innerHTML=`<div class="wph"><span class="wpht">🚶 Walking Directions</span><span style="font-size:10px;color:var(--t3);">${wmin} min walk</span></div>
    ${steps.map((s,i)=>`<div class="wps"><div class="wpsi">${s.ic}</div><div class="wpst"><strong>Step ${i+1}.</strong> ${s.tx}</div><div class="wpsd">${s.dist||''}</div></div>`).join('')}`;
}

function updateMapUI(){
  const labels={mrt:'🚇 MRT Jakarta (M01–M20)',tj:'🚌 TransJakarta – 14 Corridors',walk:'🚶 Walking Directions',bike:'🚲 Bike Routes',ojek:'🛵 Live Traffic & Ojek'};
  document.getElementById('mchip').textContent=labels[S.mode]||'🗺️ Jakarta City Map';
  const leg=document.getElementById('mleg');
  if(S.mode==='mrt') leg.innerHTML=`<div class="mli"><span class="mll" style="background:#4af0c4;"></span>MRT L1 (M01–M20)</div><div class="mli"><span class="mll" style="background:#f0b44a;"></span>LRT Bekasi</div><div class="mli"><span class="mll" style="background:#a46af0;"></span>LRT Cibubur</div><div class="mli"><span class="mld" style="background:#fff;outline:2px solid #4af0c4;outline-offset:-1px;"></span>Station · 🚃 Live</div>`;
  else if(S.mode==='tj') leg.innerHTML=`<div class="mli"><span class="mll" style="background:#f05c4a;"></span>C1: Blok M–Kota</div><div class="mli"><span class="mll" style="background:#4a90f0;"></span>C2: Pulo Gadung</div><div class="mli"><span class="mll" style="background:#4af07a;"></span>C3: Kalideres</div><div class="mli" style="color:var(--t3);font-size:9px;">+11 corridors · 🚌 Live buses</div>`;
  else if(S.mode==='walk') leg.innerHTML=`<div class="mli"><span class="mll" style="background:#4af0c4;"></span>Walk route</div><div class="mli" style="color:var(--t3);font-size:9px;">Dashed = walking segment</div>`;
  else if(S.mode==='bike') leg.innerHTML=`<div class="mli"><span class="mll" style="background:#4af07a;"></span>Bike lane</div><div class="mli"><span class="mld" style="background:#4af07a;"></span>Gowes station</div>`;
  else leg.innerHTML=`<div class="mli"><span class="mld" style="background:rgba(240,92,74,.7);"></span>🔴 Severe congestion</div><div class="mli"><span class="mld" style="background:rgba(240,180,74,.7);"></span>🟡 Heavy</div><div class="mli"><span class="mld" style="background:rgba(232,240,74,.6);"></span>Moderate</div><div class="mli"><span class="mld" style="background:rgba(74,240,122,.6);"></span>🟢 Clear</div>`;
}

// ════════════════════════════════════════════════
// SEARCH SUGGESTIONS — instant, grouped
// ════════════════════════════════════════════════
const CATS={
  'MRT Station':['MRT Station'],
  'Landmark':['Landmark','Park','Mosque','Church','Temple'],
  'Mall & Shopping':['Mall'],
  'Food & Dining':['Restaurant'],
  'Office & Business':['Office Tower','Office Area','District'],
  'Transport':['Transport Hub','Airport','Port','Train Station','Market'],
  'Other':['Hotel','University','Hospital','Attraction','Stadium'],
};
function getCat(t){for(const[k,v]of Object.entries(CATS))if(v.includes(t))return k;return'Other';}

function onSrch(field,q){
  const id=field==='or'?'orD':'dtD';
  const el=document.getElementById(id);
  const ql=q.toLowerCase().trim();
  if(!ql&&field==='or'){el.classList.remove('open');return;}
  let matches=PLACES.filter(p=>ql===''||p.name.toLowerCase().includes(ql)||(p.area||'').toLowerCase().includes(ql)||p.type.toLowerCase().includes(ql)).slice(0,16);
  const groups={};
  for(const p of matches){
    const g=getCat(p.type);if(!groups[g])groups[g]=[];if(groups[g].length<6)groups[g].push(p);
  }
  let html='';
  if(ql===''&&field==='dt'){
    const pop=[PLACES.find(p=>p.id==='monas'),PLACES.find(p=>p.id==='grand_indonesia'),PLACES.find(p=>p.id==='gbk'),PLACES.find(p=>p.id==='bundaran_hi'),PLACES.find(p=>p.id==='blok_m'),PLACES.find(p=>p.id==='kokas')].filter(Boolean);
    html=`<div class="sg"><div class="slbl">Popular in Jakarta</div>${pop.map(p=>`<div class="sit" onmousedown="pick('${field}','${p.id}')"><div class="sic">${p.ic}</div><div><div class="snm">${p.name}</div><div class="stp">${p.area}</div></div></div>`).join('')}</div>`;
  } else {
    for(const[grp,items]of Object.entries(groups)){
      if(!items.length) continue;
      html+=`<div class="sg"><div class="slbl">${grp}</div>${items.map(p=>`<div class="sit" onmousedown="pick('${field}','${p.id}')"><div class="sic">${p.ic}</div><div><div class="snm">${hl(p.name,ql)}</div><div class="stp">${p.type} · ${p.area}</div></div></div>`).join('')}</div>`;
    }
  }
  if(!html){el.classList.remove('open');return;}
  el.innerHTML=html;el.classList.add('open');
  // Instant route preview
  if(field==='dt'&&S.or&&ql.length>1&&matches.length){
    S.dt=matches[0];S.selR=0;panTo();renderPanel();
  }
}
function hl(tx,q){
  if(!q)return tx;const i=tx.toLowerCase().indexOf(q);if(i<0)return tx;
  return tx.slice(0,i)+`<strong style="color:var(--ac)">${tx.slice(i,i+q.length)}</strong>`+tx.slice(i+q.length);
}
function closeD(id){setTimeout(()=>{const e=document.getElementById(id);if(e)e.classList.remove('open');},180);}
function pick(field,id){
  const p=PLACES.find(x=>x.id===id);if(!p)return;
  if(field==='or'){S.or=p;document.getElementById('orIn').value=p.name;}
  else{S.dt=p;document.getElementById('dtIn').value=p.name;document.getElementById('dtD').classList.remove('open');}
  S.selR=0;panTo();renderPanel();updateMapUI();
}
function clearDest(){S.dt=null;document.getElementById('dtIn').value='';document.getElementById('clrBtn').style.display='none';S.highlightCongs=[];renderPanel();}
function swapLocs(){[S.or,S.dt]=[S.dt,S.or];document.getElementById('orIn').value=S.or?.name||'';document.getElementById('dtIn').value=S.dt?.name||'';S.selR=0;panTo();renderPanel();}

// ════════════════════════════════════════════════
// GEOLOCATION
// ════════════════════════════════════════════════
function requestGeo(){
  document.getElementById('geoScr').style.display='none';
  if(!navigator.geolocation){skipGeo();return;}
  navigator.geolocation.getCurrentPosition(
    pos=>{
      S.geoLat=pos.coords.latitude;S.geoLng=pos.coords.longitude;
      const c=g2c(S.geoLat,S.geoLng);
      S.or={id:'cur',name:'My Current Location',type:'Current',ic:'📍',lat:S.geoLat,lng:S.geoLng,x:c.x,y:c.y,area:'Jakarta'};
      document.getElementById('orIn').value='📍 My Current Location';
      showToast('📍 Location detected');
      panToPoint(c.x,c.y,1.3);renderPanel();
    },
    ()=>{useDefaultLoc();showToast('📍 Using Jakarta city center');},
    {timeout:8000,enableHighAccuracy:true}
  );
}
function skipGeo(){document.getElementById('geoScr').style.display='none';useDefaultLoc();}
function useDefaultLoc(){
  const lat=-6.2007,lng=106.823;const c=g2c(lat,lng);
  S.or={id:'cur',name:'Jakarta City Center',type:'Current',ic:'📍',lat,lng,x:c.x,y:c.y,area:'Jakarta'};
  document.getElementById('orIn').value='📍 Jakarta City Center';
  renderPanel();
}
function useGeo(){if(S.geoLat){const c=g2c(S.geoLat,S.geoLng);S.or={id:'cur',name:'My Current Location',type:'Current',ic:'📍',lat:S.geoLat,lng:S.geoLng,x:c.x,y:c.y,area:'Jakarta'};document.getElementById('orIn').value='📍 My Current Location';panToPoint(c.x,c.y,1.3);renderPanel();}else requestGeo();}

// ════════════════════════════════════════════════
// PAN / ZOOM
// ════════════════════════════════════════════════
function panTo(){
  if(!S.or||!S.dt)return;
  const d=Math.hypot(S.or.x-S.dt.x,S.or.y-S.dt.y);
  S.zoom=Math.max(.42,Math.min(2.5,95/d));
  S.px=0;S.py=0;
  const s=ts((S.or.x+S.dt.x)/2,(S.or.y+S.dt.y)/2);
  S.px+=W()/2-s.x;S.py+=H()/2-s.y;
}
function panToPoint(wx,wy,z){S.zoom=z||1;S.px=0;S.py=0;const s=ts(wx,wy);S.px+=W()/2-s.x;S.py+=H()/2-s.y;}
function zoom(d){S.zoom=Math.max(.26,Math.min(3.6,S.zoom+d));}
function resetV(){S.zoom=1;S.px=0;S.py=0;if(S.or&&S.dt)panTo();}

// ════════════════════════════════════════════════
// CONTROLS
// ════════════════════════════════════════════════
function setMode(m){
  S.mode=m;S.selR=0;
  document.querySelectorAll('.mt').forEach(b=>b.classList.remove('active'));
  document.getElementById('m-'+m).classList.add('active');
  if(m==='ojek'&&S.or&&S.dt)showModal();
  updateMapUI();renderPanel();
}
function setSrt(s){
  S.sort=s;S.selR=0;
  document.querySelectorAll('.sc').forEach(c=>c.classList.remove('active'));
  document.querySelector('[data-s="'+s+'"]').classList.add('active');
  renderPanel();
}
function selR(i){S.selR=i;renderPanel();}

// ════════════════════════════════════════════════
// APP MODAL — reliable deep links
// ════════════════════════════════════════════════
function showModal(){document.getElementById('appModal').classList.add('show');}
function closeModal(){document.getElementById('appModal').classList.remove('show');}
function openApp(app){
  closeModal();
  const dest=encodeURIComponent(S.dt?.name||'');
  const lat=S.dt?.lat||-6.21,lng=S.dt?.lng||106.823;
  if(app==='grab'){
    showToast('🟢 Opening Grab…');
    // Universal link works on both mobile & desktop
    const ua=navigator.userAgent.toLowerCase();
    if(/android/.test(ua)){
      window.location.href=`grab://open?type=1&destination=${dest}`;
      setTimeout(()=>window.open('https://play.google.com/store/apps/details?id=com.grabtaxi.passenger','_blank'),1500);
    } else if(/iphone|ipad/.test(ua)){
      window.location.href=`grab://open?type=1&destination=${dest}`;
      setTimeout(()=>window.open('https://apps.apple.com/id/app/grab/id647268330','_blank'),1500);
    } else {
      window.open(`https://www.grab.com/id/?destination=${dest}&dlat=${lat}&dlng=${lng}`,'_blank');
    }
  } else {
    showToast('🟢 Opening Gojek…');
    const ua=navigator.userAgent.toLowerCase();
    if(/android/.test(ua)){
      window.location.href=`gojek://open?destination=${dest}`;
      setTimeout(()=>window.open('https://play.google.com/store/apps/details?id=com.gojek.app','_blank'),1500);
    } else if(/iphone|ipad/.test(ua)){
      window.location.href=`gojek://open?destination=${dest}`;
      setTimeout(()=>window.open('https://apps.apple.com/id/app/gojek/id944875099','_blank'),1500);
    } else {
      window.open(`https://www.gojek.com/id/?destination=${dest}`,'_blank');
    }
  }
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),3200);}

// ════════════════════════════════════════════════
// MAP EVENTS
// ════════════════════════════════════════════════
cv.addEventListener('mousedown',e=>{S.drag=false;S.lm={x:e.clientX,y:e.clientY};});
cv.addEventListener('mousemove',e=>{
  if(S.lm){const dx=e.clientX-S.lm.x,dy=e.clientY-S.lm.y;
    if(Math.abs(dx)+Math.abs(dy)>4){S.drag=true;S.px+=dx;S.py+=dy;S.lm={x:e.clientX,y:e.clientY};}}
  const r=cv.getBoundingClientRect();hoverChk(e.clientX-r.left,e.clientY-r.top);
});
cv.addEventListener('mouseup',e=>{S.lm=null;if(S.drag){S.drag=false;return;}const r=cv.getBoundingClientRect();mapClk(tw(e.clientX-r.left,e.clientY-r.top));});
cv.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?-.13:.13);},{passive:false});
cv.addEventListener('touchstart',e=>{const t=e.touches[0];S.lm={x:t.clientX,y:t.clientY};S.drag=false;});
cv.addEventListener('touchmove',e=>{e.preventDefault();const t=e.touches[0];if(S.lm){S.px+=t.clientX-S.lm.x;S.py+=t.clientY-S.lm.y;S.lm={x:t.clientX,y:t.clientY};S.drag=true;}},{passive:false});
cv.addEventListener('touchend',e=>{if(!S.drag){const t=e.changedTouches[0];const r=cv.getBoundingClientRect();mapClk(tw(t.clientX-r.left,t.clientY-r.top));}S.lm=null;S.drag=false;});

function mapClk(w){
  let nearest=null,nd=Infinity;
  for(const p of PLACES){const d=Math.hypot(p.x-w.x,p.y-w.y);if(d<22&&d<nd){nd=d;nearest=p;}}
  for(const line of ALL_MRT)for(const s of line.st){
    const d=Math.hypot(s.x-w.x,s.y-w.y);
    if(d<16&&d<nd){nd=d;nearest={id:'mrt_'+s.id,name:s.nm,type:'MRT Station',ic:'🚇',lat:s.lat,lng:s.lng,x:s.x,y:s.y,area:'Jakarta'};}
  }
  if(nearest){
    if(!S.or){S.or=nearest;document.getElementById('orIn').value=nearest.name;}
    else{S.dt=nearest;document.getElementById('dtIn').value=nearest.name;panTo();}
    S.selR=0;renderPanel();updateMapUI();
  }
}
function hoverChk(sx,sy){
  const pop=document.getElementById('hpop');let found=null;
  for(const p of PLACES){if(p.type==='MRT Station')continue;const s=ts(p.x,p.y);if(Math.hypot(sx-s.x,sy-s.y)<12)found=p;}
  for(const l of ALL_MRT)for(const s of l.st){const p=ts(s.x,s.y);if(Math.hypot(sx-p.x,sy-p.y)<11)found={name:s.nm,type:l.name,ic:'🚇'};}
  if(found){
    pop.classList.remove('off');pop.style.left=(sx+14)+'px';pop.style.top=(sy-8)+'px';
    document.getElementById('hpn').textContent=(found.ic||'📍')+' '+found.name;
    document.getElementById('hpt').textContent=found.type+(found.area?' · '+found.area:'');
    cv.style.cursor='pointer';
  } else{pop.classList.add('off');cv.style.cursor=S.lm?'grabbing':'grab';}
}

// ════════════════════════════════════════════════
// TIME & REFRESH
// ════════════════════════════════════════════════
function updateTime(){
  const now=new Date(),h=now.getHours(),m=String(now.getMinutes()).padStart(2,'0');
  document.getElementById('tchip').textContent=`${h}:${m} WIB${isPeak()?' · 🟠 Peak':''}`;
}
setInterval(updateTime,10000);updateTime();
setInterval(()=>{S.cong=getCong();},90000);

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
draw();

/* ===== */

// Global navigation function - called by links in both pages
function navigate(page) {
  var dash = document.getElementById('page-dashboard');
  var plan = document.getElementById('page-planner');
  if (page === 'planner') {
    dash.style.display = 'none';
    plan.style.display = 'block';
    history.pushState({page:'planner'}, '', '#planner');
    // Re-trigger planner init if needed
    var mc = document.querySelector('#page-planner canvas#mc');
    if (mc && window._plannerDraw) window._plannerDraw();
  } else {
    plan.style.display = 'none';
    dash.style.display = 'block';
    history.pushState({page:'dashboard'}, '', '#');
  }
}
window.addEventListener('popstate', function(e) {
  var page = (e.state && e.state.page) || (location.hash === '#planner' ? 'planner' : 'dashboard');
  navigate(page);
});
// Initial route
if (location.hash === '#planner') navigate('planner');