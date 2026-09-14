// Shared video data for the watch page.
// Each entry: title, channel, initial (avatar letter), yt (real YouTube video id
// used both to embed the player and to fetch a matching thumbnail),
// views (e.g. "120K views"), uploaded (e.g. "2 hours ago"), subs, description.

const VIDEOS = {
  // "Franchise" videos shared across channel/history/search/subscriptions/watch
  v01: { title: "My New Video You Don't Want to Miss", channel: "Creator One", initial: "C", yt: "aqz-KE-bpKQ", views: "120K views", uploaded: "2 hours ago", subs: "500K subscribers", description: "This is the description for the video. Welcome to the channel! Don't forget to like, share and subscribe for more videos." },
  v02: { title: "Everything You Need to Know", channel: "Creator Two", initial: "C", yt: "H14bBuluwB8", views: "85K views", uploaded: "5 hours ago", subs: "300K subscribers", description: "Here is everything you need to know about this interesting topic." },
  v03: { title: "A Day in My Life", channel: "Creator Three", initial: "C", yt: "aqz-KE-bpKQ", views: "210K views", uploaded: "1 day ago", subs: "700K subscribers", description: "Come along with me as I show you what a typical day in my life looks like." },
  v04: { title: "Things I Wish I Knew Earlier", channel: "Creator Four", initial: "C", yt: "H14bBuluwB8", views: "340K views", uploaded: "1 day ago", subs: "450K subscribers", description: "These are some important lessons that I wish I had learned earlier." },
  v05: { title: "Testing Viral Internet Hacks", channel: "Creator Five", initial: "C", yt: "_OBlgSz8sSM", views: "560K views", uploaded: "2 days ago", subs: "900K subscribers", description: "Today we are testing some of the most popular internet hacks." },
  v06: { title: "Our Biggest Adventure Yet", channel: "Creator Six", initial: "C", yt: "aqz-KE-bpKQ", views: "190K views", uploaded: "3 days ago", subs: "620K subscribers", description: "Join us on our biggest adventure yet, full of surprises along the way." },

  // Home feed (index.html)
  v07: { title: "How to Build a Website from Scratch", channel: "CodeWithKase", initial: "K", yt: "mU6anWqZJcc", views: "125K views", uploaded: "2 days ago", subs: "410K subscribers", description: "A beginner-friendly walkthrough on building a website from the ground up." },
  v08: { title: "The Future of Technology", channel: "TechTalks", initial: "T", yt: "mU6anWqZJcc", views: "342K views", uploaded: "4 days ago", subs: "1.2M subscribers", description: "Exploring what the next decade of technology might look like." },
  v09: { title: "Study Tips Every Student Should Know", channel: "Student Success", initial: "S", yt: "H14bBuluwB8", views: "510K views", uploaded: "6 days ago", subs: "890K subscribers", description: "Practical study tips to help you retain more and stress less." },
  v10: { title: "Easy Nigerian Recipes You Need to Try", channel: "Foodie Nigeria", initial: "F", yt: "_Wk8wb9-6JI", views: "278K views", uploaded: "1 week ago", subs: "670K subscribers", description: "Simple, delicious Nigerian recipes you can make at home." },
  v11: { title: "Beginner Friendly Web Development Tutorial", channel: "Code Academy", initial: "C", yt: "mU6anWqZJcc", views: "195K views", uploaded: "1 week ago", subs: "520K subscribers", description: "Start your web development journey with this beginner tutorial." },
  v12: { title: "How to Get First Class in University", channel: "Academic Success", initial: "A", yt: "H14bBuluwB8", views: "412K views", uploaded: "1 week ago", subs: "980K subscribers", description: "Study strategies and habits that can help you graduate with first class." },
  v13: { title: "10 Movies You Should Watch This Year", channel: "Movie Buzz", initial: "M", yt: "aqz-KE-bpKQ", views: "236K views", uploaded: "2 weeks ago", subs: "760K subscribers", description: "Our picks for the ten best movies to watch this year." },
  v14: { title: "Full Body Home Workout", channel: "Fit With Tina", initial: "W", yt: "uZbig5yMlN8", views: "318K views", uploaded: "2 weeks ago", subs: "1.1M subscribers", description: "A full body workout you can do at home with no equipment." },
  v15: { title: "How to Manage Your Money as a Student", channel: "Finance Simplified", initial: "F", yt: "H14bBuluwB8", views: "167K views", uploaded: "2 weeks ago", subs: "430K subscribers", description: "Simple budgeting tips to help students manage money better." },
  v16: { title: "The Power of Self Discipline", channel: "Mindset Matters", initial: "M", yt: "H14bBuluwB8", views: "289K views", uploaded: "3 weeks ago", subs: "710K subscribers", description: "Why self discipline matters more than motivation, and how to build it." },

  // Trending
  v17: { title: "This Broke the Internet Overnight", channel: "Viral Now", initial: "V", yt: "_OBlgSz8sSM", views: "3.2M views", uploaded: "6 hours ago", subs: "2.1M subscribers", description: "The story everyone is talking about right now." },
  v18: { title: "Everyone Is Talking About This", channel: "Daily Buzz", initial: "D", yt: "OPf0YbXqDm0", views: "2.8M views", uploaded: "10 hours ago", subs: "1.8M subscribers", description: "A closer look at today's biggest talking point." },
  v19: { title: "The Biggest Announcement This Week", channel: "News Wave", initial: "N", yt: "H14bBuluwB8", views: "2.1M views", uploaded: "12 hours ago", subs: "3.4M subscribers", description: "Breaking down the week's biggest announcement." },
  v20: { title: "You Need to See This Right Now", channel: "Trend Central", initial: "T", yt: "aqz-KE-bpKQ", views: "1.9M views", uploaded: "1 day ago", subs: "990K subscribers", description: "This is spreading fast — here's why everyone's watching." },
  v21: { title: "The Internet Can't Stop Watching This", channel: "Viral Now", initial: "V", yt: "_OBlgSz8sSM", views: "1.7M views", uploaded: "1 day ago", subs: "2.1M subscribers", description: "Another moment that has the internet hooked." },
  v22: { title: "Top Story of the Day", channel: "News Wave", initial: "N", yt: "H14bBuluwB8", views: "1.4M views", uploaded: "2 days ago", subs: "3.4M subscribers", description: "Today's top story, explained." },

  // Music
  v23: { title: "New Single - Official Music Video", channel: "Amara Sound", initial: "A", yt: "OPf0YbXqDm0", views: "4.5M views", uploaded: "3 days ago", subs: "5.2M subscribers", description: "The official music video for the new single." },
  v24: { title: "Live from the Studio Session", channel: "Amara Sound", initial: "A", yt: "OPf0YbXqDm0", views: "890K views", uploaded: "1 week ago", subs: "5.2M subscribers", description: "An intimate live session recorded in the studio." },
  v25: { title: "Top Afrobeats Hits Playlist 2026", channel: "Naija Vibes", initial: "N", yt: "OPf0YbXqDm0", views: "2.3M views", uploaded: "2 weeks ago", subs: "3.1M subscribers", description: "The biggest Afrobeats hits of the year, all in one playlist." },
  v26: { title: "Acoustic Cover - Fan Favorite", channel: "Melody Lane", initial: "M", yt: "OPf0YbXqDm0", views: "670K views", uploaded: "3 weeks ago", subs: "980K subscribers", description: "A stripped-back acoustic cover of a fan favorite track." },
  v27: { title: "Behind the Beat: Making the Track", channel: "Amara Sound", initial: "A", yt: "OPf0YbXqDm0", views: "410K views", uploaded: "1 month ago", subs: "5.2M subscribers", description: "A behind-the-scenes look at how the track came together." },
  v28: { title: "Lyrics Video - New Release", channel: "Naija Vibes", initial: "N", yt: "OPf0YbXqDm0", views: "1.1M views", uploaded: "1 month ago", subs: "3.1M subscribers", description: "The official lyrics video for the new release." },

  // Gaming
  v29: { title: "Ranked Grind to Diamond - Full Session", channel: "ProGamer NG", initial: "P", yt: "cT8w3WOzlso", views: "780K views", uploaded: "1 day ago", subs: "1.4M subscribers", description: "A full ranked session grinding to Diamond." },
  v30: { title: "New Game Release First Impressions", channel: "GameSpotlight", initial: "G", yt: "cT8w3WOzlso", views: "540K views", uploaded: "2 days ago", subs: "2.0M subscribers", description: "First impressions on this week's biggest game release." },
  v31: { title: "Insane Clutch Moments Compilation", channel: "ProGamer NG", initial: "P", yt: "cT8w3WOzlso", views: "1.6M views", uploaded: "4 days ago", subs: "1.4M subscribers", description: "The most insane clutch plays from the last month." },
  v32: { title: "Speedrunning World Record Attempt", channel: "SpeedKing", initial: "S", yt: "cT8w3WOzlso", views: "920K views", uploaded: "1 week ago", subs: "760K subscribers", description: "Attempting to break the current world record live." },
  v33: { title: "Top 10 Games to Play This Year", channel: "GameSpotlight", initial: "G", yt: "cT8w3WOzlso", views: "650K views", uploaded: "1 week ago", subs: "2.0M subscribers", description: "Our picks for the ten best games to play this year." },
  v34: { title: "Co-op Chaos with Friends", channel: "SquadPlays", initial: "S", yt: "cT8w3WOzlso", views: "430K views", uploaded: "2 weeks ago", subs: "540K subscribers", description: "Chaotic co-op gameplay with the squad." },

  // Sports
  v35: { title: "Match Highlights: Weekend Recap", channel: "SportsCenter NG", initial: "S", yt: "wz1r_VJaJZw", views: "980K views", uploaded: "8 hours ago", subs: "2.3M subscribers", description: "All the highlights from the weekend's matches." },
  v36: { title: "Top 10 Goals of the Season", channel: "Football Weekly", initial: "F", yt: "wz1r_VJaJZw", views: "1.3M views", uploaded: "1 day ago", subs: "1.9M subscribers", description: "Counting down the best ten goals of the season so far." },
  v37: { title: "Post-Match Press Conference", channel: "SportsCenter NG", initial: "S", yt: "wz1r_VJaJZw", views: "310K views", uploaded: "1 day ago", subs: "2.3M subscribers", description: "The full post-match press conference." },
  v38: { title: "Training Ground Exclusive", channel: "Athlete Life", initial: "A", yt: "wz1r_VJaJZw", views: "255K views", uploaded: "3 days ago", subs: "870K subscribers", description: "Exclusive access to the training ground ahead of the big match." },
  v39: { title: "Championship Final Full Highlights", channel: "Football Weekly", initial: "F", yt: "wz1r_VJaJZw", views: "2.0M views", uploaded: "5 days ago", subs: "1.9M subscribers", description: "Full highlights from the championship final." },
  v40: { title: "Athlete Interview: Road to the Title", channel: "Athlete Life", initial: "A", yt: "wz1r_VJaJZw", views: "410K views", uploaded: "1 week ago", subs: "870K subscribers", description: "An exclusive interview on the road to the title." },

  // Your videos
  v41: { title: "My Studio Setup Tour 2026", channel: "Your Channel", initial: "Y", yt: "aqz-KE-bpKQ", views: "45K views", uploaded: "3 days ago", subs: "500K subscribers", description: "A tour of my current studio and recording setup." },
  v42: { title: "Q&A: Answering Your Questions", channel: "Your Channel", initial: "Y", yt: "H14bBuluwB8", views: "62K views", uploaded: "1 week ago", subs: "500K subscribers", description: "Answering the questions you sent in over the last month." },
  v43: { title: "Behind the Scenes of My Last Shoot", channel: "Your Channel", initial: "Y", yt: "aqz-KE-bpKQ", views: "38K views", uploaded: "2 weeks ago", subs: "500K subscribers", description: "A behind-the-scenes look at how the last video was made." },
  v44: { title: "My Editing Workflow Explained", channel: "Your Channel", initial: "Y", yt: "mU6anWqZJcc", views: "51K views", uploaded: "3 weeks ago", subs: "500K subscribers", description: "Walking through my full editing workflow, start to finish." },
  v45: { title: "Reacting to My First Ever Video", channel: "Your Channel", initial: "Y", yt: "_OBlgSz8sSM", views: "97K views", uploaded: "1 month ago", subs: "500K subscribers", description: "Reacting to the very first video I ever uploaded." },
  v46: { title: "How I Plan My Content Calendar", channel: "Your Channel", initial: "Y", yt: "H14bBuluwB8", views: "29K views", uploaded: "1 month ago", subs: "500K subscribers", description: "How I plan, batch and schedule content each month." },

  // Shorts (index.html home feed)
  s01: { title: "Study motivation", channel: "StudyDaily", initial: "S", yt: "H14bBuluwB8", views: "1.2M views", uploaded: "1 day ago", subs: "410K subscribers", description: "Quick motivation to get through your next study session." },
  s02: { title: "Web development tips", channel: "DevBytes", initial: "D", yt: "mU6anWqZJcc", views: "850K views", uploaded: "2 days ago", subs: "320K subscribers", description: "A quick web development tip you can use today." },
  s03: { title: "Funny student moments", channel: "CampusLaughs", initial: "C", yt: "_OBlgSz8sSM", views: "2.1M views", uploaded: "3 days ago", subs: "1.1M subscribers", description: "Relatable, funny moments from student life." },
  s04: { title: "Quick cooking recipe", channel: "QuickBites", initial: "Q", yt: "_Wk8wb9-6JI", views: "760K views", uploaded: "4 days ago", subs: "540K subscribers", description: "A quick recipe you can make in minutes." },
  s05: { title: "Programming hack", channel: "CodeHacks", initial: "C", yt: "mU6anWqZJcc", views: "540K views", uploaded: "5 days ago", subs: "290K subscribers", description: "A small programming trick that saves real time." },

  // Shorts (shorts.html)
  s06: { title: "Funny moments you need to see \uD83D\uDE02", channel: "CreatorOne", initial: "C", yt: "_OBlgSz8sSM", views: "1.2M views", uploaded: "1 day ago", subs: "500K subscribers", description: "Some of the funniest moments from this week." },
  s07: { title: "This was actually amazing \uD83E\uDD2F", channel: "CreatorTwo", initial: "C", yt: "aqz-KE-bpKQ", views: "850K views", uploaded: "2 days ago", subs: "300K subscribers", description: "This genuinely surprised everyone who watched it." },
  s08: { title: "You won't believe what happened \uD83D\uDE2D", channel: "CreatorThree", initial: "C", yt: "_OBlgSz8sSM", views: "2.4M views", uploaded: "3 days ago", subs: "700K subscribers", description: "Nobody expected this to happen." },
  s09: { title: "Try this challenge with your friends", channel: "CreatorFour", initial: "C", yt: "OPf0YbXqDm0", views: "640K views", uploaded: "4 days ago", subs: "450K subscribers", description: "A fun challenge to try with your friends." },
  s10: { title: "POV: Your friend does this", channel: "CreatorFive", initial: "C", yt: "aqz-KE-bpKQ", views: "1.8M views", uploaded: "5 days ago", subs: "900K subscribers", description: "A relatable POV everyone will recognize." },
  s11: { title: "Wait until the end \uD83D\uDC40", channel: "CreatorSix", initial: "C", yt: "_OBlgSz8sSM", views: "920K views", uploaded: "6 days ago", subs: "620K subscribers", description: "Stick around — the ending is worth it." },
};

const DEFAULT_VIDEO_ID = "v01";
