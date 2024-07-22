import { SlideshowLightbox } from "lightbox.js-react";
interface PrescriptionsProps {
  chief_complaint_id: number;
}
const Perscriptions = ({ chief_complaint_id }: PrescriptionsProps) => {
  console.log(chief_complaint_id);
  return (
    <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto">
      <img
        className="w-full rounded"
        src="https://source.unsplash.com/pAKCx4y2H6Q/1400x1200"
      />
      <img
        className="w-full rounded"
        src="https://source.unsplash.com/AYS2sSAMyhc/1400x1200"
      />
      <img
        className="w-full rounded"
        src="https://source.unsplash.com/Kk8mEQAoIpI/1600x1200"
      />
      <img
        className="w-full rounded"
        src="https://source.unsplash.com/HF3X2TWv1-w/1600x1200"
      />
    </SlideshowLightbox>
  );
};

export default Perscriptions;
