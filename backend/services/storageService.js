/**
 * Storage Service - Local disk storage
 * Photos saved to /backend/uploads/ and served via Express static files.
 * To switch to Google Drive later, just swap this file.
 */

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Save a file to disk
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} entryId
 * @returns {{url: string, filename: string}}
 */
function uploadPhoto(fileBuffer, originalName, entryId) {
  const entryDir = path.join(UPLOAD_DIR, entryId);
  if (!fs.existsSync(entryDir)) {
    fs.mkdirSync(entryDir, { recursive: true });
  }

  const ext = path.extname(originalName);
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(entryDir, filename);

  fs.writeFileSync(filePath, fileBuffer);

  const url = `/uploads/${entryId}/${filename}`;
  return { url, filename };
}

/**
 * Delete all photos for an entry
 * @param {string} entryId
 */
function deleteEntryPhotos(entryId) {
  const entryDir = path.join(UPLOAD_DIR, entryId);
  if (fs.existsSync(entryDir)) {
    fs.rmSync(entryDir, { recursive: true, force: true });
  }
}

module.exports = { uploadPhoto, deleteEntryPhotos };
