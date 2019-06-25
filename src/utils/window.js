export const getScrollTop = () =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop;

export const getElementOffsetTop = element => {
  return getScrollTop() + element.getBoundingClientRect().top;
};
