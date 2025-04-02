import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import "./App.css";
import LoginPage from "./components/LoginPage";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useState } from "react";
import StudioPage from "./components/StudioPage";
import AboutPage from "./components/AboutPage";
import LibraryPage from "./components/LibraryPage";
import { I18n } from "./injectables/i18n";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

enum Page {
  About = "about",
  Library = "library",
  Login = "login",
  Studio = "studio",
}

const theme = createTheme();

const useStyles = makeStyles((theme) => {
  root: {
  }
});

function App() {
  const classes = useStyles();
  const [page, setPage] = useState<Page>(Page.Library);
  const tabs = [
    { name: I18n.get("tab-library"), value: Page.Library },
    { name: I18n.get("tab-studio"), value: Page.Studio },
    { name: I18n.get("tab-about"), value: Page.About },
  ];

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <header
          style={{
            width: "100%",
            display: "flex",
            "justify-content": "space-between",
          }}
        >
          {tabs.map((tab) => (
            <a
              style={{
                backgroundColor:
                  page === tab.value ? "lightblue" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => setPage(tab.value)}
            >
              {tab.name}
            </a>
          ))}
          <FormGroup style={{ "justify-self": "end" }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label={I18n.get("dark-mode-string")}
            />
          </FormGroup>
        </header>
        <div
          className="router"
          style={{ height: "100%" }}
        >
          {page === Page.About && <AboutPage />}
          {page === Page.Library && <LibraryPage />}
          {page === Page.Login && <LoginPage />}
          {page === Page.Studio && <StudioPage />}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
