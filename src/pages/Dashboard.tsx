import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useNotifications } from '../context/NotificationsContext';
// import type { Note } from '../types';
// import type { Note } from '../../types'
// Ensure styled-components types are included in your project:
// npm install --save-dev @types/styled-components

const DashboardContainer = styled.div`
  min-height: 100vh;
  max-width: 100%;
  width: 1430px;
  background-color: var(--bg-color);
  transition: all 0.3s ease;
`;

const Header = styled.header`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled(motion.div)`
  font-size: 1.5rem;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationIcon = styled(motion.div)`
  font-size: 1.25rem;
  color: var(--text-color);
  position: relative;
`;

const NotificationTooltip = styled(motion.div)`
  position: absolute;
  top: 2rem; /* Position below the bell icon */
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--danger-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
`;

const Avatar = styled(motion.div)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Username = styled.span`
  font-weight: 500;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  overflow: hidden;
  z-index: 20;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-color);
    color: var(--primary-color);
  }
`;

const LogoutButton = styled(DropdownItem)`
  color: var(--danger-color);
  font-weight: 500;
`;

const NotificationDropdown = styled(Dropdown)`
  min-width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: ${(props) => (props.isRead ? 'transparent' : 'rgba(79, 70, 229, 0.05)')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-color);
  }
`;

const NotificationMessage = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const NotificationTime = styled.p`
  font-size: 0.75rem;
  color: var(--text-light);
`;

const EmptyNotifications = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: var(--text-light);
  font-size: 0.875rem;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const WelcomeText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
`;

const CreateNoteButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--primary-hover);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  background-color: #f7fafc;
  color: #1a202c;
  border-radius: var(--radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border: 2px solid #5a67d8;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NoteCard = styled(motion(Link))`
  background-color: white;
  border-radius: var(--radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: block;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
    color: var(--text-color);
  }
`;

const NoteDate = styled.p`
  font-size: 0.75rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const NoteTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoteContent = styled.p`
  font-size: 0.875rem;
  color: var(--text-light);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const NoteTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(79, 70, 229, 0.2);
    transform: scale(1.05);
  }
`;

const EmptyNotes = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  grid-column: 1 / -1;
`;

const EmptyNotesIcon = styled(motion.div)`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--text-light);
`;

const EmptyNotesText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EmptyNotesSubtext = styled.p`
  color: var(--text-light);
  margin-bottom: 1.5rem;
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes } = useNotes(); // Removed getNotes due to unused var error
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);

  const totalNotes = notes.length;
  const thisWeekNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return noteDate >= weekStart;
  }).length;

  const streak = 5; // Static streak value

  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    setShowNotifications(false);
  };

  const getUserInitials = () => {
    if (!user || !user.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('User logged out');
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoIcon
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              📍
            </LogoIcon>
            InternRoutineTracker
          </Logo>
          <NavActions>
            <NotificationBadge 
              onClick={toggleNotifications}
              onMouseEnter={() => setIsNotificationHovered(true)}
              onMouseLeave={() => setIsNotificationHovered(false)}
            >
              <NotificationIcon
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                🔔
                <AnimatePresence>
                  {isNotificationHovered && !showNotifications && (
                    <NotificationTooltip
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      View Notifications
                    </NotificationTooltip>
                  )}
                </AnimatePresence>
              </NotificationIcon>
              {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
              <AnimatePresence>
                {showNotifications && (
                  <NotificationDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id.toString()} // Ensure string key
                          isRead={notification.isRead}
                          onClick={() => handleNotificationClick(notification.id.toString())}
                        >
                          <NotificationMessage>{notification.message}</NotificationMessage>
                          <NotificationTime>
                            {new Date(notification.createdAt).toLocaleString()}
                          </NotificationTime>
                        </NotificationItem>
                      ))
                    ) : (
                      <EmptyNotifications>No notifications</EmptyNotifications>
                    )}
                  </NotificationDropdown>
                )}
              </AnimatePresence>
            </NotificationBadge>
            <UserMenu onClick={toggleUserMenu}>
              <Avatar
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {getUserInitials()}
              </Avatar>
              <Username>{user?.username}</Username>
              <AnimatePresence>
                {showUserMenu && (
                  <Dropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem>Profile</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                  </Dropdown>
                )}
              </AnimatePresence>
            </UserMenu>
          </NavActions>
        </HeaderContent>
      </Header>
      
      <Content>
        <DashboardHeader>
          <WelcomeText>Welcome back, {user?.username}!</WelcomeText>
          <CreateNoteButton to="/notes/new">
            <span>+</span> New Note
          </CreateNoteButton>
        </DashboardHeader>
        
        <StatsGrid>
          <StatCard whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <StatTitle>Total Notes</StatTitle>
            <StatValue>{totalNotes}</StatValue>
          </StatCard>
          <StatCard whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <StatTitle>This Week</StatTitle>
            <StatValue>{thisWeekNotes}</StatValue>
          </StatCard>
          <StatCard whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <StatTitle>Current Streak</StatTitle>
            <StatValue>{streak} days</StatValue>
          </StatCard>
          <StatCard whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <StatTitle>Completion Rate</StatTitle>
            <StatValue>{totalNotes > 0 ? Math.round((thisWeekNotes / 7) * 100) : 0}%</StatValue>
          </StatCard>
        </StatsGrid>

        <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
        
        <NotesGrid>
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <NoteCard
                key={note.id.toString()}
                to={`/notes/${note.id}`}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <NoteDate>{formatDate(note.createdAt)}</NoteDate>
                <NoteTitle>{note.title}</NoteTitle>
                <NoteContent>{note.content}</NoteContent>
                {note.tags && note.tags.length > 0 && (
                  <NoteTags>
                    {note.tags.map((tag, index) => (
                      <NoteTag key={index}>{tag}</NoteTag>
                    ))}
                  </NoteTags>
                )}
              </NoteCard>
            ))
          ) : (
            <EmptyNotes>
              <EmptyNotesIcon whileHover={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                📝
              </EmptyNotesIcon>
              <EmptyNotesText>No notes yet</EmptyNotesText>
              <EmptyNotesSubtext>
                Start tracking your daily activities by creating your first note.
              </EmptyNotesSubtext>
              <CreateNoteButton to="/notes/new">
                <span>+</span> Create Your First Note
              </CreateNoteButton>
            </EmptyNotes>
          )}
        </NotesGrid>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
