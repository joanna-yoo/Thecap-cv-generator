import { Fragment } from 'react';
import { Document, Page, StyleSheet, View, Text, Link } from '@react-pdf/renderer';
import { Section } from '@/components/Section';
import { CvData } from '@/types';

export const documentStyles = StyleSheet.create({
  page: {
    padding: 32, // reduced from 48
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  viewer: {
    width: '100%',
    height: '100vh',
  },
  header: {
    marginBottom: 16, // reduced from 32
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4, // reduced from 8
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2, // reduced from 4
    fontSize: 10,
  },
  contactText: {
    color: '#333333',
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  bullet: {
    color: '#333333',
    paddingHorizontal: 2, // reduced from 4
    fontSize: 10,
  },
});

export const CvDocument = ({ cvData }: { cvData: CvData }) => {
  return (
    <Document>
      <Page size="A4" style={documentStyles.page}>
        <View style={documentStyles.header}>
          <Text style={documentStyles.name}>{cvData.contact.name}</Text>
          <View style={documentStyles.contactRow}>
            <Text>Phone: </Text>
            <Link src={`tel:${cvData.contact.phone}`} style={documentStyles.contactText}>
              {cvData.contact.phone}
            </Link>
            <Text style={documentStyles.bullet}>•</Text>
            <Text>Email: </Text>
            <Link src={`mailto:${cvData.contact.email}`} style={documentStyles.contactText}>
              {cvData.contact.email}
            </Link>
            <Text style={documentStyles.bullet}>•</Text>
            <Text>Website: </Text>
            <Link
              src={cvData.contact.website.startsWith('http') ? cvData.contact.website : `https://${cvData.contact.website}`}
              style={documentStyles.contactText}
            >
              {cvData.contact.website}
            </Link>
          </View>
        </View>
        {cvData.sections.map((section, index) => (
          <Section key={index} section={section} />
        ))}
      </Page>
    </Document >
  );
};