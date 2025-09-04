'use client';

import { useState, useEffect } from 'react';
import { categoryService } from '@/lib/services/category-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FolderOpen,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const allCategories = await categoryService.getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.is_active) ||
                         (filterStatus === 'inactive' && !category.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await categoryService.deleteCategory(categoryId);
        toast.success('Category deleted successfully!');
        await loadCategories(); // Refresh the list
      } catch (error) {
        console.error('Error deleting category:', error);
        if (error instanceof Error && error.message.includes('Cannot delete category that has products')) {
          toast.error('Cannot delete category that has products. Please remove or reassign products first.');
        } else {
          toast.error('Failed to delete category');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => !c.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => c.sort_order <= 5).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Slug: {category.slug}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={category.is_active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Category Description */}
              <div className="space-y-3">
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Sort Order: {category.sort_order}</span>
                  <span>
                    {new Date(category.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/categories/${category.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/catalog/${category.slug}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first category'
              }
            </p>
            <Link href="/admin/categories/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}




