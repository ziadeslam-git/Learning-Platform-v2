export interface ModuleData {
  id: string;
  title: string;
  description: string;
  topics: string[];
}

export const module1Data: ModuleData = {
  id: 'm1',
  title: 'Fundamentals of the Program',
  description: 'An introduction to the core concepts and methodologies we will explore.',
  topics: ['Introduction to Core Principles', 'Historical Context', 'Basic Terminology'],
};
