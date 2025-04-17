export interface MenuItem {
  name: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  type: string;
  menu: MenuItem[];
  votes: number;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "장어보감",
    address: "1층",
    phone: "032-568-8892",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "장어탕", price: 9000 },
      { name: "물냉면, 비빔냉면", price: 7000 },
    ],
  },
  {
    id: "2",
    name: "중국집(취향)",
    address: "오류동 1657-6번지 1층 일부 서구 인천광역시",
    phone: "032-567-8972",
    type: "전화 주문(배달)",
    votes: 0,
    menu: [
      { name: "짜장면", price: 5000 },
      { name: "짬뽕", price: 7000 },
      { name: "볶음밥", price: 7000 },
      { name: "잡채밥", price: 9000 },
      { name: "오징어덮밥", price: 9000 },
      { name: "제육덮밥", price: 9000 },
    ],
  },
  {
    id: "3",
    name: "칼국수(이조시대)",
    address: "인천광역시 서구 오류동 번지 1층 632-14",
    phone: "032-562-4234",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "버섯 칼국수 세트", price: 9000 },
      { name: "바지락 칼국수", price: 9000 },
      { name: "대박 칼국수", price: 7000 },
    ],
  },
  {
    id: "4",
    name: "원가(부대찌개집)",
    address: "인천 서구 오류동 1660-2",
    phone: "0507-1366-9636",
    type: "직접 가기",
    votes: 0,
    menu: [{ name: "의정부 부대찌개", price: 9000 }],
  },
  {
    id: "5",
    name: "김밥천국(왕길점)",
    address: "인천 서구 단봉로 105-7",
    phone: "032-566-3005",
    type: "직접 가기",
    votes: 0,
    menu: [
      // 이미지 1 (김밥 메뉴)
      { name: "오므라이스", price: 6500 },
      { name: "김치오므라이스", price: 7000 },
      { name: "새우오므라이스", price: 7000 },
      { name: "새우볶음밥", price: 6500 },
      { name: "철판김치볶음밥", price: 7000 },
      { name: "김치볶음밥", price: 7500 },
      { name: "참치볶음밥", price: 8000 },
      { name: "제육볶음밥", price: 8000 },
      { name: "오징어볶음밥", price: 8000 },
      { name: "낙지볶음밥", price: 8500 },
      { name: "돈까스", price: 8000 },
      { name: "치즈돈까스", price: 8000 },
      { name: "고구마돈까스", price: 9000 },
      { name: "왕만두치즈돈까스", price: 8500 },
      { name: "철판불고기덮밥", price: 8500 },
      // 세트 메뉴
      { name: "돈까스+볶면", price: 9500 },
      { name: "돈까스+오므라이스", price: 9500 },

      // 이미지 2 (우동 및 국수 메뉴)
      { name: "우동", price: 5000 },
      { name: "김치우동", price: 5500 },
      { name: "해물튀김우동", price: 6000 },
      { name: "매운해물튀김우동", price: 6000 },
      { name: "볶면", price: 7000 },
      { name: "잔치국수", price: 7000 },
      { name: "비빔국수", price: 7000 },
      { name: "수제비", price: 7000 },
      { name: "얼큰수제비", price: 7500 },
      { name: "바지락칼국수", price: 7000 },
      { name: "얼큰칼국수", price: 7500 },
      { name: "육개장칼국수", price: 8500 },
      // 여름철 메뉴
      { name: "물냉면", price: 7000 },
      { name: "비빔냉면", price: 7000 },
      { name: "콩국수", price: 8000 },
      { name: "냉모밀국수", price: 6000 },

      // 이미지 3 (찌개 메뉴)
      { name: "된장찌개", price: 7000 },
      { name: "김치찌개", price: 8000 },
      { name: "순두부찌개", price: 7000 },
      { name: "치즈순두부찌개", price: 7500 },
      { name: "참치찌개", price: 8000 },
      { name: "갈비탕", price: 8000 },
      { name: "다슬기해장국", price: 7500 },
      { name: "뚝배기불고기", price: 8000 },
      { name: "김치찌개돌솥밥", price: 8000 },
      { name: "동태찌개", price: 8000 },
      { name: "부대찌개", price: 8000 },
      { name: "내장탕", price: 9500 },
      { name: "뼈해장국", price: 8500 },
      { name: "비빔밥", price: 7000 },
      { name: "참치비빔밥", price: 8000 },
      { name: "돌솥비빔밥", price: 8000 },
      { name: "참치돌솥비빔밥", price: 9000 },
      { name: "돌솥살밥", price: 9000 },

      // 이미지 4 (김밥 종류 및 라면)
      { name: "김밥", price: 4000 },
      { name: "치즈김밥", price: 4000 },
      { name: "참치김밥", price: 5000 },
      { name: "김치김밥", price: 5000 },
      { name: "치즈참치김밥", price: 5500 },
      { name: "치즈불고기", price: 5500 },
      { name: "라면", price: 4000 },
      { name: "치즈라면", price: 4500 },
      { name: "떡라면", price: 4500 },
      { name: "만두라면", price: 4500 },
      { name: "김치라면", price: 4500 },
      { name: "김치통+냉면", price: 5000 },
      { name: "왕만두라면", price: 5500 },
      { name: "고기만두", price: 4000 },
      { name: "김치만두", price: 4000 },
      { name: "찐만두", price: 7000 },
      { name: "만두국", price: 7000 },
      { name: "팥죽", price: 7500 },
    ],
  },
  {
    id: "6",
    name: "단풍나무",
    address: "인천 서구 검단로379번길 31-2",
    phone: "032-563-5323",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "육개장", price: 10000 },
      { name: "백개장", price: 10000 },
    ],
  },
  {
    id: "7",
    name: "롯데리아",
    address: "인천 서구 봉화로 49 1층 일부호(오류동)",
    phone: "032-568-0122",
    type: "배달의 민족",
    votes: 0,
    menu: [
      { name: "리아 불고기 세트", price: 8600 },
      { name: "핫크리스피 치킨 버거 세트", price: 9600 },
      { name: "클래식 치즈 버거 세트", price: 9000 },
      { name: "티렉스 버거 세트", price: 8600 },
      { name: "더블 치킨 버거 세트", price: 9300 },
    ],
  },
  {
    id: "8",
    name: "검단한우곰탕탕",
    address: "인천 서구 원당대로95",
    phone: "032-565-7342",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "사골곰탕", price: 8000 },
      { name: "모듬곰탕", price: 10000 },
    ],
  },
  {
    id: "9",
    name: "통돼지두루치기(오류동점)",
    address: "인천 서구 검단로114번안길 27",
    phone: "032-561-6859",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "통돼지 두루치기", price: 9000 },
      { name: "생고기 김치찌개", price: 9000 },
    ],
  },
  {
    id: "10",
    name: "신미옥순대감자탕(오류점점)",
    address: "인천 서구 검단로114번안길 22",
    phone: "0507-1442-8032",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "순대국", price: 10000 },
      { name: "김치 순대국", price: 10000 },
      { name: "얼큰 순대국", price: 10000 },
      { name: "뼈해장국", price: 10000 },
    ],
  },
  {
    id: "11",
    name: "전주콩나물국밥(오류동점)",
    address: "인천 서구 원당대로 103",
    phone: "032-561-9897",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "전주콩나물국밥", price: 6000 },
      { name: "황태콩나물국밥", price: 8000 },
      { name: "돌솥 비빔밥", price: 6000 },
      { name: "양푼이비빔밥", price: 6000 },
      { name: "대구뽈탕", price: 8000 },
      { name: "특대구뽈탕", price: 10000 },
      { name: "오삼불고기", price: 20000 },
      { name: "해물파전", price: 10000 },
    ],
  },
  {
    id: "12",
    name: "김포산더미불고기",
    address: "인천 서구 원당대로 109 103호",
    phone: "0507-1432-4911",
    type: "직접 가기",
    votes: 0,
    menu: [
      { name: "육회비빔밥", price: 9000 },
      { name: "뚝배기불고기", price: 9000 },
      { name: "소고기 된장찌개", price: 9000 },
      { name: "선지해장국", price: 8000 },
      { name: "순두부찌개", price: 8000 },
    ],
  },
];

export const getRestaurantCategory = (restaurant: Restaurant): string => {
  if (restaurant.name.includes("김밥")) return "분식";
  if (restaurant.name.includes("중국") || restaurant.name.includes("취향"))
    return "중식";
  if (restaurant.name.includes("한우") || restaurant.name.includes("불고기"))
    return "한식/고기";
  if (restaurant.name.includes("칼국수") || restaurant.name.includes("국밥"))
    return "국수/국밥";
  if (restaurant.name.includes("두루치기") || restaurant.name.includes("순대"))
    return "한식/고기";
  if (restaurant.name.includes("장어")) return "한식/장어";
  if (restaurant.name.includes("리아")) return "패스트푸드";
  if (restaurant.name.includes("부대찌개")) return "한식/찌개";
  return "기타";
};

export const priceOptions = [
  { value: 5000, label: "~5,000원" },
  { value: 7000, label: "~7,000원" },
  { value: 10000, label: "~10,000원" },
  { value: 20000, label: "~20,000원" },
];

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  restaurants.forEach((restaurant) => {
    categories.add(getRestaurantCategory(restaurant));
  });
  return ["all", ...Array.from(categories)];
};