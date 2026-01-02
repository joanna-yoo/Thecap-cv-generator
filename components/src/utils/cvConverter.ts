import { parse } from 'yaml';
import { ContactInfo, CvData, CvItem, CvProperties, CvSection } from "../types";

export function parseYamlFrontmatter(markdown: string): { properties: CvProperties, content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  if (!match) return { properties: {}, content: markdown };
  const [, frontmatter, content] = match;
  try {
    const properties = parse(frontmatter) as CvProperties;
    return { properties: properties || {}, content: content.trim() };
  } catch {
    return { properties: {}, content: markdown };
  }
}

export function markdownToCv(markdown: string): CvData {
  const { properties, content } = parseYamlFrontmatter(markdown);
  const lines = content.split('\n').filter(line => line.trim());
  const cv: CvData = {
    properties: Object.keys(properties).length > 0 ? properties : undefined,
    contact: { name: '', title: '', phone: '', email: '', location: '', links: [] },
    sections: []
  };

  let currentSection: CvSection | null = null;
  let currentItem: CvItem | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# ')) {
      cv.contact.name = line.replace('# ', '');
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentSection) cv.sections.push(currentSection);
      const title = line.replace('## ', '');
      currentSection = {
        title: title.replace('\\break', '').trim(),
        items: [],
        break: title.includes('\\break')
      };
      currentItem = null;
      continue;
    }

    if (line.startsWith('### ')) {
      const headerLine = line.replace('### ', '');
      const hasBreak = headerLine.endsWith('\\break');
      const cleanHeader = hasBreak ? headerLine.slice(0, -6).trim() : headerLine;
      const [primary, primaryRight] = cleanHeader.split(' | ');

      currentItem = {
        primary,
        primaryRight,
        roles: [],
        details: [],
        break: hasBreak
      };
      if (currentSection) currentSection.items.push(currentItem);
      continue;
    }

    if (line.startsWith('#### ') && currentItem) {
      const [title, date] = line.replace('#### ', '').split(' | ');
      if (!currentItem.roles) currentItem.roles = [];
      currentItem.roles.push({
        title: title.trim(),
        date: date?.trim() || '',
        details: []
      });
      continue;
    }

    if ((line.startsWith('- ') || line.startsWith('* ')) && currentSection) {
      const detail = line.substring(2).trim();
      if (currentItem) {
        // If we have roles, add to the LATEST role
        if (currentItem.roles && currentItem.roles.length > 0) {
          currentItem.roles[currentItem.roles.length - 1].details.push(detail);
        } else {
          currentItem.details.push(detail);
        }
      } else {
        currentSection.items.push({ details: [detail] });
      }
    }
  }

  if (currentSection) cv.sections.push(currentSection);
  return cv;
}

export function validateCvMarkdown(markdown: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const cv = markdownToCv(markdown);
  if (!cv.contact.name) errors.push('Missing Name (# Heading)');
  if (!cv.sections.length) errors.push('At least one section (## Heading) required');
  return { isValid: errors.length === 0, errors };
}