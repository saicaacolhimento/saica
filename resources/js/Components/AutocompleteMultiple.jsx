import React, { useState, useEffect, useRef } from 'react';
import { Chip, TextField, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import { X } from 'lucide-react';

const AutocompleteMultiple = ({ 
    label, 
    options = [], 
    value, 
    onChange, 
    error, 
    helperText,
    ...props 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (inputValue) {
            const filtered = options.filter(item => 
                item.nome.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(filtered.length > 0);
        } else {
            setSuggestions(options);
            setIsOpen(options.length > 0);
        }
    }, [inputValue, options]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSelect = (item) => {
        if (!value.some(selected => selected.id === item.id)) {
            onChange([...value, item]);
        }
        setInputValue('');
        setIsOpen(false);
    };

    const handleRemove = (itemToRemove) => {
        onChange(value.filter(item => item.id !== itemToRemove.id));
    };

    return (
        <Box ref={wrapperRef} sx={{ position: 'relative', width: '100%' }}>
            <TextField
                fullWidth
                label={label}
                value={inputValue}
                onChange={handleInputChange}
                error={error}
                helperText={helperText}
                onFocus={() => {
                    if (options.length > 0) {
                        setIsOpen(true);
                    }
                }}
                {...props}
            />
            {value.length > 0 && (
                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 1,
                    maxWidth: '100%'
                }}>
                    {value.map((item) => (
                        <Chip
                            key={item.id}
                            label={item.nome}
                            onDelete={() => handleRemove(item)}
                            deleteIcon={<X size={16} />}
                            sx={{ 
                                backgroundColor: '#f3f4f6',
                                '& .MuiChip-deleteIcon': {
                                    color: '#6b7280',
                                    '&:hover': {
                                        color: '#ef4444'
                                    }
                                }
                            }}
                        />
                    ))}
                </Box>
            )}
            {isOpen && suggestions.length > 0 && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        position: 'absolute',
                        width: '100%',
                        maxHeight: 200,
                        overflow: 'auto',
                        zIndex: 1000,
                        mt: 0.5,
                        backgroundColor: 'white'
                    }}
                >
                    <List sx={{ p: 0 }}>
                        {suggestions.map((item) => (
                            <ListItem
                                key={item.id}
                                button
                                onClick={() => handleSelect(item)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={item.nome}
                                    primaryTypographyProps={{
                                        sx: { fontSize: '0.875rem' }
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default AutocompleteMultiple; 