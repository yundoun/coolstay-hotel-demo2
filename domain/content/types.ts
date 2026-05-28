export type AboutBlock = {
  /** 블록 유형: text = 텍스트 중심, image-text = 이미지+텍스트, feature-grid = 특징 그리드 */
  type: "text" | "image-text" | "feature-grid";
  eyebrow?: string;
  title: string;
  body?: string;
  image?: string;
  /** image-text 타입에서 이미지 위치 */
  imagePosition?: "left" | "right";
  /** feature-grid 타입에서 사용 */
  features?: { icon: string; title: string; description: string }[];
};

export type SiteContent = {
  /** 사장님 인사말 */
  greeting: {
    headline: string;
    body: string;
    signature: string;
  };
  /** About 섹션 블록들 — 순서대로 렌더링 */
  about: AboutBlock[];
  /** 찾아오는 길 — 지도 + 안내 항목 */
  directions: {
    /** 구글 지도 검색어 (주소 or 장소명) */
    mapQuery: string;
    /** 지도 아래 안내 항목 — 라벨+값 쌍, 자유 구성 */
    items: { label: string; value: string }[];
  };
};
