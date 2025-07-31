
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { User, Activity, Announcement, Status } from '@/types';

// As modalidades foram movidas para cá para evitar o erro "use server".
export const initialModalities = [
    'Futebol', 'Vôlei', 'Basquete', 'Natação', 'Handebol', 'Atletismo', 'Tênis de Mesa', 'Xadrez', 'Yoga'
];


export const getUsers = async (): Promise<User[]> => {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return userList;
};

export const getActivities = async (): Promise<Activity[]> => {
  const activitiesCol = collection(db, 'activities');
  const activitySnapshot = await getDocs(activitiesCol);
  const activityList = activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  return activityList;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const announcementsCol = collection(db, 'announcements');
  const announcementSnapshot = await getDocs(announcementsCol);
  const announcementList = announcementSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
  return announcementList;
};

export const getModalities = async (): Promise<string[]> => {
    return new Promise(resolve => setTimeout(() => resolve(initialModalities), 50));
};

export const findUserByEmail = async (email: string | null | undefined): Promise<User | undefined> => {
    if (!email) return undefined;
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return undefined;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

// --- Funções de Escrita ---

// Atividades
export const addActivity = async (activityData: Omit<Activity, 'id'>) => {
  await addDoc(collection(db, 'activities'), activityData);
};

export const updateActivity = async (activityId: string, activityData: Partial<Activity>) => {
  const activityRef = doc(db, 'activities', activityId);
  await updateDoc(activityRef, activityData);
};

export const updateActivityStatus = async (activityId: string, status: Status) => {
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, { status });
};

export const deleteActivity = async (activityId: string) => {
  const activityRef = doc(db, 'activities', activityId);
  await deleteDoc(activityRef);
};


// Avisos
export const addAnnouncement = async (announcementData: Omit<Announcement, 'id'>) => {
  await addDoc(collection(db, 'announcements'), announcementData);
};

export const updateAnnouncement = async (announcementId: string, announcementData: Partial<Announcement>) => {
    const announcementRef = doc(db, 'announcements', announcementId);
    await updateDoc(announcementRef, announcementData);
};

export const deleteAnnouncement = async (announcementId: string) => {
    const announcementRef = doc(db, 'announcements', announcementId);
    await deleteDoc(announcementRef);
};
