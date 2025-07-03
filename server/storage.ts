import { 
  User, 
  Profile, 
  Match, 
  Message, 
  Like, 
  Block, 
  Report,
  InsertUser,
  InsertProfile,
  InsertMessage,
  InsertLike,
  InsertBlock,
  InsertReport,
  ProfileWithUser,
  MessageWithSender,
  MatchWithProfiles,
  users,
  profiles,
  matches,
  messages,
  likes,
  blocks,
  reports
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, ilike, ne } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createProfile(profileData: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        ...profileData,
        interests: profileData.interests || [],
        accessibilityNeeds: profileData.accessibilityNeeds || [],
        communicationPreferences: profileData.communicationPreferences || [],
        photos: profileData.photos || [],
        isActive: profileData.isActive ?? true
      })
      .returning();
    return profile;
  }

  async getProfileById(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async updateProfile(id: number, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set(profileData)
      .where(eq(profiles.id, id))
      .returning();
    return profile || undefined;
  }

  async getProfiles(excludeUserId?: number): Promise<ProfileWithUser[]> {
    const query = db
      .select({
        id: profiles.id,
        name: profiles.name,
        userId: profiles.userId,
        createdAt: profiles.createdAt,
        age: profiles.age,
        location: profiles.location,
        bio: profiles.bio,
        interests: profiles.interests,
        disabilityType: profiles.disabilityType,
        accessibilityNeeds: profiles.accessibilityNeeds,
        communicationPreferences: profiles.communicationPreferences,
        photos: profiles.photos,
        isActive: profiles.isActive,
        user: users
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(excludeUserId ? and(eq(profiles.isActive, true), ne(users.id, excludeUserId)) : eq(profiles.isActive, true))
      .orderBy(desc(profiles.createdAt));

    return await query;
  }

  async searchProfiles(query: string, excludeUserId?: number): Promise<ProfileWithUser[]> {
    const searchQuery = db
      .select({
        id: profiles.id,
        name: profiles.name,
        userId: profiles.userId,
        createdAt: profiles.createdAt,
        age: profiles.age,
        location: profiles.location,
        bio: profiles.bio,
        interests: profiles.interests,
        disabilityType: profiles.disabilityType,
        accessibilityNeeds: profiles.accessibilityNeeds,
        communicationPreferences: profiles.communicationPreferences,
        photos: profiles.photos,
        isActive: profiles.isActive,
        user: users
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(
        and(
          eq(profiles.isActive, true),
          excludeUserId ? eq(users.id, excludeUserId) : undefined,
          or(
            ilike(profiles.name, `%${query}%`),
            ilike(profiles.bio, `%${query}%`),
            ilike(profiles.location, `%${query}%`)
          )
        )
      )
      .orderBy(desc(profiles.createdAt));

    return await searchQuery;
  }

  async createMatch(userId1: number, userId2: number): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values({ userId1, userId2 })
      .returning();
    return match;
  }

  async getMatchesByUserId(userId: number): Promise<MatchWithProfiles[]> {
    const userMatches = await db
      .select()
      .from(matches)
      .where(or(eq(matches.userId1, userId), eq(matches.userId2, userId)));

    const matchWithProfiles: MatchWithProfiles[] = [];
    
    for (const match of userMatches) {
      const profile1 = await this.getProfileByUserId(match.userId1);
      const profile2 = await this.getProfileByUserId(match.userId2);
      const user1 = await this.getUserById(match.userId1);
      const user2 = await this.getUserById(match.userId2);

      if (profile1 && profile2 && user1 && user2) {
        matchWithProfiles.push({
          id: match.id,
          userId1: match.userId1,
          userId2: match.userId2,
          matchedAt: match.matchedAt,
          isActive: match.isActive,
          profile1: { ...profile1, user: user1 },
          profile2: { ...profile2, user: user2 }
        });
      }
    }

    return matchWithProfiles;
  }

  async checkMatch(userId1: number, userId2: number): Promise<Match | undefined> {
    const [match] = await db
      .select()
      .from(matches)
      .where(
        or(
          and(eq(matches.userId1, userId1), eq(matches.userId2, userId2)),
          and(eq(matches.userId1, userId2), eq(matches.userId2, userId1))
        )
      );
    return match || undefined;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...messageData,
        messageType: messageData.messageType || 'text',
        isRead: messageData.isRead ?? false
      })
      .returning();
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<MessageWithSender[]> {
    const messagesData = await db
      .select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        messageType: messages.messageType,
        isRead: messages.isRead,
        sentAt: messages.sentAt,
        sender: users
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(desc(messages.sentAt));

    return messagesData;
  }

  async getConversationsByUserId(userId: number): Promise<MessageWithSender[]> {
    const messagesData = await db
      .select({
        id: messages.id,
        content: messages.content,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        messageType: messages.messageType,
        isRead: messages.isRead,
        sentAt: messages.sentAt,
        sender: users
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.sentAt));

    return messagesData;
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  async createLike(likeData: InsertLike): Promise<Like> {
    const [like] = await db
      .insert(likes)
      .values(likeData)
      .returning();
    return like;
  }

  async getLikesByUserId(userId: number): Promise<Like[]> {
    return await db
      .select()
      .from(likes)
      .where(eq(likes.senderId, userId));
  }

  async checkLike(senderId: number, receiverId: number): Promise<Like | undefined> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.senderId, senderId), eq(likes.receiverId, receiverId)));
    return like || undefined;
  }

  async createBlock(blockData: InsertBlock): Promise<Block> {
    const [block] = await db
      .insert(blocks)
      .values({
        ...blockData,
        reason: blockData.reason || null
      })
      .returning();
    return block;
  }

  async getBlocksByUserId(userId: number): Promise<Block[]> {
    return await db
      .select()
      .from(blocks)
      .where(eq(blocks.blockerId, userId));
  }

  async checkBlock(blockerId: number, blockedId: number): Promise<Block | undefined> {
    const [block] = await db
      .select()
      .from(blocks)
      .where(and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, blockedId)));
    return block || undefined;
  }

  async createReport(reportData: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values({
        ...reportData,
        status: reportData.status || 'pending',
        description: reportData.description || null
      })
      .returning();
    return report;
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.reporterId, userId));
  }
}

export const storage = new DatabaseStorage();