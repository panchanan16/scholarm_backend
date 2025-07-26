export type IntroArticleInput = {
  intro_id?: number;
  articleDetails: {
    intro_id?: number;
    type: string;
    sub_class: string,
    main_author: number;
  };

  sections: string[];
};
