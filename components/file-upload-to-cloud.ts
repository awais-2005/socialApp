// Utility to upload a File to Cloudinary and return the public URL
// You must set your Cloudinary upload preset and cloud name in environment variables or constants

export async function uploadFileToCloudinary(file: File): Promise<string> {
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) {
    console.error('Cloudinary upload error:', data);
    throw new Error('Cloud upload failed: ' + (data.error?.message || JSON.stringify(data)));
  }
  return data.secure_url;
}
