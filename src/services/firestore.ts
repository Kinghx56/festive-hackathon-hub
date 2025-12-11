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
    const teamData: Omit<TeamData, 'createdAt' | 'updatedAt'> & {
      createdAt: any;
      updatedAt: any;
    } = {
      ...formData,
      teamId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add to Firestore
    const teamsRef = collection(db, 'teams');
    await addDoc(teamsRef, teamData);

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
