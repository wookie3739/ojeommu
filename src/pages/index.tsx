import { useState, useEffect } from 'react';
import { Restaurant } from '@/data/restaurants';
import { 
  checkAndResetVotes, 
  findWinningRestaurant,
  getTodayDateString,
  sortRestaurantsByVotes
} from '@/utils/helpers';
import Head from 'next/head';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState(20000);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [winningRestaurant, setWinningRestaurant] = useState<Restaurant | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votedToday, setVotedToday] = useState(false);

  // 식당 데이터 불러오기
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/restaurants');
        let fetchedRestaurants = await response.json();
        
        // 투표 데이터 불러오기
        const votesResponse = await fetch('/api/vote');
        const votesData = await votesResponse.json();
        
        // 날짜 확인 및 투표 초기화 필요한지 확인
        const today = getTodayDateString();
        
        if (votesData.date === today) {
          const votes = votesData.votes || {};
          
          // 투표 수 계산
          fetchedRestaurants = fetchedRestaurants.map((restaurant: Restaurant) => ({
            ...restaurant,
            votes: votes[restaurant.id] || 0
          }));
          
          // 총 투표 수 계산
          const voteCount = Object.values(votes).reduce((sum: number, vote: any) => sum + vote, 0);
          setTotalVotes(voteCount);
          
          // 로컬 스토리지에서 오늘 투표했는지 확인
          const votedStatus = localStorage.getItem('votedToday');
          setVotedToday(votedStatus === today);
        }
        
        // 카테고리 목록 생성
        const categorySet = new Set<string>();
        fetchedRestaurants.forEach((restaurant: Restaurant) => {
          const category = getRestaurantCategory(restaurant);
          categorySet.add(category);
        });
        
        setCategories(['all', ...Array.from(categorySet)]);
        setRestaurants(fetchedRestaurants);
        
        // 투표 결과에 따라 우승 레스토랑 설정
        const winner = findWinningRestaurant(fetchedRestaurants);
        setWinningRestaurant(winner);
        
        setIsLoading(false);
      } catch (error) {
        console.error('식당 데이터를 불러오는 중 오류가 발생했습니다:', error);
        setIsLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  // 식당 카테고리 가져오기
  const getRestaurantCategory = (restaurant: Restaurant): string => {
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

  // 식당 투표하기
  const voteForRestaurant = async (restaurantId: string) => {
    if (votedToday) {
      alert('오늘은 이미 투표하셨습니다. 내일 다시 투표해주세요!');
      return;
    }
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      });
      
      const votesData = await response.json();
      
      if (response.ok) {
        // 투표 성공 시 로컬 스토리지에 저장
        localStorage.setItem('votedToday', getTodayDateString());
        setVotedToday(true);
        
        // 레스토랑 데이터 업데이트
        const votes = votesData.votes || {};
        
        const updatedRestaurants = restaurants.map(restaurant => ({
          ...restaurant,
          votes: votes[restaurant.id] || 0
        }));
        
        // 총 투표 수 업데이트
        const voteCount = Object.values(votes).reduce((sum: number, vote: any) => sum + vote, 0);
        setTotalVotes(voteCount);
        
        setRestaurants(updatedRestaurants);
        
        // 투표 결과에 따라 우승 레스토랑 업데이트
        const winner = findWinningRestaurant(updatedRestaurants);
        setWinningRestaurant(winner);
        
        alert('투표가 완료되었습니다!');
      } else {
        alert('투표 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('투표 처리 중 오류:', error);
      alert('투표 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 필터링된 식당 목록
  const filteredRestaurants = restaurants.filter(restaurant => {
    // 이름 검색 필터
    const nameMatch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 가격 필터 (최저 가격의 메뉴가 가격 필터 이하인 경우)
    const priceMatch = restaurant.menu.some(
      item => item.price <= priceFilter
    );

    // 카테고리 필터
    let categoryMatch = true;
    if (categoryFilter !== "all") {
      categoryMatch = getRestaurantCategory(restaurant) === categoryFilter;
    }

    return nameMatch && priceMatch && categoryMatch;
  });

  // 랜덤 식당 선택
  const selectRandomRestaurant = () => {
    if (filteredRestaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      setSelectedRestaurant(filteredRestaurants[randomIndex]);
      setMenuSearchTerm('');
    }
  };

  // 식당 상세 정보에서 필터링된 메뉴 목록
  const filteredMenu = selectedRestaurant
    ? selectedRestaurant.menu
        .filter(item =>
          item.name.toLowerCase().includes(menuSearchTerm.toLowerCase())
        )
        .sort((a, b) => a.price - b.price)
    : [];

  // 메뉴 추천 기능
  const getRandomMenu = () => {
    if (!selectedRestaurant || selectedRestaurant.menu.length === 0) return;
    
    const randomMenu = selectedRestaurant.menu[
      Math.floor(Math.random() * selectedRestaurant.menu.length)
    ];
    
    alert(`오늘의 추천 메뉴: ${randomMenu.name} (${randomMenu.price.toLocaleString()}원)`);
  };

  if (isLoading) {
    return (
      <div className="container">
        <h1>오늘 점심 뭐 먹지? 🍱</h1>
        <div className="empty-state">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

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
        
        {winningRestaurant && (
          <div className="today-winner">
            <h3>🏆 오늘의 점심 우승 후보</h3>
            <p><strong>{winningRestaurant.name}</strong> (투표 수: {winningRestaurant.votes})</p>
          </div>
        )}
        
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
                  onClick={() => voteForRestaurant(selectedRestaurant.id)}
                  disabled={votedToday}
                >
                  {votedToday ? '오늘 이미 투표함' : '이 식당에 투표하기'}
                </button>
              </div>
            </div>
            
            <div className="restaurant-detail">
              <div className="detail-header">
                <h2>{selectedRestaurant.name}</h2>
                <p>📍 {selectedRestaurant.address}</p>
                <p>📞 {selectedRestaurant.phone}</p>
                <p>🚚 {selectedRestaurant.type}</p>
                <p>🗳️ 투표 수: {selectedRestaurant.votes}</p>
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
            
            <div className="vote-section">
              <div className="vote-header">
                <h3>투표 현황</h3>
                <span>총 투표 수: {totalVotes}</span>
              </div>
              
              {totalVotes > 0 ? (
                <div className="vote-progress">
                  <div 
                    className="vote-bar" 
                    style={{ 
                      width: `${(selectedRestaurant.votes / totalVotes) * 100}%`,
                      backgroundColor: selectedRestaurant.votes > 0 ? '#3498db' : '#ecf0f1'
                    }}
                  >
                    {selectedRestaurant.votes > 0 ? `${Math.round((selectedRestaurant.votes / totalVotes) * 100)}%` : ''}
                  </div>
                </div>
              ) : (
                <p>아직 투표 내역이 없습니다.</p>
              )}
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
                {sortRestaurantsByVotes(filteredRestaurants).map((restaurant) => {
                  // 최저가 메뉴 찾기
                  const cheapestMenu = restaurant.menu.reduce(
                    (cheapest, current) =>
                      current.price < cheapest.price ? current : cheapest,
                    restaurant.menu[0]
                  );
                  
                  // 투표 비율 계산
                  const votePercentage = totalVotes > 0 
                    ? Math.round((restaurant.votes / totalVotes) * 100) 
                    : 0;

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
                        {restaurant.votes > 0 && (
                          <span className="vote-count">
                            🗳️ {restaurant.votes} ({votePercentage}%)
                          </span>
                        )}
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