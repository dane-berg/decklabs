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

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

enum Page {
  About = "about",
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
  const [page, setPage] = useState<Page>(Page.Studio);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <header>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Dark mode"
            />
          </FormGroup>
        </header>
        <div className="router">
          {page === Page.About && <AboutPage />}
          {page === Page.Login && <LoginPage />}
          {page === Page.Studio && <StudioPage />}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
