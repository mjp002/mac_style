import styled from "styled-components";
import { FaWifi } from "react-icons/fa";
import { IoBatteryFull } from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "./theme";
import { useState, useEffect } from "react";

const BarContainer = styled.div<{ darkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: ${(props) =>
    props.darkMode ? "rgba(30, 30, 30, 0.8)" : "rgba(250, 250, 250, 0.8)"};
  color: ${(props) => (props.darkMode ? "white" : "black")};
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid
    ${(props) => (props.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")};
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MenuItem = styled.div`
  margin-right: 15px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    opacity: 0.7;
  }
`;

const AppleIcon = styled.div`
  font-size: 20px;
  margin-right: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const IconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
`;

const DateTime = styled.div`
  font-size: 14px;
`;

interface MacOSBarProps {
  onSettingsClick: () => void;
}

const MacOSBar = ({ onSettingsClick }: MacOSBarProps) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentDate = () => {
    return currentTime.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <BarContainer darkMode={darkMode}>
      <LeftContainer>
        <AppleIcon></AppleIcon>
        <MenuItem>Finder</MenuItem>
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>View</MenuItem>
      </LeftContainer>
      <RightContainer>
        <IconButton onClick={toggleDarkMode}>
          {darkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
        </IconButton>
        <FaWifi size={16} />
        <IoBatteryFull size={20} />
        <IconButton onClick={onSettingsClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z"
                  stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <rect x="11.5" y="3" width="1" height="3" rx="0.5" fill="currentColor"/>
            <rect x="11.5" y="18" width="1" height="3" rx="0.5" fill="currentColor"/>
            <rect x="18" y="11.5" width="3" height="1" rx="0.5" fill="currentColor"/>
            <rect x="3" y="11.5" width="3" height="1" rx="0.5" fill="currentColor"/>
            <rect x="17.5" y="5.5" width="1" height="3" rx="0.5" transform="rotate(45 17.5 5.5)" fill="currentColor"/>
            <rect x="5.5" y="17.5" width="1" height="3" rx="0.5" transform="rotate(45 5.5 17.5)" fill="currentColor"/>
            <rect x="18.5" y="17.5" width="3" height="1" rx="0.5" transform="rotate(135 18.5 17.5)" fill="currentColor"/>
            <rect x="6.5" y="5.5" width="3" height="1" rx="0.5" transform="rotate(135 6.5 5.5)" fill="currentColor"/>
          </svg>
        </IconButton>
        <DateTime>
          {getCurrentDate()} {getCurrentTime()}
        </DateTime>
      </RightContainer>
    </BarContainer>
  );
};

export default MacOSBar;
