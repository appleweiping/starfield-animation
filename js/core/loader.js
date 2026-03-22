function isValidAlbum(album) {
  return (
    album &&
    typeof album.id === "string" &&
    typeof album.name === "string" &&
    Array.isArray(album.files)
  );
}

export async function loadManifest(path = "./assets/photos/manifest.json") {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.albums)) {
    throw new Error("Invalid manifest format: missing albums array");
  }

  const albums = data.albums.filter(isValidAlbum);

  if (albums.length === 0) {
    throw new Error("Manifest loaded, but no valid albums were found");
  }

  return albums;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function preloadAlbumImages(albums) {
  const loadedPhotos = new Map();

  const allPaths = [...new Set(albums.flatMap(album => album.files))];

  const results = await Promise.allSettled(
    allPaths.map(async (src) => {
      const img = await loadImage(src);
      loadedPhotos.set(src, img);
    })
  );

  const failed = results.filter(result => result.status === "rejected");

  if (failed.length > 0) {
    console.warn("Some images failed to preload:", failed);
  }

  return loadedPhotos;
}