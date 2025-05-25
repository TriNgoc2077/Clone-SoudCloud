import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Link, Typography, Chip, Stack } from "@mui/material";
import { Favorite, PlayCircleFilled } from "@mui/icons-material";

interface IProps {
  tracks: ITrackTop[];
}

const Like = ({ tracks }: IProps) => {
  return (
    <Box sx={{ 
      padding: { xs: 2, md: 4 },
      minHeight: "100vh"
    }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        fontWeight={700} 
        textAlign="center"
        sx={{
          marginBottom: 4,
          color: "#3f51b5",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontSize: { xs: "2rem", md: "2.5rem" },
          position: "relative",
          "&:after": {
            content: '""',
            display: "block",
            width: "80px",
            height: "4px",
            background: "#ff4081",
            margin: "16px auto 0",
            borderRadius: "2px"
          }
        }}
      >
        Your Favorite Tracks
      </Typography>
      
      {tracks.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Favorite sx={{ fontSize: 60, color: "#ff4081", opacity: 0.5 }} />
          <Typography variant="h6" color="textSecondary" mt={2}>
            You haven't liked any tracks yet
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tracks.map((track) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={track._id}>
              <Card sx={{ 
                borderRadius: 2, 
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.15)"
                },
                position: "relative"
              }}>
                <CardActionArea
                  component={Link}
                  href={`/track/${track.title}-${track._id}.html?audio=${track.trackUrl}`}
                  underline="none"
                >
                  {/* Play icon overlay */}
                  <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    zIndex: 1,
                    "&:hover": {
                      opacity: 1
                    }
                  }}>
                    <PlayCircleFilled sx={{ 
                      fontSize: 60, 
                      color: "white",
                      filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))"
                    }} />
                  </Box>
                  
                  <CardMedia
                    component="img"
                    height="250"
                    image={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES}/${track.imgUrl}`}
                    alt={track.title}
                    sx={{ 
                      objectFit: "cover",
                      position: "relative"
                    }}
                  />
                  
                  <CardContent sx={{
                    background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                    borderTop: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    <Typography 
                      variant="h6" 
                      noWrap 
                      textAlign="center" 
                      fontWeight={600}
                      sx={{ color: "#2d3748" }}
                    >
                      {track.title}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
                      <Chip 
                        label={`${track.countLike} Likes`} 
                        size="small" 
                        icon={<Favorite fontSize="small" />}
                        color="secondary"
                      />
                      <Chip 
                        label={track.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderColor: "#4caf50", color: "#4caf50" }}
                      />
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Like;