import { Title, Text, Button, Group } from "@mantine/core";
import { Illustration } from "./Illustration";
import classes from "./index.module.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen bg-slate-300 flex justify-center items-center">
      <div className="w-[80%]">
        <div className={classes.inner}>
          <Illustration className={classes.image} />
          <div className={classes.content}>
            <Title className={classes.title}>Nothing to see here</Title>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              className={classes.description}
            >
              Page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you
              think this is an error contact support.
            </Text>
            <Group justify="center">
              <Button component={Link} to="/" size="md">
                Take me back to home page
              </Button>
            </Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
