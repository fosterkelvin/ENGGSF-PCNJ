import { useEffect } from 'react';

const LoadStyles = ({ styles }) => {
  useEffect(() => {
    const links = styles.map(style => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = style;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach(link => document.head.removeChild(link));
    };
  }, [styles]);

  return null;
};

export default LoadStyles;
