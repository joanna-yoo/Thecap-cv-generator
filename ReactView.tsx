import * as React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { documentStyles, markdownToCv, CvDocument, validateCvMarkdown } from './components/src/index';

interface ReactViewProps {
  markdown: string;
}

export const ReactView: React.FC<ReactViewProps> = ({ markdown }) => {
  const { isValid, errors } = validateCvMarkdown(markdown);

  if (!isValid) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h3>Format Error</h3>
        {errors.map((e, i) => <div key={i}>• {e}</div>)}
      </div>
    );
  }

  const cvData = markdownToCv(markdown);

  return (
    <div className="react-view-container">
      <PDFViewer style={documentStyles.viewer}>
        <CvDocument cvData={cvData} />
      </PDFViewer>
    </div>
  );
};