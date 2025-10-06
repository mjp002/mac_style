import React, { useState } from "react";
import styled from "styled-components";
import { useTheme } from "./theme";

const Container = styled.div<{ darkMode: boolean }>`
  display: flex;
  height: 100%;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "white")};
  color: ${(props) => (props.darkMode ? "white" : "black")};
`;

const Sidebar = styled.div<{ darkMode: boolean }>`
  width: 200px;
  flex-shrink: 0;
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#f1f1f1")};
  border-right: 1px solid
    ${(props) => (props.darkMode ? "#3e3e3e" : "#ccc")};
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const MenuItem = styled.div<{ active: boolean; darkMode: boolean }>`
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 13px;
  background-color: ${(props) =>
    props.active
      ? props.darkMode
        ? "#3e3e3e"
        : "#ddd"
      : "transparent"};
  &:hover {
    background-color: ${(props) => (props.darkMode ? "#3e3e3e" : "#ddd")};
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
`;

const BrightnessSlider = styled.input<{ darkMode: boolean }>`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(to right, #555, #007aff)"
      : "linear-gradient(to right, #ddd, #007aff)"};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    border: 2px solid #007aff;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    border: 2px solid #007aff;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const BackgroundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  margin-top: 10px;
`;

const BackgroundImage = styled.img<{ selected: boolean }>`
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  border-radius: 8px;
  border: 3px solid ${(props) => (props.selected ? "#007aff" : "transparent")};
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#007aff" : "#ccc")};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const backgrounds: string[] = [
  "/background/Bookshelves-Background-for-Mac.jpg",
  "/background/Desktop-Background-Widescreen-for-Mac.jpg",
  "/background/Wallpaper-Wide-for-Mac-book.jpg",
];

const SettingsWindow = () => {
  const [brightness, setBrightness] = useState(100);
  const [activeMenu, setActiveMenu] = useState("display");
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedBackground, setSelectedBackground] = useState(() => {
    return localStorage.getItem("backgroundImage") || backgrounds[0];
  });

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBrightness(value);
    document.body.style.filter = `brightness(${value}%)`;
  };

  const handleBackgroundChange = (bg: string) => {
    setSelectedBackground(bg);
    localStorage.setItem("backgroundImage", bg);
    const event = new CustomEvent("backgroundChange", { detail: bg });
    window.dispatchEvent(event);
  };

  return (
    <Container darkMode={darkMode}>
      <Sidebar darkMode={darkMode}>
        <MenuItem
          active={activeMenu === "display"}
          darkMode={darkMode}
          onClick={() => setActiveMenu("display")}
        >
          Display
        </MenuItem>
        <MenuItem
          active={activeMenu === "wallpaper"}
          darkMode={darkMode}
          onClick={() => setActiveMenu("wallpaper")}
        >
          Desktop & Dock
        </MenuItem>
        <MenuItem
          active={activeMenu === "appearance"}
          darkMode={darkMode}
          onClick={() => setActiveMenu("appearance")}
        >
          Appearance
        </MenuItem>
      </Sidebar>
      <Content>
        {activeMenu === "display" && (
          <>
            <Section>
              <SectionTitle>Display Brightness</SectionTitle>
              <BrightnessSlider
                darkMode={darkMode}
                type="range"
                min="30"
                max="100"
                value={brightness}
                onChange={handleBrightnessChange}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <div style={{ marginTop: "10px", fontSize: "13px" }}>
                {brightness}%
              </div>
            </Section>
          </>
        )}
        {activeMenu === "wallpaper" && (
          <>
            <Section>
              <SectionTitle>Desktop Wallpaper</SectionTitle>
              <BackgroundGrid>
                {backgrounds.map((bg) => (
                  <BackgroundImage
                    key={bg}
                    src={bg}
                    alt="Background Preview"
                    selected={selectedBackground === bg}
                    onClick={() => handleBackgroundChange(bg)}
                  />
                ))}
              </BackgroundGrid>
            </Section>
          </>
        )}
        {activeMenu === "appearance" && (
          <>
            <Section>
              <SectionTitle>Appearance</SectionTitle>
              <div style={{ display: "flex", gap: "10px" }}>
                <ToggleButton active={!darkMode} onClick={toggleDarkMode}>
                  Light
                </ToggleButton>
                <ToggleButton active={darkMode} onClick={toggleDarkMode}>
                  Dark
                </ToggleButton>
              </div>
            </Section>
          </>
        )}
      </Content>
    </Container>
  );
};

export default SettingsWindow;
