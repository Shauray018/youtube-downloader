import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body as { url: string };

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const info = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
      
      res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
      res.setHeader('Content-Type', 'video/mp4');
      
      ytdl(url, { format: format }).pipe(res);
    } catch (error) {
      console.error('Download failed:', error);
      res.status(500).json({ error: 'Download failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}