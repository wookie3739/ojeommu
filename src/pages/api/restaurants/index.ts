import { NextApiRequest, NextApiResponse } from 'next';
import { restaurants } from '@/data/restaurants';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(restaurants);
}