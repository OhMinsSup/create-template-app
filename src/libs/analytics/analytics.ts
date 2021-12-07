function getAnalytics() {
  return window.gtag ?? null;
}

const analytics = {
  get analytics() {
    return getAnalytics();
  },

  pageView(location: string) {
    return this.analytics('event', 'page_view', {
      page_location: location,
    });
  },
};

export default analytics;
