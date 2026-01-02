import React from 'react';
import { View, Text, StyleSheet, Link } from '@react-pdf/renderer';
import { CvSection as CvSectionType } from '@/types';

export const sectionStyles = StyleSheet.create({
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 4,
  },
  itemContainer: { marginBottom: 6 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  primaryText: { fontFamily: 'Helvetica-Bold' },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 1,
  },
  roleTitle: { fontFamily: 'Helvetica-Bold' },
  detailsList: { marginLeft: 8, marginTop: 2 },
  detailItem: { fontSize: 10, marginBottom: 1, flex: 1 },
  bullet: { width: 8, fontSize: 10 },
  bold: { fontFamily: 'Helvetica-Bold' },
  link: { color: '#0000EE', textDecoration: 'underline' }
});

const renderFormattedText = (text: string) => {
  if (!text) return "";
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    if (match[1]) { // Link
      parts.push(<Link key={match.index} src={match[2]} style={sectionStyles.link}>{match[1]}</Link>);
    } else if (match[3]) { // Bold
      parts.push(<Text key={match.index} style={sectionStyles.bold}>{match[3]}</Text>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts.length > 0 ? parts : text;
};

export function Section({ section }: { section: CvSectionType }) {
  return (
    <View style={sectionStyles.section} break={section.break}>
      <Text style={sectionStyles.sectionTitle}>{section.title}</Text>

      {section.items.map((item, idx) => (
        <View key={idx} style={sectionStyles.itemContainer} break={item.break}>
          {(item.primary || item.primaryRight) && (
            <View style={sectionStyles.headerRow}>
              <Text style={sectionStyles.primaryText}>{renderFormattedText(item.primary || '')}</Text>
              <Text>{item.primaryRight}</Text>
            </View>
          )}

          {item.roles && item.roles.length > 0 ? (
            item.roles.map((role, rIdx) => (
              <View key={rIdx}>
                <View style={sectionStyles.secondaryRow}>
                  <Text style={sectionStyles.roleTitle}>{renderFormattedText(role.title)}</Text>
                  <Text style={{ fontStyle: 'italic' }}>{role.date}</Text>
                </View>
                <View style={sectionStyles.detailsList}>
                  {role.details.map((d, dIdx) => (
                    <View key={dIdx} style={{ flexDirection: 'row' }}>
                      <Text style={sectionStyles.bullet}>• </Text>
                      <Text style={sectionStyles.detailItem}>{renderFormattedText(d)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <View style={sectionStyles.detailsList}>
              {item.details.map((d, dIdx) => (
                <View key={dIdx} style={{ flexDirection: 'row' }}>
                  <Text style={sectionStyles.bullet}>• </Text>
                  <Text style={sectionStyles.detailItem}>{renderFormattedText(d)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}