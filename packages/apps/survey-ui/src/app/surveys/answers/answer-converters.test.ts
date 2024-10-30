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

    const q1Answers = result.Q1;
    expect(q1Answers.length).toBe(1);
    expect(q1Answers[0].answer).toBe("A1");
    expect(q1Answers[0].answerCount).toBe(2);

    const q2Answers = result.Q2;
    expect(q2Answers.length).toBe(2);
    expect(q2Answers[0].answer).toBe("A1");
    expect(q2Answers[0].answerCount).toBe(1);
    expect(q2Answers[1].answer).toBe("A2");
    expect(q2Answers[1].answerCount).toBe(2);

    const q3Answers = result.Q3;
    expect(q3Answers.length).toBe(2);
    expect(q3Answers[0].answer).toBe("A4");
    expect(q3Answers[0].answerCount).toBe(1);
    expect(q3Answers[1].answer).toBe("A5");
    expect(q3Answers[1].answerCount).toBe(4);
  });
});
