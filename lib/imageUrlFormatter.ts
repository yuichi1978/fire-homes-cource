export default function imageUrlFormatter(imagePath: string) {
  return `https://firebasestorage.googleapis.com/v0/b/fire-homes-course-521e5.firebasestorage.app/o/${encodeURIComponent(
    imagePath
  )}?alt=media`;
}
