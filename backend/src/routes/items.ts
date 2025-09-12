import { Router, Request, Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Item interface (should match frontend)
interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId?: string; // Link items to users
}

// In-memory storage for demo (replace with database later)
let items: Item[] = [
  {
    id: '1',
    name: 'Sample Item 1',
    description: 'This is a sample item for demonstration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sample Item 2',
    description: 'Another sample item with different content',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Get all items
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    console.log('Items route: User authenticated', { userId: req.user?.id, email: req.user?.email });
    // In a real app, filter by user ID
    const userItems = items; // For now, return all items

    res.json({
      success: true,
      data: userItems,
      message: 'Items retrieved successfully'
    } as ApiResponse<Item[]>);
    return;

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Get single item
router.get('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = items.find(item => item.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: item,
      message: 'Item retrieved successfully'
    } as ApiResponse<Item>);
    return;

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Create new item
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      } as ApiResponse);
    }

    const now = new Date().toISOString();
    const newItem: Item = {
      id: Date.now().toString(), // Use timestamp as ID for demo
      name,
      description,
      createdAt: now,
      updatedAt: now,
      userId: req.user?.id // Associate with authenticated user
    };

    items.push(newItem);

    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    } as ApiResponse<Item>);
    return;

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Update item
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    // Update item
    const updatedItem = {
      ...items[itemIndex],
      ...(name && { name }),
      ...(description && { description }),
      updatedAt: new Date().toISOString()
    };

    items[itemIndex] = updatedItem;

    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    } as ApiResponse<Item>);
    return;

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Delete item
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    items.splice(itemIndex, 1);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    } as ApiResponse);
    return;

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

export default router;
