import { prisma } from "@/app";

export async function InitiateArticleIntroSections(
  articleDetails,
  sectionsTitle
) {
  const {
    type,
    title,
    abstract,
    keywords,
    sub_class,
    pages,
    belong_to,
    article_status,
    main_author,
  } = articleDetails;

  const tracsaction = await prisma.$transaction(async (db) => {
    // 1. Update the Editors response.
    const IntiatedArticle = await db.intoArticle.create({
      data: {
        type,
        title,
        abstract,
        keywords,
        sub_class,
        pages,
        belong_to,
        article_status,
        main_author,
      },
    });

    if (IntiatedArticle) {
      const sections = sectionsTitle.map((sec) => {
        return { article_id: IntiatedArticle.intro_id, section_title: sec };
      });

      // 2. Based on status update main article status.
      const InsertedSections = await db.articleSection.createMany({
        data: sections,
      });

      return [IntiatedArticle, InsertedSections];
    }
  });

  return tracsaction;
}
