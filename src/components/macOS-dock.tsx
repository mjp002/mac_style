import { useState } from "react";
import styled from "styled-components";
import Window from "./Window";
import SettingsWindow from "./settings";
import Profile from "../routes/profile";
import PacmanGame from "../routes/pacman";
import { useTheme } from "./theme";

const DockContainer = styled.div<{ darkMode: boolean }>`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  background-color: ${(props) =>
    props.darkMode ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  padding: 8px 15px;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid
    ${(props) =>
      props.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

const DockItem = styled.div<{ hasImage: boolean; bgColor?: string; isAnimating?: boolean }>`
  width: 56px;
  height: 56px;
  margin: 0 5px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.hasImage ? "inherit" : "30px")};
  border-radius: 14px;
  background: ${(props) => props.bgColor || "transparent"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-10px) scale(1.15);
  }

  ${(props) => props.isAnimating && `
    animation: bounce 0.5s ease-in-out 2;
  `}

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const DockSeparator = styled.div<{ darkMode: boolean }>`
  width: 1px;
  height: 40px;
  background-color: ${(props) =>
    props.darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"};
  margin: 0 10px;
`;

interface App {
  id: number;
  name: string;
  url?: string;
  component?: "Settings" | "Portfolio" | "Pacman";
  initialPosition: { x: number; y: number };
}

const Dock = () => {
  const [openApps, setOpenApps] = useState<App[]>([]);
  const [appId, setAppId] = useState(0);
  const [topZIndex, setTopZIndex] = useState(100);
  const [animatingApp, setAnimatingApp] = useState<string | null>(null);
  const { darkMode } = useTheme();
  const initialPosition = { x: 100, y: 100 };
  const offsetIncrement = 30;

  const handleOpenApp = (
    appName: string,
    url?: string,
    component?: "Settings" | "Portfolio" | "Pacman"
  ) => {
    // Trigger bounce animation
    setAnimatingApp(appName);

    // Open app after 1 second bounce animation
    setTimeout(() => {
      setAnimatingApp(null);

      const newAppId = appId + 1;
      setAppId(newAppId);

      // 화면 크기를 고려한 위치 계산
      const maxX = window.innerWidth - 800 - 100;
      const maxY = window.innerHeight - 600 - 100;

      const newPosition = {
        x: Math.min(
          initialPosition.x + ((newAppId * offsetIncrement) % maxX),
          maxX
        ),
        y: Math.min(
          initialPosition.y + ((newAppId * offsetIncrement) % maxY),
          maxY
        ),
      };

      setOpenApps((prevApps) => [
        ...prevApps,
        { id: newAppId, name: appName, url, component, initialPosition: newPosition },
      ]);
    }, 1000);
  };

  const handleCloseApp = (appId: number) => {
    setOpenApps((prevApps) => prevApps.filter((app) => app.id !== appId));
  };

  const handleFocusApp = () => {
    setTopZIndex((prev) => prev + 1);
  };

  const renderAppContent = (app: App) => {
    if (app.component === "Settings") {
      return <SettingsWindow />;
    }
    if (app.component === "Portfolio") {
      return <Profile />;
    }
    if (app.component === "Pacman") {
      return <PacmanGame />;
    }
    if (app.url) {
      return (
        <iframe
          src={app.url}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title={app.name}
        />
      );
    }
    return <div>No content available</div>;
  };

  return (
    <>
      <DockContainer darkMode={darkMode}>
        {/* Finder */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #4A9EFF 0%, #1E88E5 100%)"
          onClick={() => handleOpenApp("Finder")}
          isAnimating={animatingApp === "Finder"}
          title="Finder"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 12C28 12 22 12 22 18V38C22 44 28 44 28 44C28 44 34 44 34 38V18C34 12 28 12 28 12Z" fill="white" fillOpacity="0.9"/>
            <path d="M20 24H36V26H20V24Z" fill="#1E88E5"/>
            <path d="M28 16C28 16 24 16 24 20V36C24 40 28 40 28 40C28 40 32 40 32 36V20C32 16 28 16 28 16Z" fill="white" fillOpacity="0.3"/>
          </svg>
        </DockItem>

        {/* Launchpad */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #E3E3E3 0%, #B0B0B0 100%)"
          onClick={() => handleOpenApp("Launchpad")}
          isAnimating={animatingApp === "Launchpad"}
          title="Launchpad"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="24" y="14" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="34" y="14" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="14" y="24" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="24" y="24" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="34" y="24" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="14" y="34" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="24" y="34" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
            <rect x="34" y="34" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
          </svg>
        </DockItem>

        <DockSeparator darkMode={darkMode} />

        {/* Google Chrome */}
        <DockItem
          hasImage={true}
          onClick={() =>
            handleOpenApp(
              "Google Chrome",
              "https://www.google.com/webhp?igu=1"
            )
          }
          isAnimating={animatingApp === "Google Chrome"}
          title="Google Chrome"
        >
          <img src="/images/chrome_icon.png" alt="Chrome" />
        </DockItem>

        {/* Resume */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)"
          onClick={() => handleOpenApp("Resume", undefined, "Portfolio")}
          isAnimating={animatingApp === "Resume"}
          title="Resume"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="12" width="24" height="32" rx="2" fill="white" fillOpacity="0.95"/>
            <line x1="20" y1="20" x2="36" y2="20" stroke="#EE5A6F" strokeWidth="2" strokeLinecap="round"/>
            <line x1="20" y1="26" x2="36" y2="26" stroke="#EE5A6F" strokeWidth="2" strokeLinecap="round"/>
            <line x1="20" y1="32" x2="32" y2="32" stroke="#EE5A6F" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </DockItem>

        {/* Pac-Man Game */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
          onClick={() => handleOpenApp("Pac-Man", undefined, "Pacman")}
          isAnimating={animatingApp === "Pac-Man"}
          title="Pac-Man Game"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 12 A16 16 0 1 1 28 44 L28 28 Z" fill="#FFFF00"/>
            <circle cx="24" cy="22" r="2" fill="#000"/>
          </svg>
        </DockItem>

        {/* Calculator */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)"
          onClick={() => handleOpenApp("Calculator")}
          isAnimating={animatingApp === "Calculator"}
          title="Calculator"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="12" width="28" height="32" rx="3" fill="white" fillOpacity="0.2"/>
            <rect x="16" y="14" width="24" height="8" rx="1" fill="white" fillOpacity="0.9"/>
            <circle cx="20" cy="30" r="2" fill="white" fillOpacity="0.9"/>
            <circle cx="28" cy="30" r="2" fill="white" fillOpacity="0.9"/>
            <circle cx="36" cy="30" r="2" fill="white" fillOpacity="0.9"/>
            <circle cx="20" cy="38" r="2" fill="white" fillOpacity="0.9"/>
            <circle cx="28" cy="38" r="2" fill="white" fillOpacity="0.9"/>
            <circle cx="36" cy="38" r="2" fill="white" fillOpacity="0.9"/>
          </svg>
        </DockItem>

        <DockSeparator darkMode={darkMode} />

        {/* Settings */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #8E8E93 0%, #636366 100%)"
          onClick={() => handleOpenApp("Settings", undefined, "Settings")}
          isAnimating={animatingApp === "Settings"}
          title="Settings"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 18C22.477 18 18 22.477 18 28C18 33.523 22.477 38 28 38C33.523 38 38 33.523 38 28C38 22.477 33.523 18 28 18Z" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="28" cy="28" r="4" fill="white"/>
            <rect x="27" y="10" width="2" height="6" rx="1" fill="white"/>
            <rect x="27" y="40" width="2" height="6" rx="1" fill="white"/>
            <rect x="40" y="27" width="6" height="2" rx="1" fill="white"/>
            <rect x="10" y="27" width="6" height="2" rx="1" fill="white"/>
            <rect x="39" y="15" width="2" height="6" rx="1" transform="rotate(45 39 15)" fill="white"/>
            <rect x="15" y="39" width="2" height="6" rx="1" transform="rotate(45 15 39)" fill="white"/>
            <rect x="41" y="39" width="6" height="2" rx="1" transform="rotate(135 41 39)" fill="white"/>
            <rect x="17" y="15" width="6" height="2" rx="1" transform="rotate(135 17 15)" fill="white"/>
          </svg>
        </DockItem>

        {/* Trash */}
        <DockItem
          hasImage={false}
          bgColor="linear-gradient(135deg, #E3E3E3 0%, #C7C7CC 100%)"
          onClick={() => handleOpenApp("Trash")}
          isAnimating={animatingApp === "Trash"}
          title="Trash"
        >
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20V42C20 43.1 20.9 44 22 44H34C35.1 44 36 43.1 36 42V20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M16 20H40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M24 16H32V20H24V16Z" fill="white"/>
            <line x1="24" y1="26" x2="24" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="28" y1="26" x2="28" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="32" y1="26" x2="32" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </DockItem>
      </DockContainer>
      {openApps.map((app, index) => (
        <Window
          key={app.id}
          title={app.name}
          initialPosition={app.initialPosition}
          onClose={() => handleCloseApp(app.id)}
          zIndex={topZIndex + index}
          onFocus={handleFocusApp}
        >
          {renderAppContent(app)}
        </Window>
      ))}
    </>
  );
};

export default Dock;
