const SECTION_HEADERS = [
  'KEMAMPUAN',
  'SKILLS',
  'TECH STACK',
  'TOOLS',
  'HARD SKILL',
  'SOFTWARE SKILL',
];

const STOP_HEADERS = [
  'PENDIDIKAN',
  'PENGALAMAN',
  'PROJECT',
  'PROYEK',
  'SERTIFIKAT',
  'ORGANISASI',
  'KONTAK',
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