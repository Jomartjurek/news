import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  query,
  orderBy,
  collection,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "../index";
import { useRef, useEffect } from "react";
import Style from "../styles/components/login/login.module.scss";
import ModalClose from "./modalClose";

const Copyright = () => {
  return (
    <div className={Style.copyright}>
      <p>{"Copyright © "}</p>
      <p>Jomart jurek</p>
      <p>{new Date().getFullYear()}</p>
    </div>
  );
};

const Login = ({ setLogin, btnRef }) => {
  const [users] = useCollectionData(
    query(collection(db, "users"), orderBy("createdAt", "asc"))
  );
  const [t] = useTranslation();
  const loginRef = useRef(null);

  // Function to handle Google sign-in
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Check if user already exists in the database
    let res = true;
    users.forEach((data) => {
      if (data.uid === user.uid) res = false;
    });

    // If user does not exist, add them to the database
    if (res) {
      const createCollect = async () => {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: Timestamp.fromDate(new Date()),
          admin: false,
        });
      };
      createCollect();
    }

    // Close the login modal
    setLogin(false);
  };

  // Effect to listen for Escape key press to close the modal
  // and click outside the modal to close it
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setLogin(false);
      }
    };

    const handleClickOutside = (event) => {
      if (!loginRef.current.contains(event.target)) {
        setLogin(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setLogin]);

  return (
    <>
      <ModalClose
        modal={true}
        setModal={setLogin}
        refModal={loginRef}
        refButton={btnRef}
        refButton2={""}
      />
      <section className={Style.login}>
        <div ref={loginRef} className={Style.login_block}>
          <h1>{t("sign")}</h1>
          <button onClick={login} type="submit">
            <img width={18} src="../img/Login/google.png" alt="google icon" />
            {t("w_google")}
          </button>
          <Copyright />
        </div>
      </section>
    </>
  );
};

export default Login;
