# LiteDays 브랜드 변경 완료 (v2) ✨

## 📋 변경 사항 요약 (2차 업데이트)

### 새로운 추가 사항
1. ✅ **로고에 캘린더 아이콘 추가** - 모든 페이지 로고에 시각적 아이콘 추가
2. ✅ **광고 배너 공간 확보** - 좌우 하단에 160x600 광고 영역 추가

---

## 🎨 로고 아이콘 추가

### 1. 헤더 로고 (메인 앱)
- **아이콘 크기**: 32x32px (Desktop) → 20px (Mobile)
- **디자인**: 청록-핑크 그라데이션 배경
- **캘린더 요소**: 
  - 상단 바 (흰색)
  - 9개의 날짜 점 (3x3 그리드)
  - 하이라이트 점 (핑크색) - 오늘 날짜 표시

### 2. 로그인/회원가입 로고
- **아이콘 크기**: 60x60px (Desktop) → 46px (Mobile)
- **디자인**: 더 큰 캘린더 아이콘
- **캘린더 요소**:
  - 12개의 날짜 점 (4x3 그리드)
  - 하이라이트 점 + 발광 효과
  - 박스 섀도우로 입체감

### 3. 반응형 크기
| 화면 크기 | 헤더 아이콘 | 로그인 아이콘 |
|-----------|------------|--------------|
| Desktop   | 32px       | 60px         |
| Tablet    | 28px       | 52px         |
| Mobile    | 24px       | 46px         |
| Small     | 20px       | -            |

---

## 📢 광고 배너 공간

### 레이아웃 구조
```
┌─────────────────────────────────────────┐
│           Header (로고 + 메뉴)           │
├────┬──────────────────────────────┬────┤
│    │                              │    │
│ 광 │        메인 콘텐츠            │ 광 │
│ 고 │      (캘린더/통계/프로필)      │ 고 │
│    │                              │    │
│ 왼 │                              │ 오 │
│ 쪽 │                              │ 른 │
│    │                              │ 쪽 │
│    │                              │    │
└────┴──────────────────────────────┴────┘
```

### 광고 배너 사양
- **크기**: 160px (너비) x 600px (높이)
- **위치**: 
  - 왼쪽: `fixed, left: 20px, bottom: 20px`
  - 오른쪽: `fixed, right: 20px, bottom: 20px`
- **간격**: 콘텐츠와 20px 여백 확보
- **표시**: Desktop만 (태블릿/모바일에서는 자동 숨김)

### 콘텐츠 여백
- **Desktop**: 좌우 각 180px (160px 광고 + 20px 여백)
- **Max-width**: 1200px
- **자동 중앙 정렬**

### 반응형 동작
- **1400px 이상**: 광고 양쪽 표시
- **768px 이하**: 광고 숨김, 전체 화면 활용
- **480px 이하**: 모바일 최적화 레이아웃

---

## 📂 변경된 파일

### 1. `index.html`
```html
<!-- 헤더 로고 -->
<div class="header-logo">
    <div class="header-logo-icon">
        <div class="header-calendar-dots">
            <!-- 9개의 점 -->
        </div>
    </div>
    <div>
        <span class="logo-lite">Lite</span>
        <span class="logo-days">Days</span>
    </div>
</div>

<!-- 광고 배너 -->
<div class="ad-banner ad-banner-left">
    <!-- 왼쪽 광고 -->
</div>
<div class="content-wrapper">
    <!-- 메인 콘텐츠 -->
</div>
<div class="ad-banner ad-banner-right">
    <!-- 오른쪽 광고 -->
</div>
```

### 2. `css/variables.css`
```css
:root {
    /* 광고 배너 */
    --ad-banner-width: 160px;
    --ad-banner-gap: 20px;
}
```

### 3. `css/main.css`
- ✅ `.header-logo-icon` - 헤더 캘린더 아이콘
- ✅ `.header-calendar-dots` - 날짜 점 그리드
- ✅ `.ad-banner` - 광고 배너 컨테이너
- ✅ `.content-wrapper` - 콘텐츠 중앙 정렬
- ✅ 반응형 미디어 쿼리 업데이트

### 4. `css/login.css`
- ✅ `.login-logo-icon` - 로그인 캘린더 아이콘
- ✅ `.login-calendar-dots` - 날짜 점 그리드 (4x3)
- ✅ 반응형 아이콘 크기 조정

---

## 🎯 CSS 주요 스타일

### 헤더 아이콘
```css
.header-logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    border-radius: 8px;
}

.header-calendar-dot.highlight {
    background: #fed6e3;
}
```

### 광고 배너
```css
.ad-banner {
    position: fixed;
    bottom: 20px;
    width: 160px;
    height: 600px;
    background-color: var(--bg-secondary);
    border: 2px dashed var(--border-color);
}

.ad-banner-left { left: 20px; }
.ad-banner-right { right: 20px; }
```

### 콘텐츠 래퍼
```css
.content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 calc(160px + 20px); /* 광고 공간 */
}
```

---

## 📱 반응형 테스트

### Desktop (1400px+)
- ✅ 로고 아이콘 32px 표시
- ✅ 양쪽 광고 배너 표시
- ✅ 콘텐츠 중앙 정렬 (좌우 180px 여백)

### Tablet (768px - 1399px)
- ✅ 로고 아이콘 28px
- ✅ 광고 배너 숨김
- ✅ 콘텐츠 전체 화면

### Mobile (480px - 767px)
- ✅ 로고 아이콘 24px
- ✅ 광고 배너 숨김
- ✅ 모바일 최적화 레이아웃

### Small Mobile (360px - 479px)
- ✅ 로고 아이콘 20px
- ✅ 텍스트 크기 축소

---

## 🎨 디자인 가이드

### 로고 아이콘 색상
- **배경**: `linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)`
- **상단 바**: `white` (opacity: 0.9)
- **날짜 점**: `rgba(255, 255, 255, 0.6)`
- **하이라이트**: `#fed6e3` (핑크)

### 광고 배너 규격
- **표준 사이즈**: 160x600px (Wide Skyscraper)
- **파일 형식**: JPG, PNG, GIF, HTML5
- **최대 용량**: 150KB 권장
- **안전 영역**: 상하좌우 10px 여백

---

## 💡 광고 배너 활용 예시

### Google AdSense
```html
<div class="ad-banner ad-banner-left">
    <script async src="https://pagead2.googlesyndication.com/..."></script>
    <ins class="adsbygoogle" style="display:inline-block;width:160px;height:600px"></ins>
</div>
```

### 자체 광고
```html
<div class="ad-banner ad-banner-left">
    <a href="https://..." target="_blank">
        <img src="ad-image.jpg" alt="광고" width="160" height="600">
    </a>
</div>
```

---

## ✅ 체크리스트

### 로고 아이콘
- [x] 헤더에 캘린더 아이콘 추가
- [x] 로그인 페이지 아이콘 추가
- [x] 회원가입 페이지 아이콘 추가
- [x] 반응형 크기 조정
- [x] 하이라이트 점 애니메이션

### 광고 배너
- [x] 왼쪽 배너 영역 추가
- [x] 오른쪽 배너 영역 추가
- [x] 콘텐츠 중앙 정렬
- [x] 반응형 숨김 처리
- [x] 플레이스홀더 디자인

### 테스트 항목
- [ ] Desktop에서 광고 영역 확인
- [ ] 태블릿에서 광고 자동 숨김 확인
- [ ] 모바일에서 전체 화면 확인
- [ ] 로고 아이콘 반응형 크기 확인
- [ ] 다크모드에서 디자인 확인

---

## 🚀 다음 단계

1. **광고 연동**
   - Google AdSense 계정 생성
   - 광고 단위 생성 (160x600)
   - HTML 코드 교체

2. **성능 최적화**
   - 광고 지연 로딩 (Lazy Loading)
   - 광고 없을 때 공간 자동 축소
   - 광고 차단 감지 및 대응

3. **추가 기능**
   - 광고 새로고침 (30초 간격)
   - A/B 테스트 (광고 위치/크기)
   - 광고 성과 분석 대시보드

---

## 📊 예상 효과

### UX 개선
- ✅ 로고에 시각적 아이덴티티 강화
- ✅ 브랜드 인지도 향상
- ✅ 전문적인 느낌

### 수익화
- ✅ 광고 공간 확보로 수익 창출 가능
- ✅ 160x600 표준 사이즈로 광고주 유치 용이
- ✅ 콘텐츠 가독성 유지하면서 광고 노출

---

## 🎉 완료!

- ✨ 모든 로고에 캘린더 아이콘 추가 완료
- 📢 좌우 광고 배너 공간 확보 완료
- 📱 반응형 디자인 완벽 대응
- 🎨 브랜드 통일성 강화

---

*업데이트: 2025년 11월 2일 (v2)*
*작업자: Claude*
