import { useRouteError, Link } from "react-router-dom";
import "./index.scss";
import _404 from "./assets/404.svg";
import meteor from "./assets/meteor.svg";
import astronaut from "./assets/astronaut.svg";
import spaceship from "./assets/spaceship.svg";

export function ErrorPage() {
  const error = useRouteError() as { statusText: string; message: string };
  console.error(error);

  return (
    <div id="error-page">
      <div className="mars"></div>
      <img src={_404} className="logo-404" />
      <img src={meteor} className="meteor" />
      <p className="title">Oh no!!</p>
      <p className="subtitle">
        You’re either misspelling the URL <br /> or requesting a page that's no longer here.
      </p>
      <div>
        <Link className="btn-back" to="/">
          Back to home page
        </Link>
      </div>
      <img src={astronaut} className="astronaut" />
      <img src={spaceship} className="spaceship" />
    </div>
  );
}
