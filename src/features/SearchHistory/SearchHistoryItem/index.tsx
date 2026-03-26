import { ListItem, IconButton, ListItemButton, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { getFormattedDate } from "../../../utils";

interface SearchHistoryItemProps {
  location: string;
  date: string;
  setLocation: (location: string) => void
  onRemoveHistoryItem: ({location, date}: {location: string, date: string}) => void
};

export const SearchHistoryItem = ({ location, date, setLocation, onRemoveHistoryItem }: SearchHistoryItemProps) => {
  const formattedSearchDate = getFormattedDate(date);
  const handleRmoveHistoryItem = () => onRemoveHistoryItem({location, date});
  const onHistoryItemClick = () => setLocation(location);

  return (
    <ListItem 
      disablePadding 
      secondaryAction={
        <IconButton edge="end" onClick={handleRmoveHistoryItem} data-testid="remove-history-item-button">
          <DeleteIcon/>
        </IconButton>
      }
    >
      <ListItemButton onClick={onHistoryItemClick} data-testid="history-item-button">
        <ListItemText primary={location} secondary={formattedSearchDate} />
      </ListItemButton>
    </ListItem>
  );
};
