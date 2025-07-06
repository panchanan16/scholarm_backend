import { ArticleStatus } from '@prisma/client';

export type ArticleStatusType = ArticleStatus


export type currentStatusType = ArticleStatusType[] | undefined;
export type updatedStatusType = ArticleStatusType;