# 🎵 플레이리스트 스튜디오 (makesongs)

유튜브 음악 플레이리스트 영상을 만들기 위한 자료함 앱입니다. 폰·PC 어디서나 열 수 있는 웹앱(PWA)이고, Firebase로 기기 간 자료가 공유됩니다.

| 폴더 | 용도 |
|---|---|
| 🖼️ 썸네일 | 썸네일 후보 이미지 (원본 화질 그대로 저장, 붙여넣기 가능) |
| 🎵 WAV 음악 | WAV 원본 음원 (여러 개 한 번에 올리기, 바로 재생) |
| 🎬 완성 영상 | 완성된 영상 파일 또는 유튜브 링크 |
| 💡 아이디어 | 만들 플레이리스트 브레인스토밍 — 콘셉트, 무드, 목표 길이, 상태(구상/제작중/완성) |

**아이디어가 중심입니다.** 아이디어 하나에 곡·썸네일·영상을 연결하면:
- 트랙 순서를 ↑↓로 정하고, 총 길이와 목표 길이 대비 진행률이 보여요
- **📋 타임스탬프** 버튼 → 유튜브 설명란에 붙여넣을 `00:00 곡 제목` 목록이 복사돼요
- **▶ 전체** 버튼 → 플레이리스트 순서대로 이어 듣기

오프라인에서도 동작하고, 인터넷이 연결되면 자동으로 동기화됩니다.

---

## 1. 앱 주소 열기 (GitHub Pages)

1. GitHub 저장소 → **Settings** → 왼쪽 **Pages**
2. **Source**: `Deploy from a branch` → **Branch**: 이 코드가 있는 브랜치(예: `main`) / `/(root)` → **Save**
3. 1~2분 뒤 `https://sroyal6004-bit.github.io/makesongs/` 에서 열림
4. 폰에서는 크롬(아이폰은 사파리)으로 열고 **메뉴 → 홈 화면에 추가** 하면 앱처럼 쓸 수 있어요

> 무료 GitHub 계정은 **공개(Public) 저장소**에서만 Pages를 쓸 수 있어요. 코드가 공개돼도 자료(음원·이미지)는 Firebase에 있고 연결 코드 없이는 볼 수 없습니다.

## 2. Firebase 설정

### ① 웹 앱 등록 → 설정값 받기
1. [Firebase 콘솔](https://console.firebase.google.com) → 내 프로젝트
2. 왼쪽 위 ⚙️ → **프로젝트 설정** → **일반** 탭 → 아래 **내 앱** → `</>` (웹) 아이콘
3. 앱 닉네임 입력 → **앱 등록** (Hosting 체크는 안 해도 됨)
4. 나오는 `firebaseConfig = { ... }` 내용을 복사
5. 둘 중 하나:
   - **추천**: 이 저장소의 `firebase-config.js` 를 GitHub 웹에서 열고 ✏️ 편집 → 예시처럼 붙여넣고 커밋 → 모든 기기에 자동 적용
   - 또는: 앱 ⚙️ 설정 → **Firebase 설정** 칸에 붙여넣고 **설정 저장** (기기마다 해야 함)

### ② Firestore (제목·메모 등 텍스트 동기화)
1. 왼쪽 메뉴 **빌드 → Firestore Database** → **데이터베이스 만들기**
2. 위치: `asia-northeast3 (서울)` → **프로덕션 모드**로 시작
3. **규칙** 탭 → 이 저장소의 [`firestore.rules`](firestore.rules) 내용으로 바꾸고 **게시**

### ③ Storage (이미지·WAV·영상 파일 동기화)
1. 왼쪽 메뉴 **빌드 → Storage** → **시작하기**
   - 2024년 10월 이후 새로 만드는 Storage는 **Blaze(종량제) 요금제**로 업그레이드해야 켤 수 있어요. 저장 5GB·다운로드 하루 1GB까지는 무료이고, 예산 알림을 걸어두면 안심입니다.
2. 위치는 Firestore와 같게 → 완료
3. **Rules** 탭 → [`storage.rules`](storage.rules) 내용으로 바꾸고 **게시**

### ④ CORS 설정 (오프라인 저장·다운로드용, 1회)
안 해도 사진·음악·영상은 보이지만, 다른 기기에서 받은 파일을 오프라인 저장하려면 필요해요.
1. [Google Cloud Console](https://console.cloud.google.com) 에서 같은 프로젝트 선택 → 오른쪽 위 **Cloud Shell 활성화** (`>_` 아이콘)
2. 아래를 붙여넣고 엔터
   ```bash
   cat > cors.json <<'EOF'
   [ { "origin": ["*"], "method": ["GET"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600 } ]
   EOF
   gcloud storage buckets update gs://makesongs-429e1.firebasestorage.app --cors-file=cors.json
   ```

## 3. 폰 ↔ PC 연결
1. 첫 기기: 앱 ⚙️ → **✨ 새 코드 만들기** → **📋 코드 복사**
2. 다른 기기: 앱 ⚙️ → **⌨️ 다른 기기 코드 입력** → 붙여넣기
3. 오른쪽 위 점이 🟢 초록이면 연결 완료. 문제가 있으면 ⚙️ → **🩺 동기화 상태 점검** 결과를 확인하세요.

> 연결 코드는 비밀번호와 같아요. 코드를 아는 사람은 자료를 볼 수 있으니 공유하지 마세요.

## 참고
- 파일 1개당 1GB까지 클라우드에 올라가요. 그보다 큰 영상은 그 기기에만 저장되니, 완성 영상은 **유튜브 링크**로 등록하는 걸 추천해요.
- ⚙️ → **백업 내보내기**로 제목·메모·연결 정보를 JSON으로 저장할 수 있어요 (파일 원본 제외).
- 아이폰으로 찍은 HEVC 영상은 PC 브라우저에서 재생이 안 될 수 있어요.

## 파일 구성
```
index.html          앱 전체 (화면·로직·스타일)
sw.js               오프라인/자동 업데이트용 서비스워커
manifest.json       홈 화면 설치 정보
firebase-config.js  Firebase 설정값
firestore.rules     Firestore 보안 규칙
storage.rules       Storage 보안 규칙
cors.json           Storage CORS 설정
```
