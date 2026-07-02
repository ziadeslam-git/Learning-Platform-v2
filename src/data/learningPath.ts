export type TimelineNodeStatus = 'completed' | 'active' | 'not-started';
export type TimelineNodeType = 'assessment' | 'module';

export interface TimelineNodeData {
  id: string;
  title: string;
  type: TimelineNodeType;
  status?: TimelineNodeStatus;
  moduleId?: string;
}

export const learningPath: TimelineNodeData[] = [
  { id: 'pre-test', title: 'الاختبار التحصيلي القبلي', type: 'assessment' },
  { id: 'pre-scale', title: 'مقياس التقبل القبلي', type: 'assessment' },
  { id: 'module-1', title: 'الموديول الأول', type: 'module', moduleId: 'm1' },
  { id: 'module-2', title: 'الموديول الثاني', type: 'module', moduleId: 'm2' },
  { id: 'module-3', title: 'الموديول الثالث', type: 'module', moduleId: 'm3' },
  { id: 'post-test', title: 'الاختبار التحصيلي البعدي', type: 'assessment' },
  { id: 'post-scale', title: 'مقياس التقبل البعدي', type: 'assessment' },
];
