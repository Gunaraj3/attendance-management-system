import { OwnID } from "@ownid/react";
import { useRef } from "react";

export function Login() {
  const emailField = useRef(null);
  const passwordField = useRef(null);

  function onLogin(data) {
    //setting user session
    localStorage.setItem("data", JSON.stringify({ token: data.token }));
    //redirecting user to the account page
    window.location.href = "/account";
  }
  return (
    <form>
      <input ref={emailField} type="email" name="email" />
      <input ref={passwordField} type="password" name="password" />
      <button type="submit">Log In</button>
      <OwnID
        type="login"
        passwordField={passwordField}
        loginIdField={emailField}
        onError={(error) => console.error(error)}
        onLogin={onLogin}
      />
    </form>
  );
}
