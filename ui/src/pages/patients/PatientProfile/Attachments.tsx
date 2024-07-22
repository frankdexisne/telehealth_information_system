import { SlideshowLightbox } from "lightbox.js-react";
import { useAttachment } from "../../../hooks";
import { Loader } from "@mantine/core";
interface AttachmemntProps {
  chief_complaint_id: number;
}

const Attachments = ({ chief_complaint_id }: AttachmemntProps) => {
  const { data, isFetching } = useAttachment({ id: chief_complaint_id });

  if (isFetching) {
    return <Loader />;
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[100px] text-slate-500">
        ---NO ATTACHMENTS---
      </div>
    );
  }

  return (
    <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto">
      {data.map((filename: string, index: number) => (
        <img
          className="w-full rounded"
          key={index}
          src={`${import.meta.env.VITE_API_HOST.toString()?.replace(
            "/api",
            ""
          )}/patient_chief_complaints/${chief_complaint_id}/${filename}`}
        />
      ))}
    </SlideshowLightbox>
  );
};

export default Attachments;
