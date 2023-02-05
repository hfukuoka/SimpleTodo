import {
  Avatar,
  Button,
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
              <Text fz="md" c="white">
                {"hayato fukuoka"}
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
                Log Out
              </div>
            </a>
          </>
        ) : (
          <div>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
              />

              <PasswordInput
                required
                label="Password"
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
            <Button type="submit" onClick={handlerGen("SignIn")}>
              Sign In
            </Button>
            <Button type="submit" onClick={handlerGen("SignUp")}>
              Sign Up
            </Button>
          </div>
        )}
      </Navbar.Section>
    </>
  );
};
