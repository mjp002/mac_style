# macOS Style Portfolio

macOS 스타일의 포트폴리오 웹사이트입니다. React + TypeScript + Vite로 제작되었으며, Vercel을 통해 배포할 수 있습니다.

## 주요 기능

### 🖥️ macOS UI
- **메뉴바**: 실시간 시계, WiFi, 배터리, 설정 아이콘 포함
- **Dock 바**: macOS 스타일의 애플리케이션 런처
- **창 관리**: 드래그, 리사이즈 가능한 창

### 🎨 창 컨트롤
- **빨강 버튼**: 창 닫기
- **노랑 버튼**: 창 최소화
- **초록 버튼**: 전체화면 전환

### 🌓 테마
- 다크모드/라이트모드 전환
- localStorage에 설정 저장

### 🖼️ 배경화면
- 3가지 배경화면 선택 가능
- 설정에서 실시간 변경

### 📱 앱
- **Google Chrome**: 구글 검색
- **Resume**: 이력서 보기
- **Settings**: 시스템 설정
- 기타 앱 아이콘 포함

## 기술 스택

- **React 18.3**
- **TypeScript 5.2**
- **Vite 5.3**
- **Styled Components 6.1**
- **React Router DOM 6.25**
- **React RND 10.4** (드래그 & 리사이즈)
- **React Icons 5.2**

## 개발 시작

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 미리보기
```bash
npm run preview
```

## Vercel 배포

### 1. Vercel CLI 사용
```bash
npm install -g vercel
vercel
```

### 2. GitHub 연동
1. GitHub에 레포지토리 생성 및 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "New Project" 클릭
4. GitHub 레포지토리 선택
5. Framework Preset: **Vite** 자동 인식
6. Deploy 클릭

### 3. 환경 설정
Vercel은 자동으로 다음 설정을 사용합니다:
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 파일 구조

```
mac_style/
├── public/
│   └── background/          # 배경화면 이미지
├── src/
│   ├── components/
│   │   ├── macOS-bar.tsx   # 메뉴바
│   │   ├── macOS-dock.tsx  # Dock 바
│   │   ├── Window.tsx      # 창 컴포넌트
│   │   ├── settings.tsx    # 설정 앱
│   │   ├── theme.tsx       # 테마 Provider
│   │   ├── layout.tsx      # 레이아웃
│   │   └── loading-screen.tsx
│   ├── routes/
│   │   ├── home.tsx        # 메인 화면
│   │   └── profile.tsx     # 이력서
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 커스터마이징

### 배경화면 추가
1. `public/background/` 폴더에 이미지 추가
2. `src/components/settings.tsx`의 `backgrounds` 배열에 경로 추가

### 앱 추가
`src/components/macOS-dock.tsx`에서 `DockItem` 추가:

```tsx
<DockItem
  hasImage={false}
  onClick={() => handleOpenApp("App Name", "https://url.com")}
  title="App Name"
>
  🎯
</DockItem>
```

### 이력서 내용 수정
`src/routes/profile.tsx`의 `resumeContent` 변수 수정

## 라이선스

MIT

## 작성자

Jong Phil Moon
- GitHub: [@mjp002](https://github.com/mjp002)
- Email: moonjongphil@gmail.com
