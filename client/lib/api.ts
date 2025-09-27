// API utility functions for MongoDB integration

export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  time_commitment: number;
  preferred_style?: 'visual' | 'practical' | 'theoretical';
  goals: string[];
  focus_areas: string[];
  subject_levels: Record<string, {
    level: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
  }>;
  social_links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface User extends CreateUserRequest {
  id: string;
  join_date: string;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  user_id: string;
  total_study_time: number;
  questions_answered: number;
  topics_completed: string[];
  streak_count: number;
  xp_points: number;
  level: number;
  last_study_date: string | null;
  created_at: string;
  updated_at: string;
}

// User API functions
export const userAPI = {
  async create(userData: CreateUserRequest): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    return response.json();
  },

  async getById(userId: string): Promise<User | null> {
    const response = await fetch(`/api/users/${userId}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  },

  async update(userId: string, updateData: Partial<CreateUserRequest>): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  },

  async getProgress(userId: string): Promise<UserProgress | null> {
    const response = await fetch(`/api/users/${userId}/progress`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    
    return response.json();
  },

  async updateProgress(userId: string, progressData: Partial<UserProgress>): Promise<UserProgress> {
    const response = await fetch(`/api/users/${userId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    
    return response.json();
  }
};

// Local storage integration with database sync
export const syncAPI = {
  // Get user ID from localStorage or create new user
  async getCurrentUserId(): Promise<string | null> {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // Verify user exists in database
      try {
        const user = await userAPI.getById(storedUserId);
        return user ? storedUserId : null;
      } catch (error) {
        console.error('Error verifying user:', error);
        return null;
      }
    }
    return null;
  },

  // Create user from localStorage profile data
  async createUserFromLocalStorage(): Promise<string | null> {
    const profileData = localStorage.getItem('userProfile');
    if (!profileData) return null;

    try {
      const profile = JSON.parse(profileData);
      
      // Convert localStorage format to API format
      const userData: CreateUserRequest = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar,
        experience: profile.experience || 'beginner',
        time_commitment: profile.timeCommitment || 4,
        preferred_style: profile.preferredStyle,
        goals: profile.goals || [],
        focus_areas: profile.focusAreas || [],
        subject_levels: profile.subjectLevels || {},
        social_links: profile.socialLinks || {}
      };

      const user = await userAPI.create(userData);
      
      // Store user ID for future use
      localStorage.setItem('userId', user.id);
      
      return user.id;
    } catch (error) {
      console.error('Error creating user from localStorage:', error);
      return null;
    }
  },

  // Sync localStorage data to database
  async syncToDatabase(): Promise<string | null> {
    let userId = await this.getCurrentUserId();
    
    if (!userId) {
      userId = await this.createUserFromLocalStorage();
    }
    
    if (!userId) return null;

    // Sync progress data if available
    const statsData = localStorage.getItem('userStats');
    if (statsData) {
      try {
        const stats = JSON.parse(statsData);
        await userAPI.updateProgress(userId, {
          total_study_time: stats.totalStudyTime || 0,
          questions_answered: stats.questionsAnswered || 0,
          topics_completed: stats.topicsCompleted || [],
          streak_count: stats.streakCount || 0,
          xp_points: stats.xpPoints || 0,
          level: stats.level || 1
        });
      } catch (error) {
        console.error('Error syncing progress:', error);
      }
    }

    return userId;
  },

  // Load user data from database to localStorage
  async loadFromDatabase(userId: string): Promise<void> {
    try {
      const [user, progress] = await Promise.all([
        userAPI.getById(userId),
        userAPI.getProgress(userId)
      ]);

      if (user) {
        // Convert API format to localStorage format
        const profile = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          avatar: user.avatar,
          experience: user.experience,
          timeCommitment: user.time_commitment,
          preferredStyle: user.preferred_style,
          goals: user.goals,
          focusAreas: user.focus_areas,
          subjectLevels: user.subject_levels,
          socialLinks: user.social_links,
          joinDate: user.join_date,
          lastActive: user.last_active
        };

        localStorage.setItem('userProfile', JSON.stringify(profile));
        localStorage.setItem('userId', user.id);
      }

      if (progress) {
        const stats = {
          totalStudyTime: progress.total_study_time,
          questionsAnswered: progress.questions_answered,
          topicsCompleted: progress.topics_completed,
          streakCount: progress.streak_count,
          xpPoints: progress.xp_points,
          level: progress.level,
          lastStudyDate: progress.last_study_date
        };

        localStorage.setItem('userStats', JSON.stringify(stats));
      }
    } catch (error) {
      console.error('Error loading from database:', error);
    }
  }
};
