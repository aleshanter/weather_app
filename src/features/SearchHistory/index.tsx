import { SyntheticEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, List, Paper } from "@mui/material";
import {SnackbarCloseReason} from "@mui/material/Snackbar";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { getSearchHistory, removeHistoryItem } from "../../slices/history";
import { getFormattedDate } from "../../utils";
import { HistorySnackBar } from "./HistorySnackBar";

interface SearchHistoryProps {
   setLocation: (location: string) => void
}

export interface Toast {
    id: number;
    message: string;
    meta: {location: string; date: string}
}

interface HistoryItem {
    location: string;
    date: string;
}

const CLOSE_REASONS: Record<SnackbarCloseReason, SnackbarCloseReason> = {
    clickaway: 'clickaway',
    timeout: 'timeout',
    escapeKeyDown: 'escapeKeyDown',
};


export const SearchHistory = ({setLocation}: SearchHistoryProps) => {
    const dispatch = useDispatch();
    const historyItems = useSelector(getSearchHistory);
    const [removedHistoryItems, setRemovedHistoryItems] = useState<Toast[]>([]);

    const filterresHistoryItems = Object.entries(historyItems).reduce((acc, [location, dates]) => {
        const filteredItems = dates
            .map(date => ({location, date}))
            .filter(({location, date}) => {
                return !removedHistoryItems.some(({meta}) => meta.location === location && meta.date === date);
            });
        

        return [...acc, ...filteredItems];
    }, [] as HistoryItem[]);


    const onRemoveHistoryItem = ({location, date}: HistoryItem) => {
        setRemovedHistoryItems(toasts => [
            ...toasts, 
            {id: Date.now(), message: `${location}: ${getFormattedDate(date)} removed from history  `, 
            meta: {location, date}}
        ]);
    };

    const handleToastClose = (id: number, reason?: string) => {
        if (reason === CLOSE_REASONS.clickaway) {
            return;
        }

        const {location, date} = removedHistoryItems.find((t) => t.id === id)!.meta;
        dispatch(removeHistoryItem({location, date}))

        setRemovedHistoryItems((toasts) => toasts.filter((t) => t.id !== id));

        
        // FYI: not the optimal way to do this in two iterations, better to replace this with a reduce like this
        // but lets assume there will be no more than few items in our stack

        // setRemovedHistoryItems((toasts) => toasts.reduce((acc, t) => {
        //     if (t.id === id) {
        //         const {location, date} = removedHistoryItems.find((t) => t.id === id)!.meta;
        //         dispatch(removeHistoryItem({location, date}))
        //         return acc;
        //     };
        //     return [...acc, t];
        // }, [] as Toast[]));
    }

    const handleUndoRemove = (id: number) => {
        setRemovedHistoryItems((toasts) => toasts.filter((t) => t.id !== id))
    }

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Search History
            </Typography>

            <List>
                {filterresHistoryItems.length === 0 && (
                    <Typography variant="body1" component="p" gutterBottom data-testid="no-history-placeholder">
                        No search history available
                    </Typography>
                )}

                {filterresHistoryItems.length > 0 && filterresHistoryItems.map(({location, date}) => (
                        <SearchHistoryItem 
                            data-testid="history-item"
                            key={date} 
                            setLocation={setLocation} 
                            location={location} date={date} 
                            onRemoveHistoryItem={onRemoveHistoryItem} 
                        />
                    ))}
            </List>

            {removedHistoryItems.map((toast, index) => {
                const onRemoveToast = (_: SyntheticEvent, reason?: string) => handleToastClose(toast.id, reason);
                const onUndoRemove = () => handleUndoRemove(toast.id);

                return (
                    <HistorySnackBar 
                        key={toast.id} 
                        toast={toast} 
                        index={index} 
                        onRemoveToast={onRemoveToast} 
                        onUndoRemove={onUndoRemove}
                    />
                );
            })}
        </Paper>
  );
};

