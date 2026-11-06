import type { AnswerSpec, Lesson } from "../types.ts";

export function responseFieldCount(answer: AnswerSpec): number {
  return answer.kind === "parts" ? answer.parts.length : 1;
}

export function contentStats(
  lessons: readonly Lesson[],
  families: readonly unknown[],
) {
  const questions = lessons.flatMap((lesson) => [
    lesson.prediction,
    ...lesson.practice,
    ...lesson.exit,
  ]);
  const mistakes = (answer: AnswerSpec): number =>
    answer.kind === "parts"
      ? answer.parts.reduce(
          (total, part) => total + (part.mistakes?.length ?? 0),
          0,
        )
      : 0;
  return {
    lessons: lessons.length,
    practice: lessons.reduce(
      (total, lesson) => total + lesson.practice.length,
      0,
    ),
    exit: lessons.reduce((total, lesson) => total + lesson.exit.length, 0),
    predictions: lessons.length,
    questions: questions.length,
    responseFields: questions.reduce(
      (total, question) => total + responseFieldCount(question.answer),
      0,
    ),
    examples: lessons.reduce(
      (total, lesson) => total + lesson.examples.length,
      0,
    ),
    generatorFamilies: families.length,
    feedbackRules: questions.reduce(
      (total, question) =>
        total + (question.mistakes?.length ?? 0) + mistakes(question.answer),
      0,
    ),
  };
}
