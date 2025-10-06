import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const LoadingContainer = styled.div<{ fadeout: boolean }>`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  animation: ${(props) => (props.fadeout ? fadeOut : "none")} 0.5s ease-out;
`;

const AppleLogo = styled.div`
  font-size: 100px;
  color: white;
  margin-bottom: 30px;
`;

const ProgressBarContainer = styled.div`
  width: 300px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
`;

const progressAnimation = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: white;
  border-radius: 3px;
  animation: ${progressAnimation} 2s ease-out;
`;

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeout(true);
      setTimeout(onLoadingComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <LoadingContainer fadeout={fadeout}>
      <AppleLogo></AppleLogo>
      <ProgressBarContainer>
        <ProgressBar />
      </ProgressBarContainer>
    </LoadingContainer>
  );
};

export default LoadingScreen;
