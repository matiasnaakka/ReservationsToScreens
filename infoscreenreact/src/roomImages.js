// filepath: /c:/Users/matia/Desktop/projekti/src/roomImages.js
const roomImageFiles = import.meta.glob("/src/assets/roomImages/*.{jpg,jpeg,png,webp,avif}", { eager: true });

export default Object.fromEntries(
  Object.entries(roomImageFiles).map(([path, module]) => {
    // Extract room number from filename, handling different extensions
    const fileName = path.split("/").pop().replace(/\.(jpg|jpeg|png|webp|avif)$/, "").replace(/\./g, "_");
    return [fileName, module.default];
  })
);