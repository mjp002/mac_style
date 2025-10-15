import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "../components/theme";

const SafariContainer = styled.div<{ darkMode: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "#ffffff")};
`;

const TopBar = styled.div<{ darkMode: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#f5f5f5")};
  border-bottom: 1px solid
    ${(props) => (props.darkMode ? "#3e3e3e" : "#d1d1d1")};
  gap: 8px;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const NavButton = styled.button<{ darkMode: boolean; disabled?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background-color: ${(props) =>
    props.darkMode ? "#3e3e3e" : "#e0e0e0"};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.darkMode
          ? "#3e3e3e"
          : "#e0e0e0"
        : props.darkMode
        ? "#4e4e4e"
        : "#d0d0d0"};
  }
`;

const AddressBar = styled.div<{ darkMode: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.darkMode ? "#383838" : "#ffffff")};
  border: 1px solid ${(props) => (props.darkMode ? "#4e4e4e" : "#c0c0c0")};
  border-radius: 6px;
  padding: 0 10px;
  height: 32px;
`;

const AddressInput = styled.input<{ darkMode: boolean }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
  font-size: 13px;
  padding: 0 8px;

  &::placeholder {
    color: ${(props) => (props.darkMode ? "#888888" : "#999999")};
  }
`;

const RefreshButton = styled.button<{ darkMode: boolean }>`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#4e4e4e" : "#e0e0e0")};
  }
`;

const BrowserContent = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const LoadingOverlay = styled.div<{ darkMode: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) =>
    props.darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${(props) => (props.darkMode ? "#ffffff" : "#000000")};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 122, 255, 0.3);
  border-top-color: rgba(0, 122, 255, 1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Safari = () => {
  const { darkMode } = useTheme();
  const [url, setUrl] = useState("https://www.google.com/webhp?igu=1");
  const [inputUrl, setInputUrl] = useState("https://www.google.com/webhp?igu=1");
  const [history, setHistory] = useState<string[]>(["https://www.google.com/webhp?igu=1"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);

  const handleNavigate = (newUrl: string) => {
    let finalUrl = newUrl.trim();

    // If no protocol, add https://
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      // Check if it looks like a URL (has a dot and no spaces)
      if (finalUrl.includes(".") && !finalUrl.includes(" ")) {
        finalUrl = "https://" + finalUrl;
      } else {
        // Otherwise, treat it as a search query
        finalUrl = "https://www.google.com/search?q=" + encodeURIComponent(finalUrl);
      }
    }

    setIsLoading(true);
    setUrl(finalUrl);
    setInputUrl(finalUrl);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Force iframe reload
    setKey(prev => prev + 1);

    // Remove loading state after a delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNavigate(inputUrl);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousUrl = history[newIndex];
      setUrl(previousUrl);
      setInputUrl(previousUrl);
      setKey(prev => prev + 1);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setUrl(nextUrl);
      setInputUrl(nextUrl);
      setKey(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <SafariContainer darkMode={darkMode}>
      <TopBar darkMode={darkMode}>
        <NavigationButtons>
          <NavButton
            darkMode={darkMode}
            onClick={handleBack}
            disabled={historyIndex === 0}
            title="Back"
          >
            ←
          </NavButton>
          <NavButton
            darkMode={darkMode}
            onClick={handleForward}
            disabled={historyIndex === history.length - 1}
            title="Forward"
          >
            →
          </NavButton>
        </NavigationButtons>
        <AddressBar darkMode={darkMode}>
          <span style={{ fontSize: "14px", marginRight: "4px" }}>🔒</span>
          <AddressInput
            darkMode={darkMode}
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search or enter website name"
          />
          <RefreshButton
            darkMode={darkMode}
            onClick={handleRefresh}
            title="Refresh"
          >
            ↻
          </RefreshButton>
        </AddressBar>
      </TopBar>
      <BrowserContent>
        {isLoading && (
          <LoadingOverlay darkMode={darkMode}>
            <Spinner />
          </LoadingOverlay>
        )}
        <IFrame
          key={key}
          src={url}
          title="Safari Browser"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </BrowserContent>
    </SafariContainer>
  );
};

export default Safari;
