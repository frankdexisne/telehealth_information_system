import { IconUserHeart, IconUser, IconInfoCircle } from "@tabler/icons-react";
import { Grid, Alert, Group, Button } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import IconWithLabel from "../../components/base/IconWithLabel";
import Faqs from "../../components/faqs";

export type callerType = "doctor" | "patient" | "log";

const Teleclerk = () => {
  const [selectedCaller, setSelectedCaller] = useState<callerType | null>(
    "patient"
  );
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl my-7 text-blue-700 font-bold">
        Please select a type of caller <Faqs module="tele-clerks" />
      </h1>
      <Grid className="w-[70%]">
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <IconWithLabel
            Component={IconUser}
            label="Patient"
            isSelected={selectedCaller === "patient"}
            onSelect={() => setSelectedCaller("patient")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <IconWithLabel
            Component={IconUserHeart}
            label="Doctor"
            isSelected={selectedCaller === "doctor"}
            onSelect={() => setSelectedCaller("doctor")}
          />
        </Grid.Col>
      </Grid>
      {["patient", "doctor"].includes(selectedCaller!) && (
        <Alert
          className="w-[70%] mt-5"
          variant="light"
          color="blue"
          title={<h1 className="text-xl">Good day!</h1>}
          icon={<IconInfoCircle />}
        >
          Welcome to BRHMC TeleHealth Services! Aming pinapahalagahan ang
          pribadong impormasyon na inyong ibabahagi, subalit, nais po namin
          ipaalam na hindi namin lubusang masisigurado na ligtas ito sa cyber
          hacking. At may kukunin din po kaming pribadong impormasyon. Nais niyo
          po bang magpatuloy?
          <Group my={15} className="w-full flex justify-center">
            <Button
              component={NavLink}
              to={
                selectedCaller === "patient"
                  ? "/patients/create"
                  : "/tele-medicine/create-doctor"
              }
              color="green"
              w={200}
            >
              TELECONSULTATION
            </Button>

            <Button component={NavLink} to="/referral-to-opd" w={200}>
              REFFERED TO OPD
            </Button>
            <Button w={200} component={NavLink} to="/inquiry" color="gray">
              INQUIRY
            </Button>
          </Group>
        </Alert>
      )}
    </div>
  );
};

export default Teleclerk;
