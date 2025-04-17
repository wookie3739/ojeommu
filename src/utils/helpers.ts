import { Restaurant } from "@/data/restaurants";

// localStorage에서 투표 데이터 불러오기
export const loadVotes = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  const votes = localStorage.getItem("restaurantVotes");
  return votes ? JSON.parse(votes) : {};
};

// localStorage에 투표 데이터 저장
export const saveVotes = (votes: Record<string, number>): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("restaurantVotes", JSON.stringify(votes));
};

// 오늘의 날짜 문자열 가져오기
export const getTodayDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

// 오늘의 날짜를 확인하고 필요에 따라 투표 초기화
export const checkAndResetVotes = (): void => {
  if (typeof window === "undefined") return;
  
  const lastVoteDate = localStorage.getItem("lastVoteDate");
  const todayString = getTodayDateString();
  
  if (lastVoteDate !== todayString) {
    // 날짜가 바뀌면 투표 초기화
    localStorage.setItem("restaurantVotes", JSON.stringify({}));
    localStorage.setItem("lastVoteDate", todayString);
  }
};

// 투표 수에 따라 레스토랑 정렬
export const sortRestaurantsByVotes = (restaurants: Restaurant[]): Restaurant[] => {
  return [...restaurants].sort((a, b) => b.votes - a.votes);
};

// 가장 많은 투표를 받은 레스토랑 찾기
export const findWinningRestaurant = (restaurants: Restaurant[]): Restaurant | null => {
  if (restaurants.length === 0) return null;
  
  const sortedRestaurants = sortRestaurantsByVotes(restaurants);
  
  // 투표가 있는지 확인
  if (sortedRestaurants[0].votes > 0) {
    return sortedRestaurants[0];
  }
  
  return null;
};