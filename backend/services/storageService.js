const { put, del, list } = require('@vercel/blob');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const isVercel = !!process.env.BLOB_READ_WRITE_TOKEN;

// Local fallback directory for dev
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!isVercel && !fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function uploadPhoto(fileBuffer, originalName, entryId) {
  const ext = path.extname(originalName);
  const filename = `${uuidv4()}${ext}`;

  if (isVercel) {
    const blob = await put(`uploads/${entryId}/${filename}`, fileBuffer, {
      access: 'public',
      contentType: getContentType(ext)
    });
    return { url: blob.url, filename };
  } else {
    const entryDir = path.join(UPLOAD_DIR, entryId);
    if (!fs.existsSync(entryDir)) {
      fs.mkdirSync(entryDir, { recursive: true });
    }
    fs.writeFileSync(path.join(entryDir, filename), fileBuffer);
    return { url: `/uploads/${entryId}/${filename}`, filename };
  }
}

async function deleteEntryPhotos(entryId) {
  if (isVercel) {
    const { blobs } = await list({ prefix: `uploads/${entryId}/` });
    for (const blob of blobs) {
      await del(blob.url);
    }
  } else {
    const entryDir = path.join(UPLOAD_DIR, entryId);
    if (fs.existsSync(entryDir)) {
      fs.rmSync(entryDir, { recursive: true, force: true });
    }
  }
}

function getContentType(ext) {
  const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
  return types[ext.toLowerCase()] || 'application/octet-stream';
}

module.exports = { uploadPhoto, deleteEntryPhotos };
