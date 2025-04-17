import React from 'react';
import Head from 'next/head';
import { restaurants } from '@/data/restaurants';

export default function Home() {
  // 식당 목록 렌더링
  const renderRestaurantList = () => {
    return restaurants.map((restaurant) => (
      <div key={restaurant.id} className="restaurant-card">
        <div className="card-header">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.type}</p>
        </div>
        <div className="card-body">
          <p>대표메뉴 {restaurant.menu.length}개</p>
        </div>
      </div>
    ));
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
        <div className="restaurant-grid">
          {renderRestaurantList()}
        </div>
      </div>
    </>
  );
}