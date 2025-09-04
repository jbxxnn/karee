'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { categoryService } from '@/lib/services/category-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  FolderOpen,
  Loader2
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

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    sort_order: 1,
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const categoryData = await categoryService.getCategoryById(categoryId);
      if (categoryData) {
        setCategory(categoryData);
        setFormData({
          name: categoryData.name || '',
          slug: categoryData.slug || '',
          description: categoryData.description || '',
          is_active: categoryData.is_active || false,
          sort_order: categoryData.sort_order || 1,
          meta_title: categoryData.meta_title || '',
          meta_description: categoryData.meta_description || '',
        });
      }
    } catch (error) {
      console.error('Error loading category:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.slug) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Update the category
      const updatedCategory = await categoryService.updateCategory(categoryId, formData);
      
      if (updatedCategory) {
        toast.success('Category updated successfully!');
        router.push('/admin/categories');
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The category you're looking for doesn't exist.
          </p>
          <Link href="/admin/categories">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600">Update category information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={category.is_active ? "default" : "secondary"}>
            {category.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="category-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the category"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first in category lists
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO & Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="SEO title for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use category name
                  </p>
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO description for search engines"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use category description
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Status */}
            <Card>
              <CardHeader>
                <CardTitle>Category Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <p className="text-xs text-gray-500">
                  Inactive categories won't be visible to customers
                </p>
              </CardContent>
            </Card>

            {/* Category Info */}
            <Card>
              <CardHeader>
                <CardTitle>Category Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(category.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(category.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">ID:</span>
                  <span className="ml-2 text-gray-900 font-mono text-xs">
                    {category.id}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Link href="/admin/categories">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}




