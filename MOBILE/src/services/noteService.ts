import api from './api';

export interface Article {
  code: number;
  title: string;
  content: string;
  time: string;
  type_article: 'hoctap' | 'congviec' | 'canhan' | 'khac';
  luot_thich: number;
}

export interface HomeResponse {
  articles: Article[];
  counts: {
    hoctap: number;
    congviec: number;
    canhan: number;
    khac: number;
  };
}

export const getHome = async () => {
  const res = await api.get<HomeResponse>('/api/home');
  return res.data;
};

export const getArticlesByType = async (type?: string) => {
  const res = await api.get<{ articles: Article[] }>('/api/articles', {
    params: type ? { type } : {},
  });
  return res.data;
};

export const likeArticle = async (code: number) => {
  const res = await api.post(`/api/like/${code}`);
  return res.data;
};