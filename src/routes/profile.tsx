import styled from "styled-components";
import htmlParser from "html-react-parser";
import { useTheme } from "../components/theme";

const resumeContent = `
<h1>Jong Phil Moon</h1>
<p>Permanent Resident in USA | <a href="mailto:moonjongphil@gmail.com">moonjongphil@gmail.com</a> | <a href="https://github.com/mjp002" target="_blank" rel="noopener noreferrer">github.com/mjp002</a></p>

<h2>Experience</h2>

<h3>Educon <em>Oct 2020 – Present</em></h3>
<p><strong>Software Engineer</strong> — Startup, Seoul, South Korea</p>

<h4>Pharmy (파미) — Pharmaceutical Application <em>Nov 2020 – Present</em></h4>
<ul>
  <li>Collaborated with designers and backend engineers to plan, design, and deliver a pharmaceutical app using Flutter, Dart, AWS, JavaScript, TypeScript, Elasticsearch, PostgreSQL, and GraphQL, which has surpassed 2,000 active users, onboarded 60+ pharmacies, and maintains a retention rate of over 97%.</li>
  <li>Successfully worked in an agile development environment, contributing to core features and taking ownership of cleaning and structuring large-scale pharmaceutical data for app integration.</li>
  <li>Released and maintained the app on Google Play and App Store, ensuring compliance with platform policies and automating deployment with Jenkins-based CI/CD pipelines.</li>
  <li>Implemented a supplement comparison feature using Flutter's Provider, accessed by 93% of active users daily, improving purchase decision time by 40%.</li>
  <li>Applied automated user authentication using Firebase for increased security and user convenience, including support for Google, Apple, Kakao, and Naver platforms.</li>
  <li>Led the development of a pharmacy reservation feature that enabled users to reserve medications directly with pharmacies, resulting in a 36% increase in pharmacy sales.</li>
  <li>Designed and developed an in-app advertising feature for pharmacies to promote their products, contributing directly to increased sales.</li>
  <li>Utilized Dart and Flutter to create a website for administrators to manage user data and upload health-related content.</li>
  <li>Built a TypeScript + React platform for pharmacies, enabling online drug sales and user interaction; 60+ pharmacies signed up within a week of advertising.</li>
  <li>Enhanced UI/UX design using Tailwind CSS by creating reusable components like list tiles (drug sales, ad) and navigation tabs, optimizing responsive layouts, and streamlining styling with utility classes for better maintainability.</li>
  <li>Integrated Elasticsearch and Python pipelines to refine large-scale pharmaceutical data, enhancing data-refining efficiency by 80%.</li>
</ul>

<h4>feeel;d Study (필디스터디) — Architect Educational Application <em>Oct 2020 – May 2021</em></h4>
<ul>
  <li>Focused on frontend development, utilizing JavaScript, React Native, and Expo.</li>
  <li>Applied social login functionality to enable user registration and login via KakaoTalk, Naver, Google, and Apple.</li>
</ul>

<h2>Self Projects</h2>

<h3>Twitter cloning — TypeScript, React.js</h3>
<p><a href="https://github.com/mjp002/nwitter-reloaded" target="_blank" rel="noopener noreferrer">github.com/mjp002/nwitter-reloaded</a></p>
<ul>
  <li>Implemented a login system using Firebase, streamlining the login process and improving efficiency of user data handling and authentication.</li>
</ul>

<h3>Memo app — Swift (Ongoing)</h3>
<ul>
  <li>Developing a Swift-based iOS memo app with intuitive UI/UX and local storage integration.</li>
  <li>Implemented a calculator feature allowing users to input results directly into memos without switching apps.</li>
</ul>

<h2>Skills</h2>
<ul>
  <li><strong>Programming Languages:</strong> Python, Dart, TypeScript, JavaScript, Swift (Basic)</li>
  <li><strong>Frameworks:</strong> Flutter, React.js, Vue.js, React Native, Expo</li>
  <li><strong>Tools:</strong> GraphQL, Node.js, PostgreSQL, Elasticsearch, Docker, Jenkins, Firebase</li>
</ul>

<h2>Education</h2>
<ul>
  <li><strong>Green Computer Academy</strong> — Government-funded Python-based Big Data Analytics bootcamp <em>Dec 2019 – Jun 2020</em></li>
  <li><strong>Portland Community College</strong> — Associate of Arts Oregon Transfer — Earned 40 credits <em>Jan 2021 – Mar 2023</em></li>
  <li><strong>Kansas State University</strong> — Life Science — Earned 65 credits</li>
</ul>
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const ProfileContainer = styled.div<{ darkMode: boolean }>`
  max-width: 800px;
  width: 100%;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  height: 100%;
  overflow-y: auto;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "white")};
  color: ${(props) => (props.darkMode ? "white" : "black")};

  h1 {
    font-size: 2.5em;
    margin-bottom: 0.5em;
  }

  h2 {
    font-size: 1.8em;
    margin-top: 1.5em;
    border-bottom: 2px solid ${(props) => (props.darkMode ? "#3e3e3e" : "#e1e1e1")};
    padding-bottom: 0.3em;
  }

  h3 {
    font-size: 1.4em;
    margin-top: 1em;
  }

  h4 {
    font-size: 1.2em;
    margin-top: 0.8em;
  }

  p,
  ul,
  li {
    font-size: 1em;
  }

  a {
    color: ${(props) => (props.darkMode ? "#58a6ff" : "#0073e6")};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  ul {
    margin-left: 20px;
  }

  li {
    margin-bottom: 0.5em;
  }

  em {
    color: ${(props) => (props.darkMode ? "#8b949e" : "#666")};
  }
`;

export default function Profile() {
  const { darkMode } = useTheme();

  return (
    <Wrapper>
      <ProfileContainer darkMode={darkMode}>
        {htmlParser(resumeContent)}
      </ProfileContainer>
    </Wrapper>
  );
}
