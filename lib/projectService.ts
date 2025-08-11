import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { FileTab } from '../app/components/Editor';

export interface Project {
  id: string;
  name: string;
  description: string;
  files: FileTab[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  previewUrl?: string;
}

export const projectService = {
  // Save a new project
  async saveProject(name: string, description: string, files: FileTab[], userId: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        name,
        description,
        files: files.map(f => ({
          id: f.id,
          name: f.name,
          content: f.content,
          language: f.language
        })),
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  },

  // Update an existing project
  async updateProject(projectId: string, files: FileTab[]): Promise<void> {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        files: files.map(f => ({
          id: f.id,
          name: f.name,
          content: f.content,
          language: f.language
        })),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Get projects for a specific user
  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, 'projects'), 
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Project[];
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};
