export default () =>
  ({ id }) =>
    id.split(',').map((d: string) => ({
      id: d,
      title: 'mockTitle',
      thumbnail: 'mock',
      publishedAt: new Date().toISOString(),
      channelId: 'mockChannelId',
      channelTitle: 'mockChannelTitle',
    }));
