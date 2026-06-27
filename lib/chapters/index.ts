import { Chapter } from '@/types';
import { iamChapter } from './iam';
import { vpcChapter } from './vpc';
import { ec2Chapter } from './ec2';
import { s3Chapter } from './s3';
import { cloudfrontChapter } from './cloudfront';

export const chapters: Chapter[] = [
  iamChapter,
  vpcChapter,
  ec2Chapter,
  s3Chapter,
  cloudfrontChapter
];

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find(c => c.id === id);
}

export function getNextChapter(id: string): Chapter | undefined {
  const index = chapters.findIndex(c => c.id === id);
  if (index !== -1 && index < chapters.length - 1) {
    return chapters[index + 1];
  }
  return undefined;
}

export function getPrevChapter(id: string): Chapter | undefined {
  const index = chapters.findIndex(c => c.id === id);
  if (index > 0) {
    return chapters[index - 1];
  }
  return undefined;
}
