export enum ArticleStatus {
  INCOMPLETE = "incomplete",
  NEWSUBMISSION = "newsubmission",
  INPRESS = "inpress",
  EDITORINVITED = "editorinvited",
  NEEDTOASSIGNEDITOR = "needtoassigneditor",
  NEEDTOASSIGNREVIEWER = "needtoassignreviewer",
  UNDERREVIEW = "underreview",
  DECISIONINPROCESS = "decisioninprocess",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  SENTTOAUTHOR = "senttoauthor",
  NOREVIEWCOMPLETED = "noreviewcompleted",
  ONEREVIEWCOMPLETED = "onereviewcompleted",
  TWOREVIEWCOMPLETED = "tworeviewcompleted",
  THREEREVIEWCOMPLETED = "threereviewcompleted",
  FOURORMOREREVIEWCOMPLETED = "fourormorereviewcompleted",
  REVISIONDUE = "revisiondue",
}

export type IntroArticleInput = {
  journal_id: number;
  intro_id?: number;
  type: string;
  title: string;
  abstract: string;
  keywords: string;
  sub_class: string;
  pages?: number;
  belong_to: string;
  issueType: string;
  specialIssue: number;
  article_status?: ArticleStatus;
  main_author: number;
  istick: boolean;
};
