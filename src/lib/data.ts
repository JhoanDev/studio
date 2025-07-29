import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Activity, Announcement } from './types';

const modalities = [
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
    return new Promise(resolve => setTimeout(() => resolve(modalities), 50));
};

// Esta função agora busca o usuário pelo e-mail, que é o identificador no Firebase Auth.
export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    if (!email) return undefined;
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return undefined;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}
