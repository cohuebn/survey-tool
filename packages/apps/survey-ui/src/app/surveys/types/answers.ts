// Encapsulating these types in case single answer/multi answer types
// need to support additional primitives in the future

import { Hospital } from "../../hospitals/types";

export type SingleAnswer = string;
export type MultiAnswer = string[];
export type Answer = SingleAnswer | MultiAnswer;

export type SavableAnswer = {
  participantId: string;
  surveyId: string;
  questionId: string;
  answer: SingleAnswer;
  answerTime: Date;
  location?: string;
  department?: string;
  employmentType?: string;
};

export type DBAnswer = SavableAnswer & {
  id: string;
};

export type DBAnswerWithoutParticipant = Omit<DBAnswer, "participantId">;

export type AnswersForQuestions = Record<string, Answer>;

export type AggregatedAnswerForQuestion = {
  questionId: string;
  answer: string;
  answerCount: number;
};

export type AggregatedAnswerWithLocationForQuestion =
  AggregatedAnswerForQuestion & {
    locationId: string;
  };

export type AggregatedAnswersForQuestions = Record<
  string,
  AggregatedAnswerForQuestion[]
>;

export type AggregatedAnswersWithLocationForQuestions = Record<
  string,
  AggregatedAnswerWithLocationForQuestion[]
>;

export type DBParticipatingHospital = {
  location_id: string;
  hospital_name: string;
  hospital_city: string;
  hospital_state: string;
  participant_count: number;
};

export type ParticipatingHospital = {
  hospital: Hospital;
  participantCount: number;
};
