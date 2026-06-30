export type TimelineNodeStatus = 'completed' | 'active' | 'locked';
export type TimelineNodeType = 'assessment' | 'module';

export interface TimelineNodeData {
  id: string;
  title: string;
  type: TimelineNodeType;
  status: TimelineNodeStatus;
  moduleId?: string;
}

export const learningPath: TimelineNodeData[] = [
  { id: 'pre-assessment', title: 'Pre Assessment', type: 'assessment', status: 'completed' },
  { id: 'module-1', title: 'Module One', type: 'module', status: 'completed', moduleId: 'm1' },
  { id: 'module-2', title: 'Module Two', type: 'module', status: 'active', moduleId: 'm2' },
  { id: 'module-3', title: 'Module Three', type: 'module', status: 'locked', moduleId: 'm3' },
  { id: 'post-assessment', title: 'Post Assessment', type: 'assessment', status: 'locked' },
];
