import { dbAggregatedAnswersToAnswers } from "./answer-converters";

describe("dbAggregatedAnswersToAnswers", () => {
  it("should return a map of question IDs to aggregated answers", () => {
    const dbAnswers = [
      {
        location: "L1",
        questionId: "Q1",
        answer: "A1",
        answerCount: 2,
      },
      {
        location: "L1",
        questionId: "Q2",
        answer: "A1",
        answerCount: 1,
      },
      {
        location: "L1",
        questionId: "Q2",
        answer: "A2",
        answerCount: 1,
      },
      {
        location: "L2",
        questionId: "Q2",
        answer: "A2",
        answerCount: 1,
      },
      {
        location: "L2",
        questionId: "Q3",
        answer: "A4",
        answerCount: 1,
      },
      {
        location: "L2",
        questionId: "Q3",
        answer: "A5",
        answerCount: 4,
      },
    ];

    const result = dbAggregatedAnswersToAnswers(dbAnswers);

    const resultKeys = Object.keys(result);
    expect(resultKeys.length).toBe(3);
    expect(resultKeys).toContain("Q1");
    expect(resultKeys).toContain("Q2");
    expect(resultKeys).toContain("Q3");
  });
});
