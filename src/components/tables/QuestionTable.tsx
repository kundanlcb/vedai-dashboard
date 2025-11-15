import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Question } from '../../types/question.types';
import { useState } from 'react';

interface QuestionTableProps {
  items: Question[];
  loading: boolean;
  selectedIds: string[];
  page: number;
  limit: number;
  total: number;
  onSelectItem: (id: string) => void;
  onSelectAll: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const getDifficultyColor = (difficulty: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    easy: 'success',
    medium: 'warning',
    hard: 'error',
  };
  return colors[difficulty] || 'default';
};

const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    draft: 'default',
    under_review: 'warning',
    published: 'success',
    archived: 'error',
  };
  return colors[status] || 'default';
};

export const QuestionTable = ({
  items,
  loading,
  selectedIds,
  page,
  limit,
  total,
  onSelectItem,
  onSelectAll,
  onView,
  onEdit,
  onPublish,
  onArchive,
  onDelete,
  onPageChange,
  onLimitChange,
}: QuestionTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<Record<string, HTMLElement | null>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleMenuOpen = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleMenuClose = (id: string) => {
    setMenuAnchor((prev) => ({ ...prev, [id]: null }));
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
    }
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < items.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No questions found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} selected={selectedIds.includes(item.id)} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.text.substring(0, 50)}...
                  </TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.difficultyLevel}
                      color={getDifficultyColor(item.difficultyLevel)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status.replace(/_/g, ' ')}
                      color={getStatusColor(item.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(item.id, e)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor[item.id]}
                      open={Boolean(menuAnchor[item.id])}
                      onClose={() => handleMenuClose(item.id)}
                    >
                      <MenuItem
                        onClick={() => {
                          onView(item.id);
                          handleMenuClose(item.id);
                        }}
                      >
                        <VisibilityIcon sx={{ mr: 1 }} fontSize="small" /> View
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onEdit(item.id);
                          handleMenuClose(item.id);
                        }}
                      >
                        <EditIcon sx={{ mr: 1 }} fontSize="small" /> Edit
                      </MenuItem>
                      {item.status !== 'published' && (
                        <MenuItem
                          onClick={() => {
                            onPublish(item.id);
                            handleMenuClose(item.id);
                          }}
                        >
                          <PublishIcon sx={{ mr: 1 }} fontSize="small" /> Publish
                        </MenuItem>
                      )}
                      {item.status !== 'archived' && (
                        <MenuItem
                          onClick={() => {
                            onArchive(item.id);
                            handleMenuClose(item.id);
                          }}
                        >
                          <ArchiveIcon sx={{ mr: 1 }} fontSize="small" /> Archive
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          handleDeleteClick(item.id);
                          handleMenuClose(item.id);
                        }}
                      >
                        <DeleteIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" /> Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value))}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this question? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuestionTable;

