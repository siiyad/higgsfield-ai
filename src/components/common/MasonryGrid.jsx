import React, { useEffect, useState } from 'react';
import MediaCard from './MediaCard';

function getColCount(desktopCols, width) {
  if (desktopCols === 6) {
    if (width >= 1100) return 6;
    if (width >= 640) return 3;
    return 2;
  }
  if (width >= 1100) return 4;
  return 2;
}

export default function MasonryGrid({ items, desktopCols = 4 }) {
  const [colCount, setColCount] = useState(() =>
    typeof window !== 'undefined' ? getColCount(desktopCols, window.innerWidth) : desktopCols
  );

  useEffect(() => {
    const onResize = () => {
      setColCount(getColCount(desktopCols, window.innerWidth));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [desktopCols]);

  const columns = Array.from({ length: colCount }, () => []);
  items.forEach((item, index) => {
    const targetCol =
      colCount === desktopCols && typeof item.col === 'number' && item.col < colCount
        ? item.col
        : index % colCount;
    columns[targetCol].push(item);
  });

  return (
    <div className={desktopCols === 6 ? 'hf-masonry-6' : 'hf-masonry-4'}>
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="hf-masonry-col">
          {colItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}
