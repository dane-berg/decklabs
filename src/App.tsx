import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import "./App.css";
import LoginPage from "./components/LoginPage";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import { useState } from "react";
import StudioPage from "./components/StudioPage";
import AboutPage from "./components/AboutPage";
import LibraryPage from "./components/LibraryPage";
import { I18n } from "./injectables/i18n";
import { ThemeOptions } from "@mui/material/styles";
import { Game } from "./injectables/game/game";
import GamePage from "./components/GamePage";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#177E89",
    },
    secondary: {
      main: "#084C61",
    },
  },
};

enum Page {
  About = "about",
  Library = "library",
  Login = "login",
  Studio = "studio",
}

const tabs = [
  { label: I18n.get("tab-studio"), value: Page.Studio },
  { label: I18n.get("tab-library"), value: Page.Library },
  { label: I18n.get("tab-about"), value: Page.About },
];

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  page: Page;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, page, ...other } = props;
  const index = tabs.findIndex((tab) => tab.value === page) ?? -1;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "calc(100% - 16px)", padding: 8 }}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function App() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const theme = createTheme(themeOptions);
  const [game, setGame] = useState<Game | undefined>(undefined);

  function quickPlay() {
    setGame(new Game());
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppBar component="nav">
          <Toolbar>
            <Box
              component="div"
              sx={{ flexGrow: 1, display: "flex", gap: "8px" }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {I18n.get("decklabs-title")}
              </Typography>
              {!game && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={quickPlay}
                >
                  {I18n.get("quick-play")}
                </Button>
              )}
            </Box>
            {!game && (
              <Tabs
                value={tabIndex}
                onChange={(_, newTabIndex) => setTabIndex(newTabIndex)}
                textColor="inherit"
                indicatorColor="secondary"
                aria-label="navigation tabs"
              >
                {tabs.map((tab) => (
                  <Tab
                    label={tab.label}
                    key={tab.value}
                    sx={{ minWidth: { sm: 144 } }}
                  />
                ))}
              </Tabs>
            )}
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{ height: "calc(100% - 64px)", paddingTop: 8 }}
        >
          {!game && (
            <>
              <TabPanel
                value={tabIndex}
                page={Page.About}
              >
                <AboutPage />
              </TabPanel>
              <TabPanel
                value={tabIndex}
                page={Page.Library}
              >
                <LibraryPage />
              </TabPanel>
              <TabPanel
                value={tabIndex}
                page={Page.Login}
              >
                <LoginPage />
              </TabPanel>
              <TabPanel
                value={tabIndex}
                page={Page.Studio}
              >
                <StudioPage />
              </TabPanel>
            </>
          )}
          {!!game && <GamePage game={game} />}
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;

/** For dark mode
 *           <FormGroup style={{ justifySelf: "end" }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label={I18n.get("dark-mode-string")}
            />
          </FormGroup>
 */
