// lib/downloadUtils.ts
export const downloadFile = async (
  resumeUrl: string, 
  filename: string,
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  try {
    const response = await fetch(resumeUrl);
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Get total file size
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Track download progress (if needed)
    let loaded = 0;
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        // Report progress
        if (onProgress && total > 0) {
          onProgress((loaded / total) * 100);
        }
      }
    }
    
    // Create blob from chunks
    const blob = new Blob(chunks as BlobPart[]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    return false;
  }
};
