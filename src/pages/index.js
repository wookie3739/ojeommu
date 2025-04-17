// 기존 index.js나 index.tsx 파일 대신 이 파일을 사용합니다
import { useState } from 'react';
import Head from 'next/head';

// 식당 데이터를 직접 페이지에 포함시켜 로딩 문제 해결
const restaurants = [
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
      { name: "오므라이스", price: 6500 },
      { name: "김치오므라이스", price: 7000 },
      { name: "새우오므라이스", price: 7000 },
      { name: "새우볶음밥", price: 6500 },
      { name: "철판김치볶음밥", price: 7000 },
      { name: "김치볶음밥", price: 7500 },
      { name: "참치볶음밥", price: 8000 },
      { name: "김밥", price: 4000 },
      { name: "라면", price: 4000 },
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
    ],
  },
];

// 식당 카테고리 가져오기
const getRestaurantCategory = (restaurant) => {
  if (restaurant.name.includes("김밥")) return "분식";
  if (restaurant.name.includes("중국") || restaurant.name.includes("취향")) return "중식";
  if (restaurant.name.includes("한우") || restaurant.name.includes("불고기")) return "한식/고기";
  if (restaurant.name.includes("칼국수") || restaurant.name.includes("국밥")) return "국수/국밥";
  if (restaurant.name.includes("두루치기") || restaurant.name.includes("순대")) return "한식/고기";
  if (restaurant.name.includes("장어")) return "한식/장어";
  if (restaurant.name.includes("리아")) return "패스트푸드";
  if (restaurant.name.includes("부대찌개")) return "한식/찌개";
  return "기타";
};

// 카테고리 목록 생성
const generateCategories = () => {
  const categorySet = new Set();
  restaurants.forEach((restaurant) => {
    categorySet.add(getRestaurantCategory(restaurant));
  });
  return ["all", ...Array.from(categorySet)];
};

export default function Home() {
  // 기본 상태 설정
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState(20000);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  
  // 투표 관련 상태는 간단하게 유지
  const [votedRestaurantId, setVotedRestaurantId] = useState('');
  
  // 카테고리 목록 생성
  const categories = generateCategories();
  
  // 식당 필터링
  const filteredRestaurants = restaurants.filter(restaurant => {
    // 이름 검색 필터
    const nameMatch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 가격 필터 (최저 가격의 메뉴가 가격 필터 이하인 경우)
    const priceMatch = restaurant.menu.some(item => item.price <= priceFilter);
    
    // 카테고리 필터
    let categoryMatch = true;
    if (categoryFilter !== "all") {
      categoryMatch = getRestaurantCategory(restaurant) === categoryFilter;
    }
    
    return nameMatch && priceMatch && categoryMatch;
  });
  
  // 최저가 메뉴 찾기
  const findCheapestMenu = (restaurant) => {
    return restaurant.menu.reduce(
      (cheapest, current) => current.price < cheapest.price ? current : cheapest,
      restaurant.menu[0]
    );
  };
  
  // 메뉴 필터링
  const filteredMenu = selectedRestaurant
    ? selectedRestaurant.menu.filter(item => 
        item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()))
        .sort((a, b) => a.price - b.price)
    : [];
  
  // 랜덤 식당 선택
  const selectRandomRestaurant = () => {
    if (filteredRestaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      setSelectedRestaurant(filteredRestaurants[randomIndex]);
    }
  };
  
  // 랜덤 메뉴 추천
  const getRandomMenu = () => {
    if (!selectedRestaurant || selectedRestaurant.menu.length === 0) return;
    
    const randomMenu = selectedRestaurant.menu[
      Math.floor(Math.random() * selectedRestaurant.menu.length)
    ];
    
    alert(`오늘의 추천 메뉴: ${randomMenu.name} (${randomMenu.price.toLocaleString()}원)`);
  };
  
  // 투표 처리
  const handleVote = (restaurantId) => {
    if (votedRestaurantId) {
      alert('오늘은 이미 투표하셨습니다. 내일 다시 투표해주세요!');
      return;
    }
    
    setVotedRestaurantId(restaurantId);
    alert('투표가 완료되었습니다!');
  };
  
  return (
    <>
      <Head>
        <title>오늘 점심 뭐 먹지?</title>
        <meta name="description" content="점심 메뉴 추천 및 투표 서비스" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="container">
        <h1>오늘 점심 뭐 먹지? 🍱</h1>
        
        {selectedRestaurant ? (
          // 식당 상세 정보 화면
          <>
            <div className="detail-actions">
              <button 
                className="btn back-btn" 
                onClick={() => {
                  setSelectedRestaurant(null);
                  setMenuSearchTerm('');
                }}
              >
                ← 목록으로
              </button>
              <div>
                <button 
                  className="btn recommend-btn" 
                  onClick={getRandomMenu}
                  style={{ marginRight: '10px' }}
                >
                  메뉴 추천받기
                </button>
                <button 
                  className="btn vote-btn" 
                  onClick={() => handleVote(selectedRestaurant.id)}
                  disabled={votedRestaurantId}
                >
                  {votedRestaurantId ? '오늘 이미 투표함' : '이 식당에 투표하기'}
                </button>
              </div>
            </div>
            
            <div className="restaurant-detail">
              <div className="detail-header">
                <h2>{selectedRestaurant.name}</h2>
                <p>📍 {selectedRestaurant.address}</p>
                <p>📞 {selectedRestaurant.phone}</p>
                <p>🚚 {selectedRestaurant.type}</p>
              </div>
              
              <div className="detail-body">
                <h3>📋 메뉴 ({selectedRestaurant.menu.length}개)</h3>
                
                <input 
                  type="text" 
                  className="menu-search" 
                  placeholder="메뉴 검색..." 
                  value={menuSearchTerm}
                  onChange={(e) => setMenuSearchTerm(e.target.value)}
                />
                
                <div className="menu-grid">
                  {filteredMenu.map((item, index) => (
                    <div className="menu-item" key={index}>
                      <span>{item.name}</span>
                      <span className="price">{item.price.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                
                {filteredMenu.length === 0 && (
                  <div className="empty-state">
                    <p>검색 조건에 맞는 메뉴가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // 식당 목록 화면
          <>
            <div className="search-filters">
              <input 
                type="text" 
                className="search-input" 
                placeholder="식당 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select 
                className="filter-select category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">모든 카테고리</option>
                {categories
                  .filter(cat => cat !== "all")
                  .map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
              </select>
              
              <select 
                className="filter-select price-filter"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
              >
                {[
                  { value: 5000, label: "~5,000원" },
                  { value: 7000, label: "~7,000원" },
                  { value: 10000, label: "~10,000원" },
                  { value: 20000, label: "~20,000원" }
                ].map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              <button 
                className="btn random-btn" 
                onClick={selectRandomRestaurant}
                disabled={filteredRestaurants.length === 0}
              >
                랜덤 선택
              </button>
            </div>
          
            {filteredRestaurants.length === 0 ? (
              <div className="empty-state">
                <p>검색 조건에 맞는 식당이 없습니다.</p>
              </div>
            ) : (
              <div className="restaurant-grid">
                {filteredRestaurants.map((restaurant) => {
                  // 최저가 메뉴 찾기
                  const cheapestMenu = findCheapestMenu(restaurant);
                  
                  return (
                    <div 
                      className="restaurant-card" 
                      key={restaurant.id}
                      onClick={() => {
                        setSelectedRestaurant(restaurant);
                        setMenuSearchTerm('');
                      }}
                    >
                      <div className="card-header">
                        <h2>{restaurant.name}</h2>
                        <p>{restaurant.type}</p>
                      </div>
                      <div className="card-body">
                        <p>대표메뉴 {restaurant.menu.length}개</p>
                        <div className="menu-preview">
                          <span>최저가 메뉴: {cheapestMenu.name}</span>
                          <span className="price">{cheapestMenu.price.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}