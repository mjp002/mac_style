import styled from "styled-components";
import MacOSBar from "../components/macOS-bar";
import Dock from "../components/macOS-dock";
import { useState, useEffect } from "react";
import Window from "../components/Window";
import SettingsWindow from "../components/settings";
import { useTheme } from "../components/theme";

const HomeContainer = styled.div<{ backgroundImage: string; darkMode: boolean }>`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(
      ${(props) =>
        props.darkMode
          ? "rgba(0, 0, 0, 0.4)"
          : "rgba(0, 0, 0, 0.1)"},
      ${(props) =>
        props.darkMode
          ? "rgba(0, 0, 0, 0.4)"
          : "rgba(0, 0, 0, 0.1)"}
    ),
    ${(props) => `url(${props.backgroundImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background-image 0.3s ease;
`;

const Home = () => {
  const { darkMode } = useTheme();
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const saved = localStorage.getItem("backgroundImage");
    return saved || "/background/Bookshelves-Background-for-Mac.jpg";
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleBackgroundChange = (event: CustomEvent) => {
      setBackgroundImage(event.detail);
    };

    window.addEventListener(
      "backgroundChange",
      handleBackgroundChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "backgroundChange",
        handleBackgroundChange as EventListener
      );
  }, []);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <HomeContainer backgroundImage={backgroundImage} darkMode={darkMode}>
      <MacOSBar onSettingsClick={handleSettingsClick} />
      <Dock />
      {showSettings && (
        <Window
          title="System Settings"
          initialPosition={{ x: 200, y: 100 }}
          onClose={handleCloseSettings}
          zIndex={1000}
        >
          <SettingsWindow />
        </Window>
      )}
    </HomeContainer>
  );
};

export default Home;
