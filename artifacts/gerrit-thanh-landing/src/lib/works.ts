export type WorkImage = {
  file: string;
  alt: string;
  caption: string;
};

export const workAssetUrl = (file: string) => `${import.meta.env.BASE_URL}works/${file}`;

export const internshipCover: Pick<WorkImage, 'file' | 'alt'> = {
  file: 'internship-make-it-work-cover.webp',
  alt: 'Make It Work cover with two reaching hands and the Make It Work logo',
};

export const internshipImages: WorkImage[] = [
  {
    file: 'internship-make-it-work-front.webp',
    alt: 'Make It Work flyer front with two reaching hands',
    caption: 'Flyer — front',
  },
  {
    file: 'internship-make-it-work-back-blurred.webp',
    alt: 'Make It Work flyer back with project information, partner logos and blurred coach portraits',
    caption: 'Flyer — back',
  },
  {
    file: 'make-it-work.webp',
    alt: 'Op zoek naar een toffe job? flyer with a backpack photograph',
    caption: 'Op zoek naar een toffe job? — flyer',
  },
  {
    file: 'youth-infographic.webp',
    alt: 'Youth visualisation with colourful hands and outcome figures',
    caption: 'Youth visualisation',
  },
];