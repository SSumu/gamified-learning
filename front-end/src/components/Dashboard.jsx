import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Stars as StarsIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  // Sample data - replace with real data from your API
  const stats = [
    {
      title: "Total Students",
      value: 124,
      icon: <PeopleIcon fontSize="large" />,
      color: "primary.main",
    },
    {
      title: "Active Courses",
      value: 8,
      icon: <SchoolIcon fontSize="large" />,
      color: "secondary.main",
    },
    {
      title: "Challenges",
      value: 32,
      icon: <AssignmentIcon fontSize="large" />,
      color: "success.main",
    },
    {
      title: "Rewards Earned",
      value: 156,
      icon: <StarsIcon fontSize="large" />,
      color: "warning.main",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "completed",
      item: "JavaScript Basics Challenge",
      points: 50,
      icon: <CheckCircleIcon color="success" />,
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "redeemed",
      item: "Epic Reward",
      points: 200,
      icon: <StarsIcon color="warning" />,
      time: "25 minutes ago",
    },
    {
      id: 3,
      user: "Alex Johnson",
      action: "started",
      item: "Advanced React Course",
      points: 0,
      icon: <SchoolIcon color="info" />,
      time: "1 hour ago",
    },
    {
      id: 4,
      user: "Sarah Williams",
      action: "missed",
      item: "Weekly Quiz Deadline",
      points: -20,
      icon: <WarningIcon color="error" />,
      time: "2 hours ago",
    },
  ];

  const progressData = [
    { skill: "JavaScript", progress: 75 },
    { skill: "React", progress: 60 },
    { skill: "Node.js", progress: 45 },
    { skill: "CSS", progress: 80 },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities and Progress */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{activity.icon}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" component="span">
                            <strong>{activity.user}</strong> {activity.action}{" "}
                            <strong>{activity.item}</strong>
                          </Typography>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {activity.time}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={
                                activity.points > 0
                                  ? "success.main"
                                  : activity.points < 0
                                  ? "error.main"
                                  : "text.secondary"
                              }
                              sx={{ fontWeight: "bold" }}
                            >
                              {activity.points > 0
                                ? `+${activity.points}`
                                : activity.points}{" "}
                              points
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Progress */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Community Skill Progress
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Average completion rates
                </Typography>
              </Box>
              {progressData.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {item.skill}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "right" }}
                  >
                    {item.progress}%
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
