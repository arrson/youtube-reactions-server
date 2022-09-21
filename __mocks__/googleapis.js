export const google = {
  youtube: () => ({
    search: {
      list: () => ({
        data: { items: [] },
      }),
    },
    channels: {
      list: () => ({
        data: { items: [] },
      }),
    },
    videos: {
      list: ({ id }) => ({
        data: {
          items: id[0].split(',').map((d) => ({
            id: d,
            snippet: {
              title: 'mockTitle',
              thumbnails: { medium: { url: 'mockUrl' } },
              publishedAt: new Date().toISOString(),
              channelId: 'mockChannelId',
              channelTitle: 'mockChannelTitle',
            },
          })),
        },
      }),
    },
  }),
};
