import { Plugin, Modal, parseYaml } from 'obsidian';
import React, { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { ReactView } from './ReactView';

interface Role {
	title: string;
	date: string;
	points: string[];
}

interface Experience {
	company: string;
	roles: Role[];
}

export interface CVData {
	name: string;
	title?: string; // Requirement #1: Optional
	contact: Record<string, string>;
	experiences: Experience[];
	education: Experience[];
}

class CvModal extends Modal {
	root: Root | null = null;

	parseMarkdown(markdown: string): CVData {
		const lines = markdown.split('\n');
		const yamlEndIndex = lines.indexOf('---', 1);
		const yamlContent = lines.slice(1, yamlEndIndex).join('\n');
		const frontmatter = parseYaml(yamlContent);

		const data: CVData = {
			name: frontmatter.name || 'Name Missing',
			title: frontmatter.title, // Requirement #1
			contact: frontmatter.contact || {},
			experiences: [],
			education: []
		};

		let currentSection: 'experience' | 'education' | null = null;
		let currentCompany: Experience | null = null;
		let currentRole: Role | null = null;

		for (let i = yamlEndIndex + 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue;

			if (line === '## Experience') { currentSection = 'experience'; continue; }
			if (line === '## Education') { currentSection = 'education'; continue; }

			if (line.startsWith('### ')) {
				// Requirement #2: New Company context
				currentCompany = { company: line.replace('### ', ''), roles: [] };
				if (currentSection === 'experience') data.experiences.push(currentCompany);
				if (currentSection === 'education') data.education.push(currentCompany);
				currentRole = null;
			}
			else if (line.startsWith('#### ') && currentCompany) {
				// Requirement #2: Nested Role under company
				const [title, date] = line.replace('#### ', '').split('|').map(s => s.trim());
				currentRole = { title, date: date || '', points: [] };
				currentCompany.roles.push(currentRole);
			}
			else if ((line.startsWith('- ') || line.startsWith('* ')) && currentRole) {
				currentRole.points.push(line.substring(2).trim());
			}
		}
		return data;
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('cv-preview-modal');

		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return;

		const markdown = await this.app.vault.cachedRead(activeFile);
		const structuredData = this.parseMarkdown(markdown);

		const reactContainer = contentEl.createDiv();
		this.root = createRoot(reactContainer);
		this.root.render(
			React.createElement(StrictMode, null,
				React.createElement(ReactView, { data: structuredData })
			)
		);
	}

	onClose() {
		this.root?.unmount();
		this.contentEl.empty();
	}
}

export default class ThecapCvGenerator extends Plugin {
	async onload() {
		this.addRibbonIcon('pdf-file', 'Preview curriculum', () => {
			new CvModal(this.app).open();
		});

		this.addCommand({
			id: 'thecap-cv-generator-preview',
			name: 'Open curriculum preview',
			callback: () => {
				new CvModal(this.app).open();
			}
		});
	}
}