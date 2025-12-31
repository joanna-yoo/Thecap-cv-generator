import React from 'react';
import { CVData } from './main';

interface Props {
  data: CVData;
}

export const ReactView: React.FC<Props> = ({ data }) => {

  // Requirement #3: Markdown Link Recognition
  const renderMarkdownLinks = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(regex);

    if (parts.length === 1) return text;

    const result: (string | JSX.Element)[] = [];
    for (let i = 0; i < parts.length; i += 3) {
      result.push(parts[i]);
      if (parts[i + 1]) {
        result.push(
          <a key={i} href={parts[i + 2]} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
            {parts[i + 1]}
          </a>
        );
      }
    }
    return result;
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#333' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 5px 0' }}>{data.name}</h1>
        {/* Requirement #1: Optional Title */}
        {data.title && <h3 style={{ margin: '0', color: '#666', fontWeight: 'normal' }}>{data.title}</h3>}

        <div style={{ marginTop: '10px' }}>
          {Object.entries(data.contact).map(([key, value], idx) => (
            <span key={key}>
              {idx > 0 && ' • '}
              {renderMarkdownLinks(value)}
            </span>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Experience</h2>
        {data.experiences.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{exp.company}</h3>
            {/* Requirement #2: Map multiple roles */}
            {exp.roles.map((role, rIdx) => (
              <div key={rIdx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{role.title}</span>
                  <span style={{ fontWeight: 'normal' }}>{role.date}</span>
                </div>
                <ul style={{ marginTop: '5px' }}>
                  {role.points.map((point, pIdx) => (
                    <li key={pIdx} style={{ marginBottom: '3px' }}>
                      {renderMarkdownLinks(point)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Education</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: '0' }}>{edu.company}</h3>
            {edu.roles.map((role, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{role.title}</span>
                <span>{role.date}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};