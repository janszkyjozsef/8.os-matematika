import type { TopicId } from "./topics.ts";
export type { TopicId } from "./topics.ts";

export type ScalarAnswerSpec =
  | {
      kind: "number";
      expected: string;
      unit?: string;
      variable?: string;
      requireSimplified?: boolean;
      tolerance?: number;
    }
  | {
      kind: "choice";
      correct: string;
      options: { id: string; text: string }[];
    }
  | {
      /** A finite authored set of expression spellings; never arbitrary code. */
      kind: "expression";
      accepted: string[];
      example?: string;
    };

export interface MistakeRule {
  input: string;
  feedback: string;
}
export interface AnswerPart {
  id: string;
  label: string;
  answer: ScalarAnswerSpec;
  mistakes?: MistakeRule[];
}
export type AnswerSpec =
  ScalarAnswerSpec | { kind: "parts"; parts: AnswerPart[] };

export interface SolutionStep {
  expression: string;
  why: string;
}
export interface Exercise {
  id: string;
  topic: TopicId;
  kind: "compute" | "reason" | "transfer";
  prompt: string;
  context?: string;
  answer: AnswerSpec;
  hints: string[];
  solution: SolutionStep[];
  takeaway: string;
  mistakes?: MistakeRule[];
  difficulty: 1 | 2 | 3;
  manuscriptId?: string;
  /** A learner's explanation is compared with these prompts, never auto-graded. */
  reflection?: { prompt: string; checkpoints: string[] };
}
export interface WorkedExample {
  title: string;
  prompt: string;
  steps: SolutionStep[];
  check: string;
  alternative?: SolutionStep[];
}
export interface Lesson {
  id: TopicId;
  moduleId: string;
  title: string;
  shortTitle: string;
  question: string;
  teaser: string;
  description: string;
  goals: string[];
  prerequisites: string[];
  estimateMinutes: number;
  color: string;
  layer: "ALAP" | "TÖRZS";
  prediction: Exercise;
  explanation: {
    heading: string;
    body: string;
    formula?: string;
    bullets?: string[];
  }[];
  examples: WorkedExample[];
  practice: Exercise[];
  exit: Exercise[];
  recap: string[];
  glossary: { term: string; definition: string }[];
  nextTopic?: TopicId;
  coveredUnits?: string[];
  prerequisiteTopics?: TopicId[];
}
export interface GradeResult {
  status: "correct" | "incorrect" | "invalid" | "form";
  correct: boolean;
  message: string;
  normalized?: string;
  parts?: { id: string; label: string; result: GradeResult }[];
}
export type LabState = Record<string, number | string | boolean | number[]>;
export interface LabProps {
  topic: TopicId;
  value: LabState;
  onChange: (next: LabState) => void;
}
