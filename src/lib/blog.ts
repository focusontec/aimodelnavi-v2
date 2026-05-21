import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'src/content/blog');
const blogEnDir = path.join(process.cwd(), 'src/content/blog-en');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  content: string;
}

function loadPostFromFile(filepath: string, slug: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title,
      date: data.date,
      tag: data.tag,
      excerpt: data.excerpt,
      content,
    };
  } catch {
    return null;
  }
}

export function getAllPosts(locale: string = 'ja'): BlogPost[] {
  if (locale === 'en') {
    // EN: only return posts that have actual EN translations
    if (!fs.existsSync(blogEnDir)) return [];
    const files = fs.readdirSync(blogEnDir).filter((f) => f.endsWith('.md'));
    return files
      .map((file) => {
        const slug = file.replace(/\.md$/, '');
        return loadPostFromFile(path.join(blogEnDir, file), slug);
      })
      .filter((p): p is BlogPost => p !== null)
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  // JA: read from blog/
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      return loadPostFromFile(path.join(blogDir, file), slug);
    })
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string, locale: string = 'ja'): BlogPost | null {
  if (locale === 'en') {
    // EN: only return if actual EN version exists
    const enPath = path.join(blogEnDir, `${slug}.md`);
    return loadPostFromFile(enPath, slug);
  }
  return loadPostFromFile(path.join(blogDir, `${slug}.md`), slug);
}
