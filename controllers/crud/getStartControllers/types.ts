export type IntroArticleInput = {
  intro_id?: number;
  articleDetails: {
    journal_id: number;
    intro_id?: number;
    type: string;
    sub_class: string;
    main_author: number;
  };

  sections: string[];
};
