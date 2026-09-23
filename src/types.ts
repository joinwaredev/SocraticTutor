export type GradeLevel = '3rd' | '4th' | '5th' | 'Advanced';

export type ScaffoldType =
  | 'fractions'
  | 'balance_scale'
  | 'array_grid'
  | 'number_line'
  | 'place_value'
  | 'none';

export interface FractionScaffoldData {
  numeratorA?: number;
  denominatorA?: number;
  numeratorB?: number;
  denominatorB?: number;
  operation?: '+' | '-' | '=' | 'compare';
  labelA?: string;
  labelB?: string;
}

export interface BalanceScaffoldData {
  leftSideExpression?: string;
  leftUnknowns?: number; // e.g. 2 x's
  leftConstants?: number; // e.g. + 5
  rightSideExpression?: string;
  rightConstants?: number; // e.g. 15
  isBalanced?: boolean;
}

export interface ArrayGridScaffoldData {
  rows: number;
  cols: number;
  highlightRows?: number;
  highlightCols?: number;
  label?: string;
}

export interface NumberLineScaffoldData {
  min: number;
  max: number;
  start: number;
  jumpSize: number;
  jumpsCount: number;
  target?: number;
}

export interface PlaceValueScaffoldData {
  hundreds: number;
  tens: number;
  ones: number;
}

export interface StepMetadata {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  scaffoldType: ScaffoldType;
  scaffoldData?: any;
  guidingQuestion: string;
  encouragement: string;
  curiosityFact?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: number;
  actionType?: 'regular' | 'why' | 'hint' | 'check' | 'simplify' | 'start';
  metadata?: StepMetadata;
  modelUsed?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  requirement: string;
  category: 'curiosity' | 'persistence' | 'mastery';
}

export interface SparkyCostume {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  category: 'hat' | 'outfit' | 'accessory';
}

export interface SessionRecord {
  id: string;
  date: string;
  problemSummary: string;
  gradeLevel: GradeLevel;
  totalSteps: number;
  stepsCompleted: number;
  whyQuestionsAsked: number;
  hintsUsed: number;
  durationMinutes: number;
  conceptsTrained: string[];
  growthNote: string;
}

export interface SampleProblem {
  id: string;
  title: string;
  grade: GradeLevel;
  category: 'Fractions' | 'Algebra' | 'Word Problem' | 'Calculus Challenge' | 'Multiplication';
  text: string;
  imageThumbnailSvg: string;
  description: string;
  scaffoldType: ScaffoldType;
  defaultData: any;
}
