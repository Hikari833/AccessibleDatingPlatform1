import { 
  users, profiles, matches, messages, likes, blocks, reports,
  type User, type Profile, type Match, type Message, type Like, type Block, type Report,
  type InsertUser, type InsertProfile, type InsertMessage, type InsertLike, type InsertBlock, type InsertReport,
  type ProfileWithUser, type MessageWithSender, type MatchWithProfiles
} from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Profile operations
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfileById(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: number): Promise<Profile | undefined>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  getProfiles(excludeUserId?: number): Promise<ProfileWithUser[]>;
  searchProfiles(query: string, excludeUserId?: number): Promise<ProfileWithUser[]>;
  
  // Match operations
  createMatch(userId1: number, userId2: number): Promise<Match>;
  getMatchesByUserId(userId: number): Promise<MatchWithProfiles[]>;
  checkMatch(userId1: number, userId2: number): Promise<Match | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<MessageWithSender[]>;
  getConversationsByUserId(userId: number): Promise<MessageWithSender[]>;
  markMessageAsRead(messageId: number): Promise<void>;
  
  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  getLikesByUserId(userId: number): Promise<Like[]>;
  checkLike(senderId: number, receiverId: number): Promise<Like | undefined>;
  
  // Block operations
  createBlock(block: InsertBlock): Promise<Block>;
  getBlocksByUserId(userId: number): Promise<Block[]>;
  checkBlock(blockerId: number, blockedId: number): Promise<Block | undefined>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReportsByUserId(userId: number): Promise<Report[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private profiles: Map<number, Profile> = new Map();
  private matches: Map<number, Match> = new Map();
  private messages: Map<number, Message> = new Map();
  private likes: Map<number, Like> = new Map();
  private blocks: Map<number, Block> = new Map();
  private reports: Map<number, Report> = new Map();
  
  private currentUserId = 1;
  private currentProfileId = 1;
  private currentMatchId = 1;
  private currentMessageId = 1;
  private currentLikeId = 1;
  private currentBlockId = 1;
  private currentReportId = 1;

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const user1: User = {
      id: 1,
      username: "alex_photos",
      email: "alex@example.com",
      password: "hashed_password",
      createdAt: new Date(),
    };
    
    const user2: User = {
      id: 2,
      username: "sarah_dev",
      email: "sarah@example.com",
      password: "hashed_password",
      createdAt: new Date(),
    };

    this.users.set(1, user1);
    this.users.set(2, user2);

    // Create sample profiles
    const profile1: Profile = {
      id: 1,
      userId: 1,
      name: "Alex, 28",
      age: 28,
      location: "San Francisco, CA",
      bio: "Photography enthusiast who loves hiking and exploring new places. I use a wheelchair and enjoy accessible outdoor activities. Looking for someone who shares my love for adventure and good conversations.",
      interests: ["Photography", "Hiking", "Travel"],
      disabilityType: "Mobility",
      accessibilityNeeds: ["Wheelchair accessible venues", "Ground floor access"],
      communicationPreferences: ["Text", "Voice calls"],
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"],
      isActive: true,
      createdAt: new Date(),
    };

    const profile2: Profile = {
      id: 2,
      userId: 2,
      name: "Sarah, 32",
      age: 32,
      location: "Oakland, CA",
      bio: "Music lover and software developer. I'm hard of hearing and communicate through ASL and text. I enjoy concerts with good visual elements and love cooking new recipes. Looking for genuine connections.",
      interests: ["Music", "Cooking", "Programming"],
      disabilityType: "Hearing",
      accessibilityNeeds: ["Visual alerts", "ASL interpretation"],
      communicationPreferences: ["Text", "ASL", "Video calls"],
      photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80"],
      isActive: true,
      createdAt: new Date(),
    };

    this.profiles.set(1, profile1);
    this.profiles.set(2, profile2);

    this.currentUserId = 3;
    this.currentProfileId = 3;
  }

  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  // Profile operations
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const newProfile: Profile = {
      ...profile,
      id,
      createdAt: new Date(),
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async getProfileById(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.userId === userId);
  }

  async updateProfile(id: number, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async getProfiles(excludeUserId?: number): Promise<ProfileWithUser[]> {
    const profilesArray = Array.from(this.profiles.values());
    const filtered = excludeUserId 
      ? profilesArray.filter(profile => profile.userId !== excludeUserId)
      : profilesArray;
    
    return filtered.map(profile => ({
      ...profile,
      user: this.users.get(profile.userId)!,
    }));
  }

  async searchProfiles(query: string, excludeUserId?: number): Promise<ProfileWithUser[]> {
    const profiles = await this.getProfiles(excludeUserId);
    const lowerQuery = query.toLowerCase();
    
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(lowerQuery) ||
      profile.bio.toLowerCase().includes(lowerQuery) ||
      profile.location.toLowerCase().includes(lowerQuery) ||
      profile.interests.some(interest => interest.toLowerCase().includes(lowerQuery)) ||
      profile.accessibilityNeeds.some(need => need.toLowerCase().includes(lowerQuery))
    );
  }

  // Match operations
  async createMatch(userId1: number, userId2: number): Promise<Match> {
    const id = this.currentMatchId++;
    const match: Match = {
      id,
      userId1,
      userId2,
      matchedAt: new Date(),
      isActive: true,
    };
    this.matches.set(id, match);
    return match;
  }

  async getMatchesByUserId(userId: number): Promise<MatchWithProfiles[]> {
    const matches = Array.from(this.matches.values()).filter(
      match => match.userId1 === userId || match.userId2 === userId
    );
    
    return matches.map(match => {
      const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
      const profile1 = this.profiles.get(match.userId1);
      const profile2 = this.profiles.get(match.userId2);
      const user1 = this.users.get(match.userId1);
      const user2 = this.users.get(match.userId2);
      
      return {
        ...match,
        profile1: { ...profile1!, user: user1! },
        profile2: { ...profile2!, user: user2! },
      };
    });
  }

  async checkMatch(userId1: number, userId2: number): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find(
      match => 
        (match.userId1 === userId1 && match.userId2 === userId2) ||
        (match.userId1 === userId2 && match.userId2 === userId1)
    );
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = {
      ...message,
      id,
      sentAt: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<MessageWithSender[]> {
    const messages = Array.from(this.messages.values()).filter(
      message => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
    );
    
    return messages.map(message => ({
      ...message,
      sender: this.users.get(message.senderId)!,
    }));
  }

  async getConversationsByUserId(userId: number): Promise<MessageWithSender[]> {
    const messages = Array.from(this.messages.values()).filter(
      message => message.senderId === userId || message.receiverId === userId
    );
    
    return messages.map(message => ({
      ...message,
      sender: this.users.get(message.senderId)!,
    }));
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    const message = this.messages.get(messageId);
    if (message) {
      this.messages.set(messageId, { ...message, isRead: true });
    }
  }

  // Like operations
  async createLike(like: InsertLike): Promise<Like> {
    const id = this.currentLikeId++;
    const newLike: Like = {
      ...like,
      id,
      createdAt: new Date(),
    };
    this.likes.set(id, newLike);
    return newLike;
  }

  async getLikesByUserId(userId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.senderId === userId);
  }

  async checkLike(senderId: number, receiverId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      like => like.senderId === senderId && like.receiverId === receiverId
    );
  }

  // Block operations
  async createBlock(block: InsertBlock): Promise<Block> {
    const id = this.currentBlockId++;
    const newBlock: Block = {
      ...block,
      id,
      createdAt: new Date(),
    };
    this.blocks.set(id, newBlock);
    return newBlock;
  }

  async getBlocksByUserId(userId: number): Promise<Block[]> {
    return Array.from(this.blocks.values()).filter(block => block.blockerId === userId);
  }

  async checkBlock(blockerId: number, blockedId: number): Promise<Block | undefined> {
    return Array.from(this.blocks.values()).find(
      block => block.blockerId === blockerId && block.blockedId === blockedId
    );
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const newReport: Report = {
      ...report,
      id,
      createdAt: new Date(),
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.reporterId === userId);
  }
}

export const storage = new MemStorage();
