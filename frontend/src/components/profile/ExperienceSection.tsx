'use client';

import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import { Add as AddIcon, Work } from '@mui/icons-material';

interface Experience {
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  isOwnProfile: boolean;
  onAddExperience: () => void;
  onEditExperience: (index: number) => void;
}

export default function ExperienceSection({ 
  experiences, 
  isOwnProfile, 
  onAddExperience, 
  onEditExperience 
}: ExperienceSectionProps) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Experience</Typography>
        {isOwnProfile && (
          <Button startIcon={<AddIcon />} onClick={onAddExperience}>
            Add experience
          </Button>
        )}
      </Box>
      <List>
        {experiences.map((experience, index) => (
          <ListItem 
            key={index} 
            alignItems="flex-start" 
            sx={{ px: 0 }}
            onClick={() => isOwnProfile && onEditExperience(index)}
            component={isOwnProfile ? "button" : "li"}
          >
            <Work sx={{ mr: 2, mt: 1 }} />
            <ListItemText
              primary={experience.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {experience.company}
                  </Typography>
                  <br />
                  {experience.location}
                  <br />
                  {experience.current 
                    ? `${experience.startDate} - Present`
                    : `${experience.startDate} - ${experience.endDate}`}
                  <br />
                  {experience.description}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
} 