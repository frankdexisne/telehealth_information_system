import { Grid } from "@mantine/core";
import { FaFacebook, FaViber, FaPhone, FaSatelliteDish } from "react-icons/fa";
import { useState } from "react";
import IconWithLabel from "../base/IconWithLabel";

export type plaformType = "call" | "facebook/messenger" | "radio" | "viber";

interface SelectPlatformProps {
  onConfirm: (platform: plaformType) => void;
  onReset: () => void;
}

const SelectPlatform = (props: SelectPlatformProps) => {
  const [selectedPlatform, setSelectedPlatform] =
    useState<plaformType>("facebook/messenger");
  const confirmPlatform = (platform: plaformType) => {
    setSelectedPlatform(platform);
    props.onConfirm(platform);
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <IconWithLabel
          Component={FaPhone}
          label="Call"
          isSelected={selectedPlatform === "call"}
          onSelect={() => confirmPlatform("call")}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <IconWithLabel
          Component={FaFacebook}
          label="Facebook/Messenger"
          isSelected={selectedPlatform === "facebook/messenger"}
          onSelect={() => confirmPlatform("facebook/messenger")}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <IconWithLabel
          Component={FaSatelliteDish}
          label="Radio"
          isSelected={selectedPlatform === "radio"}
          onSelect={() => confirmPlatform("radio")}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <IconWithLabel
          Component={FaViber}
          label="Viber"
          isSelected={selectedPlatform === "viber"}
          onSelect={() => confirmPlatform("viber")}
        />
      </Grid.Col>
    </Grid>
  );
};

export default SelectPlatform;
