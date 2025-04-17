import { useState, useEffect } from 'react';
import { Restaurant, restaurants as initialRestaurants, getCategories, getRestaurantCategory } from '@/data/restaurants';
import Head from 'next/head';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState(20000);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(false); // 강제로 로딩 상태를 비활성화
  const [winningRestaurant, setWinningRestaurant] = useState<Restaurant | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votedToday, setVotedToday] = useState(false);

  // 로컬 스토리지에서 투표 데이터 불러오기
  const loadVotesFromStorage = () => {
    if (typeof window === 'undefined') return {};
    try {
      const storedVotes = localStorage.getItem('restaurantVotes');
      return storedVotes ? JSON.parse(storedVotes) : {};
    } catch (error) {
      console.error('투표 데이터를 불러오는 중 오류:', error);
      return {};
    }
  };

  // 오늘 날짜 문자열 가져오기
  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  // 날짜 변경 확인 및 투표 초기화
  const checkAndResetVotes = () => {
    if (typeof window === 'undefined') return {};
    
    const lastVoteDate = localStorage.getItem('lastVoteDate');
    const todayString = getTodayDateString();
    
    if (lastVoteDate !== todayString) {
      // 날짜가 바뀌면 투표 초기화
      localStorage.setItem('restaurantVotes', JSON.stringify({}));
      localStorage.setItem('lastVoteDate', todayString);
      return {};
    }
    
    return loadVotesFromStorage();
  };

  // 가장 많은 투표를 받은 레스토랑 찾기
  const findWinningRestaurant = (restaurants: Restaurant[]): Restaurant | null => {
    if (restaurants.length === 0) return null;
    
    const sortedRestaurants = [...restaurants].sort((a, b) => b.votes - a.votes);
    
    // 투표가 있는지 확인
    if (sortedRestaurants[0].votes > 0) {
      return sortedRestaurants[0];
    }
    
    return null;
  };

  // 투표 수에 따라 레스토랑 정렬
  const sortRestaurantsByVotes = (restaurants: Restaurant[]): Restaurant[] => {
    return [...restaurants].sort((a, b) => b.votes - a.votes);
  };

  // 식당 데이터 초기화
  useEffect(() => {
    // 초기 레스토랑 데이터 설정
    const init = () => {
      try {
        setIsLoading(true);
        
        // 투표 데이터 불러오기
        const votes = checkAndResetVotes();
        
        // 오늘 투표 여부 확인
        const todayString = getTodayDateString();
        const votedStatus = localStorage.getItem('votedToday');
        setVotedToday(votedStatus === todayString);
        
        // 레스토랑 데이터에 투표 수 적용
        const restaurantsWithVotes = initialRestaurants.map(restaurant => ({
          ...restaurant,
          votes: votes[restaurant.id] || 0
        }));
        
        // 총 투표 수 계산
        const voteCount = Object.values(votes).reduce((sum: number, vote: any) => sum + (vote || 0), 0);
        setTotalVotes(voteCount);
        
        // 카테고리 목록 설정
        setCategories(getCategories());
        
        // 레스토랑 데이터 설정
        setRestaurants(restaurantsWithVotes);
        
        // 우승 레스토랑 설정
        const winner = findWinningRestaurant(restaurantsWithVotes);
        setWinningRestaurant(winner);
        
        setIsLoading(false);
      } catch (error) {
        console.error('데이터 초기화 중 오류:', error);
        // 오류 발생 시에도 기본 데이터로 초기화
        setRestaurants(initialRestaurants);
        setCategories(getCategories());
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  // 식당 투표하기
  const voteForRestaurant = (restaurantId: string) => {
    if (votedToday) {
      alert('오늘은 이미 투표하셨습니다. 내일 다시 투표해주세요!');
      return;
    }
    
    try {
      // 현재 투표 데이터 가져오기
      const votes = loadVotesFromStorage();
      
      // 투표 증가
      votes[restaurantId] = (votes[restaurantId] || 0) + 1;
      
      // 투표 데이터 저장
      localStorage.setItem('restaurantVotes', JSON.stringify(votes));
      localStorage.setItem('votedToday', getTodayDateString());
      
      setVotedToday(true);
      
      // 레스토랑 데이터 업데이트
      const updatedRestaurants = restaurants.map(restaurant => ({
        ...restaurant,
        votes: votes[restaurant.id] || 0
      }));
      
      // 총 투표 수 업데이트
      const voteCount = Object.values(votes).reduce((sum: number, vote: any) => sum + (vote || 0), 0);
      setTotalVotes(voteCount);
      
      setRestaurants(updatedRestaurants);
      
      // 투표 결과에 따라 우승 레스토랑 업데이트
      const winner = findWinningRestaurant(updatedRestaurants);
      setWinningRestaurant(winner);
      
      alert('투표가 완료되었습니다!');
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