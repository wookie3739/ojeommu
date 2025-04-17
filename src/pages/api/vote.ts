import { Redis } from '@upstash/redis';
import { NextApiRequest, NextApiResponse } from 'next';

// 투표 데이터 타입 정의
interface VoteData {
  date: string;
  votes: Record<string, number>;
}

// Redis 클라이언트 초기화
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const today = new Date().toISOString().split('T')[0];
  const voteKey = `votes-${today}`;

  if (req.method === 'GET') {
    // 오늘의 투표 가져오기
    const votesData = await redis.get<VoteData>(voteKey) || { date: today, votes: {} };
    return res.status(200).json(votesData);
  }

  if (req.method === 'POST') {
    try {
      const { restaurantId } = req.body;

      if (!restaurantId) {
        return res.status(400).json({ error: '식당 ID가 필요합니다.' });
      }

      // 현재 투표 데이터 가져오기
      const votesData: VoteData = await redis.get<VoteData>(voteKey) || { date: today, votes: {} };

      // 투표 증가
      votesData.votes[restaurantId] = (votesData.votes[restaurantId] || 0) + 1;

      // 저장
      await redis.set(voteKey, votesData);

      return res.status(200).json(votesData);
    } catch (error) {
      console.error('투표 처리 중 오류:', error);
      return res.status(500).json({ error: '투표 처리 중 오류가 발생했습니다.' });
    }
  }

  return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
}