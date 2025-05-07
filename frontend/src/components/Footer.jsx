import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// Custom styled component for footer links
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
  marginBottom: theme.spacing(1),
  display: 'block'
}));

const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              SkillHive
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect, Share, and Grow with professionals in your field
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <FooterLink href="/communities">Communities</FooterLink>
            <FooterLink href="/my-network">Connections</FooterLink>
            <FooterLink href="#">Learning</FooterLink>
            <FooterLink href="#">Events</FooterLink>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Press</FooterLink>
            <FooterLink href="/settings">Settings</FooterLink>
          </Grid>
          
          <Grid item xs={12} sm={12} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
            <FooterLink href="#">Copyright Policy</FooterLink>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} SkillHive. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;