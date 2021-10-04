import getAnalytics from './analytics';

const logger = {
  get analytics() {
    return getAnalytics();
  },

  pageView(location: string) {
    return this.analytics('event', 'page_view', {
      page_location: location,
    });
  },
};

export default logger;
