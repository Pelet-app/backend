/* eslint-disable no-unused-vars */
import fs from 'fs';
import PdfParse from 'pdf-parse';
import InvariantError from '../exceptions/invariant-error.js';


export const extractCvText = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const data = await PdfParse(buffer);

    return data.text;
  } catch (error) {
    throw new InvariantError('Gagal membaca file PDF');
  }
};