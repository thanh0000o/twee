import type { FC } from 'react';
import { WorkImagePreview } from './work-image-preview';
import { workAssetUrl } from '../lib/works';
import { useReveal } from '../motion/use-reveal';

type Props = { file: string; previewFile?: string; alt: string; caption: string; label?: string; primary?: boolean; eager?: boolean; numberedOnly?: boolean };

export const EditorialFigure: FC<Props> = ({ file, previewFile, alt, caption, label, primary, eager, numberedOnly }) => {
  // Images visible on load (primary or eager) appear straight away.
  const ref = useReveal<HTMLElement>(!primary && !eager);
  return (
  <figure ref={ref} className={`ed-fig${primary ? ' ed-primary' : ''}`}>
    <div className="ed-stage">
      <WorkImagePreview src={workAssetUrl(file)} alt={alt} label={label ?? `Open ${caption} at full size`}>
        <img src={workAssetUrl(previewFile ?? file)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </WorkImagePreview>
    </div>
    <figcaption>{numberedOnly ? null : caption}</figcaption>
  </figure>
  );
};
