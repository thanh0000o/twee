export type WorkImage = { file: string; alt: string; caption: string };
export const workAssetUrl = (file: string) => `/__mockup/images/works/${file}`;
export const internshipCover: Pick<WorkImage, 'file' | 'alt'> = {
  file: 'internship-make-it-work-cover.webp',
  alt: 'Make It Work cover with two reaching hands and the Make It Work logo',
};
