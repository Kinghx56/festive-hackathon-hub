import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DAYS_TO_KEEP = 7;
const uploadsDir = path.join(__dirname, 'uploads', 'id-cards');

/**
 * Clean up ID cards that have been verified/rejected for more than 7 days
 */
async function cleanupOldIDCards() {
  try {
    console.log('🧹 Starting ID card cleanup...');

    // Get all teams from Firestore
    const teamsRef = collection(db, 'teams');
    const teamsSnapshot = await getDocs(teamsRef);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_KEEP);

    let deletedCount = 0;
    let skippedCount = 0;

    for (const teamDoc of teamsSnapshot.docs) {
      const team = teamDoc.data();

      // Check if team has ID verification data
      if (team.idVerification && team.idVerification.idCardPath) {
        const { status, verifiedAt, idCardPath } = team.idVerification;

        // Only delete if verified/rejected and past retention period
        if ((status === 'verified' || status === 'rejected') && verifiedAt) {
          const verificationDate = verifiedAt.toDate();

          if (verificationDate < cutoffDate) {
            // Delete the file
            const filename = path.basename(idCardPath);
            const filePath = path.join(uploadsDir, filename);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              deletedCount++;
              console.log(`✅ Deleted: ${filename} (verified: ${verificationDate.toLocaleDateString()})`);
            } else {
              console.log(`⚠️ File not found: ${filename}`);
            }
          } else {
            skippedCount++;
          }
        }
      }
    }

    console.log('🎉 Cleanup complete!');
    console.log(`📊 Deleted: ${deletedCount} files`);
    console.log(`📊 Skipped (recent): ${skippedCount} files`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run cleanup
cleanupOldIDCards()
  .then(() => {
    console.log('✅ Cleanup script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup script failed:', error);
    process.exit(1);
  });
