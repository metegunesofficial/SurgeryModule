import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ActivityFeedCard from '@/components/dashboard/ActivityFeedCard.jsx';

function makeItems(count: number) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => ({
    ts: new Date(now.getTime() - (i + 1) * 60000),
    text: `event ${i + 1}`,
  }));
}

describe('ActivityFeedCard - infinite scroll', () => {
  it('calls onLoadMore when scrolled near bottom and hasMore=true', async () => {
    const onLoadMore = vi.fn(() => Promise.resolve());
    render(
      <ActivityFeedCard
        items={makeItems(25)}
        fixedHeight={360}
        onLoadMore={onLoadMore}
        hasMore
      />
    );

    const list = await screen.findByTestId('activity-list');
    Object.defineProperty(list, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(list, 'clientHeight', { value: 300, configurable: true });
    Object.defineProperty(list, 'scrollTop', { value: 750, writable: true, configurable: true });

    fireEvent.scroll(list);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});


