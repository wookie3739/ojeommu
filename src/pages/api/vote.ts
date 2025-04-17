import { NextApiRequest, NextApiResponse } from 'next';

// 메모리에 투표 데이터 저장 (실제 프로덕션에서는 MongoDB, Firebase 등의 데이터베이스를 사용해야 함)
let votesData = {
  date: new Date().toISOString().split('T')[0],
  votes: {} as Record<string, number>
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // 날짜가 바뀌었는지 확인 후 필요하면 초기화
    const today = new Date().toISOString().split('T')[0];
    if (votesData.date !== today) {
      votesData = {
        date: today,
        votes: {}
      };
    }
    
    return res.status(200).json(votesData);
  }
  
  if (req.method === 'POST') {
    try {
      const { restaurantId } = req.body;
      
      if (!restaurantId) {
        return res.status(400).json({ error: '식당 ID가 필요합니다.' });
      }
      
      // 현재 날짜 확인
      const today = new Date().toISOString().split('T')[0];
      
      // 날짜가 바뀌었으면 초기화
      if (votesData.date !== today) {
        votesData = {
          date: today,
          votes: {}
        };
      }
      
      // 투표 증가
      votesData.votes[restaurantId] = (votesData.votes[restaurantId] || 0) + 1;
      
      return res.status(200).json(votesData);
    } catch (error) {
      console.error('투표 처리 중 오류:', error);
      return res.status(500).json({ error: '투표 처리 중 오류가 발생했습니다.' });
    }
  }
  
  return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
}