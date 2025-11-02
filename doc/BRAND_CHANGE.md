# LiteDays 브랜드 변경 완료 ✨

## 📋 변경 사항 요약

### 1. 브랜드 리뉴얼
- **이전**: 다이어트 캘린더
- **이후**: LiteDays (Light + Days)
- **컨셉**: 가벼운 하루하루를 기록하는 다이어트 캘린더

---

## 🎨 디자인 변경 내역

### 1. **index.html** 변경
- [x] 페이지 타이틀 변경: "LiteDays - 가벼운 다이어트 캘린더"
- [x] 로그인 페이지에 LiteDays 로고 추가
- [x] 회원가입 페이지에 LiteDays 로고 추가
- [x] 메인 헤더 로고 변경
- [x] 파비콘(favicon) 추가

### 2. **CSS 스타일 추가**

#### `css/login.css`
```css
/* LiteDays 로고 스타일 */
.login-logo {
    text-align: center;
    font-size: 56px;
    margin-bottom: var(--spacing-md);
    font-weight: 300;
    letter-spacing: -0.5px;
}

.logo-lite {
    font-weight: 200;
    color: #4fd1c5;  /* 청록색 - Light 강조 */
}

.logo-days {
    font-weight: 500;
    color: var(--text-primary);  /* 진한색 - Days 강조 */
}
```

#### `css/main.css`
```css
/* LiteDays 헤더 로고 */
.header-logo {
    font-size: 28px;
    font-weight: 300;
    color: var(--text-primary);
    transition: opacity 0.2s ease;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
}
```

### 3. **새로운 에셋 파일**
- [x] `assets/logo-icon.svg` - 파비콘용 아이콘
- [x] `assets/logo-horizontal.svg` - 가로 로고 (필요시 사용)

---

## 🎯 디자인 포인트

### 색상
- **청록색 (#4fd1c5)**: "Lite" 부분에 사용, 가벼움을 시각적으로 표현
- **진한 회색 (var(--text-primary))**: "Days" 부분에 사용, 안정감 제공

### 타이포그래피
- **Lite**: font-weight 200 (매우 얇음) - 가벼운 느낌
- **Days**: font-weight 500 (중간) - 안정적인 느낌
- 대비를 통해 브랜드 의미 시각화

### 반응형 디자인
- **Desktop**: 로고 56px (로그인), 28px (헤더)
- **Tablet**: 로고 48px (로그인), 22px (헤더)
- **Mobile**: 로고 42px (로그인), 20px (헤더)
- **Small Mobile**: 로고 유지, 18px (헤더)

---

## 📂 파일 구조

```
Calender/
├── index.html          # ✅ 브랜드 적용 완료
├── assets/
│   ├── logo-icon.svg   # ✅ 새로 생성
│   └── logo-horizontal.svg  # ✅ 새로 생성
├── css/
│   ├── login.css       # ✅ 로고 스타일 추가
│   └── main.css        # ✅ 헤더 로고 스타일 추가
└── ...
```

---

## 🚀 적용된 위치

### 1. 로그인 페이지
- 상단에 큰 LiteDays 로고
- "가벼운 다이어트 캘린더" 부제목

### 2. 회원가입 페이지
- 로그인 페이지와 동일한 로고 배치

### 3. 메인 앱 헤더
- 왼쪽 상단에 LiteDays 로고
- 클릭 시 캘린더 뷰로 이동

### 4. 브라우저 탭
- 파비콘(favicon)으로 브랜드 아이콘 표시
- "LiteDays - 가벼운 다이어트 캘린더" 타이틀

---

## ✅ 테스트 체크리스트

- [ ] 로그인 페이지에서 로고 정상 표시 확인
- [ ] 회원가입 페이지에서 로고 정상 표시 확인
- [ ] 메인 헤더 로고 정상 표시 확인
- [ ] 파비콘이 브라우저 탭에 표시되는지 확인
- [ ] 다크모드에서 로고 가독성 확인
- [ ] 모바일 화면에서 로고 크기 확인
- [ ] 태블릿 화면에서 로고 크기 확인

---

## 🎨 브랜드 가이드

### 로고 사용 원칙
1. **Lite**와 **Days**는 항상 붙여서 사용
2. **Lite**는 항상 청록색(#4fd1c5)
3. **Days**는 다크모드에 따라 자동 변경
4. 최소 크기: 18px (모바일 헤더)

### 금지 사항
- 로고 색상 임의 변경 금지
- 폰트 굵기 변경 금지
- "Lite"와 "Days" 분리 표기 금지
- 비율 왜곡 금지

---

## 📝 다음 작업 제안

1. **로딩 애니메이션**: 로고 아이콘에 부드러운 페이드 인 효과
2. **스플래시 스크린**: PWA 전환 시 사용할 스플래시 화면
3. **다크모드 최적화**: 다크모드에서 로고 색상 미세 조정
4. **SEO 최적화**: 메타 태그에 LiteDays 브랜드 정보 추가

---

## 🎉 완료!

LiteDays 브랜드로 성공적으로 변경되었습니다!
"가벼운 하루하루를 기록하다"라는 브랜드 가치가 디자인에 잘 반영되었습니다.

---

*변경일: 2025년 11월 2일*
*작업자: Claude*
