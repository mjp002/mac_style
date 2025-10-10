import { useState, ReactNode } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { useTheme } from "./theme";

const AppWindow = styled.div<{ darkMode: boolean; isMinimized: boolean }>`
  display: ${(props) => (props.isMinimized ? "none" : "flex")};
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "white")};
  color: ${(props) => (props.darkMode ? "white" : "black")};
  border: 1px solid ${(props) => (props.darkMode ? "#3e3e3e" : "#ccc")};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
`;

const WindowHeader = styled.div<{ darkMode: boolean }>`
  background-color: ${(props) => (props.darkMode ? "#2d2d2d" : "#f1f1f1")};
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  border-bottom: 1px solid
    ${(props) => (props.darkMode ? "#3e3e3e" : "#d1d1d1")};
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ControlButton = styled.button<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  background-color: ${(props) => props.color};
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.2);
  }

  &:hover::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 8px;
    color: rgba(0, 0, 0, 0.6);
  }
`;

const CloseButton = styled(ControlButton)`
  &:hover::before {
    content: "×";
    font-size: 14px;
    font-weight: bold;
  }
`;

const MinimizeButton = styled(ControlButton)`
  &:hover::before {
    content: "−";
    font-size: 12px;
    font-weight: bold;
  }
`;

const MaximizeButton = styled(ControlButton)<{ disabled?: boolean }>`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover::before {
    content: ${(props) => (props.disabled ? '""' : '"⤢"')};
    font-size: 10px;
  }
`;

const WindowTitle = styled.div`
  font-weight: 500;
  font-size: 13px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const WindowContent = styled.div`
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

interface WindowProps {
  title: string;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  onClose: () => void;
  zIndex?: number;
  onFocus?: () => void;
  fixedSize?: { width: number; height: number };
}

const Window = ({
  title,
  children,
  initialPosition,
  onClose,
  zIndex = 100,
  onFocus,
  fixedSize,
}: WindowProps) => {
  const { darkMode } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({
    width: 800,
    height: 600,
    x: initialPosition.x,
    y: initialPosition.y,
  });

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    if (fixedSize) return; // 고정 크기일 경우 최대화 비활성화
    if (!isMaximized) {
      // 현재 크기 저장
      const rnd = document.querySelector(`[data-window-title="${title}"]`);
      if (rnd) {
        const rect = rnd.getBoundingClientRect();
        setPreviousSize({
          width: rect.width,
          height: rect.height,
          x: rect.left,
          y: rect.top,
        });
      }
    }
    setIsMaximized(!isMaximized);
  };

  const getWindowSize = () => {
    if (isMaximized) {
      return {
        width: window.innerWidth,
        height: window.innerHeight - 30, // 메뉴바 높이 제외
        x: 0,
        y: 30, // 메뉴바 아래
      };
    }
    return previousSize;
  };

  const windowSize = getWindowSize();

  return (
    <Rnd
      data-window-title={title}
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: fixedSize?.width || 800,
        height: fixedSize?.height || 600,
      }}
      position={
        isMaximized ? { x: windowSize.x, y: windowSize.y } : undefined
      }
      size={
        fixedSize
          ? { width: fixedSize.width, height: fixedSize.height }
          : isMaximized
          ? { width: windowSize.width, height: windowSize.height }
          : undefined
      }
      bounds="parent"
      minWidth={fixedSize?.width || 300}
      minHeight={fixedSize?.height || 200}
      disableDragging={isMaximized}
      enableResizing={!fixedSize && !isMaximized}
      style={{ zIndex }}
      onMouseDown={onFocus}
    >
      <AppWindow darkMode={darkMode} isMinimized={isMinimized}>
        <WindowHeader darkMode={darkMode}>
          <WindowControls>
            <CloseButton color="#ff5f57" onClick={onClose} />
            <MinimizeButton color="#ffbd2e" onClick={handleMinimize} />
            <MaximizeButton
              color="#28ca42"
              onClick={handleMaximize}
              disabled={!!fixedSize}
            />
          </WindowControls>
          <WindowTitle>{title}</WindowTitle>
          <div style={{ width: "60px" }} /> {/* Spacer for centering */}
        </WindowHeader>
        <WindowContent>{children}</WindowContent>
      </AppWindow>
    </Rnd>
  );
};

export default Window;
