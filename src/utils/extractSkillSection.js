const SECTION_HEADERS = [
  'KEMAMPUAN',
  'KEAHLIAN',
  'KOMPETENSI',
  'SKILLS?',
  'TECH(?:NICAL)?\\s+SKILLS?',
  'TECH\\s+STACK',
  'TOOLS?',
  'HARD\\s+SKILLS?',
  'SOFTWARE\\s+SKILLS?',
  'CORE\\s+COMPETENCIES',
];

const STOP_HEADERS = [
  'PENDIDIKAN',
  'EDUCATION',
  'PENGALAMAN',
  'EXPERIENCE',
  'PROJECT',
  'PROYEK',
  'CERTIFICATE',
  'CERTIFICATES',
  'SERTIFIKAT',
  'ORGANISASI',
  'ORGANIZATION',
  'KONTAK',
  'CONTACT',
];

export const extractSkillSection = (cvText) => {
  if (!cvText) return '';

  const pattern = new RegExp(
    `(?:${SECTION_HEADERS.join('|')})\\s*:?([\\s\\S]*?)(?:${STOP_HEADERS.join('|')}|$)`,
    'i'
  );

  const match = cvText.match(pattern);

  if (!match) {
    return '';
  }

  return match[1]
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};