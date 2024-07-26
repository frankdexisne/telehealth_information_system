import { Group, Text } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import api from "../../utils/api";

interface AttachFileProps {
  encounter_id: number;
}

const AttachFile = (props: Partial<DropzoneProps & AttachFileProps>) => {
  return (
    <Dropzone
      onDrop={(files) => {
        api.post(
          `/patient-chief-complaints/attach-file/${props.encounter_id}`,
          {
            file: files[0],
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }}
      maxSize={5 * 1024 ** 2}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};

export default AttachFile;
