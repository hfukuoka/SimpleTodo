import {
  Avatar,
  Button,
  Flex,
  Group,
  Navbar,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useContext } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsArrowLeftRight } from "react-icons/bs";
import { firebaseAuth } from "../libs/firebase";
import { UserContext } from "./context/user";

type SideFooterPropType = {
  classes: Record<
    | "footer"
    | "header"
    | "link"
    | "navbar"
    | "version"
    | "linkIcon"
    | "linkActive",
    string
  >;
};

export const SideFooter = (props: SideFooterPropType) => {
  const user = useContext(UserContext);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });
  const handlerGen = (type: "SignIn" | "SignUp") => (e: any) => {
    e.preventDefault();
    // This change will trigger `onAuthStateChanged`
    const proc =
      type === "SignIn"
        ? signInWithEmailAndPassword
        : createUserWithEmailAndPassword;
    proc(firebaseAuth, form.values.email, form.values.password)
      .then((userCredential) => {
        console.log("Auth success.");
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to auth");
      });
  };

  return (
    <>
      <Navbar.Section className={props.classes.footer}>
        {user ? (
          <>
            <Group spacing={20} className={props.classes.link}>
              <Avatar size={20} />
              <Text
                sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                fz="md"
                c="white"
              >
                {user.email}
              </Text>
            </Group>

            <a
              href="#"
              className={props.classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <BiLogOut size={20} />
              <div
                style={{ padding: "10px", fontSize: "15px" }}
                onClick={() => firebaseAuth.signOut()}
              >
                Sign Out
              </div>
            </a>
          </>
        ) : (
          <div>
            <Stack>
              <Text c="white" size={15}>
                Email
              </Text>
              <TextInput
                required
                placeholder="Your email"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
              />
              <Text c="white" size={15}>
                Password
              </Text>
              <PasswordInput
                required
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
              />
            </Stack>
            <Flex justify="center" align="center" direction="row" wrap="wrap">
              <Button
                type="submit"
                onClick={handlerGen("SignIn")}
                style={{ margin: "10px" }}
              >
                Sign In
              </Button>
              <Button
                type="submit"
                onClick={handlerGen("SignUp")}
                style={{ margin: "10px" }}
              >
                Sign Up
              </Button>
            </Flex>
          </div>
        )}
      </Navbar.Section>
    </>
  );
};
