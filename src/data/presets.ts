import type { PresetProfile } from '../types';

// Pre-defined fallback/mock profiles for quick play.
// Guarantees a great experience even without API access or when GitHub rate limit is hit.
export const PRESET_PROFILES: Record<string, PresetProfile> = {
  torvalds: {
    profile: {
      login: "torvalds",
      name: "Linus Torvalds",
      bio: "I do not write code. I verbally abuse people until they write better code.",
      public_repos: 6,
      followers: 215000,
      following: 0,
      company: "The Linux Foundation",
      location: "Portland, OR",
      blog: "https://kernel.org",
      avatar_url: "https://avatars.githubusercontent.com/u/1024?v=4",
      created_at: "2011-09-03T15:26:54Z"
    },
    repos: [
      { name: "linux", description: "Linux kernel source tree", language: "C", stargazers_count: 178000, forks_count: 53000 },
      { name: "git", description: "Git Source Code - the stupid content tracker", language: "C", stargazers_count: 52000, forks_count: 27000 },
      { name: "subsurface-dive-log", description: "Subsurface divelog desktop application", language: "C++", stargazers_count: 1800, forks_count: 650 }
    ],
    mockRoastEn: {
      developerTitle: "The Arch-Deity of Verbal Indentations",
      statsRoast: "215,000 followers and following 0 people. Your social ratio is as cold as an unpushed git commit on Thanksgiving dinner.",
      bioRoast: "Your bio is basically 'Submit a clean patch or get called a redundant biological error'. Honestly, valid.",
      reposRoast: "You wrote 'linux' and 'git' literally just so you wouldn't have to deal with CVS or humans. Still, write more C tree parsers, we dare you.",
      theMainRoast: "Creator of Git but probably still uses manual shell aliases to force pull from your own storage closets. You literally built Git because you hated BitKeeper so much, demonstrating that the entire software industry is driven purely by spite. It's admirable, really, but we all know you haven't written a single line of React and your CSS skills are restricted to choosing a terminal font color.",
      roastedTags: ["#SpiteDrivenDevelopment", "#RedundantBiologicalError", "#CIsTheOnlyLanguage", "#GitGud"],
      burnScore: 99
    },
    mockRoastId: {
      developerTitle: "Suhu Tertinggi Penentang Indentasi",
      statsRoast: "Follower 215 ribu tapi following bulat-bulat 0. Lu bener-bener sepuh penentang interaksi sosial atau lupa password feed?",
      bioRoast: "Bio lu intinya 'Gua gak nulis kode, gua cuma marahin Kontributor biar pinter'. Galak amat mastah.",
      reposRoast: "Lu nulis 'linux' sama 'git' cuma karena mager pakai tools bikinan orang lain. Coba bikin responsive CSS flexbox dulu baru kita akui puh.",
      theMainRoast: "Pembuat Git tapi mungkin masih pakai alias bash manual buat maksa pull dari server sendiri. Lu bikin Git murni karena dendam kesumat sama BitKeeper, ngebuktiin kalau pendorong utama inovasi software adalah rasa malas berinteraksi sama manusia. Keren dan legendaris sih, tapi kami tahu lu gak pernah bikin config css tailwind.",
      roastedTags: ["#SekteBahasaC", "#DendamKreatif", "#SepuhKodingan", "#AntiSosialArtisan"],
      burnScore: 99
    }
  },
  gaearon: {
    profile: {
      login: "gaearon",
      name: "Dan Abramov",
      bio: "I wrote Redux, now please stop asking me about state management. I am busy making React more complicated.",
      public_repos: 284,
      followers: 86400,
      following: 15,
      company: "Originally Facebook, now floating in RSCs",
      location: "London, UK",
      blog: "https://overreacted.io",
      avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4",
      created_at: "2011-05-25T17:21:00Z"
    },
    repos: [
      { name: "redux", description: "Predictable state container for JavaScript apps", language: "JavaScript", stargazers_count: 60500, forks_count: 15500 },
      { name: "react-hot-loader", description: "Tweak React components in real time", language: "JavaScript", stargazers_count: 12500, forks_count: 950 },
      { name: "overreacted.io", description: "My personal blog where I overcomplicate simple web logic", language: "TypeScript", stargazers_count: 4200, forks_count: 320 }
    ],
    mockRoastEn: {
      developerTitle: "The Master of State-Management Trauma",
      statsRoast: "Over 86,000 followers who are all still trying to figure out why they had to write 9 boilerplate files just to toggle a light-theme checkbox in Redux.",
      bioRoast: "You built Redux, realized what you unleashed upon humanity, wrote a blog post saying 'it's okay not to use it', and fled to build React Server Components just to confuse us more.",
      reposRoast: "Your repository directory is a temple of abstract JS patterns that became obsolete immediately after the next Minor React version release.",
      theMainRoast: "You got hired by Meta because you wrote a state library that single-handedly generated 80% of all StackOverflow traffic between 2016 and 2021. You became a web development philosopher on 'overreacted.io', writing extremely poetic guides on why hooks work, while junior developers in tutorial hell just wanted to know how to pass a prop.",
      roastedTags: ["#BoilerplateSlinger", "#TheReactProphecy", "#OverreactedOverengineered", "#ReducerRegrets"],
      burnScore: 96
    },
    mockRoastId: {
      developerTitle: "Sesepuh Redux Pembuat Pusing Pemula",
      statsRoast: "Pengikut 86 ribu orang di mana semuanya masih bingung kenapa harus bikin 9 boilerplate file cuma buat ganti true-false state.",
      bioRoast: "Bikin Redux, setelah sadar seberapa ribet itu langsung bikin post 'gapapa gak usah pakai Redux', terus kabur ke React Server Components biar semuanya tambah pusing.",
      reposRoast: "Kumpulan repository lu adalah kuil arsitektur kodingan JS abstrak yang usang dalam 3 bulan begitu versi React minor baru keluar.",
      theMainRoast: "Diterima kerja di Facebook karena bikin library state management yang sendirian nyumbang 80% traffic StackOverflow dari tahun 2016 sampai 2021. Terkenal banget di overreacted.io nulis puisi indah tentang kenapa Hooks berguna, padahal junior di tutorial hell cuma pengen tahu cara passing props tanpa error.",
      roastedTags: ["#SesepuhRedux", "#BoilerplateArtisan", "#ReactMakinRibet", "#SuhuProps"],
      burnScore: 96
    }
  },
  dhh: {
    profile: {
      login: "dhh",
      name: "DHH (David Heinemeier Hansson)",
      bio: "Creator of Ruby on Rails, co-owner of 37signals, racing driver, and standard provider of hot opinions since 2004.",
      public_repos: 42,
      followers: 21200,
      following: 0,
      company: "37signals / Basecamp",
      location: "Malibu, CA",
      blog: "https://dhh.dk",
      avatar_url: "https://avatars.githubusercontent.com/u/274?v=4",
      created_at: "2008-01-22T19:26:00Z"
    },
    repos: [
      { name: "rails", description: "Ruby on Rails - web development that doesn't hurt", language: "Ruby", stargazers_count: 55000, forks_count: 21000 },
      { name: "kinsta-speed-tests", description: "Speed benchmarking designed to make Node look bad", language: "Ruby", stargazers_count: 220, forks_count: 18 }
    ],
    mockRoastEn: {
      developerTitle: "The Monolith Crusader & Malibu Philosopher",
      statsRoast: "21,200 followers and following EXACTLY zero developers. Your feed is a carefully engineered echo chamber of Malibu racing-laps and CSS-free web declarations.",
      bioRoast: "Your bio boasts 'Ruby on Rails' and 'Opinion Provider' as if they aren't the same exact thing. Your Rails conventions are so opinionated they are practically legally binding.",
      reposRoast: "Your repos are essentially a historical museum of C-level basecamp assets and Ruby scripts that look beautiful but run at the speed of a loaded tricycle.",
      theMainRoast: "You spent the last decade wage-warring against Kubernetes, Microservices, and SPA frameworks as if single-page apps personally stole your racing helmet. You wrote Rails to build blog engines in 15 minutes, but now your developers spend 15 days trying to figure out why ActionText is loading an entire document editor because of a typo in an active record hook.",
      roastedTags: ["#OpinionsAsDependencies", "#NoKubernetesAllowed", "#MonolithWorshipper", "#RubySpeedLimit"],
      burnScore: 97
    },
    mockRoastId: {
      developerTitle: "Filsuf Monolith & Musuh Abadi Kubernetes",
      statsRoast: "21 ribu pengikut dan following EXACTLY 0 orang. Feed isi pamer mobil balap Malibu sama ngetawain framework SPA JS.",
      bioRoast: "Di bio bangga banget nulis 'Opinion Provider'. Rails bikinan lu emang kaku banget seleranya kayak bapak-bapak komplek.",
      reposRoast: "Repomu isinya rujukan masa lalu berisi kode Ruby yang aesthetic tapi lemotnya kayak koneksi internet Edge pas hujan badai.",
      theMainRoast: "Lu kerjaannya perang di medsos nuntut orang balik ke Monolith nolak microservices seolah-olah SPA merampok dompet lu di jalan. Bikin Rails biar nulis web gampang, tapi kalau ada bug di Active Record asosiasi, developer lu butuh berminggu-minggu buat nyari letak typo query.",
      roastedTags: ["#SekolahMonolith", "#SekteRubyOnRails", "#AntiSPA", "#MansionKoding"],
      burnScore: 97
    }
  },
  "juniordev-cliche": {
    profile: {
      login: "chad-dev-99",
      name: "Chad 'Hyper-Scalable' Junior",
      bio: "🚀 Tech Enthusiast | ☕ Coffee to Code Compiler | 💻 Seeking Senior Roles (No Internships please) | Future AI Multi-Trillionaire | 🤖 Prompt Engineering Master",
      public_repos: 12,
      followers: 4,
      following: 890,
      company: "Unemployed - Open for Remote C-level Roles",
      location: "San Francisco, CA (or anywhere with high speed coffee)",
      blog: "https://chad-portfolio.github.io",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      created_at: "2024-03-15T12:00:00Z"
    },
    repos: [
      { name: "todo-vite-tailwind", description: "A highly complex hyper-scalable interactive todo item application built over 4 sleepless nights", language: "CSS", stargazers_count: 1, forks_count: 0 },
      { name: "copypasted-portfolio-temp", description: "My custom personal homepage with floating particles that crashes iOS Safari on load", language: "HTML", stargazers_count: 2, forks_count: 1 },
      { name: "calculator-pro", description: "Calculates numbers. Currently only supports adding 2 + 2, subtraction coming in v2.4.0", language: "JavaScript", stargazers_count: 0, forks_count: 0 }
    ],
    mockRoastEn: {
      developerTitle: "The Caffeinated Template Stasher",
      statsRoast: "4 followers versus 890 following. Your follower acquisition rate is slower than installing node_modules via 2G mobile hotspot.",
      bioRoast: "You list 'Coffee to Code Compiler' in your bio as if caffeine is legally responsible for making your todo lists run inside Vite's local dev build.",
      reposRoast: "A todo list, a template portfolio that is 90% particle.js, and a calculator with a 3-month roadmap for standard subtraction. NASA is shaking in their boots.",
      theMainRoast: "You self-describe as a 'Prompt Engineering Master' which is a fancy term for searching 'why is my npm broken' inside ChatGPT. You refuse to take junior roles because you watched three 60-second TikTok videos about dropshipping and high-paying SaaS setups, yet you still push your `.env` secrets directly to main branch public repositories.",
      roastedTags: ["#TutorialLoopSurvivor", "#CoffeeToBugs", "#SaaSPretender", "#EnvironmentVariableLeaker"],
      burnScore: 98
    },
    mockRoastId: {
      developerTitle: "Suhu Koding Gaya Elit Koding Sulit",
      statsRoast: "Hanya 4 pengikut tapi following 890 orang. Ini akun Github profesional apa lagi arisan online kelompok magang?",
      bioRoast: "Bionya bangga nulis 'Coffee to Code Compiler' sama 'Seeking C-level Roles'. Gaya elit banget padahal bikin server express aja portnya masih tabrakan.",
      reposRoast: "Aplikasi Todo-list Vite, template portofolio kopas kelap-kelip, dan kalkulator pertambahan yang subtraction-nya baru rilis tahun depan. NASA langsung gundah gulana.",
      theMainRoast: "Ngaku 'Prompt Engineering Master' padahal aslinya lu cuma kopas error NPM ke ChatGPT tiap 2 menit sekali. Nolak kerjaan junior karena ngerasa pantes jadi CTO setelah liat video motivasi koding santai di TikTok, padahal file `.env` berisi API key rahasia lolos di commit master public.",
      roastedTags: ["#GayaElitKodingSulit", "#TutorialHellSurvivor", "#AnakMagangAmbisius", "#PushKeyRahasia"],
      burnScore: 98
    }
  }
};
