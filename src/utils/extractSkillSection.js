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
  'RIWAYAT ORGANISASI',
  'ORGANISASI',
  'ORGANIZATION',
  'PROJECT',
  'PROJECTS',
  'PROYEK',
  'CERTIFICATE',
  'CERTIFICATES',
  'SERTIFIKAT',
  'PENGHARGAAN',
  'AWARDS',
  'KONTAK',
  'CONTACT',
  'BAHASA',
  'LANGUAGE',
  'HOBI',
  'HOBBIES',
  'REFERENSI',
  'REFERENCE',
];

export const extractSkillSection = (cvText) => {
  if (!cvText) return '';

  const patterns = [
    /Hard Skills?\s*:?\s*([\s\S]*?)(?=Soft Skills?|Software Skills?|$)/i,
    /Soft Skills?\s*:?\s*([\s\S]*?)(?=Software Skills?|$)/i,
    /Software Skills?\s*:?\s*([\s\S]*?)(?=$)/i,
  ];

  const skills = [];

  patterns.forEach((pattern) => {
    const match = cvText.match(pattern);

    if (match?.[1]) {
      skills.push(match[1].trim());
    }
  });

  return skills
    .join(' ')
    .replace(/\r/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};