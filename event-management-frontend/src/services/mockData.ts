import { Event, PagedResponse } from "./event";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
  },
  {
    id: 2,
    name: "Emma Johnson",
    email: "emma.j@example.com",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
  },
];

// Helper to create dates relative to now
const createDate = (daysFromNow: number, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

// Sample image URLs for events
const eventImageSets = {
  tech: [
    {
      id: 1,
      imageUrl: "https://source.unsplash.com/random/800x600/?tech,conference",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?technology,digital",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      imageUrl: "https://source.unsplash.com/random/800x600/?innovation,future",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  art: [
    {
      id: 4,
      imageUrl: "https://source.unsplash.com/random/800x600/?art,gallery",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 5,
      imageUrl: "https://source.unsplash.com/random/800x600/?digital,artwork",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 6,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?exhibition,creative",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  wellness: [
    {
      id: 7,
      imageUrl: "https://source.unsplash.com/random/800x600/?wellness,yoga",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 8,
      imageUrl: "https://source.unsplash.com/random/800x600/?meditation,relax",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 9,
      imageUrl: "https://source.unsplash.com/random/800x600/?nature,retreat",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  business: [
    {
      id: 10,
      imageUrl: "https://source.unsplash.com/random/800x600/?business,meeting",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 11,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?entrepreneur,startup",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 12,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?office,professional",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  food: [
    {
      id: 13,
      imageUrl: "https://source.unsplash.com/random/800x600/?food,cooking",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 14,
      imageUrl: "https://source.unsplash.com/random/800x600/?chef,cuisine",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 15,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?gourmet,restaurant",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  fashion: [
    {
      id: 16,
      imageUrl: "https://source.unsplash.com/random/800x600/?fashion,style",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 17,
      imageUrl: "https://source.unsplash.com/random/800x600/?clothing,design",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 18,
      imageUrl: "https://source.unsplash.com/random/800x600/?model,runway",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  data: [
    {
      id: 19,
      imageUrl: "https://source.unsplash.com/random/800x600/?data,code",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 20,
      imageUrl: "https://source.unsplash.com/random/800x600/?ai,machine",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 21,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?computer,programming",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  photo: [
    {
      id: 22,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?camera,photography",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 23,
      imageUrl: "https://source.unsplash.com/random/800x600/?city,urban",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 24,
      imageUrl:
        "https://source.unsplash.com/random/800x600/?street,architecture",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  space: [
    {
      id: 25,
      imageUrl: "https://source.unsplash.com/random/800x600/?space,planet",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 26,
      imageUrl: "https://source.unsplash.com/random/800x600/?galaxy,stars",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 27,
      imageUrl: "https://source.unsplash.com/random/800x600/?astronaut,rocket",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
  gaming: [
    {
      id: 28,
      imageUrl: "https://source.unsplash.com/random/800x600/?gaming,vr",
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 29,
      imageUrl: "https://source.unsplash.com/random/800x600/?videogame,console",
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 30,
      imageUrl: "https://source.unsplash.com/random/800x600/?esports,player",
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
  ],
};

// Mock event data
export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Tech Innovation Summit 2025",
    description:
      "Join the most anticipated tech event of the year featuring keynotes from industry leaders, hands-on workshops, and groundbreaking product reveals. Network with innovators and stay ahead of the curve in AI, blockchain, and emerging technologies.",
    location: "Innovation Center, San Francisco",
    startTime: createDate(14),
    endTime: createDate(16),
    maxAttendees: 750,
    creator: mockUsers[0],
    registrationCount: 421,
    isFull: false,
    images: eventImageSets.tech,
  },
  {
    id: 2,
    title: "Digital Art & NFT Exhibition",
    description:
      "Experience the future of digital art in this immersive exhibition showcasing works from renowned digital artists and emerging talents. Live demonstrations, interactive installations, and panel discussions on NFTs and the evolving digital art landscape.",
    location: "Modern Art Gallery, New York",
    startTime: createDate(7),
    endTime: createDate(7, 8),
    maxAttendees: 300,
    creator: mockUsers[1],
    registrationCount: 189,
    isFull: false,
    images: eventImageSets.art,
  },
  {
    id: 3,
    title: "Wellness & Mindfulness Retreat",
    description:
      "Escape the digital world and reconnect with yourself in this three-day retreat focused on mindfulness, meditation, yoga, and holistic wellness practices. Expert-led sessions, nutritious meals, and natural surroundings to restore balance.",
    location: "Serenity Gardens, Malibu",
    startTime: createDate(21),
    endTime: createDate(23),
    maxAttendees: 50,
    creator: mockUsers[2],
    registrationCount: 50,
    isFull: true,
    images: eventImageSets.wellness,
  },
  {
    id: 4,
    title: "Global Entrepreneurship Workshop",
    description:
      "Accelerate your startup journey with this intensive workshop covering business model development, funding strategies, scaling operations, and global market entry. Connect with investors, mentors, and fellow entrepreneurs.",
    location: "Business Hub, London",
    startTime: createDate(10),
    endTime: createDate(11),
    maxAttendees: 200,
    creator: mockUsers[0],
    registrationCount: 178,
    isFull: false,
    images: eventImageSets.business,
  },
  {
    id: 5,
    title: "Culinary Masterclass: World Fusion",
    description:
      "Elevate your cooking skills with this hands-on masterclass led by renowned chef Maria Rodriguez. Learn innovative techniques for combining flavors from different cuisines to create spectacular fusion dishes that will impress any dinner guest.",
    location: "Gourmet Kitchen Studio, Chicago",
    startTime: createDate(5),
    endTime: createDate(5, 5),
    maxAttendees: 30,
    creator: mockUsers[1],
    registrationCount: 28,
    isFull: false,
    images: eventImageSets.food,
  },
  {
    id: 6,
    title: "Sustainable Fashion Conference",
    description:
      "Explore the future of fashion with industry leaders committed to sustainability and ethical practices. Discussions on innovative materials, circular economy models, and transforming the industry for a more sustainable future.",
    location: "Design Quarter, Milan",
    startTime: createDate(30),
    endTime: createDate(31),
    maxAttendees: 400,
    creator: mockUsers[2],
    registrationCount: 275,
    isFull: false,
    images: eventImageSets.fashion,
  },
  {
    id: 7,
    title: "Data Science & AI Bootcamp",
    description:
      "Immersive 5-day bootcamp covering essential data science and AI fundamentals. From statistical analysis to machine learning models and practical applications. Hands-on projects and expert mentoring for all skill levels.",
    location: "Tech Academy, Austin",
    startTime: createDate(15),
    endTime: createDate(20),
    maxAttendees: 100,
    creator: mockUsers[0],
    registrationCount: 100,
    isFull: true,
    images: eventImageSets.data,
  },
  {
    id: 8,
    title: "Urban Photography Walk",
    description:
      "Capture the soul of the city in this guided photography walk through iconic neighborhoods and hidden gems. Learn composition techniques, lighting tricks, and post-processing tips from professional urban photographers.",
    location: "Downtown Arts District, Los Angeles",
    startTime: createDate(3),
    endTime: createDate(3, 4),
    maxAttendees: 25,
    creator: mockUsers[1],
    registrationCount: 12,
    isFull: false,
    images: eventImageSets.photo,
  },
  {
    id: 9,
    title: "Space Exploration Symposium",
    description:
      "Journey to the frontiers of space exploration with presentations from NASA scientists, astronauts, and private space companies. Latest discoveries, future missions, and the evolving landscape of human existence beyond Earth.",
    location: "Planetarium, Houston",
    startTime: createDate(45),
    endTime: createDate(46),
    maxAttendees: 500,
    creator: mockUsers[2],
    registrationCount: 317,
    isFull: false,
    images: eventImageSets.space,
  },
  {
    id: 10,
    title: "Virtual Reality Gaming Tournament",
    description:
      "Compete in the ultimate VR gaming challenge featuring multiple games and skill levels. State-of-the-art equipment, professional commentators, and substantial prizes for winners. Spectator experiences available.",
    location: "Gaming Arena, Tokyo",
    startTime: createDate(12),
    endTime: createDate(13),
    maxAttendees: 150,
    creator: mockUsers[0],
    registrationCount: 143,
    isFull: false,
    images: eventImageSets.gaming,
  },
];

// Helper function to create paged response
export const createPagedResponse = <T>(
  content: T[],
  pageNumber: number,
  pageSize: number,
  totalElements: number = content.length
): PagedResponse<T> => {
  const totalPages = Math.ceil(totalElements / pageSize);
  return {
    content,
    pageNumber,
    pageSize,
    totalElements,
    totalPages,
    last: pageNumber >= totalPages - 1,
  };
};

// Mock search function
export const mockSearchEvents = (
  keyword: string,
  page = 0,
  size = 6
): PagedResponse<Event> => {
  const filteredEvents = mockEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(keyword.toLowerCase()) ||
      event.description.toLowerCase().includes(keyword.toLowerCase()) ||
      event.location.toLowerCase().includes(keyword.toLowerCase())
  );

  const startIndex = page * size;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + size);

  return createPagedResponse(
    paginatedEvents,
    page,
    size,
    filteredEvents.length
  );
};

// Mock upcoming events function
export const mockUpcomingEvents = (
  page = 0,
  size = 6
): PagedResponse<Event> => {
  const now = new Date().toISOString();
  const upcomingEvents = mockEvents
    .filter((event) => event.startTime > now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const startIndex = page * size;
  const paginatedEvents = upcomingEvents.slice(startIndex, startIndex + size);

  return createPagedResponse(
    paginatedEvents,
    page,
    size,
    upcomingEvents.length
  );
};

// Mock all events function
export const mockAllEvents = (page = 0, size = 6): PagedResponse<Event> => {
  const startIndex = page * size;
  const paginatedEvents = mockEvents.slice(startIndex, startIndex + size);

  return createPagedResponse(paginatedEvents, page, size, mockEvents.length);
};

// Mock get event by ID function
export const mockGetEventById = (id: number): Event | null => {
  return mockEvents.find((event) => event.id === id) || null;
};
