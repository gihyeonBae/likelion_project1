# 카페앱 Blueprint

## 1. 프로젝트 목표

일반적인 카페에서 주문할 수 있는 커피, 음료, 디저트, 베이커리 메뉴를 온라인으로 둘러보고 주문할 수 있는 카페 주문 사이트를 만든다.

참고 사이트인 커피리브레는 기능 범위를 그대로 따라가지 않고, 전체적인 디자인 톤만 참고한다.

- 밝은 배경과 절제된 색 사용
- 상품 이미지 중심의 정돈된 그리드
- 국문명과 영문명을 함께 보여주는 메뉴 카드
- 메뉴 카테고리를 명확히 나누는 상단 내비게이션
- 군더더기 없는 타이포그래피
- 브랜드 감성이 느껴지는 홈 배너와 소개 영역

## 2. 서비스 범위

### 2.1 판매 메뉴

- 커피: 아메리카노, 카페라떼, 바닐라라떼, 카푸치노, 플랫화이트, 콜드브루
- 논커피 음료: 초코라떼, 말차라떼, 밀크티, 에이드, 티
- 디저트: 치즈케이크, 티라미수, 쿠키, 휘낭시에, 마들렌
- 베이커리: 크루아상, 소금빵, 스콘, 베이글
- 시즌 메뉴: 여름 한정 음료, 겨울 한정 라떼, 시즌 디저트

### 2.2 주문 방식

- 매장 픽업 주문을 기본으로 한다.
- 장바구니에 여러 메뉴를 담아 한 번에 주문한다.
- 메뉴 옵션은 온도, 사이즈, 샷 추가, 시럽 추가, 얼음 양, 포장 여부를 우선 지원한다.
- 결제는 실제 PG 연동 없이 주문 완료 화면까지 구현한다.

## 3. 설계 원칙

- 대분류는 역할자 기준으로 나눈다.
- 중분류는 역할자 안의 기능 기준으로 나눈다.
- 소분류는 CRUD 기준으로 나눈다.
- 각 CRUD 화면 폴더 안에는 `index.html`, `index.css`, `index.js`를 함께 둔다.
- 기능 내부 공통 코드는 해당 기능의 `_shared/`에 둔다.
- 앱 전체 공통 코드는 `src/shared/`에 둔다.
- 초기 데이터는 `data/`의 목업 데이터와 `localStorage`를 사용한다.
- 화면 이동은 상대 경로를 사용한다.

## 4. 역할자별 기능 설계

## 4.1 고객

고객은 메뉴를 탐색하고, 장바구니에 담고, 주문을 완료하는 역할자다.

### 4.1.1 홈

목표: 카페의 첫인상, 대표 메뉴, 시즌 메뉴를 보여준다.

#### Create

- 없음

#### Read

- 메인 배너 조회
- 대표 메뉴 조회
- 시즌 메뉴 조회
- 카테고리 바로가기 조회
- 브랜드 소개 요약 조회

#### Update

- 오늘 하루 보지 않기 같은 팝업 표시 상태 변경

#### Delete

- 없음

화면:

- `src/customer/home/read/index.html`

### 4.1.2 메뉴

목표: 커피, 음료, 디저트, 베이커리 메뉴를 탐색하고 상세 정보를 확인한다.

#### Create

- 없음

#### Read

- 전체 메뉴 목록 조회
- 카테고리별 메뉴 조회
- 메뉴 상세 조회
- 메뉴 검색
- 추천 메뉴 조회
- 품절 여부 조회

#### Update

- 메뉴 목록 정렬 조건 변경
- 메뉴 필터 조건 변경
- 선택 옵션 임시 변경

#### Delete

- 적용한 검색어/필터 초기화

화면:

- `src/customer/menu/read/list/index.html`
- `src/customer/menu/read/detail/index.html`
- `src/customer/menu/read/search/index.html`
- `src/customer/menu/update/filter/index.html`
- `src/customer/menu/delete/filter/index.html`

### 4.1.3 장바구니

목표: 주문할 메뉴와 옵션을 임시로 관리한다.

#### Create

- 메뉴 장바구니 담기

#### Read

- 장바구니 목록 조회
- 총 주문 금액 조회
- 선택한 옵션 조회

#### Update

- 메뉴 수량 변경
- 온도, 사이즈, 샷 추가, 시럽 추가 등 옵션 변경
- 선택 주문 여부 변경

#### Delete

- 장바구니 메뉴 삭제
- 장바구니 전체 비우기

화면:

- `src/customer/cart/create/index.html`
- `src/customer/cart/read/index.html`
- `src/customer/cart/update/index.html`
- `src/customer/cart/delete/index.html`

### 4.1.4 주문

목표: 장바구니 메뉴를 주문하고 주문 결과를 확인한다.

#### Create

- 주문 생성
- 픽업 정보 입력
- 요청사항 입력

#### Read

- 주문서 조회
- 주문 완료 결과 조회
- 주문 내역 조회
- 주문 상세 조회

#### Update

- 결제 전 주문 정보 수정
- 결제 전 픽업 시간 수정
- 결제 전 요청사항 수정

#### Delete

- 결제 전 주문 취소

화면:

- `src/customer/order/create/index.html`
- `src/customer/order/read/checkout/index.html`
- `src/customer/order/read/complete/index.html`
- `src/customer/order/read/list/index.html`
- `src/customer/order/read/detail/index.html`
- `src/customer/order/update/index.html`
- `src/customer/order/delete/index.html`

### 4.1.5 계정

목표: 고객이 로그인하고 본인 정보를 관리한다.

#### Create

- 회원가입
- 로그인 세션 생성

#### Read

- 로그인 화면 조회
- 내 정보 조회
- 내 주문 요약 조회

#### Update

- 프로필 수정
- 비밀번호 수정
- 연락처 수정

#### Delete

- 로그아웃
- 회원 탈퇴

화면:

- `src/customer/account/create/signup/index.html`
- `src/customer/account/create/login/index.html`
- `src/customer/account/read/profile/index.html`
- `src/customer/account/update/profile/index.html`
- `src/customer/account/delete/logout/index.html`
- `src/customer/account/delete/withdraw/index.html`

### 4.1.6 문의

목표: 고객이 주문이나 메뉴 관련 문의를 남기고 답변을 확인한다.

#### Create

- 문의 작성

#### Read

- 문의 목록 조회
- 문의 상세 조회
- 답변 상태 조회

#### Update

- 답변 전 문의 수정

#### Delete

- 답변 전 문의 삭제

화면:

- `src/customer/inquiry/create/index.html`
- `src/customer/inquiry/read/list/index.html`
- `src/customer/inquiry/read/detail/index.html`
- `src/customer/inquiry/update/index.html`
- `src/customer/inquiry/delete/index.html`

## 4.2 관리자

관리자는 메뉴, 주문, 재고, 카페 콘텐츠를 관리하는 역할자다.

### 4.2.1 대시보드

목표: 카페 주문과 운영 상태를 빠르게 확인한다.

#### Create

- 없음

#### Read

- 오늘 주문 수 조회
- 오늘 매출 요약 조회
- 품절 메뉴 조회
- 최근 주문 조회
- 최근 문의 조회

#### Update

- 대시보드 기간 필터 변경

#### Delete

- 없음

화면:

- `src/admin/dashboard/read/index.html`
- `src/admin/dashboard/update/filter/index.html`

### 4.2.2 메뉴 관리

목표: 판매할 커피, 음료, 디저트, 베이커리 메뉴를 관리한다.

#### Create

- 메뉴 등록
- 메뉴 이미지 등록
- 메뉴 옵션 등록

#### Read

- 메뉴 목록 조회
- 메뉴 상세 조회
- 카테고리별 메뉴 조회
- 품절 메뉴 조회

#### Update

- 메뉴명 수정
- 가격 수정
- 설명 수정
- 이미지 수정
- 판매 상태 수정
- 추천 메뉴 여부 수정
- 옵션 수정

#### Delete

- 메뉴 삭제
- 메뉴 이미지 삭제
- 메뉴 옵션 삭제

화면:

- `src/admin/menu/create/index.html`
- `src/admin/menu/read/list/index.html`
- `src/admin/menu/read/detail/index.html`
- `src/admin/menu/update/index.html`
- `src/admin/menu/delete/index.html`

### 4.2.3 카테고리 관리

목표: 메뉴를 커피, 음료, 디저트, 베이커리, 시즌 메뉴로 분류한다.

#### Create

- 카테고리 등록

#### Read

- 카테고리 목록 조회
- 카테고리별 메뉴 수 조회

#### Update

- 카테고리명 수정
- 노출 순서 수정
- 노출 여부 수정

#### Delete

- 카테고리 삭제

화면:

- `src/admin/category/create/index.html`
- `src/admin/category/read/index.html`
- `src/admin/category/update/index.html`
- `src/admin/category/delete/index.html`

### 4.2.4 주문 관리

목표: 고객 주문을 접수하고 제조 상태를 관리한다.

#### Create

- 현장 주문 수동 등록

#### Read

- 주문 목록 조회
- 주문 상세 조회
- 주문 상태별 조회
- 픽업 예정 주문 조회

#### Update

- 주문 상태 변경: 접수, 제조중, 픽업대기, 완료
- 품절로 인한 주문 조정
- 관리자 메모 수정

#### Delete

- 테스트 주문 삭제
- 취소 주문 정리

화면:

- `src/admin/order/create/index.html`
- `src/admin/order/read/list/index.html`
- `src/admin/order/read/detail/index.html`
- `src/admin/order/update/status/index.html`
- `src/admin/order/delete/index.html`

### 4.2.5 재고 관리

목표: 메뉴 판매 가능 여부와 재료 재고를 관리한다.

#### Create

- 재고 항목 등록
- 입고 기록 등록

#### Read

- 재고 목록 조회
- 부족 재고 조회
- 입고 기록 조회

#### Update

- 재고 수량 수정
- 품절 여부 수정
- 안전 재고 기준 수정

#### Delete

- 잘못 입력한 입고 기록 삭제
- 사용하지 않는 재고 항목 삭제

화면:

- `src/admin/inventory/create/index.html`
- `src/admin/inventory/read/list/index.html`
- `src/admin/inventory/read/history/index.html`
- `src/admin/inventory/update/index.html`
- `src/admin/inventory/delete/index.html`

### 4.2.6 콘텐츠 관리

목표: 홈 배너, 시즌 메뉴 소개, 공지사항을 관리한다.

#### Create

- 배너 등록
- 공지사항 등록
- 시즌 소개 콘텐츠 등록

#### Read

- 배너 목록 조회
- 공지사항 목록 조회
- 시즌 콘텐츠 조회

#### Update

- 배너 수정
- 공지사항 수정
- 시즌 콘텐츠 수정
- 노출 여부 수정

#### Delete

- 배너 삭제
- 공지사항 삭제
- 시즌 콘텐츠 삭제

화면:

- `src/admin/content/create/banner/index.html`
- `src/admin/content/create/notice/index.html`
- `src/admin/content/read/banner-list/index.html`
- `src/admin/content/read/notice-list/index.html`
- `src/admin/content/update/banner/index.html`
- `src/admin/content/update/notice/index.html`
- `src/admin/content/delete/index.html`

### 4.2.7 고객 관리

목표: 가입 고객과 문의 내역을 확인한다.

#### Create

- 관리자 고객 메모 작성

#### Read

- 고객 목록 조회
- 고객 상세 조회
- 고객 주문 내역 조회
- 고객 문의 내역 조회

#### Update

- 고객 상태 수정
- 관리자 메모 수정

#### Delete

- 관리자 메모 삭제
- 탈퇴 고객 정보 정리

화면:

- `src/admin/customer/create/memo/index.html`
- `src/admin/customer/read/list/index.html`
- `src/admin/customer/read/detail/index.html`
- `src/admin/customer/update/status/index.html`
- `src/admin/customer/delete/memo/index.html`

## 5. 코로케이션 폴더 구조

```text
likelion_project1/
├── blueprint.md
├── index.html
├── assets/
│   ├── images/
│   │   ├── menu/
│   │   ├── banners/
│   │   └── brand/
│   └── icons/
├── data/
│   ├── menu.js
│   ├── categories.js
│   ├── orders.js
│   ├── customers.js
│   ├── inventory.js
│   └── content.js
└── src/
    ├── shared/
    │   ├── styles/
    │   │   ├── reset.css
    │   │   ├── base.css
    │   │   └── layout.css
    │   ├── components/
    │   │   ├── header.js
    │   │   ├── footer.js
    │   │   ├── menu-card.js
    │   │   ├── option-selector.js
    │   │   └── modal.js
    │   ├── services/
    │   │   ├── storage.js
    │   │   ├── menu-service.js
    │   │   ├── cart-service.js
    │   │   ├── order-service.js
    │   │   └── auth-service.js
    │   └── utils/
    │       ├── dom.js
    │       ├── format.js
    │       └── validation.js
    ├── customer/
    │   ├── home/
    │   │   └── read/
    │   │       ├── index.html
    │   │       ├── index.css
    │   │       └── index.js
    │   ├── menu/
    │   │   ├── _shared/
    │   │   │   ├── menu-filter.js
    │   │   │   └── menu-renderer.js
    │   │   ├── read/
    │   │   │   ├── list/
    │   │   │   │   ├── index.html
    │   │   │   │   ├── index.css
    │   │   │   │   └── index.js
    │   │   │   ├── detail/
    │   │   │   │   ├── index.html
    │   │   │   │   ├── index.css
    │   │   │   │   └── index.js
    │   │   │   └── search/
    │   │   │       ├── index.html
    │   │   │       ├── index.css
    │   │   │       └── index.js
    │   │   ├── update/
    │   │   │   └── filter/
    │   │   │       ├── index.html
    │   │   │       ├── index.css
    │   │   │       └── index.js
    │   │   └── delete/
    │   │       └── filter/
    │   │           ├── index.html
    │   │           ├── index.css
    │   │           └── index.js
    │   ├── cart/
    │   │   ├── create/
    │   │   │   ├── index.html
    │   │   │   ├── index.css
    │   │   │   └── index.js
    │   │   ├── read/
    │   │   │   ├── index.html
    │   │   │   ├── index.css
    │   │   │   └── index.js
    │   │   ├── update/
    │   │   │   ├── index.html
    │   │   │   ├── index.css
    │   │   │   └── index.js
    │   │   └── delete/
    │   │       ├── index.html
    │   │       ├── index.css
    │   │       └── index.js
    │   ├── order/
    │   │   ├── create/
    │   │   │   ├── index.html
    │   │   │   ├── index.css
    │   │   │   └── index.js
    │   │   ├── read/
    │   │   │   ├── checkout/
    │   │   │   ├── complete/
    │   │   │   ├── list/
    │   │   │   └── detail/
    │   │   ├── update/
    │   │   │   ├── index.html
    │   │   │   ├── index.css
    │   │   │   └── index.js
    │   │   └── delete/
    │   │       ├── index.html
    │   │       ├── index.css
    │   │       └── index.js
    │   ├── account/
    │   │   ├── create/
    │   │   ├── read/
    │   │   ├── update/
    │   │   └── delete/
    │   └── inquiry/
    │       ├── create/
    │       ├── read/
    │       ├── update/
    │       └── delete/
    └── admin/
        ├── dashboard/
        │   ├── read/
        │   └── update/
        ├── menu/
        │   ├── create/
        │   ├── read/
        │   ├── update/
        │   └── delete/
        ├── category/
        │   ├── create/
        │   ├── read/
        │   ├── update/
        │   └── delete/
        ├── order/
        │   ├── create/
        │   ├── read/
        │   ├── update/
        │   └── delete/
        ├── inventory/
        │   ├── create/
        │   ├── read/
        │   ├── update/
        │   └── delete/
        ├── content/
        │   ├── create/
        │   ├── read/
        │   ├── update/
        │   └── delete/
        └── customer/
            ├── create/
            ├── read/
            ├── update/
            └── delete/
```

주의: 위 트리에서 축약된 CRUD 폴더도 실제 구현 시에는 최종 화면 폴더마다 `index.html`, `index.css`, `index.js`를 함께 둔다.

## 6. 데이터 모델 초안

### 6.1 MenuItem

```js
{
  id: 'menu-001',
  nameKo: '바닐라 라떼',
  nameEn: 'Vanilla Latte',
  categoryId: 'coffee',
  description: '부드러운 우유와 바닐라 향이 어우러진 라떼',
  price: 5200,
  imageUrl: './assets/images/menu/vanilla-latte.jpg',
  tags: ['best', 'sweet'],
  options: {
    temperature: ['hot', 'ice'],
    size: ['regular', 'large'],
    extraShot: true,
    syrup: true
  },
  status: 'on-sale',
  isRecommended: true
}
```

### 6.2 Category

```js
{
  id: 'dessert',
  nameKo: '디저트',
  nameEn: 'Dessert',
  sortOrder: 3,
  isVisible: true
}
```

### 6.3 CartItem

```js
{
  id: 'cart-001',
  menuId: 'menu-001',
  quantity: 2,
  options: {
    temperature: 'ice',
    size: 'regular',
    extraShotCount: 1,
    syrupCount: 0,
    takeout: true
  }
}
```

### 6.4 Order

```js
{
  id: 'order-001',
  customerId: 'customer-001',
  items: [],
  pickupName: '홍길동',
  pickupPhone: '010-0000-0000',
  pickupTime: '14:30',
  requestMessage: '얼음 적게 주세요',
  totalPrice: 15400,
  status: 'received',
  createdAt: '2026-07-08'
}
```

## 7. 구현 단계 TODO

### 1단계: 프로젝트 기반 구축

- [ ] 기본 폴더 구조 생성
- [ ] `index.html` 진입 페이지 생성
- [ ] 공통 CSS 생성
- [ ] 공통 헤더/푸터 생성
- [ ] 메뉴 목업 데이터 생성
- [ ] 카테고리 목업 데이터 생성
- [ ] `localStorage` 저장소 유틸 생성

### 2단계: 고객 - 홈/메뉴 Read

- [ ] 고객 홈 조회 화면 구현
- [ ] 메뉴 목록 조회 화면 구현
- [ ] 메뉴 상세 조회 화면 구현
- [ ] 메뉴 검색 화면 구현
- [ ] 카테고리 필터 구현
- [ ] 커피/음료/디저트/베이커리/시즌 메뉴 구분 구현

### 3단계: 고객 - 장바구니 CRUD

- [ ] 장바구니 담기 구현
- [ ] 장바구니 조회 구현
- [ ] 수량 변경 구현
- [ ] 옵션 변경 구현
- [ ] 장바구니 메뉴 삭제 구현
- [ ] 장바구니 전체 비우기 구현

### 4단계: 고객 - 주문 CRUD

- [ ] 주문 생성 구현
- [ ] 주문서 조회 구현
- [ ] 주문 완료 조회 구현
- [ ] 주문 내역 조회 구현
- [ ] 결제 전 주문 수정 구현
- [ ] 결제 전 주문 취소 구현

### 5단계: 고객 - 계정/문의 CRUD

- [ ] 회원가입 구현
- [ ] 로그인 구현
- [ ] 내 정보 조회 구현
- [ ] 내 정보 수정 구현
- [ ] 로그아웃 구현
- [ ] 문의 작성 구현
- [ ] 문의 조회 구현
- [ ] 문의 수정/삭제 구현

### 6단계: 관리자 - 메뉴/카테고리 CRUD

- [ ] 메뉴 등록 구현
- [ ] 메뉴 목록/상세 조회 구현
- [ ] 메뉴 수정 구현
- [ ] 메뉴 삭제 구현
- [ ] 카테고리 등록 구현
- [ ] 카테고리 조회 구현
- [ ] 카테고리 수정 구현
- [ ] 카테고리 삭제 구현

### 7단계: 관리자 - 주문/재고 CRUD

- [ ] 주문 목록/상세 조회 구현
- [ ] 주문 상태 변경 구현
- [ ] 현장 주문 수동 등록 구현
- [ ] 테스트 주문 삭제 구현
- [ ] 재고 등록 구현
- [ ] 재고 조회 구현
- [ ] 재고 수정 구현
- [ ] 재고 삭제 구현

### 8단계: 관리자 - 콘텐츠/고객 CRUD

- [ ] 홈 배너 등록 구현
- [ ] 홈 배너 조회 구현
- [ ] 홈 배너 수정 구현
- [ ] 홈 배너 삭제 구현
- [ ] 공지사항 CRUD 구현
- [ ] 고객 목록/상세 조회 구현
- [ ] 고객 상태 수정 구현

### 9단계: 품질 점검

- [ ] 모든 HTML 링크 경로 점검
- [ ] 모든 CSS/JS 상대 경로 점검
- [ ] 코로케이션 구조 점검
- [ ] 고객 주문 흐름 수동 점검
- [ ] 관리자 메뉴 CRUD 수동 점검
- [ ] 모바일 화면 점검

## 8. 우선순위 TODO

- [ ] 1순위: 고객 홈
- [ ] 2순위: 메뉴 목록/상세
- [ ] 3순위: 장바구니
- [ ] 4순위: 주문 생성/완료
- [ ] 5순위: 관리자 메뉴 CRUD
- [ ] 6순위: 관리자 카테고리 CRUD
- [ ] 7순위: 관리자 주문 관리
- [ ] 8순위: 재고 관리
- [ ] 9순위: 고객 계정
- [ ] 10순위: 문의/콘텐츠 관리

## 9. 디자인 방향

- 첫 화면은 메뉴 주문으로 바로 이어지는 구조로 만든다.
- 상품 사진은 카드의 중심 요소로 둔다.
- 메뉴 카드는 국문명, 영문명, 가격, 태그, 품절 상태를 간결하게 보여준다.
- 컬러는 흰색, 검정, 아이보리, 포인트 레드 정도로 제한한다.
- 카페 메뉴판처럼 카테고리 전환이 빠르게 보여야 한다.
- 버튼은 주문, 담기, 수정, 삭제처럼 행동이 명확한 문구를 사용한다.
- 관리자 화면은 장식보다 표, 폼, 상태 배지를 중심으로 구성한다.

## 10. 구현 규칙

- 역할자 폴더 아래에 기능 폴더를 둔다.
- 기능 폴더 아래에 CRUD 폴더를 둔다.
- CRUD 폴더 아래 최종 화면 폴더 또는 화면 파일을 둔다.
- 최종 화면 단위에서는 `index.html`, `index.css`, `index.js`를 함께 둔다.
- 한 화면에서만 쓰는 스크립트는 해당 화면의 `index.js`에 둔다.
- 같은 기능의 여러 화면이 공유하는 코드는 기능 폴더의 `_shared/`에 둔다.
- 여러 기능이 공유하는 코드는 `src/shared/`에 둔다.
- 구현 완료 후 이 문서의 TODO 체크박스를 함께 갱신한다.
