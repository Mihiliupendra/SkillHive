import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Chip,
  Box,
  Typography,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Go', 'Rust',
  // Web Technologies
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'HTML5', 'CSS3', 'TypeScript',
  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Oracle', 'SQLite',
  // Cloud Platforms
  'AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean',
  // Tools & Others
  'Git', 'Docker', 'Kubernetes', 'Jenkins', 'JIRA', 'Agile', 'Scrum'
];

export default function AddSkillModal({ open, onClose, onSave, currentSkills = [] }) {
  const [skills, setSkills] = useState(currentSkills);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');

  // Reset skills when modal is opened with new currentSkills
  React.useEffect(() => {
    setSkills(currentSkills);
  }, [currentSkills, open]);

  const handleAddSkill = (skill) => {
    if (!skill) return;
    
    // Check if skill already exists
    if (skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      setError('This skill is already added');
      return;
    }

    setSkills([...skills, skill]);
    setNewSkill('');
    setError('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    onSave(skills);
    setNewSkill('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ color: '#002B5B', fontWeight: 'bold' }}>
          Add Skills
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#002B5B',
            '&:hover': {
              color: '#F7931E',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            freeSolo
            options={COMMON_SKILLS}
            value={newSkill}
            onChange={(event, newValue) => {
              if (newValue) {
                handleAddSkill(newValue);
              }
            }}
            onInputChange={(event, newInputValue) => {
              setNewSkill(newInputValue);
              setError('');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add a skill"
                error={!!error}
                helperText={error}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(newSkill);
                  }
                }}
              />
            )}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
                sx={{
                  bgcolor: '#002B5B',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#F7931E',
                  }
                }}
              />
            ))}
          </Box>

          {skills.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
              No skills added yet. Start typing to add your skills!
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#002B5B',
            '&:hover': {
              bgcolor: '#002B5B10',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: '#F7931E',
            '&:hover': {
              bgcolor: '#002B5B',
            }
          }}
        >
          Save Skills
        </Button>
      </DialogActions>
    </Dialog>
  );
} 