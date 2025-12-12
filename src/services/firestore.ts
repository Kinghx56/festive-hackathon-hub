import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface TeamData {
  teamId: string;
  teamName: string;
  institutionName: string;
  numberOfMembers: string;
  teamLeadName: string;
  teamLeadEmail: string;
  teamLeadPhone: string;
  problemStatementId: string;
  projectTitle: string;
  projectDescription: string;
  techStack: string;
  members: Array<{ name: string; email: string; role: string }>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // ID Card Verification
  idVerification?: {
    status: 'pending' | 'verified' | 'rejected' | 'not-required';
    confidence: number;
    extractedData?: {
      name?: string;
      idNumber?: string;
      institution?: string;
      fullText?: string;
    };
    idCardPath?: string; // Server file path
    uploadedAt?: Timestamp;
    verifiedAt?: Timestamp;
    verifiedBy?: string;
    rejectionReason?: string;
  };
}

// Chat Message Interface
export interface ChatMessage {
  messageId: string;
  teamId: string;
  teamName: string;
  sender: 'team' | 'bot' | 'admin';
  message: string;
  timestamp: Timestamp;
  isEscalated?: boolean;
  escalationReason?: string;
  adminResponse?: string;
  adminRespondedAt?: Timestamp;
  adminRespondedBy?: string;
}

// Generate unique Team ID
export const generateTeamId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  let isUnique = false;
  let teamId = '';

  while (!isUnique) {
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    teamId = `NH-${year}-${randomNum}`;

    // Check if team ID already exists
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      isUnique = true;
    }
  }

  return teamId;
};

// Check if email or phone already registered
export const checkDuplicateEntry = async (
  email: string,
  phone: string,
  memberEmails?: string[]
): Promise<{ isDuplicate: boolean; message: string }> => {
  const teamsRef = collection(db, 'teams');

  // Check team lead email
  const emailQuery = query(teamsRef, where('teamLeadEmail', '==', email));
  const emailSnapshot = await getDocs(emailQuery);

  if (!emailSnapshot.empty) {
    return {
      isDuplicate: true,
      message: 'This email is already registered as a team lead. Please use a different email.',
    };
  }

  // Check phone
  const phoneQuery = query(teamsRef, where('teamLeadPhone', '==', phone));
  const phoneSnapshot = await getDocs(phoneQuery);

  if (!phoneSnapshot.empty) {
    return {
      isDuplicate: true,
      message: 'This phone number is already registered. Please use a different number.',
    };
  }

  // Check if team lead email or any member email exists in other teams
  const allTeamsSnapshot = await getDocs(teamsRef);
  const allEmailsToCheck = [email, ...(memberEmails || [])].filter(e => e && e.trim());

  for (const teamDoc of allTeamsSnapshot.docs) {
    const teamData = teamDoc.data();
    
    // Check if any email matches team lead in existing teams
    if (allEmailsToCheck.includes(teamData.teamLeadEmail)) {
      return {
        isDuplicate: true,
        message: `Email ${teamData.teamLeadEmail} is already registered in another team.`,
      };
    }

    // Check if any email matches members in existing teams
    if (teamData.members && Array.isArray(teamData.members)) {
      for (const member of teamData.members) {
        if (member.email && allEmailsToCheck.includes(member.email)) {
          return {
            isDuplicate: true,
            message: `Email ${member.email} is already registered as a team member.`,
          };
        }
      }
    }
  }

  return { isDuplicate: false, message: '' };
};

// Register a new team
export const registerTeam = async (
  formData: Omit<TeamData, 'teamId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; teamId?: string; message: string }> => {
  try {
    console.log('🔥 Firestore registerTeam - Received form data:', {
      teamLeadName: formData.teamLeadName,
      hasIdVerification: !!formData.idVerification,
      idVerificationRaw: formData.idVerification,
    });

    // Extract member emails for duplicate check
    const memberEmails = formData.members
      .map(m => m.email)
      .filter(email => email && email.trim());

    // Check for duplicate entries (including all member emails)
    const duplicateCheck = await checkDuplicateEntry(
      formData.teamLeadEmail,
      formData.teamLeadPhone,
      memberEmails
    );

    if (duplicateCheck.isDuplicate) {
      return {
        success: false,
        message: duplicateCheck.message,
      };
    }

    // Generate unique team ID
    const teamId = await generateTeamId();

    // Prepare team data
    const teamData: any = {
      ...formData,
      teamId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('📦 Before cleanup - idVerification:', JSON.stringify(teamData.idVerification, null, 2));

    // Clean up idVerification data - remove undefined values
    if (teamData.idVerification) {
      // Remove undefined fields from extractedData
      if (teamData.idVerification.extractedData) {
        const cleanedData: any = {};
        Object.keys(teamData.idVerification.extractedData).forEach(key => {
          const value = teamData.idVerification.extractedData[key];
          if (value !== undefined && value !== null) {
            cleanedData[key] = value;
          }
        });
        
        // Only keep extractedData if it has any fields
        if (Object.keys(cleanedData).length > 0) {
          teamData.idVerification.extractedData = cleanedData;
        } else {
          delete teamData.idVerification.extractedData;
        }
      }
      
      // Remove undefined fields from idVerification
      Object.keys(teamData.idVerification).forEach(key => {
        if (teamData.idVerification[key] === undefined) {
          delete teamData.idVerification[key];
        }
      });
    }

    console.log('✨ After cleanup - Final data to Firestore:', {
      hasIdVerification: !!teamData.idVerification,
      idVerification: JSON.stringify(teamData.idVerification, null, 2),
    });

    // Add to Firestore
    const teamsRef = collection(db, 'teams');
    await addDoc(teamsRef, teamData);

    console.log('✅ Successfully written to Firestore with team ID:', teamId);

    return {
      success: true,
      teamId,
      message: 'Team registered successfully!',
    };
  } catch (error) {
    console.error('Error registering team:', error);
    return {
      success: false,
      message: 'Failed to register team. Please try again.',
    };
  }
};

// Get team by email and phone (for login)
export const getTeamByCredentials = async (
  email: string,
  phone: string
): Promise<{ success: boolean; team?: TeamData; message: string }> => {
  try {
    const teamsRef = collection(db, 'teams');
    const q = query(
      teamsRef,
      where('teamLeadEmail', '==', email),
      where('teamLeadPhone', '==', phone)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Invalid credentials. Please check your email and phone number.',
      };
    }

    const teamDoc = querySnapshot.docs[0];
    const team = { id: teamDoc.id, ...teamDoc.data() } as TeamData & { id: string };

    return {
      success: true,
      team,
      message: 'Login successful!',
    };
  } catch (error) {
    console.error('Error fetching team:', error);
    return {
      success: false,
      message: 'Failed to login. Please try again.',
    };
  }
};

// Get all teams (for admin)
export const getAllTeams = async (): Promise<{
  success: boolean;
  teams?: (TeamData & { id: string })[];
  message: string;
}> => {
  try {
    const teamsRef = collection(db, 'teams');
    const querySnapshot = await getDocs(teamsRef);

    const teams = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (TeamData & { id: string })[];

    return {
      success: true,
      teams,
      message: 'Teams fetched successfully!',
    };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return {
      success: false,
      message: 'Failed to fetch teams.',
    };
  }
};

// Update team status (approve/reject)
export const updateTeamStatus = async (
  teamId: string,
  status: 'approved' | 'rejected'
): Promise<{ success: boolean; message: string }> => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Team ${status} successfully!`,
    };
  } catch (error) {
    console.error('Error updating team status:', error);
    return {
      success: false,
      message: 'Failed to update team status.',
    };
  }
};

// Update ID verification status
export const updateIDVerificationStatus = async (
  teamDocId: string,
  status: 'verified' | 'rejected',
  verifiedBy: string,
  rejectionReason?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const teamRef = doc(db, 'teams', teamDocId);
    await updateDoc(teamRef, {
      'idVerification.status': status,
      'idVerification.verifiedAt': serverTimestamp(),
      'idVerification.verifiedBy': verifiedBy,
      'idVerification.rejectionReason': rejectionReason || null,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `ID verification ${status} successfully!`,
    };
  } catch (error) {
    console.error('Error updating ID verification:', error);
    return {
      success: false,
      message: 'Failed to update ID verification status.',
    };
  }
};

// Get team by ID
export const getTeamById = async (
  teamId: string
): Promise<{ success: boolean; team?: TeamData & { id: string }; message: string }> => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      return {
        success: false,
        message: 'Team not found.',
      };
    }

    const team = { id: teamDoc.id, ...teamDoc.data() } as TeamData & { id: string };

    return {
      success: true,
      team,
      message: 'Team fetched successfully!',
    };
  } catch (error) {
    console.error('Error fetching team:', error);
    return {
      success: false,
      message: 'Failed to fetch team.',
    };
  }
};

// ============= CHAT FUNCTIONS =============

// Save chat message
export const saveChatMessage = async (
  teamId: string,
  teamName: string,
  sender: 'team' | 'bot' | 'admin',
  message: string,
  isEscalated: boolean = false,
  escalationReason?: string
): Promise<{ success: boolean; messageId?: string; message: string }> => {
  try {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const chatMessage: any = {
      messageId,
      teamId,
      teamName,
      sender,
      message,
      timestamp: serverTimestamp(),
    };

    // Only add optional fields if they have values
    if (isEscalated) {
      chatMessage.isEscalated = isEscalated;
    }
    if (escalationReason) {
      chatMessage.escalationReason = escalationReason;
    }

    const messagesRef = collection(db, 'chatMessages');
    await addDoc(messagesRef, chatMessage);

    return {
      success: true,
      messageId,
      message: 'Message saved successfully',
    };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return {
      success: false,
      message: 'Failed to save message',
    };
  }
};

// Get chat history for a team
export const getChatHistory = async (
  teamId: string
): Promise<{ success: boolean; messages: ChatMessage[]; message: string }> => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef, where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);

    const messages: ChatMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ ...doc.data() } as ChatMessage);
    });

    // Sort by timestamp
    messages.sort((a, b) => {
      const timeA = a.timestamp?.toMillis() || 0;
      const timeB = b.timestamp?.toMillis() || 0;
      return timeA - timeB;
    });

    return {
      success: true,
      messages,
      message: 'Chat history fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return {
      success: false,
      messages: [],
      message: 'Failed to fetch chat history',
    };
  }
};

// Get all escalated queries for admin
export const getEscalatedQueries = async (): Promise<{
  success: boolean;
  messages: ChatMessage[];
  message: string;
}> => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef, where('isEscalated', '==', true));
    const querySnapshot = await getDocs(q);

    const messages: ChatMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage & { id: string });
    });

    // Sort by timestamp (newest first)
    messages.sort((a, b) => {
      const timeA = a.timestamp?.toMillis() || 0;
      const timeB = b.timestamp?.toMillis() || 0;
      return timeB - timeA;
    });

    return {
      success: true,
      messages,
      message: 'Escalated queries fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching escalated queries:', error);
    return {
      success: false,
      messages: [],
      message: 'Failed to fetch escalated queries',
    };
  }
};

// Admin respond to escalated query
export const respondToEscalatedQuery = async (
  messageId: string,
  adminResponse: string,
  adminName: string = 'Admin'
): Promise<{ success: boolean; message: string }> => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const q = query(messagesRef, where('messageId', '==', messageId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: 'Message not found',
      };
    }

    const docRef = doc(db, 'chatMessages', querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      adminResponse,
      adminRespondedAt: serverTimestamp(),
      adminRespondedBy: adminName,
    });

    return {
      success: true,
      message: 'Response sent successfully',
    };
  } catch (error) {
    console.error('Error responding to query:', error);
    return {
      success: false,
      message: 'Failed to send response',
    };
  }
};
