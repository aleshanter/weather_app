import { render, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import { ListItemText } from "@mui/material";
import { SearchHistoryItem } from ".";
import { getFormattedDate } from "../../../utils";

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');

  return {
    ...actual,
    ListItemText: vi.fn((props) => <div {...props} />),
    ListItemButton: vi.fn((props) => <div {...props} />),
    IconButton: vi.fn((props) => <div {...props} />),
  };
});


describe("SearchHistoryItem component", () => {
  const locationMock = "New York, NY";
  const baseProps = {
    location: locationMock,
    date: new Date().toDateString(),
    setLocation: vi.fn(),
    onRemoveHistoryItem: vi.fn(),
  }

  it("should render without errors", () => {
    render(<SearchHistoryItem {...baseProps} />);
  });

  it("should properly call ListItemText component", () => {
    render(<SearchHistoryItem {...baseProps} />);

    expect(ListItemText).toHaveBeenCalledWith({
      primary: locationMock,
      secondary: getFormattedDate(baseProps.date),
    }, {});
  });

  it('should handle history-item-button click', () => {
    const { getByTestId } = render(<SearchHistoryItem {...baseProps} />);
    const historyItemButton = getByTestId('history-item-button');
    fireEvent.click(historyItemButton);

    expect(baseProps.setLocation).toHaveBeenCalledWith(locationMock);
  });

  it('should handle remove-history-item-button click', () => {
    const { getByTestId } = render(<SearchHistoryItem {...baseProps} />);
    const removeHistoryItemButton = getByTestId('remove-history-item-button');
    fireEvent.click(removeHistoryItemButton);

    expect(baseProps.onRemoveHistoryItem).toHaveBeenCalledWith({location: locationMock, date: baseProps.date});
  });
});
