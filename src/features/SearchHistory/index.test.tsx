import { render, waitFor } from "@testing-library/react";
import { beforeEach, vi, type Mock } from "vitest";
import { useDispatch, useSelector } from 'react-redux';
import { SearchHistory } from "./";
import { SearchHistoryItem } from "./SearchHistoryItem";

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn()
  };
});

vi.mock('./SearchHistoryItem', () => ({
  SearchHistoryItem:  vi.fn((props) => <div {...props} />),
}));

describe("SearchHistory component", () => {
    const baseProps = {
        setLocation: vi.fn()
    }

    const historyStoreMock = {
        Kyiv: ["2026-03-26T19:27:57.669Z"]
    }

    const mockDispatch = vi.fn();
    const mockedUseSelector = vi.mocked(useSelector);

    beforeEach(() => {
        (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
        mockedUseSelector.mockReturnValue(historyStoreMock);
    })
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should render without errors", () => {
        render(<SearchHistory {...baseProps} />);
    });

    it('should diplay "No search history available" message', () => {
        (useSelector as unknown as Mock).mockReturnValue({});

        const { getByText } = render(<SearchHistory {...baseProps} />);

        expect(getByText('No search history available')).toBeInTheDocument();
    });

    
    it('should render single SearchHistoryItem component', () => {
        render(<SearchHistory {...baseProps} />);

        expect(SearchHistoryItem).toHaveBeenCalledTimes(1);
        expect(SearchHistoryItem).toHaveBeenCalledWith({
            location: 'Kyiv', 
            date: historyStoreMock.Kyiv[0], 
            setLocation: baseProps.setLocation, 
            onRemoveHistoryItem: expect.any(Function),
            ['data-testid']: 'history-item'
        }, {});
    });

    
    it('should render multiple SearchHistoryItem components', () => {
        const storeMockLocal = {
            Kyiv: ["2025-03-26T19:27:57.669Z", "2025-03-26T19:27:57.669Z"],
            Paris: ["2025-03-26T19:27:57.669Z", "2025-03-26T19:27:57.669Z"]
        };
        mockedUseSelector.mockReturnValue(storeMockLocal);

        render(<SearchHistory {...baseProps} />);

        expect(SearchHistoryItem).toHaveBeenCalledTimes(4);

        Object.entries(storeMockLocal).forEach(([location, dates]) => {
            dates.forEach(date => {
                expect(SearchHistoryItem).toHaveBeenCalledWith({
                    location, 
                    date, 
                    setLocation: baseProps.setLocation, 
                    onRemoveHistoryItem: expect.any(Function),
                    ['data-testid']: 'history-item'
                }, {});
            })
        })
    });

    it('should be able to remove history item', async () => {
        const {queryAllByTestId} = render(<SearchHistory {...baseProps} />);

        expect(queryAllByTestId('history-item')).toHaveLength(1);
        expect(queryAllByTestId('no-history-placeholder')).toHaveLength(0);
        
        
        (SearchHistoryItem as Mock).mock.calls[0][0].onRemoveHistoryItem({location: 'Kyiv', date: historyStoreMock.Kyiv[0]});

        await waitFor(() => {
            expect(queryAllByTestId('history-item')).toHaveLength(0);
            expect(queryAllByTestId('no-history-placeholder')).toHaveLength(1);
        })


    });
});